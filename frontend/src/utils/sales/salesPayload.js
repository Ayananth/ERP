export const mapLinesToPayload = (lines) =>
  lines.map((line) => ({
    item: Number(line.item_id),
    unit: Number(line.unit),
    quantity: Number(line.qty || 0),
    rate: Number(line.rate || 0),
    discount_percent: Number(line.discount_percent || 0),
    vat_percent: Number(line.vat_percent || 0),
  }));
