import { getTodayDate } from "./salesConstants";

export { getTodayDate };

export const initialHeader = {
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

export const initialLines = [
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

export const createEmptyLine = (id) => ({
  ...initialLines[0],
  id,
});
