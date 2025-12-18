export type OrderContext = {
  type: "mesa" | "carpa";
  id: string;
};

export type OrderContextStore = {
  orderContext: OrderContext | null;
  setOrderContext: (ctx: OrderContext) => void;
  clearOrderContext: () => void;
};