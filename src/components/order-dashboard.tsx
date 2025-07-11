"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import {
  ArrowUpDown,
  Trash2,
  MoreVertical,
  Search,
  RefreshCw,
  Columns,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar as CalendarIcon,
} from "lucide-react";
import { type DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { type Order } from "@/lib/types";
import { orders as initialOrders } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  );
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
          order.customerId.toLowerCase().includes(query)
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
        const orderDate = parseISO(order.orderDate);
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
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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

  const handleSelectAll = (checked: boolean) => {
    const newSelection = paginatedOrders.reduce(
      (acc, order) => {
        acc[order.id] = checked;
        return acc;
      },
      {} as Record<string, boolean>
    );
    setRowSelection(checked ? newSelection : {});
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
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customerId: formData.get("customerId") as string,
      status: formData.get("status") as Order["status"],
      total: parseFloat(formData.get("total") as string),
      quantity: parseInt(formData.get("quantity") as string, 10),
      orderDate: new Date(formData.get("orderDate") as string).toISOString(),
      currency: formData.get("currency") as "USD" | "VND",
      createdAt: new Date().toISOString(),
    };
    setOrders([newOrder, ...orders]);
    setIsAddOrderDialogOpen(false);
    toast({
      title: "Success",
      description: `Order ${newOrder.id} created.`,
    });
  };

  const renderSortIcon = (columnKey: SortKey) => {
    if (sortConfig?.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUpDown className="ml-2 h-3 w-3" />
    ) : (
      <ArrowUpDown className="ml-2 h-3 w-3" />
    );
  };

  const getStatusBadgeClass = (status: Order["status"]): string => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "New Order":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "Waiting Process":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxPagesToShow) {
        if (currentPage <= 3) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="icon"
          className="h-8 w-8 text-sm"
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    if(totalPages > maxPagesToShow) {
        if(currentPage > 3) {
            pages.unshift(<Button variant="ghost" size="icon" className="h-8 w-8" key="start-ellipsis">...</Button>);
            pages.unshift(<Button key={1} variant="outline" size="icon" className="h-8 w-8 text-sm" onClick={() => setCurrentPage(1)}>1</Button>);
        }
        if(currentPage < totalPages - 2) {
             pages.push(<Button variant="ghost" size="icon" className="h-8 w-8" key="end-ellipsis">...</Button>);
             pages.push(<Button key={totalPages} variant="outline" size="icon" className="h-8 w-8 text-sm" onClick={() => setCurrentPage(totalPages)}>{totalPages}</Button>);
        }
    }


    return pages;
  };

  return (
    <>
      <Card className="shadow-lg bg-white">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Order Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-full md:w-64 bg-gray-100 border-gray-100"
              />
            </div>
            <Select onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1);}} defaultValue="all">
              <SelectTrigger className="w-full md:w-auto">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New Order">New Order</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Waiting Process">Waiting Process</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Columns className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <FileText className="h-4 w-4" />
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                className="bg-gray-100 border-gray-200"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={selectedRowsCount === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Dialog open={isAddOrderDialogOpen} onOpenChange={setIsAddOrderDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Order</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddOrder} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
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
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[260px] justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/y")} →{" "}
                          {format(dateRange.to, "dd/MM/y")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => { setDateRange(range); setCurrentPage(1); }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
             <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Currency</span>
                <Select onValueChange={(value) => { setCurrencyFilter(value); setCurrentPage(1); }} defaultValue="all">
                  <SelectTrigger className="w-full md:w-auto">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="VND">VND</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-[50px] px-4">
                    <Checkbox
                      checked={
                        paginatedOrders.length > 0 &&
                        selectedRowsCount === paginatedOrders.length
                      }
                      onCheckedChange={(value) => handleSelectAll(!!value)}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center">
                      Order ID {renderSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("customerId")}
                  >
                    <div className="flex items-center">
                      Customer ID {renderSortIcon("customerId")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status {renderSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-left"
                    onClick={() => handleSort("orderDate")}
                  >
                    <div className="flex items-center">
                      Order Date {renderSortIcon("orderDate")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("quantity")}
                  >
                    <div className="flex items-center justify-end">
                      Quantity {renderSortIcon("quantity")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center justify-end">
                      Total Amount {renderSortIcon("total")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      data-state={rowSelection[order.id] && "selected"}
                    >
                      <TableCell className="px-4">
                        <Checkbox
                          checked={rowSelection[order.id] || false}
                          onCheckedChange={() => handleRowSelect(order.id)}
                          aria-label={`Select order ${order.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerId}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "rounded-md px-2 py-1 text-xs font-semibold border",
                            getStatusBadgeClass(order.status)
                          )}
                          variant="outline"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-left">
                        {format(parseISO(order.orderDate), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.total.toLocaleString("en-US", {
                          style: "currency",
                          currency: order.currency,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Order</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setRowSelection({ [order.id]: true });
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedRowsCount} of {sortedOrders.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {renderPagination()}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
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
    </>
  );
}
