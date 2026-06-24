import ItemTabs from "./ItemTabs";
import { useParams } from "react-router-dom";

function ItemPageLayout({
  title,
  description,
  children,
}) {
  const { itemId } = useParams();
  return (
    <div className="min-h-screen bg-[#f3f4f8] p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-[0_2px_10px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <div>
              <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="text-sm text-slate-500">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div>
        <ItemTabs itemId={itemId}/>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.08)] md:p-5 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ItemPageLayout;
