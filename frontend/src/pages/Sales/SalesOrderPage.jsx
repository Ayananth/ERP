import { Suspense } from "react";

import Alert from "../../components/common/Alert";
import SalesQuotationLayout from "../../components/sales/SalesQuotationLayout";
import SalesQuotationFooter from "../../components/sales/SalesQuotationFooter";
import {
  LazySalesOrderPreviewModal,
  LazySalesQuotationSelectModal,
} from "../../components/sales/lazySalesModals";
import SalesOrderSelectModal from "../../components/sales/SalesOrderSelectModal";
import SalesOrderHeader from "../../components/sales/SalesOrderHeader";
import SalesOrderLines from "../../components/sales/SalesOrderLines";
import useSalesOrderPage from "../../hooks/sales/useSalesOrderPage";

function SalesOrderPage() {
  const {
    activeOrderId,
    customers,
    errorMessage,
    firstFieldRef,
    firstTableCellRef,
    handleAddLine,
    handleCancel,
    handleFooterAction,
    handleHeaderChange,
    handleHeaderEnd,
    handleItemSearch,
    handleItemSelect,
    handleLineChange,
    handleListOrders,
    handleOrderSelect,
    handlePreview,
    handleQuotationSelect,
    handleSaveOrder,
    header,
    isEditing,
    isOrderModalLoading,
    isOrderModalOpen,
    isPreviewOpen,
    isQuotationModalLoading,
    isQuotationModalOpen,
    loadingOrder,
    newEditButtonRef,
    openQuotationModal,
    orders,
    primaryActionLabel,
    quotations,
    saving,
    setErrorMessage,
    setIsOrderModalOpen,
    setIsPreviewOpen,
    setIsQuotationModalOpen,
    setSuccessMessage,
    successMessage,
    tableRefs,
    totals,
    lines,
  } = useSalesOrderPage();

  return (
    <SalesQuotationLayout title="Sales Order">
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

      {loadingOrder ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Loading sales order...
        </div>
      ) : null}

      <SalesOrderHeader
        data={header}
        isEditing={isEditing}
        onChange={handleHeaderChange}
        onQuotationClick={openQuotationModal}
        firstInputRef={firstFieldRef}
        customers={customers}
        onHeaderEnd={handleHeaderEnd}
      />

      <SalesOrderLines
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
        onList={handleListOrders}
        onPreview={handlePreview}
        previewDisabled={!activeOrderId}
        onSave={handleSaveOrder}
        primaryActionLabel={primaryActionLabel}
        saving={saving}
        totals={totals}
      />

      {isQuotationModalOpen ? (
        <Suspense fallback={null}>
          <LazySalesQuotationSelectModal
            isOpen={isQuotationModalOpen}
            loading={isQuotationModalLoading}
            quotations={quotations}
            onClose={() => setIsQuotationModalOpen(false)}
            onSelect={handleQuotationSelect}
          />
        </Suspense>
      ) : null}

      <SalesOrderSelectModal
        isOpen={isOrderModalOpen}
        loading={isOrderModalLoading}
        orders={orders}
        onClose={() => setIsOrderModalOpen(false)}
        onSelect={handleOrderSelect}
      />

      {isPreviewOpen ? (
        <Suspense fallback={null}>
          <LazySalesOrderPreviewModal
            open={isPreviewOpen}
            onOpenChange={setIsPreviewOpen}
            orderId={activeOrderId}
          />
        </Suspense>
      ) : null}
    </SalesQuotationLayout>
  );
}

export default SalesOrderPage;
