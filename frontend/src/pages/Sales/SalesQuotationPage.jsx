import { useState } from "react";

import SalesQuotationLayout from "../../components/sales/SalesQuotationLayout";
import SalesQuotationHeader from "../../components/sales/SalesQuotationHeader";
import SalesQuotationLines from "../../components/sales/SalesQuotationLines";
import SalesQuotationFooter from "../../components/sales/SalesQuotationFooter";

function SalesQuotationPage() {
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

  return (
    <SalesQuotationLayout>
      <SalesQuotationHeader
        data={header}
        onChange={setHeader}
      />

      <SalesQuotationLines
        lines={lines}
        setLines={setLines}
      />

      <SalesQuotationFooter />
    </SalesQuotationLayout>
  );
}

export default SalesQuotationPage;
