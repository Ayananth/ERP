import { getItemDetails } from "../../api/salesApi";

export const hydrateApiLine = async (line, hydrateLine, index = 0) => {
  const itemDetails = line.item ? await getItemDetails(line.item) : null;
  const selectedUnit =
    itemDetails?.units?.find(
      (unit) => String(unit.unit_id) === String(line.unit)
    ) ??
    (line.unit
      ? {
          unit_id: line.unit,
          unit_name: line.unit_name ?? "",
        }
      : null);

  return hydrateLine({
    id: line.id ?? index + 1,
    item_id: line.item ?? "",
    item_code: itemDetails?.item_code ?? "",
    description: line.item_name ?? itemDetails?.name ?? "",
    unit: line.unit ?? "",
    unit_name: selectedUnit?.unit_name ?? "",
    qty: line.quantity ?? "",
    rate: line.rate ?? "",
    discount_percent: line.discount_percent ?? "",
    vat_percent: line.vat_percent ?? "",
    unit_options: itemDetails?.units ?? (selectedUnit ? [selectedUnit] : []),
    unit_prices: itemDetails?.prices ?? [],
    item_options: [],
  });
};
