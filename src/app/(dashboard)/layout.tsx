"use client"

import "../globals.css";
import React, { useState, useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { ForYouSidebar } from "../modules/components/For You/Sidebar";
import { ForYouNavbar } from "../modules/components/For You/for-you-navbar";
import useAuthStatus from '@/hooks/use-auth-status'; // Import your custom auth hook
import { useRouter } from 'next/navigation'; // Import useRouter

export default function DashboardLayout({ // Renamed to DashboardLayout for clarity
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use your authentication status hook to get user and loading state
  const { user, loading } = useAuthStatus();
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
  useEffect(() => {
    // Only redirect if not loading and user is null (not authenticated)
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]); // Depend on user, loading, and router

  // If authentication is still loading, show a global loading spinner
  if (loading) {
    return (
      <html lang="en">
        <body>
          <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-700 text-2xl animate-pulse">
            Loading dashboard...
          </div>
        </body>
      </html>
    );
  }

  // If no user is logged in after loading, render the access denied message.
  // The useEffect above will handle the actual redirection.
  if (!user) {
    return (
      <html lang="en">
        <body >
          <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex-col text-center p-4">
            <p className="text-4xl font-extrabold text-blue-800 mb-4">Access Denied</p>
            <p className="text-lg text-gray-700 mb-6">Please log in to view this content.</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          {/* The main Shadcn Sidebar component */}
          <Sidebar>
            {/* Your custom ForYouSidebar component, receiving necessary props */}
            <ForYouSidebar
              onSelect={handleSidebarSelect}
              activeItem={activeItem}
              user={user} // Pass the user object from useAuthStatus
            />
          </Sidebar>
          {/* SidebarInset wraps the main content area */}
          <SidebarInset>
            {/* ForYouNavbar can also receive user or other props if needed */}
            <ForYouNavbar/>
            {children} {/* This renders your page content (e.g., app/dashboard/for-you/page.tsx) */}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
