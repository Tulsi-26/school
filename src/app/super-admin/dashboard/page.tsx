"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  PauseCircle, 
  PlayCircle, 
  Search,
  LayoutDashboard,
  LogOut,
  AlertCircle,
  BarChart3,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface Organization {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [schools, setSchools] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user && (session.user.role as any) !== "SUPER_ADMIN")) {
      router.push("/signin");
    } else if (status === "authenticated") {
      Promise.all([fetchSchools(), fetchStats()]).finally(() => setLoading(false));
    }
  }, [status, session, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/super-admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await fetch("/api/super-admin/schools");
      if (!response.ok) throw new Error("Failed to fetch schools");
      const data = await response.json();
      setSchools(data);
    } catch (error) {
      toast.error("Could not load schools");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/super-admin/schools", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update status");
      }
      
      setSchools(schools.map(school => 
        school.id === id ? { ...school, isActive: !currentStatus } : school
      ));
      
      toast.success(`School ${!currentStatus ? 'started' : 'paused'} successfully`);
    } catch (error: any) {
      toast.error(error.message || "failed to update school status");
    }
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-8">
      {/* Page Title */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard <span className="text-blue-500">Overview</span></h2>
        <p className="text-neutral-400 mt-1">Global platform performance and organization metrics.</p>
      </div>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-neutral-900 border-neutral-800 shadow-sm hover:border-blue-500/50 transition-colors">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 text-neutral-400">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider">Total Schools</CardTitle>
              <Building2 className="w-4 h-4 opacity-50" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white">{stats?.totalSchools ?? schools.length ?? 0}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-neutral-900 border-neutral-800 shadow-sm hover:border-green-500/50 transition-colors">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 text-neutral-400">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider">Active</CardTitle>
              <PlayCircle className="w-4 h-4 text-green-500 opacity-50" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-green-500">{schools.filter(s => s.isActive).length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-neutral-900 border-neutral-800 shadow-sm hover:border-red-500/50 transition-colors">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 text-neutral-400">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider">Paused</CardTitle>
              <PauseCircle className="w-4 h-4 text-red-500 opacity-50" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-red-500">{schools.filter(s => !s.isActive).length}</div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 shadow-sm hover:border-purple-500/50 transition-colors">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 text-neutral-400">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider">Revenue Collection</CardTitle>
              <BarChart3 className="w-4 h-4 text-purple-500 opacity-50" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-purple-500">{stats?.collectionRate || 0}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col gap-2 border-neutral-800 hover:border-blue-500 group transition-all"
                onClick={() => router.push("/super-admin/organizations")}
              >
                <Building2 className="w-6 h-6 text-neutral-500 group-hover:text-blue-500" />
                <span>Manage Schools</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col gap-2 border-neutral-800 hover:border-green-500 group transition-all"
                onClick={() => router.push("/super-admin/financials")}
              >
                <CreditCard className="w-6 h-6 text-neutral-500 group-hover:text-green-500" />
                <span>Verify Payments</span>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", stats?.databaseStatus === "Operational" ? "bg-green-500" : "bg-red-500")} />
                    <span className="text-sm font-medium">Database Connection</span>
                  </div>
                  <span className={cn("text-xs font-bold", stats?.databaseStatus === "Operational" ? "text-green-500" : "text-red-500")}>
                    {stats?.databaseStatus || "Offline"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", stats?.authStatus === "Operational" ? "bg-green-500" : "bg-red-500")} />
                    <span className="text-sm font-medium">Authentication Service</span>
                  </div>
                  <span className={cn("text-xs font-bold", stats?.authStatus === "Operational" ? "text-green-500" : "text-red-500")}>
                    {stats?.authStatus || "Offline"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
