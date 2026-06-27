import { useEffect, useState } from "react";

export default function useFormMessages() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  return {
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    clearMessages,
  };
}
