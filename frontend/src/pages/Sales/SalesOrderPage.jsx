import { useState } from "react";

import SalesQuotationLayout from "../../components/sales/SalesQuotationLayout";
import SalesQuotationFooter from "../../components/sales/SalesQuotationFooter";
import SalesOrderHeader from "../../components/sales/SalesOrderHeader";
import SalesOrderLines from "../../components/sales/SalesOrderLines";

function SalesOrderPage() {
  const [header] = useState({
    order_no: "",
    order_type: "",
    issue_date: "18-06-2026",
    valid_date: "18-07-2026",
    linked_quotation: "No quotation linked",
    customer_po: "",
    customer: "",
    sales_executive: "",
    currency: "1 - SAUDI RIYAL",
    exchange_rate: "1.00",
    delivery_place: "",
    notes: "",
  });

  const [lines] = useState([
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
    <SalesQuotationLayout title="Sales Order">
      <SalesOrderHeader data={header} />

      <SalesOrderLines lines={lines} />

      <SalesQuotationFooter />
    </SalesQuotationLayout>
  );
}

export default SalesOrderPage;
