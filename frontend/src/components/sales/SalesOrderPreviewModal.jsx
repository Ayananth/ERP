import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
  const [iframeLoading, setIframeLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open || !orderId) {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl("");
      }
      setLoading(false);
      setIframeLoading(false);
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
        setIframeLoading(true);
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
      setIframeLoading(false);
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
          {errorMessage ? (
            <div className="flex h-full items-center justify-center px-6 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : pdfUrl ? (
            <div className="relative h-full w-full">
              {(loading || iframeLoading) ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/80 text-sm text-slate-500">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  <span>Loading PDF preview...</span>
                </div>
              ) : null}
              <iframe
                title="Sales order PDF preview"
                src={pdfUrl}
                className="h-full w-full border-0"
                onLoad={() => setIframeLoading(false)}
                onError={() => {
                  setIframeLoading(false);
                  setErrorMessage("Failed to load the PDF preview.");
                }}
              />
            </div>
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
