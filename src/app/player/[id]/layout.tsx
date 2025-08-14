"use client"

import "@/app/globals.css"
import React, { useState, } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ForYouNavbar } from "@/app/modules/components/dashboard/for-you/for-you-navbar";
import useAuthStatus from '@/hooks/use-auth-status';
import { useRouter } from 'next/navigation';
import { ModalProvider } from "@/app/context/modal-context";
import { AudioPlayer } from "@/app/modules/components/book-player/player-page/audio-player/audio-player";
import { PlayerSidebar } from "@/app/modules/components/book-player/player-page/Sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useAuthStatus();
    const router = useRouter();
    const [activeItem, setActiveItem] = useState("");

    const handleSidebarSelect = (id: string) => {
        setActiveItem(id);
        router.push(`/dashboard/${id}`);
    };

    return (
        <>
            <ModalProvider>
                <SidebarProvider>
                    <div className="flex w-full h-screen overflow-hidden">
                        <PlayerSidebar
                            onSelect={handleSidebarSelect}
                            activeItem={activeItem}
                            user={user}

                        />
                        <SidebarInset>
                            <ForYouNavbar />
                            <main className="flex-1 overflow-y-auto">
                                {children}
                            </main>
                        </SidebarInset>
                        <AudioPlayer />
                    </div>
                </SidebarProvider>
            </ModalProvider>
        </>
    );
}