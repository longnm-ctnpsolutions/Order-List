import OrderDashboard from "@/features/orders/components/order-dashboard";
import Header from "@/shared/components/layout/header";
import Sidebar from "@/shared/components/layout/sidebar";
import { SidebarProvider } from "@/shared/components/ui/sidebar";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100 min-w-[375px]">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <OrderDashboard />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
