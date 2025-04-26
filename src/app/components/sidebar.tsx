"use client"

import { Folder, Home, Key, NotebookPen, User, Users } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function Sidebar() {
    const pathname = usePathname()
    const navItems = [
        {title: "Dashboard", href: "/dashboard", icon: Home},
        {title: "Projects", href: "/dashboard/projects", icon: Folder},
        {title: "Members", href: "/dashboard/members", icon: Users},
        {title: "Profile", href: "/dashboard/profile", icon: User},
        {title: "Admin", href: "/dashboard/admin", icon: Key},
    ]
    return (
        <div className="flex h-full w-[80px] flex-col bg-black">
            {/* Logo */}
            <div className="flex h-[60px] item-center justify-center bg-[#01693E]">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <NotebookPen className="text-white"/>
                </Link>
            </div>

            {/* Sidebar Items */}
            <nav>
                <ul className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex flex-col h-[60px] w-full items-center justify-center transition",
                                    (item.href === "/dashboard" && pathname === item.href) || 
                                    (item.href !== "/dashboard" && pathname.startsWith(item.href))
                                        ? "bg-white text-black font-bold"
                                        : "bg-black text-white"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="text-xs mt-1">{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}