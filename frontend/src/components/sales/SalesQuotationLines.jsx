export default function SalesQuotationLinesSection({
  lines,
}) {
  return (
    <section className="border rounded-lg mt-4">

      <div className="border-b bg-slate-50 px-4 py-3 font-medium">
        Items
      </div>

      <div className="overflow-auto h-[450px]">

        <table className="w-full text-sm">

          <thead className="sticky top-0 bg-slate-800 text-white">

            <tr>

              <th className="p-2 text-left w-12">
                #
              </th>

              <th className="p-2 text-left">
                Code
              </th>

              <th className="p-2 text-left">
                Description
              </th>

              <th className="p-2 text-left">
                Unit
              </th>

              <th className="p-2 text-right">
                Qty
              </th>

              <th className="p-2 text-right">
                Rate
              </th>

              <th className="p-2 text-right">
                Disc %
              </th>

              <th className="p-2 text-right">
                Disc Amt
              </th>

              <th className="p-2 text-right">
                Net
              </th>

              <th className="p-2 text-right">
                VAT
              </th>

              <th className="p-2 text-right">
                Net After VAT
              </th>

            </tr>

          </thead>

          <tbody>

            {lines.map((line, index) => (
              <tr
                key={line.id}
                className="border-b"
              >
                <td className="p-2">
                  {index + 1}
                </td>

                <td className="p-1">
                  <input className="w-full border rounded px-2 py-1" />
                </td>

                <td className="p-1">
                  <input className="w-full border rounded px-2 py-1" />
                </td>

                <td className="p-1">
                  <select className="w-full border rounded px-2 py-1" />
                </td>

                <td className="p-1">
                  <input className="w-full border rounded px-2 py-1 text-right" />
                </td>

                <td className="p-1">
                  <input className="w-full border rounded px-2 py-1 text-right" />
                </td>

                <td className="p-1">
                  <input className="w-full border rounded px-2 py-1 text-right" />
                </td>

                <td className="p-2 text-right">0.00</td>
                <td className="p-2 text-right">0.00</td>
                <td className="p-2 text-right">0.00</td>
                <td className="p-2 text-right">0.00</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}