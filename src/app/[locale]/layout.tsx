"use client";

import Header from "@/shared/components/layout/header";
import Sidebar from "@/shared/components/layout/sidebar";
import { SidebarProvider, useSidebar } from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";
import * as React from "react";

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out",
          !isMobile && (isCollapsed ? "lg:pl-16" : "lg:pl-64")
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppLayout>{children}</AppLayout>
    </SidebarProvider>
  );
}
