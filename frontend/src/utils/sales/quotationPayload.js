import { mapLinesToPayload } from "./salesPayload";

export const createQuotationPayload = (header, validLines) => ({
  customer: Number(header.customer),
  quotation_date: header.date,
  notes: header.notes,
  lines: mapLinesToPayload(validLines),
});
