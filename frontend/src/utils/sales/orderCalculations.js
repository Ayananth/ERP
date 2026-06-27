import { toNumber } from "./salesCalculations";

export { toNumber };

export const calculateLine = (line, overrides = {}) => {
  const qty = toNumber(overrides.qty ?? line.qty);
  const rate = toNumber(overrides.rate ?? line.rate);
  const discountPercent = toNumber(
    overrides.discount_percent ?? line.discount_percent
  );
  const vatPercent = toNumber(overrides.vat_percent ?? line.vat_percent);

  if (
    qty <= 0 ||
    rate < 0 ||
    discountPercent < 0 ||
    discountPercent > 100 ||
    vatPercent < 0 ||
    vatPercent > 100
  ) {
    return {
      qty: overrides.qty ?? line.qty,
      rate: overrides.rate ?? line.rate,
      discount_percent: overrides.discount_percent ?? line.discount_percent,
      vat_percent: overrides.vat_percent ?? line.vat_percent,
      discount_amount: "0.00",
      net: "0.00",
      vat: "0.00",
      net_after_vat: "0.00",
    };
  }

  const gross = qty * rate;
  const discountAmount = gross * (discountPercent / 100);
  const net = gross - discountAmount;
  const vatAmount = net * (vatPercent / 100);

  return {
    qty: overrides.qty ?? line.qty,
    rate: overrides.rate ?? line.rate,
    discount_percent: overrides.discount_percent ?? line.discount_percent,
    vat_percent: overrides.vat_percent ?? line.vat_percent,
    discount_amount: discountAmount.toFixed(2),
    net: net.toFixed(2),
    vat: vatAmount.toFixed(2),
    net_after_vat: (net + vatAmount).toFixed(2),
  };
};

export const calculateTotals = (orderLines = []) => {
  const totals = orderLines.reduce(
    (acc, line) => {
      const qty = toNumber(line.qty);
      const rate = toNumber(line.rate);

      acc.gross += qty * rate;
      acc.discount += toNumber(line.discount_amount);
      acc.net += toNumber(line.net);
      acc.vat += toNumber(line.vat);
      acc.netAfterVat += toNumber(line.net_after_vat);

      return acc;
    },
    {
      gross: 0,
      discount: 0,
      net: 0,
      vat: 0,
      netAfterVat: 0,
    }
  );

  return {
    gross: totals.gross.toFixed(2),
    discount: totals.discount.toFixed(2),
    net: totals.net.toFixed(2),
    vat: totals.vat.toFixed(2),
    netAfterVat: totals.netAfterVat.toFixed(2),
  };
};

export const hydrateLine = (line) => {
  const normalizedLine = {
    ...line,
    qty: String(line.qty ?? line.quantity ?? ""),
    rate: String(line.rate ?? ""),
    discount_percent: String(line.discount_percent ?? ""),
    vat_percent: String(line.vat_percent ?? ""),
  };

  return {
    ...normalizedLine,
    ...calculateLine(normalizedLine),
  };
};
