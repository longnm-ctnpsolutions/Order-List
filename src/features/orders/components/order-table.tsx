"use client"

import * as React from "react"
import {
  ArrowUpDown,
  MoreVertical,
  Minus
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { type Order } from "@/features/orders/types/order.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortKey = keyof Order;

const formatDateInUTC = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
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

const renderSortIcon = (columnKey: SortKey, sortConfig: { key: SortKey; direction: "ascending" | "descending"; } | null) => {
    if (sortConfig?.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUpDown className="ml-2 h-3 w-3" />
    ) : (
      <ArrowUpDown className="ml-2 h-3 w-3" />
    );
};

interface OrderTableProps {
    paginatedOrders: Order[];
    rowSelection: Record<string, boolean>;
    sortConfig: { key: SortKey; direction: "ascending" | "descending"; } | null;
    handleSort: (key: SortKey) => void;
    handleRowSelect: (id: string) => void;
    setRowSelection: (selection: Record<string, boolean>) => void;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({ paginatedOrders, rowSelection, sortConfig, handleSort, handleRowSelect, setRowSelection, setIsDeleteDialogOpen }) => {
    const areAllRowsSelected = paginatedOrders.length > 0 && paginatedOrders.every(order => rowSelection[order.id]);
    
    const handleSelectAll = () => {
        const newRowSelection: Record<string, boolean> = {};
        if (!areAllRowsSelected) {
            paginatedOrders.forEach(order => {
                newRowSelection[order.id] = true;
            });
        }
        setRowSelection(newRowSelection);
    };

    return (
        <Table>
            <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 w-full">
                <TableHead className="w-[50px] px-4">
                <Checkbox
                    checked={areAllRowsSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                />
                </TableHead>
                <TableHead className="min-w-[150px] cursor-pointer" onClick={() => handleSort("temporaryOrderId")}>
                <div className="flex items-center">Temporary Order ID {renderSortIcon("temporaryOrderId", sortConfig)}</div>
                </TableHead>
                <TableHead className="min-w-[120px] cursor-pointer" onClick={() => handleSort("id")}>
                <div className="flex items-center">Order ID {renderSortIcon("id", sortConfig)}</div>
                </TableHead>
                <TableHead className="min-w-[150px] cursor-pointer hidden md:table-cell" onClick={() => handleSort("customerId")}>
                <div className="flex items-center">Customer ID {renderSortIcon("customerId", sortConfig)}</div>
                </TableHead>
                <TableHead className="min-w-[120px] cursor-pointer hidden md:table-cell" onClick={() => handleSort("backOrder")}>
                <div className="flex items-center">Back Order {renderSortIcon("backOrder", sortConfig)}</div>
                </TableHead>
                <TableHead className="min-w-[120px] cursor-pointer" onClick={() => handleSort("status")}>
                <div className="flex items-center">Order Status {renderSortIcon("status", sortConfig)}</div>
                </TableHead>
                <TableHead className="min-w-[120px] cursor-pointer text-left hidden md:table-cell" onClick={() => handleSort("orderDate")}>
                <div className="flex items-center">Order Date {renderSortIcon("orderDate", sortConfig)}</div>
                </TableHead>
                <TableHead className="min-w-[100px] cursor-pointer text-right hidden lg:table-cell" onClick={() => handleSort("quantity")}>
                <div className="flex items-center justify-end">Ordered Quantity {renderSortIcon("quantity", sortConfig)}</div>
                </TableHead>
                <TableHead className="min-w-[150px] cursor-pointer text-right hidden lg:table-cell" onClick={() => handleSort("confirmedQuantity")}>
                <div className="flex items-center justify-end">Confirmed Quantity {renderSortIcon("confirmedQuantity", sortConfig)}</div>
                </TableHead>
                <TableHead className="cursor-pointer text-right hidden md:table-cell" onClick={() => handleSort("total")}>
                <div className="flex items-center justify-end">Total Amount (Incl. VAT) {renderSortIcon("total", sortConfig)}</div>
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
                    <TableCell className="font-medium">{order.temporaryOrderId}</TableCell>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.customerId}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.backOrder}</TableCell>
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
                    <TableCell className="text-left hidden md:table-cell min-w-[150px]">{formatDateInUTC(order.orderDate)}</TableCell>
                    <TableCell className="text-right hidden lg:table-cell">{order.quantity}</TableCell>
                    <TableCell className="text-right hidden lg:table-cell">{order.confirmedQuantity}</TableCell>
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
                    colSpan={11}
                    className="h-24 text-center text-muted-foreground"
                >
                    No orders found.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
    )
}
