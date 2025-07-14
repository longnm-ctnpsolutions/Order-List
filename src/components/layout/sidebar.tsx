"use client"

import React from 'react';
import { 
  LayoutGrid, 
  Zap, 
  List, 
  Bell, 
  Calculator, 
  ChevronDown,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarProps {
  isMobile?: boolean;
}

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  const NavItem = ({ icon: Icon, children, isCollapsed, active = false, asChild=false, ...props }: any) => {
    const Comp = asChild ? 'div' : Button;
    return (
      <Comp
        variant="ghost"
        className={cn(
          "w-full justify-start items-center text-sm font-normal h-10 px-4",
          isCollapsed ? "justify-center px-0" : "justify-start",
          active ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800" : "hover:bg-gray-100",
        )}
        {...props}
      >
        <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
        {!isCollapsed && <span className="flex-1 text-left">{children}</span>}
      </Comp>
    );
  };
  
  const CollapsibleNavItem = ({ icon: Icon, children, subItems, isCollapsed, active = false }: any) => (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start items-center text-sm font-normal h-10 px-4",
            isCollapsed ? "justify-center px-0" : "justify-start",
            active ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800" : "hover:bg-gray-100",
          )}
        >
          <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span className="flex-1 text-left">{children}</span>}
          {!isCollapsed && <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      {!isCollapsed && (
        <CollapsibleContent className="pl-8 py-1 space-y-1">
          {subItems.map((item:any, index:number) => (
            <Button key={index} variant="ghost" className="w-full justify-start font-normal text-sm h-9">
              {item.name}
            </Button>
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );

  const sidebarClasses = cn(
    "bg-white flex flex-col transition-all duration-300 ease-in-out border-r border-gray-200",
    isCollapsed ? "w-16" : "w-64",
    isMobile ? "w-full h-full" : "hidden lg:flex"
  );
  
  return (
    <aside className={sidebarClasses}>
        <div className={cn(
            "flex items-center border-b border-gray-200", 
            isCollapsed ? "justify-center" : "justify-between",
            isMobile ? "p-4" : "p-4 h-[60px]"
        )}>
            {!isCollapsed && !isMobile && (
              <Image src="https://i.imgur.com/Q2yT9W5.png" alt="Bridgestone Logo" width={140} height={20} />
            )}
            {!isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                <Menu className="h-6 w-6" />
              </Button>
            )}
             {isMobile && (
                <div className="flex items-center justify-between w-full">
                     <Image src="https://i.imgur.com/Q2yT9W5.png" alt="Bridgestone Logo" width={140} height={20} />
                </div>
            )}
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
            <CollapsibleNavItem 
                icon={LayoutGrid} 
                isCollapsed={isCollapsed}
                active
                subItems={[
                    { name: "Quick Order" },
                    { name: "Price List" },
                ]}
            >
                Order
            </CollapsibleNavItem>
            <NavItem icon={Bell} isCollapsed={isCollapsed}>Notification</NavItem>
            <NavItem icon={Calculator} isCollapsed={isCollapsed}>Earning Calculator</NavItem>
            <NavItem icon={List} isCollapsed={isCollapsed}>Price List</NavItem>
        </nav>
    </aside>
  )
}
