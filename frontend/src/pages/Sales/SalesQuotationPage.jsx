import Alert from "../../components/common/Alert";
import SalesQuotationLayout from "../../components/sales/SalesQuotationLayout";
import SalesQuotationHeader from "../../components/sales/SalesQuotationHeader";
import SalesQuotationLines from "../../components/sales/SalesQuotationLines";
import SalesQuotationFooter from "../../components/sales/SalesQuotationFooter";
import SalesQuotationSelectModal from "../../components/sales/SalesQuotationSelectModal";
import SalesOrderPreviewModal from "../../components/sales/SalesOrderPreviewModal";
import useSalesQuotationPage from "../../hooks/sales/useSalesQuotationPage";

function SalesQuotationPage() {
  const {
    activeQuotationId,
    customers,
    errorMessage,
    firstFieldRef,
    firstTableCellRef,
    footerTotals,
    handleAddLine,
    handleCancel,
    handleFooterAction,
    handleHeaderChange,
    handleHeaderEnd,
    handleItemSearch,
    handleItemSelect,
    handleLineChange,
    handleListQuotations,
    handlePreview,
    handleQuotationSelect,
    handleSaveQuotation,
    header,
    isEditing,
    isPreviewOpen,
    isQuotationModalLoading,
    isQuotationModalOpen,
    loadingQuotation,
    newEditButtonRef,
    primaryActionLabel,
    quotations,
    setErrorMessage,
    setIsPreviewOpen,
    setIsQuotationModalOpen,
    setSuccessMessage,
    successMessage,
    tableRefs,
    lines,
  } = useSalesQuotationPage();

  return (
    <SalesQuotationLayout>
      <Alert
        type="error"
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />

      <Alert
        type="success"
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />

      {loadingQuotation ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Loading quotation...
        </div>
      ) : null}

      <SalesQuotationHeader
        data={header}
        isEditing={isEditing}
        onChange={handleHeaderChange}
        onHeaderEnd={handleHeaderEnd}
        firstInputRef={firstFieldRef}
        customers={customers}
      />

      <SalesQuotationLines
        lines={lines}
        isEditing={isEditing}
        onChange={handleLineChange}
        onItemSearch={handleItemSearch}
        onItemSelect={handleItemSelect}
        onAddLine={handleAddLine}
        firstTableCellRef={firstTableCellRef}
        tableRefs={tableRefs}
        saveButtonRef={newEditButtonRef}
      />

      <SalesQuotationFooter
        isEditing={isEditing}
        onAction={handleFooterAction}
        onCancel={handleCancel}
        newEditButtonRef={newEditButtonRef}
        onList={handleListQuotations}
        onPreview={handlePreview}
        previewDisabled={!activeQuotationId}
        onSave={handleSaveQuotation}
        primaryActionLabel={primaryActionLabel}
        totals={footerTotals}
      />

      <SalesOrderPreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        pdfPath={
          activeQuotationId
            ? `/sales/quotations/${activeQuotationId}/pdf/`
            : ""
        }
      />

      <SalesQuotationSelectModal
        isOpen={isQuotationModalOpen}
        loading={isQuotationModalLoading}
        quotations={quotations}
        onClose={() => setIsQuotationModalOpen(false)}
        onSelect={handleQuotationSelect}
      />
    </SalesQuotationLayout>
  );
}

export default SalesQuotationPage;
