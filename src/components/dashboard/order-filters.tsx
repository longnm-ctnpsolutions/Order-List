"use client"

import * as React from 'react'
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderFiltersProps {
    dateRange: DateRange | undefined;
    setDateRange: (dateRange: DateRange | undefined) => void;
    setCurrencyFilter: (currency: string) => void;
    setCurrentPage: (page: number) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({ dateRange, setDateRange, setCurrencyFilter, setCurrentPage }) => {
    return (
        <div className="flex flex-col mobile:flex-row items-start mobile:items-center gap-4">
        <div className="hidden md:flex items-center gap-2 w-full">
            {/* Desktop filters are in the header */}
        </div>

          <div className="flex w-full flex-col mobile:flex-row items-start mobile:items-center gap-2 md:justify-end">
            <span className="text-sm text-muted-foreground hidden mobile:inline">Date</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full mobile:w-[260px] justify-start text-left font-normal",
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
              <PopoverContent className="w-auto p-0" align="end">
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
            <span className="text-sm text-muted-foreground hidden md:inline">Currency</span>
             <Select onValueChange={(value) => { setCurrencyFilter(value); setCurrentPage(1); }} defaultValue="all">
              <SelectTrigger className="w-full mobile:w-auto md:w-[100px]">
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
    )
}
