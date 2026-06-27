import { mapLinesToPayload } from "./salesPayload";

export const createOrderPayload = (header, validLines) => ({
  quotation: header.quotation_id ? Number(header.quotation_id) : null,
  customer: Number(header.customer),
  order_date: header.issue_date,
  notes: header.notes,
  lines: mapLinesToPayload(validLines),
});
