import { getTodayDate } from "./salesConstants";

export const getValidDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
};

export const createEmptyLine = (id) => ({
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

export const initialHeader = {
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

export const initialLines = [createEmptyLine(1)];
