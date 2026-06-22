import ItemTabs from "./ItemTabs";

function ItemPageLayout({
  title,
  description,
  children,
}) {
  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h1 className="text-xl font-semibold">
          {title}
        </h1>

        <p className="text-sm text-slate-500">
          {description}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <ItemTabs />
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}

export default ItemPageLayout;