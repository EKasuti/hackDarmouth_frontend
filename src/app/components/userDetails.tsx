"use client"

import { LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

export function UserDetails() {
    const { data: session } = useSession();

    const user = session?.user

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button 
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#01693E] text-sm font-medium text-white"
                    aria-label="User menu"
                >
                    {user?.image && (
                        <Image
                            src={user.image}
                            alt={user.name || user.email || "User avatar"}
                            className="h-8 w-8 rounded-full object-cover"
                            width={32}
                            height={32}
                        />
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] bg-white">
                <div className="px-4 py-2">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">{user?.email}</p>
                </div>
                <DropdownMenuItem 
                    onSelect={handleLogout}
                    className="text-red-600 cursor-pointer focus:bg-red-50"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}