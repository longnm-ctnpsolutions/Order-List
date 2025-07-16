"use client"

import { Menu, Bell } from "lucide-react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "./sidebar";
import { useSidebar } from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";

export default function Header() {
  const { isCollapsed, isMobile } = useSidebar() ?? { isCollapsed: false, isMobile: false };
  
  return (
    <header className={cn(
        "bg-white shadow-sm flex items-center justify-between p-4 lg:py-2.5 lg:px-6 transition-all duration-300 ease-in-out",
        !isMobile && (isCollapsed ? "lg:ml-16" : "lg:ml-64")
    )}>
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] p-0">
            <Sidebar isMobile={true}/>
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
  );
}
