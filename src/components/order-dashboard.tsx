"use client";

import * as React from "react";
import { format } from "date-fns";
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

type SortKey = keyof Order;

export default function OrderDashboard() {
  const { toast } = useToast();
  const [orders, setOrders] = React.useState<Order[]>(initialOrders);
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>({ key: "orderDate", direction: "descending" });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 16),
    to: new Date(2025, 5, 26),
  });
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [currentPage, setCurrentPage] = React.useState(4);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

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
        if (!dateRange?.from && !dateRange?.to) return true;
        const orderDate = new Date(order.orderDate);
        if (dateRange.from && orderDate < dateRange.from) return false;
        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (orderDate > toDate) return false;
        }
        return true;
      });
  }, [orders, searchQuery, statusFilter, dateRange]);

  const sortedOrders = React.useMemo(() => {
    if (!sortConfig) return filteredOrders;
    return [...filteredOrders].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
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
    toast({
      title: "Success",
      description: `${selectedIds.length} order(s) deleted.`,
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
        return "bg-green-100 text-green-800";
      case "New Order":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Waiting Process":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "ghost"}
          size="icon"
          className={`h-8 w-8 ${i === currentPage ? 'bg-primary text-primary-foreground' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };


  return (
    <>
      <Card className="shadow-lg bg-white p-4">
        <CardContent className="p-0">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 md:grow-0">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
               <Input
                placeholder="Order Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            <Select onValueChange={setStatusFilter} defaultValue="all">
              <SelectTrigger className="w-full md:w-auto">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
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
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={selectedRowsCount === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add New Order
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
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
                            "rounded-md px-2 py-1 text-xs font-semibold",
                            getStatusBadgeClass(order.status)
                          )}
                          variant="outline"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-left">
                        {format(new Date(order.orderDate), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.total.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
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
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center space-x-2">
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