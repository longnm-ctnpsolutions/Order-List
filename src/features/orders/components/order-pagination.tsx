"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface OrderPaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    selectedRowsCount: number;
    sortedOrdersCount: number;
}

export const OrderPagination: React.FC<OrderPaginationProps> = ({ currentPage, totalPages, setCurrentPage, selectedRowsCount, sortedOrdersCount }) => {
    const [isMobile, setIsMobile] = React.useState(false);
  
    React.useEffect(() => {
      const checkScreenSize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const renderPagination = () => {
        const pages = [];
        const maxPagesToShow = isMobile ? 3 : 5;
    
        if (totalPages <= maxPagesToShow) {
          for (let i = 1; i <= totalPages; i++) {
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
        } else {
            if (isMobile) {
                let startPage, endPage;
                if (currentPage <= 2) {
                    startPage = 1;
                    endPage = 3;
                } else if (currentPage >= totalPages - 1) {
                    startPage = totalPages - 2;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 1;
                    endPage = currentPage + 1;
                }
    
                if (startPage > 1) {
                    pages.push(<Button key={1} variant="ghost" size="icon" className="h-8 w-8 text-sm text-gray-500" onClick={() => setCurrentPage(1)}>1</Button>);
                    if (startPage > 2) {
                        pages.push(<span key="start-ellipsis" className="px-2">...</span>);
                    }
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
    
                if (endPage < totalPages) {
                     if (endPage < totalPages - 1) {
                        pages.push(<span key="end-ellipsis" className="px-2">...</span>);
                    }
                    pages.push(<Button key={totalPages} variant="ghost" size="icon" className="h-8 w-8 text-sm text-gray-500" onClick={() => setCurrentPage(totalPages)}>{totalPages}</Button>);
                }
            } else {
                pages.push(
                    <Button
                      key={1}
                      variant="ghost"
                      className={cn("h-8 w-8 text-sm", {
                        "bg-blue-600 text-white hover:bg-blue-700 hover:text-white": 1 === currentPage,
                        "text-gray-500": 1 !== currentPage,
                      })}
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </Button>
                  );
                if (currentPage > 3) {
                  pages.push(<span key="start-ellipsis" className="px-2">...</span>);
                }
        
                let startPage = Math.max(2, currentPage - 1);
                let endPage = Math.min(totalPages - 1, currentPage + 1);
        
                if (currentPage <= 3) {
                    startPage = 2;
                    endPage = 4;
                }
                if (currentPage >= totalPages - 2) {
                  startPage = Math.max(2, totalPages - 3);
                  endPage = totalPages - 1;
                }
        
                 for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant="ghost"
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
        
                if (currentPage < totalPages - 2) {
                  pages.push(<span key="end-ellipsis" className="px-2">...</span>);
                }
                pages.push(
                    <Button
                    key={totalPages}
                    size="icon"
                    className={cn("h-8 w-8 text-sm", {
                        "bg-blue-600 text-white hover:bg-blue-700 hover:text-white": totalPages === currentPage,
                        "text-gray-500": totalPages !== currentPage,
                    })}
                    onClick={() => setCurrentPage(totalPages)}
                    >
                    {totalPages}
                    </Button>
                );
            }
        }
    
        return <div className="flex space-x-1 items-center">{pages}</div>;
      };

    return (
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {selectedRowsCount > 0
                ? `${selectedRowsCount} of ${sortedOrdersCount} row(s) selected.`
                : `Total ${sortedOrdersCount} orders`
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
              <div className="flex">{renderPagination()}</div>
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
    )
}
