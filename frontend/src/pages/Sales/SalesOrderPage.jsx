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
import Alert from "../../components/common/Alert";
import usePrimaryActionFocus from "../../hooks/usePrimaryActionFocus";
import SalesQuotationLayout from "../../components/sales/SalesQuotationLayout";
import SalesQuotationFooter from "../../components/sales/SalesQuotationFooter";
import SalesQuotationSelectModal from "../../components/sales/SalesQuotationSelectModal";
import SalesOrderSelectModal from "../../components/sales/SalesOrderSelectModal";
import SalesOrderPreviewModal from "../../components/sales/SalesOrderPreviewModal";
import SalesOrderHeader from "../../components/sales/SalesOrderHeader";
import SalesOrderLines from "../../components/sales/SalesOrderLines";
import { getTodayDate } from "../../utils/sales/salesConstants";
import { validateLines } from "../../utils/sales/salesCalculations";
import {
  calculateLine,
  calculateTotals,
  hydrateLine,
  hydrateOrderLine,
} from "../../utils/sales/orderCalculations";
import { createOrderPayload } from "../../utils/sales/orderPayload";

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [nextLineId, setNextLineId] = useState(2);
  const firstTableCellRef = useRef(null);
  const tableRefs = useRef([]);
  const newEditButtonRef = useRef(null);
  const firstFieldRef = useRef(null);
  const schedulePrimaryActionFocus = usePrimaryActionFocus(newEditButtonRef);

  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isEditing) {
        firstFieldRef.current?.focus();
      } else {
        schedulePrimaryActionFocus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isEditing, schedulePrimaryActionFocus]);

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
      schedulePrimaryActionFocus();
      
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
      schedulePrimaryActionFocus();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ??
          "Failed to load the selected sales order."
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
          const nextLine = { ...line, [field]: value };
          return {
            ...nextLine,
            ...calculateLine(nextLine, { [field]: value }),
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

    if (orderId) {
      navigate("/sales/transactions/order", {
        replace: true,
      });
    }
  };

  const handleSaveOrder = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!header.customer) {
      setErrorMessage("Please select a customer before saving.");
      return;
    }

    const validLines = lines.filter((line) => line.item_id);

    if (!validLines.length) {
      setErrorMessage("Please add at least one order line before saving.");
      return;
    }

    const lineValidationMessage = validateLines(validLines);
    if (lineValidationMessage) {
      setErrorMessage(lineValidationMessage);
      return;
    }

    const payload = createOrderPayload(header, validLines);

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

  const handleHeaderEnd = () => {
    firstTableCellRef.current?.focus?.();
  };

  const handlePreview = () => {
    if (!activeOrderId) {
      return;
    }

    setIsPreviewOpen(true);
  };

  const totals = calculateTotals(lines);

  return (
    <SalesQuotationLayout title="Sales Order">
      <Alert
        type="error"
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />

      <Alert
        type="success"
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />

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
        onHeaderEnd={handleHeaderEnd}
      />

      <SalesOrderLines
        lines={lines}
        isEditing={isEditing}
        onChange={handleLineChange}
        onItemSearch={handleItemSearch}
        onItemSelect={handleItemSelect}
        onAddLine={handleAddLine}
        firstTableCellRef={firstTableCellRef}
        tableRefs={tableRefs}
        saveButtonRef={newEditButtonRef}
      />

      <SalesQuotationFooter
        isEditing={isEditing}
        onAction={handleFooterAction}
        onCancel={handleCancel}
        newEditButtonRef={newEditButtonRef}
        onList={handleListOrders}
        onPreview={handlePreview}
        previewDisabled={!activeOrderId}
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

      <SalesOrderPreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        orderId={activeOrderId}
      />
    </SalesQuotationLayout>
  );
}

export default SalesOrderPage;
