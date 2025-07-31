// components/ForYou.tsx
"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { HomeIcon, Bookmark, Pencil, Search, SettingsIcon, LogIn, HelpCircle, LogOut, LucideProps } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/app/lib/utils/firebase-client";
import { signOut, User } from "firebase/auth";
import { ForwardRefExoticComponent, RefAttributes } from "react";

// --- NEW INTERFACES FOR SIDEBAR ITEMS ---
interface BaseSidebarItem {
    id: string;
    label: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    disabled?: boolean;
}

interface NavSidebarItem extends BaseSidebarItem {
    href: string;
    action?: never; // Explicitly state that href items don't have an action
}

interface ActionSidebarItem extends BaseSidebarItem {
    action: () => void | Promise<void>;
    href?: never; // Explicitly state that action items don't have an href
}

type SidebarItem = NavSidebarItem | ActionSidebarItem;

interface ForYouSidebarProps {
    onSelect: (id: string) => void;
    activeItem: string;
    user: User | null;
}

export const ForYouSidebar = ({ onSelect, activeItem, user }: ForYouSidebarProps) => {

    const sidebarItems: SidebarItem[] = [
        { id: 'for-you', label: 'For you', icon: HomeIcon, href: "/for-you" },
        { id: 'my-library', label: 'My Library', icon: Bookmark, href: "/my-library" },
        // For items that trigger a content switch on the same page, give them an 'action'
        // and ensure no 'href'. This maps to the ActionSidebarItem type.
        { id: 'highlights', label: 'Highlights', icon: Pencil, disabled: true, action: () => onSelect('highlights') },
        { id: 'search', label: 'Search', icon: Search, disabled: true, action: () => onSelect('search') },
    ];

    const authItem: SidebarItem = user
        ? {
            id: 'logout', label: 'Log Out', icon: LogOut, action: async () => {
                try {
                    await signOut(auth);
                    // Redirect after successful logout
                    window.location.href = '/sign-in'; // Using window.location.href for full reload to clear state
                } catch (error) {
                    console.error("Error signing out:", error);
                    alert("Failed to log out. Please try again.");
                }
            }
        }
        : { id: 'login', label: 'Log In', icon: LogIn, href: '/sign-in' }; // Login is a navigation link

    const footerItems: SidebarItem[] = [
        { id: 'settings', label: 'Settings', icon: SettingsIcon, href: "/settings" },
        { id: 'help-support', label: 'Help & Support', icon: HelpCircle, action: () => alert("Help & Support is coming soon!") },
        authItem,
    ];

    return (
        <Sidebar className="max-w-[200px] border-none">
            <SidebarHeader className="flex items-center justify-center h-[80px]">
                <Image width={160} height={60} className="my-1.5" src={"/assets/logo.png"} alt="logo" />
            </SidebarHeader>
            <SidebarContent className="flex-1">
                <SidebarGroup className="mt-6 space-y-2">
                    {sidebarItems.map((item) => {
                        const IconComponent = item.icon;
                        const commonClasses = `h-[56px] flex items-center gap-2 p-2 rounded-md ${activeItem === item.id ? 'bg-blue-100 text-blue-700 font-semibold' : ''
                            } ${item.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"}`;
                        const iconSize = 24; // Default icon size for main sidebar items

                        if (item.href) {
                            // Render as Link if it has an href
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    // onClick here is primarily for setting active state,
                                    // navigation is handled by Link.
                                    // If you want to prevent navigation for disabled items, handle here too.
                                    onClick={item.disabled ? (e) => e.preventDefault() : () => onSelect(item.id)}
                                    className={commonClasses}
                                    aria-disabled={item.disabled}
                                >
                                    <IconComponent size={iconSize} /> <p className="text-lg font-light">{item.label}</p>
                                </Link>
                            );
                        } else if (item.action) {
                            // Render as button if it has an action but no href
                            return (
                                <button
                                    key={item.id}
                                    type="button" // Explicitly set to 'button' literal
                                    onClick={item.disabled ? undefined : item.action} // Action only if not disabled
                                    className={`${commonClasses} w-full`} // Buttons often need full width
                                    aria-disabled={item.disabled}
                                    disabled={item.disabled} // Native disabled prop for buttons
                                >
                                    <IconComponent size={iconSize} /> <p className="text-lg font-light">{item.label}</p>
                                </button>
                            );
                        } else {
                            // Fallback to div if no href and no action (e.g., purely decorative)
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
            <SidebarFooter className="py-4">
                <SidebarGroup className="space-y-2">
                    {footerItems.map((item) => {
                        const IconComponent = item.icon;
                        const commonClasses = `h-[56px] w-full flex items-center gap-2 p-2 rounded-md ${activeItem === item.id ? 'bg-blue-100 text-blue-700 font-semibold' : ''
                            } ${item.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"}`;
                        const iconSize = 22; // Default icon size for footer items (adjust as needed)

                        if (item.href) {
                            // Render as Link if it has an href
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={item.disabled ? (e) => e.preventDefault() : () => onSelect(item.id)}
                                    className={commonClasses}
                                    aria-disabled={item.disabled}
                                >
                                    <IconComponent size={iconSize} /> <p className="text-lg font-light">{item.label}</p>
                                </Link>
                            );
                        } else if (item.action) {
                            // Render as button if it has an action but no href
                            return (
                                <button
                                    key={item.id}
                                    type="button" // Explicitly set to 'button' literal
                                    onClick={item.disabled ? undefined : item.action} // Action only if not disabled
                                    className={commonClasses}
                                    aria-disabled={item.disabled}
                                    disabled={item.disabled} // Native disabled prop for buttons
                                >
                                    <IconComponent size={iconSize} /> <p className="text-lg font-light">{item.label}</p>
                                </button>
                            );
                        } else {
                            // Fallback to div
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
            </SidebarFooter>
        </Sidebar>
    );
};