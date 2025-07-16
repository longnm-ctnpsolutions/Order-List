"use client";

import OrderDashboard from "@/features/orders/components/order-dashboard";
import Header from "@/shared/components/layout/header";
import Sidebar from "@/shared/components/layout/sidebar";
import { SidebarProvider, useSidebar } from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";

function DashboardLayout() {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <>
      <Sidebar />
      <div
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out w-full",
          !isMobile && (isCollapsed ? "lg:pl-16" : "lg:pl-64")
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6 bg-background">
          <OrderDashboard />
        </main>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
        <DashboardLayout />
      </div>
    </SidebarProvider>
  );
}