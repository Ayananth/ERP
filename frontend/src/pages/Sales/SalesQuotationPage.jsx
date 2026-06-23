import { useEffect, useRef, useState } from "react";

import {
  createQuotation,
  getItemDetails,
  getCustomerDropdown,
  getItemSearch,
  getQuotationList,
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
    item_options: [],
  },
];

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
  const [isEditing, setIsEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [header, setHeader] = useState(initialHeader);

  const [lines, setLines] = useState(initialLines);
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
      const [customerResponse] = await Promise.all([
        getCustomerDropdown(),
        getQuotationList(),
      ]);

      setCustomers(customerResponse ?? []);
    };

    loadDropdownData();
  }, []);

  const handleHeaderChange = (field, value) => {
    setHeader((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLineChange = (lineId, field, value) => {
    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id !== lineId) {
          return line;
        }

        if (field === "unit") {
          const selectedUnit = (line.unit_options ?? []).find(
            (unit) => String(unit.unit_id) === String(value)
          );

          return {
            ...line,
            unit: value,
            unit_name: selectedUnit?.unit_name ?? "",
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

        return {
          ...line,
          item_id: itemDetails?.id ?? item.id,
          item_code: itemDetails?.item_code ?? item.item_code,
          description: itemDetails?.name ?? item.name,
          unit: selectedUnit?.unit_id ?? "",
          unit_name: selectedUnit?.unit_name ?? "",
          rate: rate === "" ? "" : String(rate),
          qty: nextQty,
          ...calculateLine(line, {
            rate: rate === "" ? "" : String(rate),
            qty: nextQty,
            discount_percent: line.discount_percent,
            vat_percent: line.vat_percent,
          }),
          unit_options: itemDetails?.units ?? [],
          item_options: [],
        };
      })
    );
  };

  const handleFooterAction = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setHeader({
      ...initialHeader,
      date: getTodayDate(),
    });
    setLines(initialLines);
    setIsEditing(false);
  };

  const handleSaveQuotation = async () => {
    const payload = {
      customer: Number(header.customer || 1),
      quotation_date: header.date,
      notes: header.notes,
      lines: lines.map((line) => ({
        item: Number(line.item_id || 1),
        unit: Number(line.unit || 1),
        quantity: Number(line.qty || 0),
        rate: Number(line.rate || 0),
        discount_percent: Number(line.discount_percent || 0),
        vat_percent: Number(line.vat_percent || 0),
      })),
    };

    const response = await createQuotation(payload);
    setIsEditing(false);
    return response;
  };

  const handleListQuotations = async () => {
    await getQuotationList();
  };

  const footerTotals = calculateTotals(lines);

  return (
    <SalesQuotationLayout>
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
