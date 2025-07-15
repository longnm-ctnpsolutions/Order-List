"use client"

import * as React from 'react'
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface OrderFiltersProps {
    dateRange: DateRange | undefined;
    setDateRange: (dateRange: DateRange | undefined) => void;
    setCurrencyFilter: (currency: string) => void;
    setCurrentPage: (page: number) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({ dateRange, setDateRange, setCurrencyFilter, setCurrentPage }) => {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
            <div className="flex w-full flex-col md:flex-row items-start md:items-center gap-2 md:justify-end md:flex-wrap">
              <div className="w-full md:w-auto flex flex-col md:flex-row md:items-center gap-2">
                <span className="text-sm text-muted-foreground">Date</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full md:w-[260px] justify-start text-left font-normal",
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
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row md:items-center gap-2">
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
      </div>
    )
}
