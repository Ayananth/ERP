import { useEffect, useRef, useState } from "react";

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
    if (isEditing) {
      setIsEditing(false);
      return;
    }

    setIsEditing(true);
  };

  const handleCancel = () => {
    setHeader(initialHeader);
    setLines(initialLines);
    setIsEditing(false);
  };

  return (
    <SalesQuotationLayout>
      <SalesQuotationHeader
        data={header}
        isEditing={isEditing}
        onChange={handleHeaderChange}
        firstInputRef={firstFieldRef}
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
      />
    </SalesQuotationLayout>
  );
}

export default SalesQuotationPage;
