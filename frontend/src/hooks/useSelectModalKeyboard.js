import { useCallback, useEffect, useRef, useState } from "react";

function isFormField(target) {
  return Boolean(target?.closest("input, textarea, select"));
}

export default function useSelectModalKeyboard({
  isOpen,
  items,
  loading,
  onSelect,
  onClose,
}) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const rowRefs = useRef([]);
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      panelRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    rowRefs.current = [];
  }, [items]);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
      return;
    }

    setHighlightedIndex(items.length > 0 ? 0 : -1);
  }, [isOpen, items]);

  useEffect(() => {
    if (highlightedIndex < 0) {
      return;
    }

    rowRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  const setRowRef = useCallback((index, element) => {
    rowRefs.current[index] = element;
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (loading || items.length === 0 || isFormField(event.target)) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((current) =>
          current < items.length - 1 ? current + 1 : current
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((current) => (current > 0 ? current - 1 : 0));
        return;
      }

      if (event.key === "Enter" && highlightedIndex >= 0) {
        event.preventDefault();
        onSelect(items[highlightedIndex]);
      }
    },
    [highlightedIndex, items, loading, onClose, onSelect]
  );

  const getRowProps = useCallback(
    (index, item) => ({
      ref: (element) => setRowRef(index, element),
      tabIndex: -1,
      "aria-selected": highlightedIndex === index,
      onMouseEnter: () => setHighlightedIndex(index),
      onClick: () => onSelect(item),
    }),
    [highlightedIndex, onSelect, setRowRef]
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, isOpen]);

  const isRowHighlighted = useCallback(
    (index) => highlightedIndex === index,
    [highlightedIndex]
  );

  return {
    panelRef,
    getRowProps,
    isRowHighlighted,
  };
}
