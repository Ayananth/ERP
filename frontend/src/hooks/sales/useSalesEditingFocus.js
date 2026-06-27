import { useEffect } from "react";

export default function useSalesEditingFocus(
  isEditing,
  firstFieldRef,
  schedulePrimaryActionFocus
) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isEditing) {
        firstFieldRef.current?.focus();
      } else {
        schedulePrimaryActionFocus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isEditing, schedulePrimaryActionFocus, firstFieldRef]);
}
