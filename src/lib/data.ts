// Shared types and mock data for the Dalifood app

export type RiceBase = "chicken" | "pork" | "none";

export interface MeatComposition {
  chicken: number;
  pork: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  active: boolean;
  riceBase: RiceBase;
  meatComposition: MeatComposition;
  isHayaca?: boolean;
}

export const PRODUCTS: Product[] = [
  { id: "hayaca", name: "Hayaca", price: 15000, active: true, riceBase: "none", meatComposition: { chicken: 0, pork: 0 }, isHayaca: true },
  { id: "pastel_pollo", name: "Pastel de Pollo", price: 12000, active: true, riceBase: "chicken", meatComposition: { chicken: 1, pork: 0 } },
  { id: "pastel_cerdo", name: "Pastel de Cerdo", price: 12000, active: true, riceBase: "pork", meatComposition: { chicken: 0, pork: 1 } },
  { id: "pastel_combinado", name: "Pastel Combinado", price: 13000, active: true, riceBase: "pork", meatComposition: { chicken: 1, pork: 1 } },
  { id: "pastel_doble", name: "Pastel Doble Presa", price: 16000, active: true, riceBase: "chicken", meatComposition: { chicken: 2, pork: 0 } },
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

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  client: string;
  deliveryDate: string;
  items: string;
  orderItems?: OrderItem[];
  status: OrderStatus;
  totalPrice: number;
  snapshotPrices: Record<string, number>;
  payments: PaymentLine[];
  paymentStatus: PaymentStatus;
}

// Initial mock orders with structured orderItems for calculator
export const initialOrders: Order[] = [
  {
    id: "ORD-001", client: "María López", deliveryDate: "2026-02-14",
    items: "6 Hayacas", status: "Pendiente", totalPrice: 90000,
    snapshotPrices: { hayaca: 15000 }, payments: [], paymentStatus: "Pendiente",
    orderItems: [{ productId: "hayaca", productName: "Hayaca", quantity: 6, unitPrice: 15000 }],
  },
  {
    id: "ORD-002", client: "Carlos Ruiz", deliveryDate: "2026-02-14",
    items: "12 Hayacas, 4 Pasteles Pollo", status: "Confirmado", totalPrice: 228000,
    snapshotPrices: { hayaca: 15000, pastel_pollo: 12000 },
    payments: [
      { method: "Nequi", amount: 128000 },
      { method: "Efectivo", amount: 100000 },
    ],
    paymentStatus: "Pagado",
    orderItems: [
      { productId: "hayaca", productName: "Hayaca", quantity: 12, unitPrice: 15000 },
      { productId: "pastel_pollo", productName: "Pastel de Pollo", quantity: 4, unitPrice: 12000 },
    ],
  },
  {
    id: "ORD-003", client: "Ana Torres", deliveryDate: "2026-02-14",
    items: "3 Pasteles Pollo, 2 Pasteles Cerdo", status: "Pendiente", totalPrice: 60000,
    snapshotPrices: { pastel_pollo: 12000, pastel_cerdo: 12000 },
    payments: [{ method: "Daviplata", amount: 20000 }],
    paymentStatus: "Parcial",
    orderItems: [
      { productId: "pastel_pollo", productName: "Pastel de Pollo", quantity: 3, unitPrice: 12000 },
      { productId: "pastel_cerdo", productName: "Pastel de Cerdo", quantity: 2, unitPrice: 12000 },
    ],
  },
  {
    id: "ORD-004", client: "Luis Méndez", deliveryDate: "2026-02-11",
    items: "10 Hayacas", status: "Entregado", totalPrice: 150000,
    snapshotPrices: { hayaca: 15000 },
    payments: [{ method: "Bancolombia", amount: 150000 }],
    paymentStatus: "Pagado",
    orderItems: [{ productId: "hayaca", productName: "Hayaca", quantity: 10, unitPrice: 15000 }],
  },
  {
    id: "ORD-005", client: "Sandra Vega", deliveryDate: "2026-02-14",
    items: "2 Hayacas, 2 Combinados, 1 Doble Presa", status: "Pendiente", totalPrice: 72000,
    snapshotPrices: { hayaca: 15000, pastel_combinado: 13000, pastel_doble: 16000 },
    payments: [], paymentStatus: "Pendiente",
    orderItems: [
      { productId: "hayaca", productName: "Hayaca", quantity: 2, unitPrice: 15000 },
      { productId: "pastel_combinado", productName: "Pastel Combinado", quantity: 2, unitPrice: 13000 },
      { productId: "pastel_doble", productName: "Pastel Doble Presa", quantity: 1, unitPrice: 16000 },
    ],
  },
  {
    id: "ORD-006", client: "Jorge Díaz", deliveryDate: "2026-02-14",
    items: "8 Hayacas, 3 Pasteles Cerdo", status: "Confirmado", totalPrice: 156000,
    snapshotPrices: { hayaca: 15000, pastel_cerdo: 12000 },
    payments: [{ method: "Nequi", amount: 156000 }],
    paymentStatus: "Pagado",
    orderItems: [
      { productId: "hayaca", productName: "Hayaca", quantity: 8, unitPrice: 15000 },
      { productId: "pastel_cerdo", productName: "Pastel de Cerdo", quantity: 3, unitPrice: 12000 },
    ],
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
  { product: "Pastel Combinado", productId: "pastel_combinado", goal: 10, done: 4 },
  { product: "Pastel Doble Presa", productId: "pastel_doble", goal: 5, done: 1 },
];

// Recipe configuration defaults
export interface RecipeConfig {
  riceFactor: number;       // Libras de arroz por pastel (default 0.294)
  flourPerPound: number;    // Hayacas por libra de harina (default 16)
  flourPerBag: number;      // Hayacas por bolsa de 1kg (default 32)
}

export const DEFAULT_RECIPE_CONFIG: RecipeConfig = {
  riceFactor: 0.294,
  flourPerPound: 16,
  flourPerBag: 32,
};

// Calculator logic
export interface IngredientSummary {
  chickenRiceLbs: number;
  porkRiceLbs: number;
  chickenPieces: number;
  porkPieces: number;
  totalHayacas: number;
  flourLbs: number;
  flourBags: number;
}

export function calculateIngredients(
  orders: Order[],
  products: Product[],
  config: RecipeConfig,
): IngredientSummary {
  const productMap = new Map(products.map(p => [p.id, p]));

  let chickenRiceUnits = 0;
  let porkRiceUnits = 0;
  let chickenPieces = 0;
  let porkPieces = 0;
  let totalHayacas = 0;

  orders.forEach(order => {
    (order.orderItems || []).forEach(item => {
      const product = productMap.get(item.productId);
      if (!product) return;

      if (product.isHayaca) {
        totalHayacas += item.quantity;
        return;
      }

      // Rice
      if (product.riceBase === "chicken") chickenRiceUnits += item.quantity;
      if (product.riceBase === "pork") porkRiceUnits += item.quantity;

      // Meat
      chickenPieces += item.quantity * product.meatComposition.chicken;
      porkPieces += item.quantity * product.meatComposition.pork;
    });
  });

  return {
    chickenRiceLbs: Math.ceil(chickenRiceUnits * config.riceFactor * 100) / 100,
    porkRiceLbs: Math.ceil(porkRiceUnits * config.riceFactor * 100) / 100,
    chickenPieces,
    porkPieces,
    totalHayacas,
    flourLbs: totalHayacas > 0 ? Math.ceil((totalHayacas / config.flourPerPound) * 100) / 100 : 0,
    flourBags: totalHayacas > 0 ? Math.ceil((totalHayacas / config.flourPerBag) * 100) / 100 : 0,
  };
}
