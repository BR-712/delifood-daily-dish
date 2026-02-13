// Shared types and mock data for the Dalifood app

export interface Product {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

export const PRODUCTS: Product[] = [
  { id: "hayaca", name: "Hayaca", price: 15000, active: true },
  { id: "pastel_pollo", name: "Pastel de Pollo", price: 12000, active: true },
  { id: "pastel_cerdo", name: "Pastel de Cerdo", price: 12000, active: true },
];

export type PaymentMethod = "Nequi" | "Daviplata" | "Bancolombia" | "Efectivo";
export type PaymentStatus = "Pagado" | "Parcial" | "Pendiente";
export type OrderStatus = "Pendiente" | "Confirmado" | "Entregado";

export interface PaymentLine {
  method: PaymentMethod;
  amount: number;
  proofUrl?: string;
}

export interface Transaction {
  id: number;
  orderId?: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  method: PaymentMethod;
  date: string;
  proofUrl?: string;
  reconciled: boolean;
}

export interface Order {
  id: string;
  client: string;
  deliveryDate: string;
  items: string;
  status: OrderStatus;
  totalPrice: number;
  snapshotPrices: Record<string, number>; // price at time of creation
  payments: PaymentLine[];
  paymentStatus: PaymentStatus;
}

// Initial mock orders with split payment support
export const initialOrders: Order[] = [
  {
    id: "ORD-001", client: "María López", deliveryDate: "2026-02-12",
    items: "6 Hayacas", status: "Pendiente", totalPrice: 90000,
    snapshotPrices: { hayaca: 15000 }, payments: [], paymentStatus: "Pendiente",
  },
  {
    id: "ORD-002", client: "Carlos Ruiz", deliveryDate: "2026-02-13",
    items: "12 Hayacas, 4 Pasteles", status: "Confirmado", totalPrice: 228000,
    snapshotPrices: { hayaca: 15000, pastel_pollo: 12000 },
    payments: [
      { method: "Nequi", amount: 128000 },
      { method: "Efectivo", amount: 100000 },
    ],
    paymentStatus: "Pagado",
  },
  {
    id: "ORD-003", client: "Ana Torres", deliveryDate: "2026-02-14",
    items: "3 Pasteles Pollo", status: "Pendiente", totalPrice: 36000,
    snapshotPrices: { pastel_pollo: 12000 },
    payments: [{ method: "Daviplata", amount: 20000 }],
    paymentStatus: "Parcial",
  },
  {
    id: "ORD-004", client: "Luis Méndez", deliveryDate: "2026-02-11",
    items: "10 Hayacas", status: "Entregado", totalPrice: 150000,
    snapshotPrices: { hayaca: 15000 },
    payments: [{ method: "Bancolombia", amount: 150000 }],
    paymentStatus: "Pagado",
  },
  {
    id: "ORD-005", client: "Sandra Vega", deliveryDate: "2026-02-15",
    items: "2 Hayacas, 2 Pasteles", status: "Pendiente", totalPrice: 54000,
    snapshotPrices: { hayaca: 15000, pastel_cerdo: 12000 },
    payments: [], paymentStatus: "Pendiente",
  },
  {
    id: "ORD-006", client: "Jorge Díaz", deliveryDate: "2026-02-12",
    items: "8 Hayacas", status: "Confirmado", totalPrice: 120000,
    snapshotPrices: { hayaca: 15000 },
    payments: [{ method: "Nequi", amount: 120000 }],
    paymentStatus: "Pagado",
  },
];

// Generate transactions from order payments
export function generateTransactionsFromOrders(orders: Order[]): Transaction[] {
  const txns: Transaction[] = [];
  let id = 1;
  orders.forEach(order => {
    order.payments.forEach(p => {
      txns.push({
        id: id++,
        orderId: order.id,
        description: `Pedido ${order.id} - ${order.client}`,
        amount: p.amount,
        type: "income",
        method: p.method,
        date: order.deliveryDate,
        proofUrl: p.proofUrl,
        reconciled: false,
      });
    });
  });
  return txns;
}

export const initialExpenses: Transaction[] = [
  { id: 100, description: "Gas para cocina", amount: 35000, type: "expense", method: "Efectivo", date: "2026-02-10", reconciled: true },
  { id: 101, description: "Hojas de plátano", amount: 20000, type: "expense", method: "Efectivo", date: "2026-02-09", reconciled: true },
  { id: 102, description: "Ingredientes varios", amount: 50000, type: "expense", method: "Efectivo", date: "2026-02-08", reconciled: true },
];

export const PAYMENT_METHODS: PaymentMethod[] = ["Nequi", "Daviplata", "Bancolombia", "Efectivo"];

export const isDigitalMethod = (m: PaymentMethod) => m !== "Efectivo";

export interface DailyGoal {
  product: string;
  productId: string;
  goal: number;
  done: number;
}

export const initialDailyGoals: DailyGoal[] = [
  { product: "Hayacas", productId: "hayaca", goal: 64, done: 20 },
  { product: "Pastel de Pollo", productId: "pastel_pollo", goal: 30, done: 12 },
  { product: "Pastel de Cerdo", productId: "pastel_cerdo", goal: 20, done: 8 },
];
