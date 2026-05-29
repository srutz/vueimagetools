import { createStore, useStore as useVuexStore } from "vuex";
import type { Store } from "vuex";
import type {
  RootState,
  Product,
  Order,
  OrderLine,
  OrderStatus,
  Invoice,
  InvoiceLine,
} from "./types";
import { seedProducts, seedOrders } from "./seed";

// Injection key would normally live here; for simplicity we expose a typed
// useStore() helper instead.

let orderCounter = 1003; // continues after the seeded orders
let invoiceCounter = 1;

function nextOrderId(): string {
  return `o-${orderCounter++}`;
}

function nextInvoiceId(): string {
  return `inv-${invoiceCounter++}`;
}

const store = createStore<RootState>({
  state: (): RootState => ({
    products: seedProducts,
    orders: seedOrders,
    invoices: [],
  }),

  getters: {
    productById: (state) => (id: string): Product | undefined =>
      state.products.find((p) => p.id === id),

    availableProducts: (state): Product[] =>
      state.products.filter((p) => p.available),

    productsByCategory: (state) => (category: Product["category"]): Product[] =>
      state.products.filter((p) => p.category === category),

    // Orders that are not yet served — i.e. still "in preparation".
    ordersInPreparation: (state): Order[] =>
      state.orders.filter((o) => o.status !== "served"),

    orderById: (state) => (id: string): Order | undefined =>
      state.orders.find((o) => o.id === id),

    // Computes the running total for an order from current product prices.
    orderTotal: (state, getters) => (orderId: string): number => {
      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return 0;
      return order.lines.reduce((sum, line) => {
        const product: Product | undefined = getters.productById(line.productId);
        return sum + (product ? product.price * line.quantity : 0);
      }, 0);
    },

    invoicesOfTheDay: (state): Invoice[] => {
      const today = new Date().toDateString();
      return state.invoices.filter(
        (inv) => new Date(inv.paidAt).toDateString() === today,
      );
    },

    revenueOfTheDay: (_state, getters): number =>
      (getters.invoicesOfTheDay as Invoice[]).reduce(
        (sum, inv) => sum + inv.total,
        0,
      ),
  },

  mutations: {
    addOrder(state, order: Order) {
      state.orders.push(order);
    },

    setOrderStatus(
      state,
      payload: { orderId: string; status: OrderStatus },
    ) {
      const order = state.orders.find((o) => o.id === payload.orderId);
      if (order) order.status = payload.status;
    },

    removeOrder(state, orderId: string) {
      state.orders = state.orders.filter((o) => o.id !== orderId);
    },

    addInvoice(state, invoice: Invoice) {
      state.invoices.push(invoice);
    },

    setProductAvailability(
      state,
      payload: { productId: string; available: boolean },
    ) {
      const product = state.products.find((p) => p.id === payload.productId);
      if (product) product.available = payload.available;
    },
  },

  actions: {
    // Places a new order with the given table and lines.
    placeOrder(
      { commit },
      payload: { table: string; lines: OrderLine[] },
    ): string {
      const order: Order = {
        id: nextOrderId(),
        table: payload.table,
        lines: payload.lines,
        status: "queued",
        createdAt: new Date().toISOString(),
      };
      commit("addOrder", order);
      return order.id;
    },

    advanceOrder({ commit, getters }, orderId: string) {
      const order: Order | undefined = getters.orderById(orderId);
      if (!order) return;
      const flow: OrderStatus[] = ["queued", "preparing", "ready", "served"];
      const next = flow[flow.indexOf(order.status) + 1];
      if (next) commit("setOrderStatus", { orderId, status: next });
    },

    // Closes an order: snapshots its lines into an invoice and removes the
    // order from the active list.
    checkout({ state, commit, getters }, orderId: string): Invoice | undefined {
      const order: Order | undefined = getters.orderById(orderId);
      if (!order) return undefined;

      const lines: InvoiceLine[] = order.lines.map((line) => {
        const product = state.products.find((p) => p.id === line.productId);
        return {
          productId: line.productId,
          name: product?.name ?? "Unknown",
          quantity: line.quantity,
          unitPrice: product?.price ?? 0,
        };
      });

      const total = lines.reduce(
        (sum, l) => sum + l.unitPrice * l.quantity,
        0,
      );

      const invoice: Invoice = {
        id: nextInvoiceId(),
        orderId: order.id,
        table: order.table,
        lines,
        total,
        paidAt: new Date().toISOString(),
      };

      commit("addInvoice", invoice);
      commit("removeOrder", orderId);
      return invoice;
    },
  },
});

export default store;

export function useStore(): Store<RootState> {
  return useVuexStore<RootState>();
}
