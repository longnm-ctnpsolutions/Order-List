export type Order = {
  id: string;
  customerId: string;
  status: "New Order" | "Completed" | "Draft";
  total: number;
  quantity: number;
  orderDate: string;
};
