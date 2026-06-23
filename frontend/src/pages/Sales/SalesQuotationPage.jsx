import { useEffect, useRef, useState } from "react";

import {
  createQuotation,
  getCustomerDropdown,
  getQuotationList,
} from "../../api/salesApi";
import SalesQuotationLayout from "../../components/sales/SalesQuotationLayout";
import SalesQuotationHeader from "../../components/sales/SalesQuotationHeader";
import SalesQuotationLines from "../../components/sales/SalesQuotationLines";
import SalesQuotationFooter from "../../components/sales/SalesQuotationFooter";

const initialHeader = {
  quotation_no: "",
  quotation_type: "",
  date: "18-06-2026",
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
    item_code: "",
    description: "",
    unit: "",
    qty: "",
    rate: "",
    discount_percent: "",
    discount_amount: "",
    net: "",
    vat: "",
    net_after_vat: "",
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

      setCustomers(customerResponse.data ?? []);
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
      prevLines.map((line) =>
        line.id === lineId ? { ...line, [field]: value } : line
      )
    );
  };

  const handleFooterAction = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setHeader(initialHeader);
    setLines(initialLines);
    setIsEditing(false);
  };

  const handleSaveQuotation = async () => {
    const payload = {
      customer: 1,
      quotation_date: "2026-06-23",
      notes: header.notes,
      lines: lines.map((line) => ({
        item: 1,
        unit: 1,
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
