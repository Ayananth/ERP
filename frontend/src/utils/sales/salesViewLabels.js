export function getPrimaryActionLabel(isEditing, viewState) {
  if (isEditing) {
    return viewState === "viewExisting" ? "Update" : "Save";
  }

  return viewState === "viewExisting" ? "Edit" : "New";
}
