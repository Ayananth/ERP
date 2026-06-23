const mockCustomers = [
  { id: 1, name: "ABC Traders" },
  { id: 2, name: "XYZ Stores" },
];

const mockItems = [
  {
    id: 1,
    item_code: "ITM-00001",
    name: "Laptop",
    units: [
      { unit_id: 1, unit_name: "PCS" },
      { unit_id: 2, unit_name: "BOX" },
    ],
    prices: [
      { unit_id: 1, sale_price: 50000 },
      { unit_id: 2, sale_price: 450000 },
    ],
  },
];

let quotationSequence = 15;
let mockQuotations = [
  {
    id: 15,
    quotation_no: "SQ-00015",
    customer: "ABC Traders",
    quotation_date: "2026-06-23",
    status: "draft",
    customer_id: 1,
    notes: "",
    lines: [
      {
        id: 1,
        item: 1,
        item_name: "Laptop",
        unit: 1,
        unit_name: "PCS",
        quantity: 2,
        rate: 50000,
        discount_percent: 5,
        vat_percent: 18,
      },
    ],
  },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

const mockResponse = (data) => Promise.resolve({ data: clone(data) });

export const getCustomerDropdown = async () => mockResponse(mockCustomers);

export const getItemSearch = async (search = "") => {
  const query = search.trim().toLowerCase();
  const filtered = query
    ? mockItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.item_code.toLowerCase().includes(query)
      )
    : mockItems;

  return mockResponse(
    filtered.map(({ id, item_code, name }) => ({ id, item_code, name }))
  );
};

export const getItemDetails = async (id) => {
  const item = mockItems.find((entry) => entry.id === Number(id));
  return mockResponse(item ?? null);
};

export const createQuotation = async (body) => {
  const customer = mockCustomers.find(
    (entry) => entry.id === Number(body.customer)
  );

  const newId = ++quotationSequence;
  const quotation = {
    id: newId,
    quotation_no: `SQ-${String(newId).padStart(5, "0")}`,
    customer: customer?.name ?? "",
    customer_id: Number(body.customer),
    quotation_date: body.quotation_date,
    notes: body.notes ?? "",
    status: "draft",
    lines: (body.lines ?? []).map((line, index) => {
      const item = mockItems.find((entry) => entry.id === Number(line.item));
      const unit = item?.units.find(
        (entry) => entry.unit_id === Number(line.unit)
      );

      return {
        id: index + 1,
        item: Number(line.item),
        item_name: item?.name ?? "",
        unit: Number(line.unit),
        unit_name: unit?.unit_name ?? "",
        quantity: Number(line.quantity ?? 0),
        rate: Number(line.rate ?? 0),
        discount_percent: Number(line.discount_percent ?? 0),
        vat_percent: Number(line.vat_percent ?? 0),
      };
    }),
  };

  mockQuotations = [quotation, ...mockQuotations];
  return mockResponse({ id: newId });
};

export const getQuotationList = async () =>
  mockResponse(
    mockQuotations.map(({ id, quotation_no, customer, quotation_date, status }) => ({
      id,
      quotation_no,
      customer,
      quotation_date,
      status,
    }))
  );

export const getQuotation = async (id) => {
  const quotation = mockQuotations.find(
    (entry) => entry.id === Number(id)
  );

  return mockResponse(quotation ?? null);
};

export const updateQuotation = async (id, body) => {
  const quotationId = Number(id);
  const customer = mockCustomers.find(
    (entry) => entry.id === Number(body.customer)
  );

  const updatedQuotation = {
    id: quotationId,
    quotation_no: `SQ-${String(quotationId).padStart(5, "0")}`,
    customer: customer?.name ?? "",
    customer_id: Number(body.customer),
    quotation_date: body.quotation_date,
    notes: body.notes ?? "",
    status: "draft",
    lines: (body.lines ?? []).map((line, index) => {
      const item = mockItems.find((entry) => entry.id === Number(line.item));
      const unit = item?.units.find(
        (entry) => entry.unit_id === Number(line.unit)
      );

      return {
        id: index + 1,
        item: Number(line.item),
        item_name: item?.name ?? "",
        unit: Number(line.unit),
        unit_name: unit?.unit_name ?? "",
        quantity: Number(line.quantity ?? 0),
        rate: Number(line.rate ?? 0),
        discount_percent: Number(line.discount_percent ?? 0),
        vat_percent: Number(line.vat_percent ?? 0),
      };
    }),
  };

  mockQuotations = mockQuotations.map((quotation) =>
    quotation.id === quotationId ? updatedQuotation : quotation
  );

  return mockResponse({ id: quotationId });
};

export const deleteQuotation = async (id) => {
  const quotationId = Number(id);
  mockQuotations = mockQuotations.filter(
    (quotation) => quotation.id !== quotationId
  );

  return mockResponse({ message: "Quotation deleted" });
};
