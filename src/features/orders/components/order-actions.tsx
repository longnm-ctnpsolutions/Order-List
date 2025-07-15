"use client";

import * as React from "react";
import {
  Trash2,
  MoreVertical,
  Search,
  Plus,
  RefreshCw,
  LayoutGrid,
  FileDown
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";

interface OrderActionsProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setStatusFilter: (status: string) => void;
    setIsAddOrderDialogOpen: (isOpen: boolean) => void;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    selectedRowsCount: number;
    setCurrentPage: (page: number) => void;
}

const MobileActions = ({ searchQuery, setSearchQuery, setStatusFilter, setCurrentPage, setIsAddOrderDialogOpen, setIsDeleteDialogOpen, selectedRowsCount }: Omit<OrderActionsProps, 'selectedRowsCount'> & { selectedRowsCount: number }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
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
  );
  
  const TabletActions = ({ searchQuery, setSearchQuery, setStatusFilter, setCurrentPage }: Pick<OrderActionsProps, 'searchQuery' | 'setSearchQuery' | 'setStatusFilter' | 'setCurrentPage'>) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="p-2 space-y-2">
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
              <SelectTrigger className="w-full bg-gray-100 border-gray-100">
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
        <DropdownMenuSeparator/>
        <DropdownMenuItem><RefreshCw className="mr-2 h-4 w-4"/> Refresh</DropdownMenuItem>
        <DropdownMenuItem><LayoutGrid className="mr-2 h-4 w-4"/> Layout</DropdownMenuItem>
        <DropdownMenuItem><FileDown className="mr-2 h-4 w-4"/> Download</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

export const OrderActions: React.FC<OrderActionsProps> = ({ 
    searchQuery, setSearchQuery, setStatusFilter, setIsAddOrderDialogOpen, setIsDeleteDialogOpen, selectedRowsCount, setCurrentPage 
}) => {
    return (
        <div className="w-full">
            {/* Desktop and Tablet Header */}
            <div className="hidden md:flex items-center justify-between w-full">
                <h2 className="text-xl font-semibold flex-shrink-0">Order Tracking</h2>
                
                {/* Desktop Actions */}
                <div className="hidden lg:flex ml-auto items-center gap-2">
                    <div className="relative w-auto">
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
                      <SelectTrigger className="w-auto bg-gray-100 border-gray-100">
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
                    <Button variant="ghost" size="icon" className="bg-gray-100 border-gray-200"><RefreshCw className="h-5 w-5"/></Button>
                    <Button variant="ghost" size="icon" className="bg-gray-100 border-gray-200"><LayoutGrid className="h-5 w-5"/></Button>
                    <Button variant="ghost" size="icon" className="bg-gray-100 border-gray-200"><FileDown className="h-5 w-5"/></Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      disabled={selectedRowsCount === 0}
                    >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                    </Button>
                    
                    <Button className="bg-blue-700 hover:bg-blue-800 text-white" onClick={() => setIsAddOrderDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Order
                    </Button>
                </div>
                
                {/* Tablet Actions */}
                <div className="hidden md:flex lg:hidden ml-auto items-center gap-2">
                    <TabletActions 
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      setStatusFilter={setStatusFilter}
                      setCurrentPage={setCurrentPage}
                    />
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      disabled={selectedRowsCount === 0}
                    >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                    </Button>
                    <Button className="bg-blue-700 hover:bg-blue-800 text-white" onClick={() => setIsAddOrderDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Order
                    </Button>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="flex md:hidden items-center justify-between w-full">
                <h2 className="text-xl font-semibold">Order Tracking</h2>
                <MobileActions 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setStatusFilter={setStatusFilter}
                    setIsAddOrderDialogOpen={setIsAddOrderDialogOpen}
                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                    selectedRowsCount={selectedRowsCount}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    )
}
