import { memo } from "react";
import { DollarSign, Settings } from "lucide-react";

function PriceListHeader({
  item,
  prices,
}) {
  return (
    <div className="border-b px-4 py-3">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <DollarSign
            size={18}
            className="mt-1 text-slate-700"
          />

          <div>
            <h2 className="font-semibold text-slate-800">
              Price List Management
            </h2>

            <div className="flex gap-2 mt-1">
              {item && (
                <>
                  <span className="px-2 py-0.5 text-xs rounded bg-blue-600 text-white">
                    {item.item_code}
                  </span>

                  <span className="text-sm text-slate-500">
                    {item.item_name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="border rounded px-3 py-1 text-xs flex items-center gap-1">
            <Settings size={12} />
            {prices.length} Units
          </button>

          <button className="border rounded px-3 py-1 text-xs flex items-center gap-1">
            <Settings size={12} />
            1 Price Type
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PriceListHeader);
