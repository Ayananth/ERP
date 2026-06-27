import { useCallback, useEffect, useState } from "react";

const EMPTY_MESSAGE = { type: "", text: "" };

export default function useInventoryMessage() {
  const [message, setMessage] = useState(EMPTY_MESSAGE);

  useEffect(() => {
    if (!message.text) return;

    const timer = setTimeout(() => {
      setMessage(EMPTY_MESSAGE);
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

  const dismissMessage = useCallback(() => {
    setMessage(EMPTY_MESSAGE);
  }, []);

  const clearMessage = dismissMessage;

  return {
    clearMessage,
    dismissMessage,
    message,
    setMessage,
  };
}
