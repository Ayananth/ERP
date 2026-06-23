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
    net: "",
    vat: "",
    net_after_vat: "",
    unit_options: [],
    item_options: [],
  },
];

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

    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id !== lineId) {
          return line;
        }

        return {
          ...line,
          item_id: itemDetails?.id ?? item.id,
          item_code: itemDetails?.item_code ?? item.item_code,
          description: itemDetails?.name ?? item.name,
          unit: "",
          unit_name: "",
          rate: "",
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
        vat_percent: Number(line.vat || 0),
      })),
    };

    const response = await createQuotation(payload);
    setIsEditing(false);
    return response;
  };

  const handleListQuotations = async () => {
    await getQuotationList();
  };

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
      />
    </SalesQuotationLayout>
  );
}

export default SalesQuotationPage;
