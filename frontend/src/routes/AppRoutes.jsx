import { Routes, Route, Navigate } from "react-router-dom";


import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ItemGeneralPage from "../pages/Inventory/ItemGeneralPage";
import ItemUnitsPage from "../pages/Inventory/ItemUnitsPage";

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
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  );
}

export default AppRoutes;