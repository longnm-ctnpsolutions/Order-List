"use client";

import OrderDashboard from "@/features/orders/components/order-dashboard";
import Header from "@/shared/components/layout/header";
import Sidebar from "@/shared/components/layout/sidebar";
import { SidebarProvider, useSidebar } from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";

function DashboardLayout() {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-100 min-w-[375px]">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          !isMobile && (isCollapsed ? "lg:ml-16" : "lg:ml-64")
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <OrderDashboard />
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <DashboardLayout />
    </SidebarProvider>
  );
}
