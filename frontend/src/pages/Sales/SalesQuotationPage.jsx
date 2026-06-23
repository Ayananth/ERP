import { useState } from "react";

import SalesQuotationLayout from "../../components/sales/SalesQuotationLayout";
import SalesQuotationHeader from "../../components/sales/SalesQuotationHeader";
import SalesQuotationLines from "../../components/sales/SalesQuotationLines";
import SalesQuotationFooter from "../../components/sales/SalesQuotationFooter";

function SalesQuotationPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [header, setHeader] = useState({
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
  });

  const [lines, setLines] = useState([
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
  ]);

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

  return (
    <SalesQuotationLayout>
      <SalesQuotationHeader
        data={header}
        isEditing={isEditing}
        onChange={handleHeaderChange}
      />

      <SalesQuotationLines
        lines={lines}
        isEditing={isEditing}
        onChange={handleLineChange}
      />

      <SalesQuotationFooter
        isEditing={isEditing}
        onAction={handleFooterAction}
      />
    </SalesQuotationLayout>
  );
}

export default SalesQuotationPage;
