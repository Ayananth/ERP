import { NavLink } from "react-router-dom";

function ItemTabs({ itemId }) {
  const tabs = [
    {
      label: "General",
      path: itemId
        ? `/inventory/items/${itemId}/general`
        : "#",
      description: "Basic item information",
    },
    {
      label: "Unit & Barcode",
      path: itemId
        ? `/inventory/items/${itemId}/units`
        : "#",
      description: "Units and barcode management",
    },
    {
      label: "Price List",
      path: itemId
        ? `/inventory/items/${itemId}/prices`
        : "#",
      description: "Pricing information",
    },
    {
      label: "Photo",
      path: itemId
        ? `/inventory/items/${itemId}/photo`
        : "#",
      description: "Item image",
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-[0_1px_8px_rgba(15,23,42,0.06)]">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.path}
            className={({ isActive }) =>
              `min-w-[170px] rounded-lg border px-4 py-3 text-sm transition ${
                !itemId
                  ? "pointer-events-none cursor-not-allowed opacity-40"
                  : isActive
                  ? "border-blue-200 bg-blue-50 text-blue-600 shadow-sm"
                  : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700"
              }`
            }
          >
            <div className="font-medium leading-none">
              {tab.label}
            </div>

            <div className="mt-1 text-[11px] text-slate-400">
              {tab.description}
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default ItemTabs;
