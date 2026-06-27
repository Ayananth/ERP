import { getTodayDate } from "./salesConstants";

export const mapQuotationToHeader = (quotation) => ({
  quotation_no: quotation?.quotation_no ?? "",
  quotation_type: quotation?.quotation_type ?? "",
  date: quotation?.quotation_date ?? getTodayDate(),
  customer: quotation?.customer ?? "",
  customer_ref_no: quotation?.customer_ref_no ?? "",
  sales_executive: quotation?.sales_executive ?? "",
  attention: quotation?.attention ?? "",
  pay_terms: quotation?.pay_terms ?? "",
  delivery_place: quotation?.delivery_place ?? "",
  currency: quotation?.currency ?? "1 - SAUDI RIYAL",
  exchange_rate: quotation?.exchange_rate ?? "1",
  notes: quotation?.notes ?? "",
});

export const mapQuotationListItem = (quotation) => ({
  id: quotation.id,
  quotation_no: quotation.quotation_no ?? "",
  delivery_place: quotation.delivery_place ?? "",
  quotation_date: quotation.quotation_date ?? "",
  customer_ref_no: quotation.customer_ref_no ?? "",
  customer_code: quotation.customer_code ?? "",
  customer_name: quotation.customer_name ?? quotation.customer ?? "",
  salesman_code: quotation.salesman_code ?? "",
  net: quotation.net ?? "",
});
