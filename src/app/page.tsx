import OrderDashboard from "@/components/order-dashboard";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <OrderDashboard />
      </div>
    </main>
  );
}
