"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BookOpen, 
  CreditCard, 
  Settings,
  Shield,
  LogOut,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  {
    title: "Overview",
    href: "/super-admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Organizations",
    href: "/super-admin/organizations",
    icon: Building2,
  },
  {
    title: "Financials",
    href: "/super-admin/financials",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/super-admin/settings",
    icon: Settings,
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 flex flex-col fixed h-full z-50">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Super <span className="text-blue-500">Admin</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10" 
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"
                )} />
                <span className="font-medium">{link.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <Button 
            variant="ghost" 
            onClick={() => signOut()}
            className="w-full justify-start text-neutral-400 hover:text-white hover:bg-red-500/10 hover:text-red-500 transition-all rounded-xl gap-3 px-4 py-3"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
