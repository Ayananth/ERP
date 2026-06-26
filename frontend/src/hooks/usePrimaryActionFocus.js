import { useCallback, useLayoutEffect, useRef } from "react";

export default function usePrimaryActionFocus(buttonRef) {
  const pendingRef = useRef(false);

  const scheduleFocus = useCallback(() => {
    pendingRef.current = true;
  }, []);

  useLayoutEffect(() => {
    if (!pendingRef.current) {
      return;
    }

    pendingRef.current = false;
    buttonRef.current?.focus();
  });

  return scheduleFocus;
}
