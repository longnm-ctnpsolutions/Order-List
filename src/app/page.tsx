import { FileArchive, Menu, Bell } from "lucide-react";
import OrderDashboard from "@/components/order-dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-16 bg-white flex flex-col items-center py-4">
        <div className="flex flex-col items-center space-y-6">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileArchive className="h-6 w-6 text-primary" />
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm flex items-center justify-between p-4">
          <div className="flex items-center">
             <Image src="https://i.imgur.com/Q2yT9W5.png" alt="Bridgestone Logo" width={140} height={20} />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="flex items-center space-x-2">
              <Image src="https://i.imgur.com/e23nC4z.png" alt="UK Flag" width={24} height={16} />
              <span>EN</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-6 w-6" />
            </Button>
            <Avatar>
              <AvatarImage src="https://i.imgur.com/s6n5s4f.png" data-ai-hint="firebase logo" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-4">Order Tracking</h1>
          <OrderDashboard />
        </main>
      </div>
    </div>
  );
}
