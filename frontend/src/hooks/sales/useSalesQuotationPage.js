import { useEffect, useRef, useState } from "react";
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
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    clearMessages,
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

  const loadQuotationById = async (id) => {
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
  };

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

  const handleHeaderChange = (field, value) => {
    clearMessages();
    setHeader((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLineChange = (lineId, field, value) => {
    clearMessages();
    setLines((prevLines) =>
      applyLineFieldChange(prevLines, lineId, field, value, calculateLine)
    );
  };

  const handleItemSearch = async (search) => {
    const response = await getItemSearch(search);
    return response ?? [];
  };

  const handleItemSelect = async (lineId, item) => {
    const itemDetails = await getItemDetails(item.id);
    setLines((prevLines) =>
      applyItemSelection(prevLines, lineId, item, itemDetails, hydrateLine)
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
      setQuotations((quotationList ?? []).map(mapQuotationListItem));
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ?? "Failed to load sales quotations."
      );
    } finally {
      setIsQuotationModalLoading(false);
    }
  };

  const handleQuotationSelect = async (quotationSummary) => {
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
  };

  const handleFooterAction = () => {
    clearMessages();

    if (viewState === "viewExisting") {
      setIsEditing(true);
      return;
    }

    resetToBlankTransaction();
  };

  const handleCancel = () => {
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
  };

  const handleSaveQuotation = async () => {
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

  const primaryActionLabel = isEditing
    ? viewState === "viewExisting"
      ? "Update"
      : "Save"
    : viewState === "viewExisting"
      ? "Edit"
      : "New";

  return {
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
    saving,
    setErrorMessage,
    setIsPreviewOpen,
    setIsQuotationModalOpen,
    setSuccessMessage,
    successMessage,
    tableRefs,
    lines,
  };
}
