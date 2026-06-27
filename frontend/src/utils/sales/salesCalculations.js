export const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const validateLines = (lines) => {
  for (const line of lines) {
    const qty = toNumber(line.qty);
    const rate = toNumber(line.rate);
    const discountPercent = toNumber(line.discount_percent);
    const vatPercent = toNumber(line.vat_percent);

    if (qty <= 0) return "Quantity must be greater than zero.";
    if (rate < 0) return "Rate cannot be negative.";
    if (discountPercent < 0 || discountPercent > 100) {
      return "Discount percentage must be between 0 and 100.";
    }
    if (vatPercent < 0 || vatPercent > 100) {
      return "VAT percentage must be between 0 and 100.";
    }
  }

  return "";
};
