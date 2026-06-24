import { X } from "lucide-react";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-950/60"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className = "", children, onClose }) {
  return (
    <div
      className={`relative flex h-[90vh] w-[90vw] flex-col overflow-hidden rounded-lg bg-white shadow-2xl ${className}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Close dialog"
      >
        <X size={18} />
      </button>
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="border-b border-slate-200 px-5 py-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold text-slate-800">{children}</h2>;
}

export function DialogBody({ children }) {
  return <div className="flex-1 overflow-hidden">{children}</div>;
}
