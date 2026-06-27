import { lazy } from "react";

export const LazySalesQuotationSelectModal = lazy(
  () => import("./SalesQuotationSelectModal")
);

export const LazySalesOrderPreviewModal = lazy(
  () => import("./SalesOrderPreviewModal")
);
