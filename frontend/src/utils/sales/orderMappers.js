import { getTodayDate } from "./salesConstants";
import { getValidDate } from "./orderConstants";

export const mapOrderToHeader = (order) => ({
  order_no: order?.order_no ?? "",
  order_type: order?.order_type ?? "",
  issue_date: order?.order_date ?? getTodayDate(),
  valid_date: order?.valid_date ?? getValidDate(),
  linked_quotation: order?.quotation_no || "No quotation linked",
  quotation_id: order?.quotation ?? "",
  customer: order?.customer ?? "",
  customer_display: order?.customer_name ?? "",
  customer_po: order?.customer_po ?? "",
  sales_executive: order?.sales_executive ?? "",
  currency: order?.currency ?? "1 - SAUDI RIYAL",
  exchange_rate: order?.exchange_rate ?? "1.00",
  delivery_place: order?.delivery_place ?? "",
  notes: order?.notes ?? "",
});

export const mapOrderListItem = (order) => ({
  id: order.id,
  order_no: order.order_no ?? "",
  customer_name: order.customer_name ?? order.customer ?? "",
  order_date: order.order_date ?? "",
  total_net_amount:
    order.total_net_amount ??
    order.net_after_vat ??
    order.net ??
    order.grand_total ??
    "",
  status: order.status ?? order.order_status ?? "",
});

export const getNextLineId = (lines) =>
  lines.reduce((max, line) => Math.max(max, line.id ?? 0), 0) + 1;
