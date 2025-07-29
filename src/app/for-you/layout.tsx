// app/for-you/layout.tsx
"use client"; // This layout needs to be a client component to use hooks

import React, { useState } from 'react';
import { ForYouSidebar } from '../modules/components/For You/Sidebar'; // Adjust import path if needed
import useAuthStatus from '@/hooks/use-auth-status'; // Import your custom auth hook
import { SidebarProvider } from '@/components/ui/sidebar';

interface ForYouLayoutProps {
    children: React.ReactNode;
}

export default function ForYouLayout({ children }: ForYouLayoutProps) {
    const { user, loading } = useAuthStatus();
    const [activeContentId, setActiveContentId] = useState('for-you'); // Default active for this segment

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-700 text-2xl">
                Checking authentication...
            </div>
        );
    }

    if (!user) {
        // If user is not logged in, render a message or redirect
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 flex-col text-center p-4">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
                <p className="text-lg text-gray-700">Please log in to view your personalized content.</p>
                {/* You might add a Link to your login page here */}
                {/* <Link href="/login" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md">Go to Login</Link> */}
            </div>
        );
    }

    return (
        // This div is the main container for this specific layout.
        // It lives inside the <body> provided by the root layout.

        <SidebarProvider>
            <div className="flex h-screen bg-gray-50">
                <ForYouSidebar
                    onSelect={setActiveContentId}
                    activeItem={activeContentId}
                    user={user}
                />
                {/* The main content area where pages within /for-you will render */}
                <main className="flex-1 overflow-y-auto">
                    {children} {/* This will be app/for-you/page.tsx content */}
                </main>
            </div >
        </SidebarProvider>
    );
}