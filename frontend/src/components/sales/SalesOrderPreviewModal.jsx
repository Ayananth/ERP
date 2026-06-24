import PdfPreviewModal from "./PdfPreviewModal";

function SalesOrderPreviewModal({
  open,
  onOpenChange,
  orderId,
  pdfPath,
}) {
  const requestUrl = pdfPath ?? (orderId ? `/sales/orders/${orderId}/pdf/` : "");

  return (
    <PdfPreviewModal
      open={open}
      onOpenChange={onOpenChange}
      requestUrl={requestUrl}
      title="Sales Order Preview"
      loadingLabel="Loading PDF preview..."
      emptyLabel="No preview available."
    />
  );
}

export default SalesOrderPreviewModal;
