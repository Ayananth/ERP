import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createSalesOrder,
  getCustomerDropdown,
  getItemDetails,
  getItemSearch,
  getQuotation,
  getQuotationList,
  getSalesOrder,
  getSalesOrderList,
} from "../../api/salesApi";
import useFormMessages from "./useFormMessages";
import usePrimaryActionFocus from "../usePrimaryActionFocus";
import useSalesEditingFocus from "./useSalesEditingFocus";
import {
  createEmptyLine,
  getValidDate,
  initialHeader,
  initialLines,
} from "../../utils/sales/orderConstants";
import { getTodayDate } from "../../utils/sales/salesConstants";
import {
  calculateLine,
  calculateTotals,
  hydrateLine,
  hydrateOrderLine,
} from "../../utils/sales/orderCalculations";
import {
  getNextLineId,
  mapOrderListItem,
  mapOrderToHeader,
} from "../../utils/sales/orderMappers";
import { mapQuotationListItem } from "../../utils/sales/quotationMappers";
import {
  applyItemSelection,
  applyLineFieldChange,
} from "../../utils/sales/salesLineHandlers";
import { validateLines } from "../../utils/sales/salesCalculations";
import { createOrderPayload } from "../../utils/sales/orderPayload";
import { getPrimaryActionLabel } from "../../utils/sales/salesViewLabels";

export default function useSalesOrderPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [header, setHeader] = useState(initialHeader);
  const [activeOrderId, setActiveOrderId] = useState(orderId ?? null);
  const [viewState, setViewState] = useState(
    orderId ? "viewExisting" : "viewBlank"
  );
  const [lines, setLines] = useState(initialLines);
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isQuotationModalLoading, setIsQuotationModalLoading] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOrderModalLoading, setIsOrderModalLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
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
        const customerResponse = await getCustomerDropdown();
        setCustomers(customerResponse ?? []);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ??
            "Failed to load sales order dropdown data."
        );
      }
    };

    loadDropdownData();
  }, [setErrorMessage]);

  const loadOrderById = useCallback(async (id) => {
    const order = await getSalesOrder(id);

    setActiveOrderId(order?.id ?? id);
    setViewState("viewExisting");
    setHeader(mapOrderToHeader(order));

    const hydratedLines = await Promise.all(
      (order?.lines ?? []).map((line, index) => hydrateOrderLine(line, index))
    );

    setLines(hydratedLines.length ? hydratedLines : initialLines);
    setNextLineId(getNextLineId(hydratedLines));
    setIsEditing(false);
  }, []);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setActiveOrderId(null);
        return;
      }

      setLoadingOrder(true);
      setErrorMessage("");

      try {
        await loadOrderById(orderId);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ??
            "Failed to load the selected sales order."
        );
      } finally {
        setLoadingOrder(false);
      }
    };

    loadOrder();
  }, [loadOrderById, orderId, setErrorMessage]);

  const openQuotationModal = useCallback(async () => {
    if (!isEditing) {
      return;
    }

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
  }, [isEditing, setErrorMessage]);

  const handleQuotationSelect = useCallback(
    async (quotationSummary) => {
      setIsQuotationModalLoading(true);
      clearMessages();

      try {
        const quotation = await getQuotation(quotationSummary.id);
        const hydratedLines = await Promise.all(
          (quotation?.lines ?? []).map((line, index) =>
            hydrateOrderLine(
              {
                ...line,
                item: line.item,
                quantity: line.quantity,
              },
              index
            )
          )
        );

        setHeader((prev) => ({
          ...prev,
          linked_quotation:
            quotation?.quotation_no ?? quotationSummary.quotation_no,
          quotation_id: quotation?.id ?? quotationSummary.id,
          customer: quotation?.customer ?? "",
          customer_display: quotationSummary.customer_name ?? "",
          delivery_place:
            quotation?.delivery_place ?? quotationSummary.delivery_place,
          notes: quotation?.notes ?? prev.notes,
        }));
        setLines(hydratedLines.length ? hydratedLines : initialLines);
        setNextLineId(getNextLineId(hydratedLines));
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
    [clearMessages, schedulePrimaryActionFocus, setErrorMessage]
  );

  const openOrderModal = useCallback(async () => {
    setIsOrderModalOpen(true);
    setIsOrderModalLoading(true);
    setErrorMessage("");

    try {
      const orderList = await getSalesOrderList();
      setOrders((orderList ?? []).map(mapOrderListItem));
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ?? "Failed to load sales orders."
      );
    } finally {
      setIsOrderModalLoading(false);
    }
  }, [setErrorMessage]);

  const resetToBlankTransaction = useCallback(() => {
    setHeader({
      ...initialHeader,
      issue_date: getTodayDate(),
      valid_date: getValidDate(),
    });
    setLines(initialLines);
    setNextLineId(2);
    setActiveOrderId(null);
    setViewState("viewBlank");
    setIsEditing(true);
    navigate("/sales/transactions/order", {
      replace: true,
    });
  }, [navigate]);

  const handleOrderSelect = useCallback(
    async (orderSummary) => {
      setIsOrderModalLoading(true);
      clearMessages();

      try {
        const order = await getSalesOrder(orderSummary.id);
        const hydratedLines = await Promise.all(
          (order?.lines ?? []).map((line, index) =>
            hydrateOrderLine(
              {
                ...line,
                item: line.item,
                quantity: line.quantity,
              },
              index
            )
          )
        );

        setHeader({
          ...mapOrderToHeader(order),
          customer_display:
            order?.customer_name ?? orderSummary.customer_name ?? "",
        });
        setLines(hydratedLines.length ? hydratedLines : initialLines);
        setNextLineId(getNextLineId(hydratedLines));
        setActiveOrderId(order?.id ?? orderSummary.id);
        setViewState("viewExisting");
        setIsEditing(false);
        setIsOrderModalOpen(false);
        schedulePrimaryActionFocus();
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ??
            "Failed to load the selected sales order."
        );
      } finally {
        setIsOrderModalLoading(false);
      }
    },
    [clearMessages, schedulePrimaryActionFocus, setErrorMessage]
  );

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
      issue_date: getTodayDate(),
      valid_date: getValidDate(),
    });
    setLines(initialLines);
    setNextLineId(2);
    setIsEditing(false);
    setActiveOrderId(null);
    setViewState("viewBlank");

    if (orderId) {
      navigate("/sales/transactions/order", {
        replace: true,
      });
    }
  }, [clearMessages, navigate, orderId]);

  const handleSaveOrder = useCallback(async () => {
    if (saving) return;

    clearMessages();

    if (!header.customer) {
      setErrorMessage("Please select a customer before saving.");
      return;
    }

    const validLines = lines.filter((line) => line.item_id);

    if (!validLines.length) {
      setErrorMessage("Please add at least one order line before saving.");
      return;
    }

    const lineValidationMessage = validateLines(validLines);

    if (lineValidationMessage) {
      setErrorMessage(lineValidationMessage);
      return;
    }

    const payload = createOrderPayload(header, validLines);

    setSaving(true);

    try {
      const response = await createSalesOrder(payload);
      const savedOrderId = response?.id;

      if (savedOrderId) {
        navigate(`/sales/transactions/order/${savedOrderId}`, {
          replace: true,
        });
        await loadOrderById(savedOrderId);
      }

      setIsEditing(false);
      setViewState("viewBlank");
      setSuccessMessage("Sales order saved successfully.");
      return response;
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.error ??
          error?.response?.data?.message ??
          "Failed to save sales order. Please try again."
      );
      return null;
    } finally {
      setSaving(false);
    }
  }, [
    clearMessages,
    header,
    lines,
    loadOrderById,
    navigate,
    saving,
    setErrorMessage,
    setSuccessMessage,
  ]);

  const handleListOrders = openOrderModal;

  const handleHeaderEnd = useCallback(() => {
    firstTableCellRef.current?.focus?.();
  }, []);

  const handlePreview = useCallback(() => {
    if (!activeOrderId) {
      return;
    }

    setIsPreviewOpen(true);
  }, [activeOrderId]);

  const closeQuotationModal = useCallback(() => {
    setIsQuotationModalOpen(false);
  }, []);

  const closeOrderModal = useCallback(() => {
    setIsOrderModalOpen(false);
  }, []);

  const totals = useMemo(() => calculateTotals(lines), [lines]);

  const primaryActionLabel = useMemo(
    () => getPrimaryActionLabel(isEditing, viewState),
    [isEditing, viewState]
  );

  const previewDisabled = !activeOrderId;

  return {
    activeOrderId,
    closeOrderModal,
    closeQuotationModal,
    customers,
    dismissError,
    dismissSuccess,
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
    previewDisabled,
    primaryActionLabel,
    quotations,
    saving,
    setIsPreviewOpen,
    successMessage,
    tableRefs,
    totals,
    lines,
  };
}
