import { useState } from "react";

import SalesQuotationHeader from "../../components/sales/SalesQuotationHeader"
import SalesQuotationLines from "../../components/sales/SalesQuotationLines"

function SalesQuotationPage() {
  const [header, setHeader] = useState({
    quotation_no: "",
    quotation_type: "",
    date: new Date().toISOString().split("T")[0],
    customer: "",
    customer_ref_no: "",
    sales_executive: "",
    attention: "",
    pay_terms: "",
    delivery_place: "",
    currency: "",
    exchange_rate: 1,
    notes: "",
  });

  const [lines, setLines] = useState([
    {
      id: 1,
      item_code: "",
      description: "",
      unit: "",
      qty: 0,
      rate: 0,
      discount_percent: 0,
      discount_amount: 0,
      net: 0,
      vat: 0,
      net_after_vat: 0,
    },
  ]);

  return (
    <div className="container-fluid">
      <h4 className="mb-3">Sales Quotation</h4>

      <SalesQuotationHeader
        data={header}
        onChange={setHeader}
      />

      <SalesQuotationLines
        lines={lines}
        setLines={setLines}
      />
    </div>
  );
}

export default SalesQuotationPage;