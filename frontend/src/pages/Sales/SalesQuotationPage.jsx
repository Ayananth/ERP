import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createQuotation,
  getQuotation,
  getItemDetails,
  getCustomerDropdown,
  getItemSearch,
  getQuotationList,
  updateQuotation,
} from "../../api/salesApi";
import SalesQuotationLayout from "../../components/sales/SalesQuotationLayout";
import SalesQuotationHeader from "../../components/sales/SalesQuotationHeader";
import SalesQuotationLines from "../../components/sales/SalesQuotationLines";
import SalesQuotationFooter from "../../components/sales/SalesQuotationFooter";

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const initialHeader = {
  quotation_no: "",
  quotation_type: "",
  date: getTodayDate(),
  customer: "",
  customer_ref_no: "",
  sales_executive: "",
  attention: "",
  pay_terms: "",
  delivery_place: "",
  currency: "1 - SAUDI RIYAL",
  exchange_rate: "1",
  notes: "",
};

const initialLines = [
  {
    id: 1,
    item_id: "",
    item_code: "",
    description: "",
    unit: "",
    unit_name: "",
    qty: "",
    rate: "",
    discount_percent: "",
    discount_amount: "",
    gross_amount: "",
    net_amount: "",
    vat_percent: "",
    vat_amount: "",
    net_after_vat: "",
    unit_options: [],
    unit_prices: [],
    item_options: [],
  },
];

const createEmptyLine = (id) => ({
  ...initialLines[0],
  id,
});

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

  const grossAmount = qty * rate;
  const discountAmount = grossAmount * (discountPercent / 100);
  const netAmount = grossAmount - discountAmount;
  const vatAmount = netAmount * (vatPercent / 100);
  const netAfterVat = netAmount + vatAmount;

  return {
    qty: overrides.qty ?? line.qty,
    rate: overrides.rate ?? line.rate,
    discount_percent: overrides.discount_percent ?? line.discount_percent,
    vat_percent: overrides.vat_percent ?? line.vat_percent,
    discount_amount: discountAmount.toFixed(2),
    gross_amount: grossAmount.toFixed(2),
    net_amount: netAmount.toFixed(2),
    vat_amount: vatAmount.toFixed(2),
    net_after_vat: netAfterVat.toFixed(2),
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

const hydrateQuotationLine = async (line, index = 0) => {
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

const calculateTotals = (quotationLines = []) => {
  const totals = quotationLines.reduce(
    (acc, line) => {
      acc.gross += toNumber(line.gross_amount);
      acc.discount += toNumber(line.discount_amount);
      acc.net += toNumber(line.net_amount);
      acc.vat += toNumber(line.vat_amount);
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

function SalesQuotationPage() {
  const navigate = useNavigate();
  const { quotationId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [header, setHeader] = useState(initialHeader);
  const [activeQuotationId, setActiveQuotationId] = useState(quotationId ?? null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingQuotation, setLoadingQuotation] = useState(false);

  const [lines, setLines] = useState(initialLines);
  const [nextLineId, setNextLineId] = useState(2);
  const newEditButtonRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      firstFieldRef.current?.focus();
      return;
    }

    if (!isEditing) {
      newEditButtonRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [customerResponse] = await Promise.all([
          getCustomerDropdown(),
          getQuotationList(),
        ]);

        setCustomers(customerResponse ?? []);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ??
            "Failed to load quotation dropdown data."
        );
      }
    };

    loadDropdownData();
  }, []);

  useEffect(() => {
    const loadQuotation = async () => {
      if (!quotationId) {
        setActiveQuotationId(null);
        return;
      }

      setLoadingQuotation(true);
      setErrorMessage("");

      try {
        const quotation = await getQuotation(quotationId);

        setActiveQuotationId(quotation?.id ?? quotationId);
        setHeader({
          quotation_no: quotation?.quotation_no ?? "",
          quotation_type: quotation?.quotation_type ?? "",
          date: quotation?.quotation_date ?? getTodayDate(),
          customer: quotation?.customer ?? "",
          customer_ref_no: quotation?.customer_ref_no ?? "",
          sales_executive: quotation?.sales_executive ?? "",
          attention: quotation?.attention ?? "",
          pay_terms: quotation?.pay_terms ?? "",
          delivery_place: quotation?.delivery_place ?? "",
          currency: quotation?.currency ?? "1 - SAUDI RIYAL",
          exchange_rate: quotation?.exchange_rate ?? "1",
          notes: quotation?.notes ?? "",
        });

        const hydratedLines = await Promise.all(
          (quotation?.lines ?? []).map((line, index) =>
            hydrateQuotationLine(line, index)
          )
        );

        setLines(hydratedLines.length ? hydratedLines : initialLines);
        setNextLineId((hydratedLines.length ? hydratedLines : initialLines).length + 1);

        setIsEditing(false);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ??
            "Failed to load the selected quotation."
        );
      } finally {
        setLoadingQuotation(false);
      }
    };

    loadQuotation();
  }, [quotationId]);

  const handleHeaderChange = (field, value) => {
    setErrorMessage("");
    setHeader((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLineChange = (lineId, field, value) => {
    setErrorMessage("");
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
          const nextRate =
            selectedPrice?.sale_price ?? line.rate ?? "";

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

        if (field === "qty" || field === "rate" || field === "discount_percent" || field === "vat_percent") {
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
      itemDetails?.prices?.find((price) => price.unit_id === selectedUnit?.unit_id) ??
      itemDetails?.prices?.[0];
    const rate = selectedPrice?.sale_price ?? "";
    const hasUnitOrPrice =
      (itemDetails?.units?.length ?? 0) > 0 || (itemDetails?.prices?.length ?? 0) > 0;

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

  const loadQuotationById = async (id) => {
    const quotation = await getQuotation(id);

    setActiveQuotationId(quotation?.id ?? id);
    setHeader({
      quotation_no: quotation?.quotation_no ?? "",
      quotation_type: quotation?.quotation_type ?? "",
      date: quotation?.quotation_date ?? getTodayDate(),
      customer: quotation?.customer ?? "",
      customer_ref_no: quotation?.customer_ref_no ?? "",
      sales_executive: quotation?.sales_executive ?? "",
      attention: quotation?.attention ?? "",
      pay_terms: quotation?.pay_terms ?? "",
      delivery_place: quotation?.delivery_place ?? "",
      currency: quotation?.currency ?? "1 - SAUDI RIYAL",
      exchange_rate: quotation?.exchange_rate ?? "1",
      notes: quotation?.notes ?? "",
    });

                const hydratedLines = await Promise.all(
                  (quotation?.lines ?? []).map((line, index) =>
                    hydrateQuotationLine(line, index)
                  )
                );

    setLines(hydratedLines.length ? hydratedLines : initialLines);
    setIsEditing(false);
  };

  const handleFooterAction = () => {
    setErrorMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setErrorMessage("");
    setHeader({
      ...initialHeader,
      date: getTodayDate(),
    });
    setLines(initialLines);
    setNextLineId(2);
    setIsEditing(false);
  };

  const handleSaveQuotation = async () => {
    setErrorMessage("");

    if (!header.customer) {
      setErrorMessage("Please select a customer before saving.");
      return;
    }

    const payload = {
      customer: Number(header.customer),
      quotation_date: header.date,
      notes: header.notes,
      lines: lines.map((line) => ({
        item: Number(line.item_id),
        unit: Number(line.unit),
        quantity: Number(line.qty || 0),
        rate: Number(line.rate || 0),
        discount_percent: Number(line.discount_percent || 0),
        vat_percent: Number(line.vat_percent || 0),
      })),
    };

    try {
      const response = activeQuotationId
        ? await updateQuotation(activeQuotationId, payload)
        : await createQuotation(payload);

      const savedQuotationId = response?.id ?? activeQuotationId;

      if (savedQuotationId) {
        navigate(`/sales/transactions/quotation/${savedQuotationId}`, {
          replace: true,
        });
        await loadQuotationById(savedQuotationId);
      }

      setIsEditing(false);
      return response;
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ??
          "Failed to save quotation. Please try again."
      );
      return null;
    }
  };

  const handleListQuotations = async () => {
    await getQuotationList();
  };

  const footerTotals = calculateTotals(lines);

  return (
    <SalesQuotationLayout>
      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {loadingQuotation ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Loading quotation...
        </div>
      ) : null}

      <SalesQuotationHeader
        data={header}
        isEditing={isEditing}
        onChange={handleHeaderChange}
        firstInputRef={firstFieldRef}
        customers={customers}
      />

      <SalesQuotationLines
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
        onList={handleListQuotations}
        onSave={handleSaveQuotation}
        totals={footerTotals}
      />
    </SalesQuotationLayout>
  );
}

export default SalesQuotationPage;
