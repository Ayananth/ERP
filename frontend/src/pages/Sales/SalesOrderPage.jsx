import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createSalesOrder,
  getCustomerDropdown,
  getItemDetails,
  getItemSearch,
  getQuotation,
  getQuotationList,
  getSalesOrder,
  getSalesOrderList,
} from "../../api/salesApi";
import SalesQuotationLayout from "../../components/sales/SalesQuotationLayout";
import SalesQuotationFooter from "../../components/sales/SalesQuotationFooter";
import SalesQuotationSelectModal from "../../components/sales/SalesQuotationSelectModal";
import SalesOrderSelectModal from "../../components/sales/SalesOrderSelectModal";
import SalesOrderHeader from "../../components/sales/SalesOrderHeader";
import SalesOrderLines from "../../components/sales/SalesOrderLines";

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const getValidDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
};

const createEmptyLine = (id) => ({
  id,
  item_id: "",
  item_code: "",
  description: "",
  unit: "",
  unit_name: "",
  qty: "",
  rate: "",
  discount_percent: "",
  discount_amount: "",
  net: "",
  vat_percent: "",
  vat: "",
  net_after_vat: "",
  unit_options: [],
  unit_prices: [],
  item_options: [],
});

const initialHeader = {
  order_no: "",
  order_type: "",
  issue_date: getTodayDate(),
  valid_date: getValidDate(),
  linked_quotation: "No quotation linked",
  quotation_id: "",
  customer: "",
  customer_display: "",
  customer_po: "",
  sales_executive: "",
  currency: "1 - SAUDI RIYAL",
  exchange_rate: "1.00",
  delivery_place: "",
  notes: "",
};

const initialLines = [createEmptyLine(1)];

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const calculateLine = (line, overrides = {}) => {
  const qty = toNumber(overrides.qty ?? line.qty);
  const rate = toNumber(overrides.rate ?? line.rate);
  const discountPercent = toNumber(
    overrides.discount_percent ?? line.discount_percent
  );
  const vatPercent = toNumber(overrides.vat_percent ?? line.vat_percent);

  const gross = qty * rate;
  const discountAmount = gross * (discountPercent / 100);
  const net = gross - discountAmount;
  const vatAmount = net * (vatPercent / 100);

  return {
    qty: overrides.qty ?? line.qty,
    rate: overrides.rate ?? line.rate,
    discount_percent: overrides.discount_percent ?? line.discount_percent,
    vat_percent: overrides.vat_percent ?? line.vat_percent,
    discount_amount: discountAmount.toFixed(2),
    net: net.toFixed(2),
    vat: vatAmount.toFixed(2),
    net_after_vat: (net + vatAmount).toFixed(2),
  };
};

const hydrateLine = (line) => {
  const normalizedLine = {
    ...line,
    qty: String(line.qty ?? line.quantity ?? ""),
    rate: String(line.rate ?? ""),
    discount_percent: String(line.discount_percent ?? ""),
    vat_percent: String(line.vat_percent ?? ""),
  };

  return {
    ...normalizedLine,
    ...calculateLine(normalizedLine),
  };
};

const hydrateOrderLine = async (line, index = 0) => {
  const itemDetails = line.item ? await getItemDetails(line.item) : null;
  const selectedUnit =
    itemDetails?.units?.find(
      (unit) => String(unit.unit_id) === String(line.unit)
    ) ??
    (line.unit
      ? {
          unit_id: line.unit,
          unit_name: line.unit_name ?? "",
        }
      : null);

  return hydrateLine({
    id: line.id ?? index + 1,
    item_id: line.item ?? "",
    item_code: itemDetails?.item_code ?? "",
    description: line.item_name ?? itemDetails?.name ?? "",
    unit: line.unit ?? "",
    unit_name: selectedUnit?.unit_name ?? "",
    qty: line.quantity ?? "",
    rate: line.rate ?? "",
    discount_percent: line.discount_percent ?? "",
    vat_percent: line.vat_percent ?? "",
    unit_options: itemDetails?.units ?? (selectedUnit ? [selectedUnit] : []),
    unit_prices: itemDetails?.prices ?? [],
    item_options: [],
  });
};

const calculateTotals = (orderLines = []) => {
  const totals = orderLines.reduce(
    (acc, line) => {
      const qty = toNumber(line.qty);
      const rate = toNumber(line.rate);

      acc.gross += qty * rate;
      acc.discount += toNumber(line.discount_amount);
      acc.net += toNumber(line.net);
      acc.vat += toNumber(line.vat);
      acc.netAfterVat += toNumber(line.net_after_vat);

      return acc;
    },
    {
      gross: 0,
      discount: 0,
      net: 0,
      vat: 0,
      netAfterVat: 0,
    }
  );

  return {
    gross: totals.gross.toFixed(2),
    discount: totals.discount.toFixed(2),
    net: totals.net.toFixed(2),
    vat: totals.vat.toFixed(2),
    netAfterVat: totals.netAfterVat.toFixed(2),
  };
};


function SalesOrderPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [header, setHeader] = useState(initialHeader);
  const [activeOrderId, setActiveOrderId] = useState(orderId ?? null);
  const [viewState, setViewState] = useState(orderId ? "viewExisting" : "viewBlank");
  const [lines, setLines] = useState(initialLines);
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isQuotationModalLoading, setIsQuotationModalLoading] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOrderModalLoading, setIsOrderModalLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [nextLineId, setNextLineId] = useState(2);

  const newEditButtonRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      firstFieldRef.current?.focus();
      return;
    }

    newEditButtonRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const customerResponse = await getCustomerDropdown();
        setCustomers(customerResponse ?? []);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ??
            "Failed to load sales order dropdown data."
        );
      }
    };

    loadDropdownData();
  }, []);

  const loadOrderById = async (id) => {
    const order = await getSalesOrder(id);

    setActiveOrderId(order?.id ?? id);
    setViewState("viewExisting");
    setHeader({
      order_no: order?.order_no ?? "",
      order_type: order?.order_type ?? "",
      issue_date: order?.order_date ?? getTodayDate(),
      valid_date: order?.valid_date ?? getValidDate(),
      linked_quotation: order?.quotation_no || "No quotation linked",
      quotation_id: order?.quotation ?? "",
      customer: order?.customer ?? "",
      customer_display: order?.customer_name ?? "",
      customer_po: order?.customer_po ?? "",
      sales_executive: order?.sales_executive ?? "",
      currency: order?.currency ?? "1 - SAUDI RIYAL",
      exchange_rate: order?.exchange_rate ?? "1.00",
      delivery_place: order?.delivery_place ?? "",
      notes: order?.notes ?? "",
    });

    const hydratedLines = await Promise.all(
      (order?.lines ?? []).map((line, index) => hydrateOrderLine(line, index))
    );

    const nextId =
      hydratedLines.reduce((max, line) => Math.max(max, line.id ?? 0), 0) + 1;

    setLines(hydratedLines.length ? hydratedLines : initialLines);
    setNextLineId(nextId);
    setIsEditing(false);
  };

  const openQuotationModal = async () => {
    if (!isEditing) {
      return;
    }

    setIsQuotationModalOpen(true);
    setIsQuotationModalLoading(true);
    setErrorMessage("");

    try {
      const quotationList = await getQuotationList();

      setQuotations(
        (quotationList ?? []).map((quotation) => ({
          id: quotation.id,
          quotation_no: quotation.quotation_no ?? "",
          delivery_place: quotation.delivery_place ?? "",
          quotation_date: quotation.quotation_date ?? "",
          customer_ref_no: quotation.customer_ref_no ?? "",
          customer_code: quotation.customer_code ?? "",
          customer_name: quotation.customer_name ?? quotation.customer ?? "",
          salesman_code: quotation.salesman_code ?? "",
          net: quotation.net ?? "",
        }))
      );
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ?? "Failed to load sales quotations."
      );
    } finally {
      setIsQuotationModalLoading(false);
    }
  };

  const handleQuotationSelect = async (quotationSummary) => {
    setIsQuotationModalLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const quotation = await getQuotation(quotationSummary.id);
      const hydratedLines = await Promise.all(
        (quotation?.lines ?? []).map((line, index) =>
          hydrateOrderLine(
            {
              ...line,
              item: line.item,
              quantity: line.quantity,
            },
            index
          )
        )
      );

      const nextId =
        hydratedLines.reduce((max, line) => Math.max(max, line.id ?? 0), 0) + 1;

      setHeader((prev) => ({
        ...prev,
        linked_quotation:
          quotation?.quotation_no ?? quotationSummary.quotation_no,
        quotation_id: quotation?.id ?? quotationSummary.id,
        customer: quotation?.customer ?? "",
        customer_display: quotationSummary.customer_name ?? "",
        delivery_place:
          quotation?.delivery_place ?? quotationSummary.delivery_place,
        notes: quotation?.notes ?? prev.notes,
      }));
      setLines(hydratedLines.length ? hydratedLines : initialLines);
      setNextLineId(nextId);
      setIsQuotationModalOpen(false);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ??
          "Failed to load the selected quotation."
      );
    } finally {
      setIsQuotationModalLoading(false);
    }
  };

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setActiveOrderId(null);
        return;
      }

      setLoadingOrder(true);
      setErrorMessage("");

      try {
        await loadOrderById(orderId);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ??
            "Failed to load the selected sales order."
        );
      } finally {
        setLoadingOrder(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const openOrderModal = async () => {
    setIsOrderModalOpen(true);
    setIsOrderModalLoading(true);
    setErrorMessage("");

    try {
      const orderList = await getSalesOrderList();

      setOrders(
        (orderList ?? []).map((order) => ({
          id: order.id,
          order_no: order.order_no ?? "",
          customer_name: order.customer_name ?? order.customer ?? "",
          order_date: order.order_date ?? "",
          total_net_amount:
            order.total_net_amount ??
            order.net_after_vat ??
            order.net ??
            order.grand_total ??
            "",
          status: order.status ?? order.order_status ?? "",
        }))
      );
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ?? "Failed to load sales orders."
      );
    } finally {
      setIsOrderModalLoading(false);
    }
  };

  const resetToBlankTransaction = () => {
    setHeader({
      ...initialHeader,
      issue_date: getTodayDate(),
      valid_date: getValidDate(),
    });
    setLines(initialLines);
    setNextLineId(2);
    setActiveOrderId(null);
    setViewState("viewBlank");
    setIsEditing(true);
    navigate("/sales/transactions/order", {
      replace: true,
    });
  };

  const handleOrderSelect = async (orderSummary) => {
    setIsOrderModalLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const order = await getSalesOrder(orderSummary.id);
      const hydratedLines = await Promise.all(
        (order?.lines ?? []).map((line, index) =>
          hydrateOrderLine(
            {
              ...line,
              item: line.item,
              quantity: line.quantity,
            },
            index
          )
        )
      );

      const nextId =
        hydratedLines.reduce((max, line) => Math.max(max, line.id ?? 0), 0) + 1;

      setHeader((prev) => ({
        ...prev,
        order_no: order?.order_no ?? "",
        order_type: order?.order_type ?? "",
        issue_date: order?.order_date ?? getTodayDate(),
        valid_date: order?.valid_date ?? getValidDate(),
        linked_quotation: order?.quotation_no || "No quotation linked",
        quotation_id: order?.quotation ?? "",
        customer: order?.customer ?? "",
        customer_display: order?.customer_name ?? orderSummary.customer_name ?? "",
        customer_po: order?.customer_po ?? "",
        sales_executive: order?.sales_executive ?? "",
        currency: order?.currency ?? "1 - SAUDI RIYAL",
        exchange_rate: order?.exchange_rate ?? "1.00",
        delivery_place: order?.delivery_place ?? "",
        notes: order?.notes ?? "",
      }));
      setLines(hydratedLines.length ? hydratedLines : initialLines);
      setNextLineId(nextId);
      setActiveOrderId(order?.id ?? orderSummary.id);
      setViewState("viewExisting");
      setIsEditing(false);
      setIsOrderModalOpen(false);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ?? "Failed to load the selected sales order."
      );
    } finally {
      setIsOrderModalLoading(false);
    }
  };

  const handleHeaderChange = (field, value) => {
    setErrorMessage("");
    setSuccessMessage("");
    setHeader((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLineChange = (lineId, field, value) => {
    setErrorMessage("");
    setSuccessMessage("");
    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id !== lineId) {
          return line;
        }

        if (field === "unit") {
          const selectedUnit = (line.unit_options ?? []).find(
            (unit) => String(unit.unit_id) === String(value)
          );
          const selectedPrice = (line.unit_prices ?? []).find(
            (price) => String(price.unit_id) === String(value)
          );
          const nextRate = selectedPrice?.sale_price ?? line.rate ?? "";

          return {
            ...line,
            unit: value,
            unit_name: selectedUnit?.unit_name ?? "",
            ...calculateLine(line, {
              rate: nextRate === "" ? "" : String(nextRate),
            }),
            rate: nextRate === "" ? "" : String(nextRate),
          };
        }

        if (
          field === "qty" ||
          field === "rate" ||
          field === "discount_percent" ||
          field === "vat_percent"
        ) {
          return {
            ...line,
            ...calculateLine(line, { [field]: value }),
          };
        }

        return { ...line, [field]: value };
      })
    );
  };

  const handleItemSearch = async (search) => {
    const response = await getItemSearch(search);
    return response ?? [];
  };

  const handleItemSelect = async (lineId, item) => {
    const itemDetails = await getItemDetails(item.id);
    const selectedUnit = itemDetails?.units?.[0];
    const selectedPrice =
      itemDetails?.prices?.find(
        (price) => price.unit_id === selectedUnit?.unit_id
      ) ?? itemDetails?.prices?.[0];
    const rate = selectedPrice?.sale_price ?? "";
    const hasUnitOrPrice =
      (itemDetails?.units?.length ?? 0) > 0 ||
      (itemDetails?.prices?.length ?? 0) > 0;

    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id !== lineId) {
          return line;
        }

        const nextQty = hasUnitOrPrice ? "1" : line.qty;

        return hydrateLine({
          ...line,
          item_id: itemDetails?.id ?? item.id,
          item_code: itemDetails?.item_code ?? item.item_code,
          description: itemDetails?.name ?? item.name,
          unit: selectedUnit?.unit_id ?? "",
          unit_name: selectedUnit?.unit_name ?? "",
          rate: rate === "" ? "" : String(rate),
          qty: nextQty,
          unit_options: itemDetails?.units ?? [],
          unit_prices: itemDetails?.prices ?? [],
          item_options: [],
        });
      })
    );
  };

  const handleAddLine = () => {
    setLines((prevLines) => [...prevLines, createEmptyLine(nextLineId)]);
    setNextLineId((prev) => prev + 1);
  };

  const handleFooterAction = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (viewState === "viewExisting") {
      setIsEditing(true);
      return;
    }

    resetToBlankTransaction();
  };

  const handleCancel = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (activeOrderId) {
      loadOrderById(activeOrderId).catch((error) => {
        setErrorMessage(
          error?.response?.data?.message ??
            "Failed to reload the sales order."
        );
      });
      return;
    }

    setHeader({
      ...initialHeader,
      issue_date: getTodayDate(),
      valid_date: getValidDate(),
    });
    setLines(initialLines);
    setNextLineId(2);
    setIsEditing(false);
    setActiveOrderId(null);
    setViewState("viewBlank");
  };

  const buildPayload = () => ({
    quotation: header.quotation_id ? Number(header.quotation_id) : null,
    customer: Number(header.customer),
    order_date: header.issue_date,
    notes: header.notes,
    lines: lines
      .filter((line) => line.item_id)
      .map((line) => ({
        item: Number(line.item_id),
        unit: Number(line.unit),
        quantity: Number(line.qty || 0),
        rate: Number(line.rate || 0),
        discount_percent: Number(line.discount_percent || 0),
        vat_percent: Number(line.vat_percent || 0),
      })),
  });

  const handleSaveOrder = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!header.customer) {
      setErrorMessage("Please select a customer before saving.");
      return;
    }

    const payload = buildPayload();

    if (!payload.lines.length) {
      setErrorMessage("Please add at least one order line before saving.");
      return;
    }

    try {
      const response = await createSalesOrder(payload);
      const savedOrderId = response?.id;

      if (savedOrderId) {
        navigate(`/sales/transactions/order/${savedOrderId}`, {
          replace: true,
        });
        await loadOrderById(savedOrderId);
      }

      setIsEditing(false);
      setViewState("viewBlank");
      setSuccessMessage("Sales order saved successfully.");
      return response;
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.error ??
          error?.response?.data?.message ??
          "Failed to save sales order. Please try again."
      );
      return null;
    }
  };

  const handleListOrders = async () => {
    await openOrderModal();
  };

  const totals = calculateTotals(lines);

  return (
    <SalesQuotationLayout title="Sales Order">
      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {loadingOrder ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Loading sales order...
        </div>
      ) : null}

      <SalesOrderHeader
        data={header}
        isEditing={isEditing}
        onChange={handleHeaderChange}
        onQuotationClick={openQuotationModal}
        firstInputRef={firstFieldRef}
        customers={customers}
      />

      <SalesOrderLines
        lines={lines}
        isEditing={isEditing}
        onChange={handleLineChange}
        onItemSearch={handleItemSearch}
        onItemSelect={handleItemSelect}
        onAddLine={handleAddLine}
      />

      <SalesQuotationFooter
        isEditing={isEditing}
        onAction={handleFooterAction}
        onCancel={handleCancel}
        newEditButtonRef={newEditButtonRef}
        onList={handleListOrders}
        onSave={handleSaveOrder}
        primaryActionLabel={
          isEditing ? (viewState === "viewExisting" ? "Update" : "Save") : viewState === "viewExisting" ? "Edit" : "New"
        }
        totals={totals}
      />

      <SalesQuotationSelectModal
        isOpen={isQuotationModalOpen}
        loading={isQuotationModalLoading}
        quotations={quotations}
        onClose={() => setIsQuotationModalOpen(false)}
        onSelect={handleQuotationSelect}
      />

      <SalesOrderSelectModal
        isOpen={isOrderModalOpen}
        loading={isOrderModalLoading}
        orders={orders}
        onClose={() => setIsOrderModalOpen(false)}
        onSelect={handleOrderSelect}
      />
    </SalesQuotationLayout>
  );
}

export default SalesOrderPage;
