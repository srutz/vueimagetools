import type { Product, Order } from "./types";

// 15 products across the menu categories.
export const seedProducts: Product[] = [
  // Pizzas
  {
    id: "p-margherita",
    name: "Margherita",
    category: "pizza",
    price: 8.5,
    description: "Tomato, mozzarella, fresh basil",
    available: true,
  },
  {
    id: "p-marinara",
    name: "Marinara",
    category: "pizza",
    price: 7.5,
    description: "Tomato, garlic, oregano, olive oil",
    available: true,
  },
  {
    id: "p-prosciutto",
    name: "Prosciutto e Funghi",
    category: "pizza",
    price: 11.0,
    description: "Ham, mushrooms, mozzarella",
    available: true,
  },
  {
    id: "p-diavola",
    name: "Diavola",
    category: "pizza",
    price: 10.5,
    description: "Spicy salami, chili, mozzarella",
    available: true,
  },
  {
    id: "p-quattro-formaggi",
    name: "Quattro Formaggi",
    category: "pizza",
    price: 11.5,
    description: "Mozzarella, gorgonzola, parmesan, fontina",
    available: true,
  },
  {
    id: "p-vegetariana",
    name: "Vegetariana",
    category: "pizza",
    price: 10.0,
    description: "Grilled vegetables, mozzarella, tomato",
    available: false,
  },

  // Salads
  {
    id: "s-caprese",
    name: "Insalata Caprese",
    category: "salad",
    price: 7.0,
    description: "Tomato, mozzarella, basil, olive oil",
    available: true,
  },
  {
    id: "s-cesare",
    name: "Caesar Salad",
    category: "salad",
    price: 8.0,
    description: "Romaine, croutons, parmesan, caesar dressing",
    available: true,
  },
  {
    id: "s-rucola",
    name: "Rucola e Parmigiano",
    category: "salad",
    price: 7.5,
    description: "Arugula, parmesan shavings, balsamic",
    available: true,
  },

  // Desserts
  {
    id: "d-tiramisu",
    name: "Tiramisù",
    category: "dessert",
    price: 5.5,
    description: "Mascarpone, coffee, cocoa",
    available: true,
  },
  {
    id: "d-pannacotta",
    name: "Panna Cotta",
    category: "dessert",
    price: 5.0,
    description: "Vanilla cream with berry coulis",
    available: true,
  },
  {
    id: "d-gelato",
    name: "Gelato Misto",
    category: "dessert",
    price: 4.5,
    description: "Three scoops of assorted gelato",
    available: true,
  },

  // Drinks
  {
    id: "b-acqua",
    name: "Acqua Minerale",
    category: "drink",
    price: 2.5,
    description: "Still or sparkling water, 0.5L",
    available: true,
  },
  {
    id: "b-cola",
    name: "Cola",
    category: "drink",
    price: 3.0,
    description: "Chilled cola, 0.33L",
    available: true,
  },
  {
    id: "b-vino-rosso",
    name: "Vino Rosso della Casa",
    category: "drink",
    price: 4.5,
    description: "House red wine, 0.2L glass",
    available: true,
  },
];

// A couple of orders already in preparation.
export const seedOrders: Order[] = [
  {
    id: "o-1001",
    table: "5",
    status: "preparing",
    createdAt: new Date().toISOString(),
    lines: [
      { productId: "p-margherita", quantity: 2 },
      { productId: "s-caprese", quantity: 1 },
      { productId: "b-cola", quantity: 2 },
    ],
  },
  {
    id: "o-1002",
    table: "takeaway",
    status: "queued",
    createdAt: new Date().toISOString(),
    lines: [
      { productId: "p-diavola", quantity: 1 },
      { productId: "d-tiramisu", quantity: 1 },
    ],
  },
];
