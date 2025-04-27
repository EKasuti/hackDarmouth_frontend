import { FloatingChatButton } from "../components/chatButton";
import { Sidebar } from "../components/sidebar";
import { UserDetails } from "../components/userDetails";

export default function DashboardLayout({ 
    children,
}: {
    children: React.ReactNode;
}){
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            <div className="flex flex-1 flex-col">
                {/* Navbar */}
                <header className="flex justify-end h-[60px] items-center gap-4 bg-white px-4 shadow-sm">
                    <UserDetails />
                </header>
                <main className="flex-1 overflow-auto p-4"> 
                    {children}
                </main>

                {/* Floating Chat Button */}
                <FloatingChatButton />
            </div>
        </div>
    )
}