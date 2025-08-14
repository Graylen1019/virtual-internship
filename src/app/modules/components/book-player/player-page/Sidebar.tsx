"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { HomeIcon, Bookmark, Pencil, Search, SettingsIcon, LogIn, HelpCircle, LogOut, LucideProps } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/app/lib/utils/firebase-client";
import { signOut, User } from "firebase/auth";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { useModal } from "@/app/context/modal-context";



interface BaseSidebarItem {
    id: string;
    label: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    disabled?: boolean;
}

interface NavSidebarItem extends BaseSidebarItem {
    href: string;
    action?: never;
}

interface ActionSidebarItem extends BaseSidebarItem {
    action?: () => void | Promise<void>;
    href?: never;
}

type SidebarItem = NavSidebarItem | ActionSidebarItem;

interface ForYouSidebarProps {
    onSelect: (id: string) => void;
    activeItem: string;
    user: User | null;
}

export const PlayerSidebar = ({ onSelect, activeItem, user }: ForYouSidebarProps) => {


    const { openSignInModal } = useModal()

    const sidebarItems: SidebarItem[] = [
        { id: 'for-you', label: 'For you', icon: HomeIcon, href: "/for-you" },
        { id: 'my-library', label: 'My Library', icon: Bookmark, href: "/my-library" },
        { id: 'highlights', label: 'Highlights', icon: Pencil, disabled: true, action: () => onSelect('highlights') },
        { id: 'search', label: 'Search', icon: Search, disabled: true, action: () => onSelect('search') },
    ];

    const authItem: SidebarItem = user
        ? {
            id: 'logout', label: 'Log Out', icon: LogIn, action: async () => {
                try {
                    await signOut(auth);
                } catch (error) {
                    console.error("Error signing out:", error);
                    alert("Failed to log out. Please try again.");
                }
            }
        }
        : { id: 'login', label: 'Login', icon: LogOut, action: openSignInModal };

    const footerItems: SidebarItem[] = [
        { id: 'settings', label: 'Settings', icon: SettingsIcon, href: "/settings" },
        { id: 'help-support', label: 'Help & Support', icon: HelpCircle, disabled: true, },
        authItem,
    ];

    return (
        <Sidebar className="max-w-[200px] border-none h-full">
            <SidebarHeader className="flex items-center justify-center h-[80px]">
                <Image width={160} height={60} className="my-1.5" src={"/assets/logo.png"} alt="logo" />
            </SidebarHeader>
            <SidebarContent className="flex-1">
                <SidebarGroup className="mt-5 space-y-2">
                    {sidebarItems.map((item) => {
                        const IconComponent = item.icon;
                        const commonClasses = `h-[56px] flex items-center gap-2 justify-start ${item.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"}`;
                        const iconSize = 23;

                        if (item.href) {
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={item.disabled ? (e) => e.preventDefault() : () => onSelect(item.id)}
                                    className={`${commonClasses} h-[56px]`}
                                    aria-disabled={item.disabled}
                                >
                                    {activeItem === item.id && (
                                        <div className="h-[56px] w-[5px] absolute left-0 bg-green-400" />
                                    )}
                                    <IconComponent className="ml-6" size={iconSize} /> <p className="text-base font-light">{item.label}</p>
                                </Link>
                            );
                        } else if (item.action) {
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={item.disabled ? undefined : item.action}
                                    className={`${commonClasses} w-full`}
                                    aria-disabled={item.disabled}
                                    disabled={item.disabled}
                                >
                                    <IconComponent className="ml-6" size={iconSize} /> <p className="text-base font-light">{item.label}</p>
                                </button>
                            );
                        } else {
                            return (
                                <div
                                    key={item.id}
                                    onClick={item.disabled ? undefined : () => onSelect(item.id)}
                                    className={commonClasses}
                                    aria-disabled={item.disabled}
                                >
                                    <IconComponent size={iconSize} /> <p className="text-lg font-light">{item.label}</p>
                                </div>
                            );
                        }
                    })}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="py-5 mb-20">
                <SidebarGroup className="space-y-2">
                    {footerItems.map((item) => {
                        const IconComponent = item.icon;
                        const commonClasses = `h-[56px] w-full flex items-center gap-2 ${item.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"}`;
                        const iconSize = 23;

                        if (item.href) {
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={item.disabled ? (e) => e.preventDefault() : () => onSelect(item.id)}
                                    className={commonClasses}
                                    aria-disabled={item.disabled}
                                >
                                    {activeItem === item.id && (
                                        <div className="h-[56px] w-[5px] absolute left-0 bg-green-400" />
                                    )}

                                    <IconComponent className="ml-6" size={iconSize} /> <p className="text-base font-light">{item.label}</p>
                                </Link>
                            );
                        } else if (item.action) {
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={item.disabled ? undefined : item.action}
                                    className={commonClasses}
                                    aria-disabled={item.disabled}
                                    disabled={item.disabled}
                                >
                                    <IconComponent className="ml-6" size={iconSize} /> <p className="text-base font-light">{item.label}</p>
                                </button>
                            );
                        } else {
                            return (
                                <div
                                    key={item.id}
                                    onClick={item.disabled ? undefined : () => onSelect(item.id)}
                                    className={commonClasses}
                                    aria-disabled={item.disabled}
                                >
                                    <IconComponent className="ml-6" size={iconSize} /> <p className="text-base font-light">{item.label}</p>
                                </div>
                            );
                        }
                    })}
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
};