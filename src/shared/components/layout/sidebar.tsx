"use client"

import React from 'react';
import { 
  LayoutGrid, 
  List, 
  Bell, 
  Calculator, 
  ChevronDown,
  Menu,
  ShoppingCart,
  Users,
  Package,
  Ticket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { useSidebar } from "@/shared/components/ui/sidebar";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isMobile?: boolean;
}

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const { isCollapsed: isCollapsedDesktop, setIsCollapsed } = useSidebar();
  const isCollapsed = isMobile ? false : isCollapsedDesktop;
  const pathname = usePathname();

  const NavItem = ({ icon: Icon, children, isCollapsed, href, ...props }: any) => {
    const active = pathname.startsWith(href);
    return (
      <Link href={href} passHref>
        <Button
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
        </Button>
      </Link>
    );
  };
  
  const CollapsibleNavItem = ({ icon: Icon, children, subItems, isCollapsed, baseHref }: any) => {
    const active = subItems.some((item: any) => pathname.startsWith(item.href));
    return (
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
            <Link href={item.href} passHref key={index}>
              <Button variant="ghost" className={cn("w-full justify-start font-normal text-sm h-9", pathname.startsWith(item.href) && "bg-gray-200")}>
                {item.name}
              </Button>
            </Link>
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
    )
  };

  const sidebarClasses = cn(
    "bg-white flex-col transition-all duration-300 ease-in-out border-r border-gray-200 z-50",
    isCollapsed ? "w-16" : "w-64",
    isMobile ? "w-full h-full flex" : "hidden lg:flex lg:fixed lg:h-full"
  );
  
  return (
    <aside className={sidebarClasses}>
        <div className={cn(
            "flex items-center border-b border-gray-200", 
            isCollapsed ? "justify-center" : "justify-between",
            isMobile ? "p-4" : "p-4 h-[60px]"
        )}>
            {!isCollapsed && !isMobile && (
              <Image src="/images/logo.svg" alt="Bridgestone Logo" width={140} height={20} />
            )}
            {!isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsedDesktop)}>
                <Menu className="h-6 w-6" />
              </Button>
            )}
             {isMobile && (
                <div className="flex items-center justify-between w-full">
                     <Image src="/images/logo.svg" alt="Bridgestone Logo" width={140} height={20} />
                </div>
            )}
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
            <NavItem icon={LayoutGrid} isCollapsed={isCollapsed} href="/en/dashboard">Dashboard</NavItem>
            <NavItem icon={ShoppingCart} isCollapsed={isCollapsed} href="/en/orders">Orders</NavItem>
            <NavItem icon={Package} isCollapsed={isCollapsed} href="/en/products">Products</NavItem>
            <NavItem icon={Ticket} isCollapsed={isCollapsed} href="/en/promotions">Promotions</NavItem>
            <NavItem icon={Users} isCollapsed={isCollapsed} href="/en/users">Users</NavItem>
            <NavItem icon={Bell} isCollapsed={isCollapsed} href="#">Notification</NavItem>
            <NavItem icon={Calculator} isCollapsed={isCollapsed} href="#">Earning Calculator</NavItem>
            <NavItem icon={List} isCollapsed={isCollapsed} href="#">Price List</NavItem>
        </nav>
    </aside>
  )
}
