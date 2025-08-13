"use client"

import "../globals.css";
import React, { useState, } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ForYouSidebar } from "../modules/components/dashboard/for-you/Sidebar";
import { ForYouNavbar } from "../modules/components/dashboard/for-you/for-you-navbar";
import useAuthStatus from '@/hooks/use-auth-status'; 
import { useRouter } from 'next/navigation';
import { ModalProvider } from "../context/modal-context";

export default function DashboardLayout({ 
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { user } = useAuthStatus();
  const router = useRouter(); 

  const [activeItem, setActiveItem] = useState('for-you');

  const handleSidebarSelect = (id: string) => {
    setActiveItem(id);
    router.push(`/dashboard/${id}`);
  };

  return (
    <ModalProvider>
      <SidebarProvider>
        <ForYouSidebar
          onSelect={handleSidebarSelect}
          activeItem={activeItem}
          user={user}
        />
        <SidebarInset>
          <ForYouNavbar />
          {children} 
        </SidebarInset>
      </SidebarProvider>
    </ModalProvider>
  );
}
