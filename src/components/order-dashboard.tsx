
"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import {
  ArrowUpDown,
  Trash2,
  MoreVertical,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MoreHorizontal,
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type SortKey = keyof Order;

const formatDateInUTC = (isoDateString: string) => {
  const date = new Date(isoDateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

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
  const [isMobileContentVisible, setIsMobileContentVisible] = React.useState(true);

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
    const maxPagesToShow = 8;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 text-sm", {
            "bg-blue-600 text-white hover:bg-blue-700 hover:text-white": i === currentPage,
            "text-gray-500": i !== currentPage,
          })}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    return <div className="flex space-x-1">{pages}</div>;
  };

  const MobileActions = () => (
    <div className="md:hidden ml-auto">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-2">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2 space-y-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Order Search"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-4 py-2 w-full bg-gray-100 border-gray-100 rounded-md"
                        />
                    </div>
                    <Select onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }} defaultValue="all">
                        <SelectTrigger className="w-full">
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
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="flex items-center gap-2"
                    onSelect={() => setIsAddOrderDialogOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    Add New Order
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex items-center gap-2 text-red-600"
                    onSelect={() => setIsDeleteDialogOpen(true)}
                    disabled={selectedRowsCount === 0}
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );

  return (
    <>
      <Card className="shadow-lg bg-white max-w-full overflow-hidden">
        <CardHeader className="p-4 md:p-6 pb-0">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Order Tracking</h2>
                 <div className="hidden md:flex ml-auto items-center gap-2">
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
                </div>
                <div className="md:hidden">
                    <MobileActions />
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-4">
          <Separator className="md:hidden -mt-2 mb-4" />
          <div className="hidden md:flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-4 w-full">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Order Search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 w-full bg-gray-100 border-gray-100 rounded-md"
                />
              </div>
              <Select onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }} defaultValue="all">
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
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
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
                  <SelectTrigger className="w-full md:w-[100px]">
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
                      aria-label="Select all orders"
                    />
                  </TableHead>
                  <TableHead
                    className="min-w-[120px] cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center">
                      Order ID {renderSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[150px] cursor-pointer hidden md:table-cell" onClick={() => handleSort("customerId")}>
                    <div className="flex items-center"> Customer ID {renderSortIcon("customerId")}</div>
                  </TableHead>
                  <TableHead className="min-w-[120px] cursor-pointer" onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status {renderSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="min-w-[120px] cursor-pointer text-left hidden md:table-cell"
                    onClick={() => handleSort("orderDate")}
                  >
                    <div className="flex items-center">
                      Order Date {renderSortIcon("orderDate")}
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[100px] cursor-pointer text-right hidden md:table-cell" onClick={() => handleSort("quantity")}>
                    <div className="flex items-center justify-end"> Quantity {renderSortIcon("quantity")}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer text-right hidden md:table-cell" onClick={() => handleSort("total")}>
                    <div className="flex items-center justify-end"> Total Amount {renderSortIcon("total")}</div>

                  </TableHead>
                  <TableHead className="min-w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      data-state={rowSelection[order.id] && "selected"}
                      className="even:bg-gray-50 hover:bg-gray-100"
                    >
                      <TableCell className="px-4">
                        <Checkbox
                          checked={!!rowSelection[order.id]}
                          onCheckedChange={() => handleRowSelect(order.id)}
                          aria-label={`Select order ${order.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell className="hidden md:table-cell">{order.customerId}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "rounded-md px-2 py-1 text-xs font-semibold border capitalize",
                            getStatusBadgeClass(order.status)
                          )}
                          variant="outline"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-left hidden md:table-cell">{formatDateInUTC(order.orderDate)}</TableCell>
                      <TableCell className="text-right hidden md:table-cell">{order.quantity}</TableCell>
                      <TableCell className="text-right hidden md:table-cell">
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
          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {selectedRowsCount > 0
                ? `${selectedRowsCount} of ${sortedOrders.length} row(s) selected.`
                : `Total ${sortedOrders.length} orders`
              }
            </div>
            <div className="flex items-center justify-center md:justify-end space-x-2 w-full md:w-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {renderPagination()}
              <Button
                variant="ghost"
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
