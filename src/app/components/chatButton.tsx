'use client';

import { usePathname, useRouter } from "next/navigation";
import { Bot } from "lucide-react";

export function FloatingChatButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/dashboard/chat") {
    return null;
  }

  return (
    <button 
      onClick={() => router.push('/dashboard/chat')}
      className="fixed bottom-6 right-6 bg-[#01693E] hover:shadow-lg hover:scale-110 text-white rounded-full p-4 shadow-lg flex items-center justify-center z-50"
    >
      <Bot className="w-6 h-6" />
    </button>
  );
}
