import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingCart,
  BarChart3,
  Search,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  Building2,
  Calendar,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-80 h-screen bg-gradient-to-b from-[#020817] via-[#02144a] to-[#020817] text-white flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">
            E
          </div>

          <h1 className="text-3xl font-bold">Exalore</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search menu..."
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 py-4 pl-12 pr-4 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-4">
        {/* Dashboard */}
        <NavLink
          to="/"
          className="flex items-center gap-4 rounded-2xl bg-indigo-900/40 px-5 py-4 mb-4"
        >
          <LayoutDashboard size={22} />
          <span className="text-xl font-medium">
            Dashboard
          </span>
        </NavLink>

        {/* Inventory */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <Package size={22} />
              <span className="text-xl">
                Inventory
              </span>
            </div>

            <ChevronDown size={18} />
          </div>

          <div className="ml-6 border-l border-slate-700 pl-6">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <FileText size={18} />
                <span>Definitions</span>
              </div>

              <ChevronDown size={16} />
            </div>

            <div className="ml-6 border-l border-slate-700 pl-6 space-y-3">
              <NavLink
                to="/inventory/items/general"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 ${
                    isActive
                      ? "text-violet-400"
                      : "text-slate-300"
                  }`
                }
              >
                <div className="h-3 w-3 rounded-full bg-current" />
                Item File
              </NavLink>

              <div className="flex items-center gap-3 py-2 text-slate-300">
                <div className="h-3 w-3 rounded-full bg-slate-500" />
                Item Group
              </div>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <FileText size={18} />
                Transactions
              </div>

              <ChevronRight size={16} />
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <BarChart3 size={18} />
                Reports
              </div>

              <ChevronRight size={16} />
            </div>
          </div>
        </div>

        {/* Sales */}
        <div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <ShoppingCart size={22} />
              <span className="text-xl">
                Sales
              </span>
            </div>

            <ChevronDown size={18} />
          </div>

          <div className="ml-6 border-l border-slate-700 pl-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <FileText size={18} />
                Definitions
              </div>

              <ChevronRight size={16} />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <FileText size={18} />
                Transactions
              </div>

              <ChevronDown size={16} />
            </div>

            <div className="ml-6 border-l border-slate-700 pl-6 space-y-3">
              <NavLink
                to="/sales/quotations"
                className="flex items-center gap-3 py-2"
              >
                <div className="h-3 w-3 rounded-full bg-slate-500" />
                Sales Quotation
              </NavLink>

              <NavLink
                to="/sales/orders"
                className="flex items-center gap-3 py-2"
              >
                <div className="h-3 w-3 rounded-full bg-slate-500" />
                Sales Order
              </NavLink>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <BarChart3 size={18} />
                Reports
              </div>

              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </nav>

      {/* Footer Card */}
      {/* <div className="p-4">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-5 space-y-5">
          <div className="flex items-center gap-3">
            <User size={20} />
            <span>admin_Client1IDB</span>
          </div>

          <div className="flex items-center gap-3">
            <Building2 size={20} />
            <span>SHOWROOM (SA)</span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={20} />
            <span>01-01-2026 to 31-12-2026</span>
          </div>
        </div>

        <button className="mt-4 w-full rounded-2xl border border-red-500/40 bg-red-950/20 px-4 py-4 text-left text-red-400 flex items-center gap-3">
          <LogOut size={20} />
          Logout
        </button>
      </div> */}
    </aside>
  );
}

export default Sidebar;