import { SALES_FOCUS_FIELD } from "../sales/salesFocusStyles";

const selectClassName = `h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:bg-white ${SALES_FOCUS_FIELD}`;

export default function ItemGeneralConfigurationSection({
  dropdowns,
  errors,
  formData,
  handleSelectKeyDown,
  onChange,
  registerField,
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
        Configuration
      </div>

      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Behaviour *
          </label>

          <select
            ref={registerField(5)}
            name="behaviour"
            value={formData.behaviour}
            onChange={onChange}
            onKeyDown={(event) => handleSelectKeyDown(event, 5)}
            className={selectClassName}
          >
            <option value="">
              Select behaviour
            </option>
            {dropdowns.behaviours.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
          {errors.behaviour && (
            <p className="mt-1 text-xs text-red-600">
              {errors.behaviour}
            </p>
          )}
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Group Code *
          </label>

          <select
            ref={registerField(6)}
            name="group"
            value={formData.group}
            onChange={onChange}
            onKeyDown={(event) => handleSelectKeyDown(event, 6)}
            className={selectClassName}
          >
            <option value="">
              Select Group
            </option>
            {dropdowns.groups.map((group) => (
              <option
                key={group.id}
                value={group.id}
              >
                {group.name}
              </option>
            ))}
          </select>
          {errors.group && (
            <p className="mt-1 text-xs text-red-600">
              {errors.group}
            </p>
          )}
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status *
          </label>

          <select
            ref={registerField(7)}
            name="status"
            value={formData.status}
            onChange={onChange}
            onKeyDown={(event) => handleSelectKeyDown(event, 7)}
            className={selectClassName}
          >
            {dropdowns.statuses.map((status) => (
              <option
                key={status.value}
                value={status.value}
              >
                {status.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-xs text-red-600">
              {errors.status}
            </p>
          )}
        </div>

        <div className="col-span-12 md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Taxable Status *
          </label>

          <select
            ref={registerField(8)}
            name="taxable_status"
            value={formData.taxable_status}
            onChange={onChange}
            onKeyDown={(event) => handleSelectKeyDown(event, 8)}
            className={selectClassName}
          >
            <option value="">
              Select Taxable Status
            </option>
            {dropdowns.taxable_statuses.map((status) => (
              <option
                key={status.value}
                value={status.value}
              >
                {status.label}
              </option>
            ))}
          </select>
          {errors.taxable_status && (
            <p className="mt-1 text-xs text-red-600">
              {errors.taxable_status}
            </p>
          )}
        </div>

        <div className="col-span-12 md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Shelf Code
          </label>

          <select
            ref={registerField(9)}
            name="shelf"
            value={formData.shelf}
            onChange={onChange}
            onKeyDown={(event) => handleSelectKeyDown(event, 9)}
            className={selectClassName}
          >
            <option value="">
              Select Shelf
            </option>
            {dropdowns.shelves.map((shelf) => (
              <option
                key={shelf.id}
                value={shelf.id}
              >
                {shelf.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Manufacturer
          </label>

          <select
            ref={registerField(10)}
            name="manufacturer"
            value={formData.manufacturer}
            onChange={onChange}
            onKeyDown={(event) => handleSelectKeyDown(event, 10)}
            className={selectClassName}
          >
            <option value="">
              Select Manufacturer
            </option>
            {dropdowns.manufacturers.map((manufacturer) => (
              <option
                key={manufacturer.id}
                value={manufacturer.id}
              >
                {manufacturer.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
