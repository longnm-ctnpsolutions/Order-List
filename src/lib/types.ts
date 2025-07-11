export type Order = {
  id: string;
  customerId: string;
  status:
    | "New Order"
    | "Completed"
    | "Draft"
    | "Cancelled"
    | "Waiting Process"
    | "Rejected";
  total: number;
  quantity: number;
  orderDate: string;
  currency: "VND" | "USD";
};
