import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createQuotation,
  getQuotation,
  getCustomerDropdown,
  getItemDetails,
  getItemSearch,
  getQuotationList,
  updateQuotation,
} from "../../api/salesApi";
import useFormMessages from "./useFormMessages";
import usePrimaryActionFocus from "../usePrimaryActionFocus";
import useSalesEditingFocus from "./useSalesEditingFocus";
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
import {
  mapQuotationListItem,
  mapQuotationToHeader,
} from "../../utils/sales/quotationMappers";
import {
  applyItemSelection,
  applyLineFieldChange,
} from "../../utils/sales/salesLineHandlers";
import { validateLines } from "../../utils/sales/salesCalculations";
import { createQuotationPayload } from "../../utils/sales/quotationPayload";
import { getPrimaryActionLabel } from "../../utils/sales/salesViewLabels";

export default function useSalesQuotationPage() {
  const navigate = useNavigate();
  const { quotationId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [header, setHeader] = useState(initialHeader);
  const [activeQuotationId, setActiveQuotationId] = useState(
    quotationId ?? null
  );
  const [viewState, setViewState] = useState(
    quotationId ? "viewExisting" : "viewBlank"
  );
  const [loadingQuotation, setLoadingQuotation] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isQuotationModalLoading, setIsQuotationModalLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [lines, setLines] = useState(initialLines);
  const [nextLineId, setNextLineId] = useState(2);
  const [saving, setSaving] = useState(false);

  const firstTableCellRef = useRef(null);
  const tableRefs = useRef([]);
  const newEditButtonRef = useRef(null);
  const firstFieldRef = useRef(null);
  const schedulePrimaryActionFocus = usePrimaryActionFocus(newEditButtonRef);

  const {
    clearMessages,
    dismissError,
    dismissSuccess,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
  } = useFormMessages();

  useSalesEditingFocus(isEditing, firstFieldRef, schedulePrimaryActionFocus);

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
  }, [setErrorMessage]);

  const loadQuotationById = useCallback(async (id) => {
    const quotation = await getQuotation(id);

    setActiveQuotationId(quotation?.id ?? id);
    setViewState("viewExisting");
    setHeader(mapQuotationToHeader(quotation));

    const hydratedLines = await Promise.all(
      (quotation?.lines ?? []).map((line, index) =>
        hydrateQuotationLine(line, index)
      )
    );

    setLines(hydratedLines.length ? hydratedLines : initialLines);
    setIsEditing(false);
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
        setHeader(mapQuotationToHeader(quotation));

        const hydratedLines = await Promise.all(
          (quotation?.lines ?? []).map((line, index) =>
            hydrateQuotationLine(line, index)
          )
        );

        const nextLines = hydratedLines.length ? hydratedLines : initialLines;
        setLines(nextLines);
        setNextLineId(nextLines.length + 1);
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
  }, [quotationId, setErrorMessage]);

  const handleHeaderChange = useCallback(
    (field, value) => {
      clearMessages();
      setHeader((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [clearMessages]
  );

  const handleLineChange = useCallback(
    (lineId, field, value) => {
      clearMessages();
      setLines((prevLines) =>
        applyLineFieldChange(prevLines, lineId, field, value, calculateLine)
      );
    },
    [clearMessages]
  );

  const handleItemSearch = useCallback(async (search) => {
    const response = await getItemSearch(search);
    return response ?? [];
  }, []);

  const handleItemSelect = useCallback(async (lineId, item) => {
    const itemDetails = await getItemDetails(item.id);
    setLines((prevLines) =>
      applyItemSelection(prevLines, lineId, item, itemDetails, hydrateLine)
    );
  }, []);

  const handleAddLine = useCallback(() => {
    setLines((prevLines) => [...prevLines, createEmptyLine(nextLineId)]);
    setNextLineId((prev) => prev + 1);
  }, [nextLineId]);

  const resetToBlankTransaction = useCallback(() => {
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
  }, [navigate]);

  const openQuotationModal = useCallback(async () => {
    setIsQuotationModalOpen(true);
    setIsQuotationModalLoading(true);
    setErrorMessage("");

    try {
      const quotationList = await getQuotationList();
      setQuotations((quotationList ?? []).map(mapQuotationListItem));
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ?? "Failed to load sales quotations."
      );
    } finally {
      setIsQuotationModalLoading(false);
    }
  }, [setErrorMessage]);

  const handleQuotationSelect = useCallback(
    async (quotationSummary) => {
      setIsQuotationModalLoading(true);
      clearMessages();

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
    },
    [
      clearMessages,
      loadQuotationById,
      schedulePrimaryActionFocus,
      setErrorMessage,
    ]
  );

  const handleFooterAction = useCallback(() => {
    clearMessages();

    if (viewState === "viewExisting") {
      setIsEditing(true);
      return;
    }

    resetToBlankTransaction();
  }, [clearMessages, resetToBlankTransaction, viewState]);

  const handleCancel = useCallback(() => {
    clearMessages();
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
  }, [clearMessages, navigate, quotationId]);

  const handleSaveQuotation = useCallback(async () => {
    if (saving) return;

    clearMessages();

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

    const payload = createQuotationPayload(header, validLines);

    setSaving(true);

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
    } finally {
      setSaving(false);
    }
  }, [
    activeQuotationId,
    clearMessages,
    header,
    lines,
    loadQuotationById,
    navigate,
    saving,
    setErrorMessage,
    setSuccessMessage,
  ]);

  const handleListQuotations = openQuotationModal;

  const handleHeaderEnd = useCallback(() => {
    firstTableCellRef.current?.focus?.();
  }, []);

  const handlePreview = useCallback(() => {
    if (!activeQuotationId) {
      return;
    }

    setIsPreviewOpen(true);
  }, [activeQuotationId]);

  const closeQuotationModal = useCallback(() => {
    setIsQuotationModalOpen(false);
  }, []);

  const footerTotals = useMemo(() => calculateTotals(lines), [lines]);

  const primaryActionLabel = useMemo(
    () => getPrimaryActionLabel(isEditing, viewState),
    [isEditing, viewState]
  );

  const previewPdfPath = useMemo(
    () =>
      activeQuotationId
        ? `/sales/quotations/${activeQuotationId}/pdf/`
        : "",
    [activeQuotationId]
  );

  const previewDisabled = !activeQuotationId;

  return {
    activeQuotationId,
    closeQuotationModal,
    customers,
    dismissError,
    dismissSuccess,
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
    previewDisabled,
    previewPdfPath,
    primaryActionLabel,
    quotations,
    saving,
    setIsPreviewOpen,
    successMessage,
    tableRefs,
    lines,
  };
}
