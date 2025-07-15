"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";

import { useToast } from "@/shared/hooks/use-toast";
import { type Order } from "@/features/orders/types/order.types";
import { orders as initialOrders } from "@/features/orders/lib/data";

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { OrderFilters } from "./order-filters";
import { OrderActions } from "./order-actions";
import { OrderTable } from "./order-table";
import { OrderPagination } from "./order-pagination";

type SortKey = keyof Order;

export default function OrderDashboard() {
  const { toast } = useToast();
  const [orders, setOrders] = React.useState<Order[]>(initialOrders);
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>({ key: "createdAt", direction: "descending" });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [currencyFilter, setCurrencyFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 16),
    to: new Date(2025, 5, 26),
  });
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = React.useState(false);
  
  const ITEMS_PER_PAGE = 10;

  const handleSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const selectedRowsCount = Object.values(rowSelection).filter(Boolean).length;

  const filteredOrders = React.useMemo(() => {
    return orders
      .filter((order) => {
        const query = searchQuery.toLowerCase();
        return (
          order.id.toLowerCase().includes(query) ||
          order.customerId.toLowerCase().includes(query) ||
          order.temporaryOrderId.toLowerCase().includes(query)
        );
      })
      .filter((order) => {
        return statusFilter === "all" || order.status === statusFilter;
      })
      .filter((order) => {
        return currencyFilter === "all" || order.currency === currencyFilter;
      })
      .filter((order) => {
        if (!dateRange?.from) return true;
        const orderDate = new Date(order.orderDate);
        if (dateRange.from && orderDate < dateRange.from) return false;
        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (orderDate > toDate) return false;
        }
        return true;
      });
  }, [orders, searchQuery, statusFilter, currencyFilter, dateRange]);

  const sortedOrders = React.useMemo(() => {
    let sortableItems = [...filteredOrders];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'orderDate' || sortConfig.key === 'createdAt') {
            const dateA = new Date(aValue).getTime();
            const dateB = new Date(bValue).getTime();
            if (dateA < dateB) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (dateA > dateB) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredOrders, sortConfig]);

  const paginatedOrders = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedOrders, currentPage]);

  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);

  const handleRowSelect = (id: string) => {
    setRowSelection((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = () => {
    const selectedIds = Object.keys(rowSelection).filter(
      (id) => rowSelection[id]
    );
    setOrders(orders.filter((order) => !selectedIds.includes(order.id)));
    setRowSelection({});
    setIsDeleteDialogOpen(false);
    setCurrentPage(1);
    toast({
      title: "Success",
      description: `${selectedIds.length} order(s) deleted.`,
    });
  };

  const handleAddOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newOrder: Order = {
      temporaryOrderId: `TEMP-${String(orders.length + 1).padStart(3, '0')}`,
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customerId: formData.get("customerId") as string,
      status: formData.get("status") as Order["status"],
      total: parseFloat(formData.get("total") as string),
      quantity: parseInt(formData.get("quantity") as string, 10),
      orderDate: new Date(formData.get("orderDate") as string).toISOString(),
      currency: formData.get("currency") as "USD" | "VND",
      createdAt: new Date().toISOString(),
      backOrder: 'No',
      confirmedQuantity: parseInt(formData.get("quantity") as string, 10),
    };
    setOrders([newOrder, ...orders]);
    setIsAddOrderDialogOpen(false);
    toast({
      title: "Success",
      description: `Order ${newOrder.id} created.`,
    });
  };

  return (
    <>
    <Dialog open={isAddOrderDialogOpen} onOpenChange={setIsAddOrderDialogOpen}>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <Card className="shadow-lg bg-white max-w-full overflow-hidden">
          <CardHeader className="p-4 md:p-6 pb-0 md:pb-4">
              <OrderActions 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setStatusFilter={setStatusFilter}
                setIsAddOrderDialogOpen={setIsAddOrderDialogOpen}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                selectedRowsCount={selectedRowsCount}
                setCurrentPage={setCurrentPage}
              />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-4">
              <OrderFilters 
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  setCurrencyFilter={setCurrencyFilter}
                  setCurrentPage={setCurrentPage}
              />

            <div className="overflow-x-auto rounded-md border">
              <OrderTable 
                  paginatedOrders={paginatedOrders}
                  rowSelection={rowSelection}
                  sortConfig={sortConfig}
                  handleSort={handleSort}
                  handleRowSelect={handleRowSelect}
                  setRowSelection={setRowSelection}
                  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              />
            </div>
            <OrderPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              selectedRowsCount={selectedRowsCount}
              sortedOrdersCount={sortedOrders.length}
            />
          </CardContent>
        </Card>
      
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                selected order(s).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New Order</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddOrder} className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="customerId" className="text-right">Customer ID</Label>
                <Input id="customerId" name="customerId" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select name="status" required>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="New Order">New Order</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Waiting Process">Waiting Process</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total" className="text-right">Total</Label>
                <Input id="total" name="total" type="number" step="0.01" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="orderDate" className="text-right">Order Date</Label>
                <Input id="orderDate" name="orderDate" type="date" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currency" className="text-right">Currency</Label>
                <Select name="currency" required>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="VND">VND</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button type="submit">Add Order</Button>
            </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
