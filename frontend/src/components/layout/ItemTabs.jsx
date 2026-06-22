import { NavLink } from "react-router-dom";

const tabs = [
  {
    label: "General",
    path: "/inventory/items/general",
    description: "Basic item information",
  },
  {
    label: "Unit & Barcode",
    path: "/inventory/items/units",
    description: "Units and barcode management",
  },
  {
    label: "Price List",
    path: "/inventory/items/prices",
    description: "Pricing information",
  },
  {
    label: "Photo",
    path: "/inventory/items/photo",
    description: "Item image",
  },
];

function ItemTabs() {
  return (
    <div className="bg-white border rounded-lg p-2">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-3 rounded-lg border text-sm ${
                isActive
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