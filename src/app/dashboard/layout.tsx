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
                <main className="p-4"> 
                    {children}
                </main>
            </div>
        </div>
    )
}