import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  createQuotation,
  getQuotation,
  getItemDetails,
  getCustomerDropdown,
  getItemSearch,
  getQuotationList,
  updateQuotation,
} from "../../api/salesApi";
import Alert from "../../components/common/Alert";
import usePrimaryActionFocus from "../../hooks/usePrimaryActionFocus";
import SalesQuotationLayout from "../../components/sales/SalesQuotationLayout";
import SalesQuotationHeader from "../../components/sales/SalesQuotationHeader";
import SalesQuotationLines from "../../components/sales/SalesQuotationLines";
import SalesQuotationFooter from "../../components/sales/SalesQuotationFooter";
import SalesQuotationSelectModal from "../../components/sales/SalesQuotationSelectModal";
import SalesOrderPreviewModal from "../../components/sales/SalesOrderPreviewModal";
import {
  createEmptyLine,
  getTodayDate,
  initialHeader,
  initialLines,
} from "../../utils/sales/quotationConstants";
import {
  calculateLine,
  calculateTotals,
  hydrateLine,
  hydrateQuotationLine,
} from "../../utils/sales/quotationCalculations";
import { validateLines } from "../../utils/sales/salesCalculations";

function SalesQuotationPage() {
  const navigate = useNavigate();
  const { quotationId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [header, setHeader] = useState(initialHeader);
  const [activeQuotationId, setActiveQuotationId] = useState(quotationId ?? null);
  const [viewState, setViewState] = useState(quotationId ? "viewExisting" : "viewBlank");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingQuotation, setLoadingQuotation] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isQuotationModalLoading, setIsQuotationModalLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const firstTableCellRef = useRef(null);
  const tableRefs = useRef([]);
  const location = useLocation();
  const [lines, setLines] = useState(initialLines);
  const [nextLineId, setNextLineId] = useState(2);
  const newEditButtonRef = useRef(null);
  const firstFieldRef = useRef(null);
  const schedulePrimaryActionFocus = usePrimaryActionFocus(newEditButtonRef);

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


  useEffect(() => {
    const timer = setTimeout(() => {
      if (isEditing) {
        firstFieldRef.current?.focus();
      } else {
        schedulePrimaryActionFocus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isEditing, schedulePrimaryActionFocus]);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [customerResponse] = await Promise.all([
          getCustomerDropdown(),
          getQuotationList(),
        ]);

        setCustomers(customerResponse ?? []);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ??
            "Failed to load quotation dropdown data."
        );
      }
    };

    loadDropdownData();
  }, []);

  useEffect(() => {
    const loadQuotation = async () => {
      if (!quotationId) {
        setActiveQuotationId(null);
        setViewState("viewBlank");
        return;
      }

      setLoadingQuotation(true);
      setErrorMessage("");

      try {
        const quotation = await getQuotation(quotationId);

        setActiveQuotationId(quotation?.id ?? quotationId);
        setViewState("viewExisting");
        setHeader({
          quotation_no: quotation?.quotation_no ?? "",
          quotation_type: quotation?.quotation_type ?? "",
          date: quotation?.quotation_date ?? getTodayDate(),
          customer: quotation?.customer ?? "",
          customer_ref_no: quotation?.customer_ref_no ?? "",
          sales_executive: quotation?.sales_executive ?? "",
          attention: quotation?.attention ?? "",
          pay_terms: quotation?.pay_terms ?? "",
          delivery_place: quotation?.delivery_place ?? "",
          currency: quotation?.currency ?? "1 - SAUDI RIYAL",
          exchange_rate: quotation?.exchange_rate ?? "1",
          notes: quotation?.notes ?? "",
        });

        const hydratedLines = await Promise.all(
          (quotation?.lines ?? []).map((line, index) =>
            hydrateQuotationLine(line, index)
          )
        );

        setLines(hydratedLines.length ? hydratedLines : initialLines);
        setNextLineId((hydratedLines.length ? hydratedLines : initialLines).length + 1);

        setIsEditing(false);
    } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ??
            "Failed to load the selected quotation."
        );
      } finally {
        setLoadingQuotation(false);
      }
    };

    loadQuotation();
  }, [quotationId]);

  const handleHeaderChange = (field, value) => {
    setErrorMessage("");
    setSuccessMessage("");
    setHeader((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLineChange = (lineId, field, value) => {
    setErrorMessage("");
    setSuccessMessage("");
    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id !== lineId) {
          return line;
        }

        if (field === "unit") {
          const selectedUnit = (line.unit_options ?? []).find(
            (unit) => String(unit.unit_id) === String(value)
          );
          const selectedPrice = (line.unit_prices ?? []).find(
            (price) => String(price.unit_id) === String(value)
          );
          const nextRate =
            selectedPrice?.sale_price ?? line.rate ?? "";

          return {
            ...line,
            unit: value,
            unit_name: selectedUnit?.unit_name ?? "",
            ...calculateLine(line, {
              rate: nextRate === "" ? "" : String(nextRate),
            }),
            rate: nextRate === "" ? "" : String(nextRate),
          };
        }

        if (field === "qty" || field === "rate" || field === "discount_percent" || field === "vat_percent") {
          const nextLine = { ...line, [field]: value };
          return {
            ...nextLine,
            ...calculateLine(nextLine, { [field]: value }),
          };
        }

        return { ...line, [field]: value };
      })
    );
  };

  const handleItemSearch = async (search) => {
    const response = await getItemSearch(search);
    return response ?? [];
  };

  const handleItemSelect = async (lineId, item) => {
    const itemDetails = await getItemDetails(item.id);
    const selectedUnit = itemDetails?.units?.[0];
    const selectedPrice =
      itemDetails?.prices?.find((price) => price.unit_id === selectedUnit?.unit_id) ??
      itemDetails?.prices?.[0];
    const rate = selectedPrice?.sale_price ?? "";
    const hasUnitOrPrice =
      (itemDetails?.units?.length ?? 0) > 0 || (itemDetails?.prices?.length ?? 0) > 0;

    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id !== lineId) {
          return line;
        }

        const nextQty = hasUnitOrPrice ? "1" : line.qty;

        return hydrateLine({
          ...line,
          item_id: itemDetails?.id ?? item.id,
          item_code: itemDetails?.item_code ?? item.item_code,
          description: itemDetails?.name ?? item.name,
          unit: selectedUnit?.unit_id ?? "",
          unit_name: selectedUnit?.unit_name ?? "",
          rate: rate === "" ? "" : String(rate),
          qty: nextQty,
          unit_options: itemDetails?.units ?? [],
          unit_prices: itemDetails?.prices ?? [],
          item_options: [],
        });
      })
    );
  };

  const handleAddLine = () => {
    setLines((prevLines) => [...prevLines, createEmptyLine(nextLineId)]);
    setNextLineId((prev) => prev + 1);
  };

  const resetToBlankTransaction = () => {
    setHeader({
      ...initialHeader,
      date: getTodayDate(),
    });
    setLines(initialLines);
    setNextLineId(2);
    setActiveQuotationId(null);
    setViewState("viewBlank");
    setIsEditing(true);
    navigate("/sales/transactions/quotation", {
      replace: true,
    });
  };

  const openQuotationModal = async () => {
    setIsQuotationModalOpen(true);
    setIsQuotationModalLoading(true);
    setErrorMessage("");

    try {
      const quotationList = await getQuotationList();

      setQuotations(
        (quotationList ?? []).map((quotation) => ({
          id: quotation.id,
          quotation_no: quotation.quotation_no ?? "",
          delivery_place: quotation.delivery_place ?? "",
          quotation_date: quotation.quotation_date ?? "",
          customer_ref_no: quotation.customer_ref_no ?? "",
          customer_code: quotation.customer_code ?? "",
          customer_name: quotation.customer_name ?? quotation.customer ?? "",
          salesman_code: quotation.salesman_code ?? "",
          net: quotation.net ?? "",
        }))
      );
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ?? "Failed to load sales quotations."
      );
    } finally {
      setIsQuotationModalLoading(false);
    }
  };

  const loadQuotationById = async (id) => {
    const quotation = await getQuotation(id);

    setActiveQuotationId(quotation?.id ?? id);
    setViewState("viewExisting");
    setHeader({
      quotation_no: quotation?.quotation_no ?? "",
      quotation_type: quotation?.quotation_type ?? "",
      date: quotation?.quotation_date ?? getTodayDate(),
      customer: quotation?.customer ?? "",
      customer_ref_no: quotation?.customer_ref_no ?? "",
      sales_executive: quotation?.sales_executive ?? "",
      attention: quotation?.attention ?? "",
      pay_terms: quotation?.pay_terms ?? "",
      delivery_place: quotation?.delivery_place ?? "",
      currency: quotation?.currency ?? "1 - SAUDI RIYAL",
      exchange_rate: quotation?.exchange_rate ?? "1",
      notes: quotation?.notes ?? "",
    });

    const hydratedLines = await Promise.all(
      (quotation?.lines ?? []).map((line, index) =>
        hydrateQuotationLine(line, index)
      )
    );

    setLines(hydratedLines.length ? hydratedLines : initialLines);
    setIsEditing(false);
  };

  const handleQuotationSelect = async (quotationSummary) => {
    setIsQuotationModalLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await loadQuotationById(quotationSummary.id);
      setIsQuotationModalOpen(false);
      schedulePrimaryActionFocus();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ??
          "Failed to load the selected quotation."
      );
    } finally {
      setIsQuotationModalLoading(false);
    }
  };

  const handleFooterAction = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (viewState === "viewExisting") {
      setIsEditing(true);
      return;
    }

    resetToBlankTransaction();
  };

  const handleCancel = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setHeader({
      ...initialHeader,
      date: getTodayDate(),
    });
    setLines(initialLines);
    setNextLineId(2);
    setIsEditing(false);
    setActiveQuotationId(null);
    setViewState("viewBlank");

    if (quotationId) {
      navigate("/sales/transactions/quotation", {
        replace: true,
      });
    }
  };

  const handleSaveQuotation = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!header.customer) {
      setErrorMessage("Please select a customer before saving.");
      return;
    }

    const validLines = lines.filter((line) => line.item_id);

    const lineValidationMessage = validateLines(validLines);
    if (lineValidationMessage) {
      setErrorMessage(lineValidationMessage);
      return;
    }

    const payload = {
      customer: Number(header.customer),
      quotation_date: header.date,
      notes: header.notes,
      lines: validLines.map((line) => ({
        item: Number(line.item_id),
        unit: Number(line.unit),
        quantity: Number(line.qty || 0),
        rate: Number(line.rate || 0),
        discount_percent: Number(line.discount_percent || 0),
        vat_percent: Number(line.vat_percent || 0),
      })),
    };

    try {
      const response = activeQuotationId
        ? await updateQuotation(activeQuotationId, payload)
        : await createQuotation(payload);

      const savedQuotationId = response?.id ?? activeQuotationId;

      if (savedQuotationId) {
        navigate(`/sales/transactions/quotation/${savedQuotationId}`, {
          replace: true,
        });
        await loadQuotationById(savedQuotationId);
      }

      setIsEditing(false);
      setViewState("viewBlank");
      setSuccessMessage("Quotation saved successfully.");
      return response;
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.error ??
          error?.response?.data?.message ??
          "Failed to save quotation. Please try again."
      );
      return null;
    }
  };

  const handleListQuotations = async () => {
    await openQuotationModal();
  };

  const handleHeaderEnd = () => {
    firstTableCellRef.current?.focus?.();
  };

  const handlePreview = () => {
    if (!activeQuotationId) {
      return;
    }

    setIsPreviewOpen(true);
  };

  const footerTotals = calculateTotals(lines);

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
        primaryActionLabel={
          isEditing ? (viewState === "viewExisting" ? "Update" : "Save") : viewState === "viewExisting" ? "Edit" : "New"
        }
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
