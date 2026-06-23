import { Routes, Route, Navigate } from "react-router-dom";


import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ItemGeneralPage from "../pages/Inventory/ItemGeneralPage";
import ItemUnitsPage from "../pages/Inventory/ItemUnitsPage";
import PriceListPage from "../pages/Inventory/PriceListPage";
import ItemPhotoPage from "../pages/Inventory/ItemPhotoPage";

import SalesQuotationPage from "../pages/Sales/SalesQuotationPage";
import SalesOrderPage from "../pages/Sales/SalesOrderPage";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<DashboardPage />}
        />

        <Route
          path="inventory/items/general"
          element={<ItemGeneralPage />}
        />
        <Route
          path="inventory/items/:itemId/general"
          element={<ItemGeneralPage />}
        />

        <Route
          path="inventory/items/:itemId/units"
          element={<ItemUnitsPage />}
        />

        <Route
          path="inventory/items/:itemId/prices"
          element={<PriceListPage />}
        />

        <Route
          path="inventory/items/:itemId/photo"
          element={<ItemPhotoPage />}
        />



        <Route
          path="sales/transactions/quotation"
          element={<SalesQuotationPage />}
        />
        <Route
          path="sales/transactions/quotation/:quotationId"
          element={<SalesQuotationPage />}
        />

        <Route
          path="sales/transactions/order"
          element={<SalesOrderPage />}
        />
        <Route
          path="sales/transactions/order/:orderId"
          element={<SalesOrderPage />}
        />

        <Route
          path="sales/orders"
          element={<SalesOrderPage />}
        />
        <Route
          path="sales/orders/:orderId"
          element={<SalesOrderPage />}
        />

      </Route>





      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  );
}

export default AppRoutes;
