const STORAGE_KEY = "erp_mock_sales_orders";
const NEXT_ID_KEY = "erp_mock_sales_orders_next_id";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const readStore = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeStore = (orders) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

const getNextId = () => {
  const current = Number(sessionStorage.getItem(NEXT_ID_KEY) || "1");
  sessionStorage.setItem(NEXT_ID_KEY, String(current + 1));
  return current;
};

const normalizeOrder = (order, id) => ({
  id,
  order_no: `SO-${String(id).padStart(5, "0")}`,
  quotation: order.quotation ?? null,
  quotation_no: order.quotation_no ?? "",
  customer: order.customer,
  customer_name: order.customer_name ?? "",
  order_date: order.order_date,
  valid_date: order.valid_date ?? order.order_date,
  order_type: order.order_type ?? "",
  customer_po: order.customer_po ?? "",
  sales_executive: order.sales_executive ?? "",
  currency: order.currency ?? "1 - SAUDI RIYAL",
  exchange_rate: order.exchange_rate ?? "1.00",
  delivery_place: order.delivery_place ?? "",
  notes: order.notes ?? "",
  status: order.status ?? "draft",
  lines: (order.lines ?? []).map((line, index) => ({
    id: line.id ?? index + 1,
    item: line.item,
    item_name: line.item_name ?? "",
    unit: line.unit,
    unit_name: line.unit_name ?? "",
    quantity: line.quantity,
    rate: line.rate,
    discount_percent: line.discount_percent ?? 0,
    vat_percent: line.vat_percent ?? 0,
  })),
});

export const createSalesOrder = async (body) => {
  await delay();

  const orders = readStore();
  const id = getNextId();
  const order = normalizeOrder(
    {
      ...body,
      status: "draft",
    },
    id
  );

  orders.push(order);
  writeStore(orders);

  return {
    id: order.id,
    order_no: order.order_no,
  };
};

export const getSalesOrder = async (id) => {
  await delay();

  const order = readStore().find((entry) => String(entry.id) === String(id));

  if (!order) {
    const error = new Error("Sales order not found.");
    error.response = { data: { message: "Sales order not found." } };
    throw error;
  }

  return order;
};

export const getSalesOrderList = async () => {
  await delay();
  return readStore();
};

export const updateSalesOrder = async (id, body) => {
  await delay();

  const orders = readStore();
  const index = orders.findIndex((entry) => String(entry.id) === String(id));

  if (index === -1) {
    const error = new Error("Sales order not found.");
    error.response = { data: { message: "Sales order not found." } };
    throw error;
  }

  const existing = orders[index];
  const updated = normalizeOrder(
    {
      ...existing,
      ...body,
      status: existing.status,
    },
    existing.id
  );

  orders[index] = updated;
  writeStore(orders);

  return {
    id: updated.id,
    order_no: updated.order_no,
  };
};
