import { useEffect } from "react";

export default function useInventoryPriceEditingFocus(
  editing,
  loading,
  firstFieldRef,
  scheduleEditButtonFocus
) {
  useEffect(() => {
    if (loading) return undefined;

    const timer = setTimeout(() => {
      if (editing) {
        firstFieldRef.current?.focus();
      } else {
        scheduleEditButtonFocus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [editing, firstFieldRef, loading, scheduleEditButtonFocus]);
}
