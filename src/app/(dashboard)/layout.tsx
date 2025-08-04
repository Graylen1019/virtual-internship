"use client"

import "../globals.css";
import React, { useState, } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ForYouSidebar } from "../modules/components/For You/Sidebar";
import { ForYouNavbar } from "../modules/components/For You/for-you-navbar";
import useAuthStatus from '@/hooks/use-auth-status'; // Import your custom auth hook
import { useRouter } from 'next/navigation'; // Import useRouter
import { ModalProvider } from "../context/modal-context";

export default function DashboardLayout({ // Renamed to DashboardLayout for clarity
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use your authentication status hook to get user and loading state
  const { user } = useAuthStatus();
  const router = useRouter(); // Initialize the router

  // State to manage which item is active in the sidebar
  // This state now lives in this layout because the sidebar is specific to the dashboard
  const [activeItem, setActiveItem] = useState('for-you');

  // Function to handle sidebar item selection and routing
  const handleSidebarSelect = (id: string) => {
    setActiveItem(id);
    // Navigate to the corresponding dashboard page
    router.push(`/dashboard/${id}`);
  };

  // Moved useEffect for redirection outside of any conditional blocks.
  // This ensures the hook is called unconditionally on every render.
  // Depend on user, loading, and router

  // If authentication is still loading, show a global loading spinner


  // If no user is logged in after loading, render the access denied message.
  // The useEffect above will handle the actual redirection.


  return (
    <ModalProvider>
      <SidebarProvider>
        {/* The main Shadcn Sidebar component */}
        {/* Your custom ForYouSidebar component, receiving necessary props */}
        <ForYouSidebar
          onSelect={handleSidebarSelect}
          activeItem={activeItem}
          user={user} // Pass the user object from useAuthStatus
        />
        {/* SidebarInset wraps the main content area */}
        <SidebarInset>
          {/* ForYouNavbar can also receive user or other props if needed */}
          <ForYouNavbar />
          {children} {/* This renders your page content (e.g., app/dashboard/for-you/page.tsx) */}
        </SidebarInset>
      </SidebarProvider>
    </ModalProvider>
  );
}
