import { toNumber } from "./salesCalculations";
import { hydrateApiLine } from "./hydrateApiLine";

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
      gross_amount: "0.00",
      net_amount: "0.00",
      vat_amount: "0.00",
      net_after_vat: "0.00",
    };
  }

  const grossAmount = qty * rate;
  const discountAmount = grossAmount * (discountPercent / 100);
  const netAmount = grossAmount - discountAmount;
  const vatAmount = netAmount * (vatPercent / 100);
  const netAfterVat = netAmount + vatAmount;

  return {
    qty: overrides.qty ?? line.qty,
    rate: overrides.rate ?? line.rate,
    discount_percent: overrides.discount_percent ?? line.discount_percent,
    vat_percent: overrides.vat_percent ?? line.vat_percent,
    discount_amount: discountAmount.toFixed(2),
    gross_amount: grossAmount.toFixed(2),
    net_amount: netAmount.toFixed(2),
    vat_amount: vatAmount.toFixed(2),
    net_after_vat: netAfterVat.toFixed(2),
  };
};

export const calculateTotals = (quotationLines = []) => {
  const totals = quotationLines.reduce(
    (acc, line) => {
      acc.gross += toNumber(line.gross_amount);
      acc.discount += toNumber(line.discount_amount);
      acc.net += toNumber(line.net_amount);
      acc.vat += toNumber(line.vat_amount);
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

export const hydrateQuotationLine = (line, index = 0) =>
  hydrateApiLine(line, hydrateLine, index);
