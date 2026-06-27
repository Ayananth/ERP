import { useEffect, useRef, useState } from "react";
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

  const loadOrderById = async (id) => {
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
  };

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
  }, [orderId, setErrorMessage]);

  const openQuotationModal = async () => {
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
  };

  const handleQuotationSelect = async (quotationSummary) => {
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
  };

  const openOrderModal = async () => {
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
  };

  const resetToBlankTransaction = () => {
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
  };

  const handleOrderSelect = async (orderSummary) => {
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
  };

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
  };

  const handleSaveOrder = async () => {
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
    }
  };

  const handleListOrders = async () => {
    await openOrderModal();
  };

  const handleHeaderEnd = () => {
    firstTableCellRef.current?.focus?.();
  };

  const handlePreview = () => {
    if (!activeOrderId) {
      return;
    }

    setIsPreviewOpen(true);
  };

  const totals = calculateTotals(lines);

  const primaryActionLabel = isEditing
    ? viewState === "viewExisting"
      ? "Update"
      : "Save"
    : viewState === "viewExisting"
      ? "Edit"
      : "New";

  return {
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
    setErrorMessage,
    setIsOrderModalOpen,
    setIsPreviewOpen,
    setIsQuotationModalOpen,
    setSuccessMessage,
    successMessage,
    tableRefs,
    totals,
    lines,
  };
}
