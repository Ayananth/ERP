import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold">
          Exalore ERP
        </h2>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="block p-2 rounded hover:bg-slate-800"
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/inventory/items"
              className="block p-2 rounded hover:bg-slate-800"
            >
              Items
            </Link>
          </li>

          <li>
            <Link
              to="/sales/quotations"
              className="block p-2 rounded hover:bg-slate-800"
            >
              Sales Quotations
            </Link>
          </li>

          <li>
            <Link
              to="/sales/orders"
              className="block p-2 rounded hover:bg-slate-800"
            >
              Sales Orders
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;