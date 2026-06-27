export function applyLineFieldChange(prevLines, lineId, field, value, calculateLine) {
  return prevLines.map((line) => {
    if (line.id !== lineId) {
      return line;
    }

    if (field === "unit") {
      const selectedUnit = (line.unit_options ?? []).find(
        (unit) => String(unit.unit_id) === String(value)
      );
      const selectedPrice = (line.unit_prices ?? []).find(
        (price) => String(price.unit_id) === String(value)
      );
      const nextRate = selectedPrice?.sale_price ?? line.rate ?? "";

      return {
        ...line,
        unit: value,
        unit_name: selectedUnit?.unit_name ?? "",
        ...calculateLine(line, {
          rate: nextRate === "" ? "" : String(nextRate),
        }),
        rate: nextRate === "" ? "" : String(nextRate),
      };
    }

    if (
      field === "qty" ||
      field === "rate" ||
      field === "discount_percent" ||
      field === "vat_percent"
    ) {
      const nextLine = { ...line, [field]: value };
      return {
        ...nextLine,
        ...calculateLine(nextLine, { [field]: value }),
      };
    }

    return { ...line, [field]: value };
  });
}

export function applyItemSelection(
  prevLines,
  lineId,
  item,
  itemDetails,
  hydrateLine
) {
  const selectedUnit = itemDetails?.units?.[0];
  const selectedPrice =
    itemDetails?.prices?.find(
      (price) => price.unit_id === selectedUnit?.unit_id
    ) ?? itemDetails?.prices?.[0];
  const rate = selectedPrice?.sale_price ?? "";
  const hasUnitOrPrice =
    (itemDetails?.units?.length ?? 0) > 0 ||
    (itemDetails?.prices?.length ?? 0) > 0;

  return prevLines.map((line) => {
    if (line.id !== lineId) {
      return line;
    }

    const nextQty = hasUnitOrPrice ? "1" : line.qty;

    return hydrateLine({
      ...line,
      item_id: itemDetails?.id ?? item.id,
      item_code: itemDetails?.item_code ?? item.item_code,
      description: itemDetails?.name ?? item.name,
      unit: selectedUnit?.unit_id ?? "",
      unit_name: selectedUnit?.unit_name ?? "",
      rate: rate === "" ? "" : String(rate),
      qty: nextQty,
      unit_options: itemDetails?.units ?? [],
      unit_prices: itemDetails?.prices ?? [],
      item_options: [],
    });
  });
}
