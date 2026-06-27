import { useCallback, useRef } from "react";

import {
  focusNextField,
  openSelectPicker,
} from "../../utils/inventory/inventoryKeyboard";

export default function useInventoryFieldNavigation(
  primaryButtonRef,
  { enabled = true } = {}
) {
  const fieldRefs = useRef([]);

  const registerField = useCallback((index) => {
    return (element) => {
      fieldRefs.current[index] = element;
    };
  }, []);

  const handleFieldEnter = useCallback((event, index) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    focusNextField(fieldRefs, index);
  }, []);

  const handleSelectKeyDown = useCallback(
    (event, index) => {
      if (event.ctrlKey && event.key === "Enter") {
        return;
      }

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        return;
      }

      if (
        event.key === " " ||
        event.key === "F4" ||
        (event.key === "ArrowDown" && event.altKey)
      ) {
        event.preventDefault();
        openSelectPicker(event.currentTarget);
        return;
      }

      handleFieldEnter(event, index);
    },
    [handleFieldEnter]
  );

  const handleContainerKeyDown = useCallback(
    (event) => {
      if (!enabled || !event.ctrlKey || event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      primaryButtonRef?.current?.focus();
    },
    [enabled, primaryButtonRef]
  );

  return {
    fieldRefs,
    handleContainerKeyDown,
    handleFieldEnter,
    handleSelectKeyDown,
    registerField,
  };
}
