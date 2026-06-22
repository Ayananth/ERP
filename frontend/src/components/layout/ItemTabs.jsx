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
    <div className="bg-white border rounded-lg p-2">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-3 rounded-lg border text-sm ${
                !itemId
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : isActive
                  ? "bg-blue-50 border-blue-300 text-blue-600"
                  : "border-transparent hover:bg-slate-50"
              }`
            }
          >
            <div className="font-medium">
              {tab.label}
            </div>

            <div className="text-xs text-slate-500">
              {tab.description}
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default ItemTabs;