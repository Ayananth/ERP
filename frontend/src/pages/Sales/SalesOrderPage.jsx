import { useState } from "react";

import {
  getItemDetails,
  getQuotation,
  getQuotationList,
} from "../../api/salesApi";
import SalesQuotationLayout from "../../components/sales/SalesQuotationLayout";
import SalesQuotationFooter from "../../components/sales/SalesQuotationFooter";
import SalesQuotationSelectModal from "../../components/sales/SalesQuotationSelectModal";
import SalesOrderHeader from "../../components/sales/SalesOrderHeader";
import SalesOrderLines from "../../components/sales/SalesOrderLines";

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const getValidDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
};

const initialHeader = {
  order_no: "",
  order_type: "",
  issue_date: getTodayDate(),
  valid_date: getValidDate(),
  linked_quotation: "No quotation linked",
  quotation_id: "",
  customer_po: "",
  customer: "",
  sales_executive: "",
  currency: "1 - SAUDI RIYAL",
  exchange_rate: "1.00",
  delivery_place: "",
  notes: "",
};

const initialLines = [
  {
    id: 1,
    item_code: "",
    description: "",
    unit: "",
    qty: "",
    rate: "",
    discount_percent: "",
    discount_amount: "",
    net: "",
    vat: "",
    net_after_vat: "",
  },
];

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const calculateLine = (line) => {
  const qty = toNumber(line.qty);
  const rate = toNumber(line.rate);
  const discountPercent = toNumber(line.discount_percent);
  const vatPercent = toNumber(line.vat_percent ?? line.vat);

  const gross = qty * rate;
  const discountAmount = gross * (discountPercent / 100);
  const net = gross - discountAmount;
  const vatAmount = net * (vatPercent / 100);

  return {
    ...line,
    discount_amount: discountAmount.toFixed(2),
    net: net.toFixed(2),
    vat: vatAmount.toFixed(2),
    net_after_vat: (net + vatAmount).toFixed(2),
  };
};

const calculateTotals = (lines) => {
  const totals = lines.reduce(
    (acc, line) => {
      const qty = toNumber(line.qty);
      const rate = toNumber(line.rate);

      acc.gross += qty * rate;
      acc.discount += toNumber(line.discount_amount);
      acc.net += toNumber(line.net);
      acc.vat += toNumber(line.vat);
      acc.netAfterVat += toNumber(line.net_after_vat);

      return acc;
    },
    {
      gross: 0,
      discount: 0,
      net: 0,
      vat: 0,
      netAfterVat: 0,
    }
  );

  return {
    gross: totals.gross.toFixed(2),
    discount: totals.discount.toFixed(2),
    net: totals.net.toFixed(2),
    vat: totals.vat.toFixed(2),
    netAfterVat: totals.netAfterVat.toFixed(2),
  };
};

function SalesOrderPage() {
  const [header, setHeader] = useState(initialHeader);
  const [lines, setLines] = useState(initialLines);
  const [quotations, setQuotations] = useState([]);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isQuotationModalLoading, setIsQuotationModalLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openQuotationModal = async () => {
    setIsQuotationModalOpen(true);
    setIsQuotationModalLoading(true);
    setErrorMessage("");

    try {
      const quotationList = await getQuotationList();

      setQuotations(
        (quotationList ?? []).map((quotation) => ({
          id: quotation.id,
          quotation_no: quotation.quotation_no ?? "",
          delivery_place: quotation.delivery_place ?? "",
          quotation_date: quotation.quotation_date ?? "",
          customer_ref_no: quotation.customer_ref_no ?? "",
          customer_code: quotation.customer_code ?? "",
          customer_name: quotation.customer_name ?? quotation.customer ?? "",
          salesman_code: quotation.salesman_code ?? "",
          net: quotation.net ?? "",
        }))
      );
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ?? "Failed to load sales quotations."
      );
    } finally {
      setIsQuotationModalLoading(false);
    }
  };

  const handleQuotationSelect = async (quotationSummary) => {
    setIsQuotationModalLoading(true);
    setErrorMessage("");

    try {
      const quotation = await getQuotation(quotationSummary.id);
      const hydratedLines = await Promise.all(
        (quotation?.lines ?? []).map(async (line, index) => {
          const itemDetails = line.item ? await getItemDetails(line.item) : null;
          const selectedUnit =
            itemDetails?.units?.find(
              (unit) => String(unit.unit_id) === String(line.unit)
            ) ?? null;

          return calculateLine({
            id: line.id ?? index + 1,
            item_code: itemDetails?.item_code ?? "",
            description: line.item_name ?? itemDetails?.name ?? "",
            unit: selectedUnit?.unit_name ?? line.unit_name ?? line.unit ?? "",
            qty: String(line.quantity ?? ""),
            rate: String(line.rate ?? ""),
            discount_percent: String(line.discount_percent ?? ""),
            vat_percent: String(line.vat_percent ?? ""),
          });
        })
      );

      setHeader((prev) => ({
        ...prev,
        linked_quotation: quotation?.quotation_no ?? quotationSummary.quotation_no,
        quotation_id: quotation?.id ?? quotationSummary.id,
        customer: quotationSummary.customer_name,
        delivery_place: quotationSummary.delivery_place,
        notes: quotation?.notes ?? "",
      }));
      setLines(hydratedLines.length ? hydratedLines : initialLines);
      setIsQuotationModalOpen(false);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ?? "Failed to load the selected quotation."
      );
    } finally {
      setIsQuotationModalLoading(false);
    }
  };

  const handleCancel = () => {
    setHeader(initialHeader);
    setLines(initialLines);
    setErrorMessage("");
  };

  const totals = calculateTotals(lines);

  return (
    <SalesQuotationLayout title="Sales Order">
      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <SalesOrderHeader
        data={header}
        onQuotationClick={openQuotationModal}
      />

      <SalesOrderLines lines={lines} />

      <SalesQuotationFooter
        onList={openQuotationModal}
        onCancel={handleCancel}
        totals={totals}
      />

      <SalesQuotationSelectModal
        isOpen={isQuotationModalOpen}
        loading={isQuotationModalLoading}
        quotations={quotations}
        onClose={() => setIsQuotationModalOpen(false)}
        onSelect={handleQuotationSelect}
      />
    </SalesQuotationLayout>
  );
}

export default SalesOrderPage;
