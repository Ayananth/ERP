import { useCallback, useEffect, useState } from "react";

export default function usePrimaryActionFocus(buttonRef) {
  const [focusRequestId, setFocusRequestId] = useState(0);

  const scheduleFocus = useCallback(() => {
    setFocusRequestId((id) => id + 1);
  }, []);

  useEffect(() => {
    if (focusRequestId === 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      buttonRef.current?.focus({ preventScroll: true });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [buttonRef, focusRequestId]);

  return scheduleFocus;
}
