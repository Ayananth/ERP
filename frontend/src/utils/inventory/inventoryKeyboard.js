export function openSelectPicker(selectElement) {
  if (typeof selectElement?.showPicker === "function") {
    selectElement.showPicker();
    return;
  }

  selectElement?.focus();
  selectElement?.click();
}

export function focusNextField(fieldRefs, index) {
  fieldRefs.current[index + 1]?.focus();
}
