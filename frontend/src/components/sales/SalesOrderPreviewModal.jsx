import { useEffect, useState } from "react";

import api from "../../api/axios";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

function SalesOrderPreviewModal({ open, onOpenChange, orderId }) {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open || !orderId) {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl("");
      }
      setLoading(false);
      setErrorMessage("");
      return;
    }

    let cancelled = false;
    let objectUrl = "";

    const loadPdf = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get(`/sales/orders/${orderId}/pdf/`, {
          responseType: "blob",
        });

        if (cancelled) {
          return;
        }

        objectUrl = URL.createObjectURL(response.data);
        setPdfUrl(objectUrl);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setErrorMessage(
          error?.response?.data?.message ??
            "Failed to load the PDF preview."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [open, orderId]);

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen && pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
      setErrorMessage("");
      setLoading(false);
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent onClose={() => handleOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Sales Order Preview</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Loading PDF preview...
            </div>
          ) : errorMessage ? (
            <div className="flex h-full items-center justify-center px-6 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : pdfUrl ? (
            <iframe
              title="Sales order PDF preview"
              src={pdfUrl}
              className="h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No preview available.
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export default SalesOrderPreviewModal;
