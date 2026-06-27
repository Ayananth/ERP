import { memo } from "react";
import { SALES_FOCUS_FIELD } from "../sales/salesFocusStyles";

const inputClassName = `h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:bg-white ${SALES_FOCUS_FIELD}`;

function ItemGeneralAdditionalSection({
  formData,
  handleFieldEnter,
  onChange,
  registerField,
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
        Additional Information
      </div>

      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 md:col-span-3">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Generic Name
          </label>

          <input
            ref={registerField(3)}
            type="text"
            name="generic_name"
            value={formData.generic_name}
            onChange={onChange}
            onKeyDown={(event) => handleFieldEnter(event, 3)}
            placeholder="Enter generic name"
            className={inputClassName}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>

          <input
            ref={registerField(4)}
            type="text"
            name="description"
            value={formData.description}
            onChange={onChange}
            onKeyDown={(event) => handleFieldEnter(event, 4)}
            placeholder="Enter description"
            className={inputClassName}
          />
        </div>
      </div>
    </section>
  );
}

export default memo(ItemGeneralAdditionalSection);
