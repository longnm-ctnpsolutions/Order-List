import OrderDashboard from "@/components/order-dashboard";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100 min-w-[375px]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <OrderDashboard />
        </main>
      </div>
    </div>
  );
}
