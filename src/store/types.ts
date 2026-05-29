// Domain types for the pizza shop store.

export type ProductCategory = "pizza" | "salad" | "dessert" | "drink";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // in EUR
  description: string;
  available: boolean;
};

export type OrderStatus = "queued" | "preparing" | "ready" | "served";

export type OrderLine = {
  productId: string;
  quantity: number;
};

export type Order = {
  id: string;
  table: string; // table number or "takeaway"
  lines: OrderLine[];
  status: OrderStatus;
  createdAt: string; // ISO timestamp
};

export type InvoiceLine = {
  productId: string;
  name: string; // snapshot of the product name at invoicing time
  quantity: number;
  unitPrice: number; // snapshot of the price at invoicing time
};

export type Invoice = {
  id: string;
  orderId: string;
  table: string;
  lines: InvoiceLine[];
  total: number;
  paidAt: string; // ISO timestamp
};

export type RootState = {
  products: Product[];
  orders: Order[];
  invoices: Invoice[];
};
