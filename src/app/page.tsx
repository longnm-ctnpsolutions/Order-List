import { FileArchive, Menu, Bell } from "lucide-react";
import OrderDashboard from "@/components/order-dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100 min-w-[375px]">
      <aside className="w-16 bg-white flex-col items-center py-4 hidden lg:flex">
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
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                <div className="flex flex-col h-full bg-white">
                  <div className="p-4 border-b">
                    <Image src="https://i.imgur.com/Q2yT9W5.png" alt="Bridgestone Logo" width={140} height={20} />
                  </div>
                  <nav className="flex-1 p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileArchive className="mr-2 h-4 w-4" />
                      Orders
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden lg:block">
              <Image src="https://i.imgur.com/Q2yT9W5.png" alt="Bridgestone Logo" width={140} height={20} />
            </div>
          </div>
          <div className="lg:hidden">
             <Image src="https://i.imgur.com/Q2yT9W5.png" alt="Bridgestone Logo" width={120} height={18} />
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" className="items-center space-x-2 hidden md:flex">
              <Image src="https://i.imgur.com/e23nC4z.png" alt="UK Flag" width={24} height={16} />
              <span>EN</span>
            </Button>
             <Button variant="ghost" className="items-center space-x-2 flex md:hidden">
              <Image src="https://i.imgur.com/e23nC4z.png" alt="UK Flag" width={24} height={16} />
              <span className="font-semibold">EN</span>
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <OrderDashboard />
        </main>
      </div>
    </div>
  );
}
