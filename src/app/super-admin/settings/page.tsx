"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Settings, 
  Shield, 
  Bell, 
  Database,
  Lock,
  Mail,
  Smartphone
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user && (session.user.role as any) !== "SUPER_ADMIN")) {
      router.push("/signin");
    } else {
      setLoading(false);
    }
  }, [status, session, router]);

  if (loading) return null;

  return (
    <div className="p-8 pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-white">System <span className="text-blue-500">Settings</span></h2>
        <p className="text-neutral-400 mt-1">Configure platform defaults and administrative permissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
           <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest px-1">Categories</h3>
           <nav className="space-y-1">
              {[
                { label: "General", icon: Settings, active: true },
                { label: "Security", icon: Shield, active: false },
                { label: "Notifications", icon: Bell, active: false },
                { label: "Database", icon: Database, active: false },
              ].map((item, idx) => (
                <button 
                  key={idx}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    item.active ? "bg-white/10 text-white" : "text-neutral-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
           </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
           <Card className="bg-neutral-900 border-neutral-800">
             <CardHeader className="border-b border-neutral-800">
               <CardTitle className="text-lg">Security Preferences</CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white">Two-Factor Authentication</div>
                    <div className="text-xs text-neutral-500">Require 2FA for all administrative accounts.</div>
                  </div>
                  <div className="w-12 h-6 bg-blue-600/20 rounded-full relative border border-blue-500/20">
                     <div className="absolute top-1 left-1 w-4 h-4 bg-blue-500 rounded-full translate-x-6" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white">Session Timeout</div>
                    <div className="text-xs text-neutral-500">Automatic logout after 30 minutes of inactivity.</div>
                  </div>
                  <Button variant="ghost" className="text-blue-500 text-xs py-0 h-auto font-bold uppercase tracking-widest">Edit</Button>
                </div>
             </CardContent>
           </Card>

           <Card className="bg-neutral-900 border-neutral-800">
             <CardHeader className="border-b border-neutral-800">
               <CardTitle className="text-lg">Platform Defaults</CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="space-y-4 px-2 py-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-center">
                   <div>
                     <Lock className="w-8 h-8 text-neutral-600 mb-2 mx-auto" />
                     <p className="text-xs text-neutral-500 italic">Advanced platform settings are restricted to the primary system owner.</p>
                   </div>
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

