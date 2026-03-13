"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  PauseCircle, 
  PlayCircle, 
  Search,
  AlertCircle,
  ChevronRight,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Organization {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    members: number;
    projects: number;
    labReports: number;
  };
}

export default function OrganizationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [schools, setSchools] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user && (session.user.role as any) !== "SUPER_ADMIN")) {
      router.push("/signin");
    } else if (status === "authenticated") {
      fetchSchools();
    }
  }, [status, session, router]);

  const fetchSchools = async () => {
    try {
      const response = await fetch("/api/super-admin/schools");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch" }));
        throw new Error(errorData.error || "Internal Server Error");
      }
      const data = await response.json();
      setSchools(data);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error("Detailed API Error:", error);
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
    return <div className="flex items-center justify-center p-20">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Manage <span className="text-blue-500">Organizations</span></h2>
          <p className="text-neutral-400 mt-1">Monitor and control all registered schools on the platform.</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-neutral-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-900/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input 
              placeholder="Search by name or slug..." 
              className="pl-10 bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus:ring-blue-500 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-neutral-500 text-xs uppercase tracking-widest border-b border-neutral-800 bg-neutral-950/30">
                <th className="px-6 py-4 font-semibold">Organization</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Members</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center border border-neutral-700 group-hover:border-blue-500/50 transition-colors">
                        <Building2 className="w-5 h-5 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div>
                        <div className="font-bold text-white leading-none mb-1">{school.name}</div>
                        <div className="text-xs text-neutral-500">ID: {school.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-400 font-mono text-sm">{school.slug}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{school._count?.members || 0} Members</span>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-tighter">Registered Users</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {school.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                        Paused
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-neutral-400 hover:text-white hover:bg-white/5 gap-2 h-9"
                        onClick={() => router.push(`/super-admin/organizations/${school.id}`)}
                      >
                        Details
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-4 bg-neutral-800 mx-1" />
                      {school.isActive ? (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:bg-red-500/10 h-9"
                          onClick={() => toggleStatus(school.id, school.isActive)}
                        >
                          <PauseCircle className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-green-500 hover:bg-green-500/10 h-9"
                          onClick={() => toggleStatus(school.id, school.isActive)}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSchools.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center text-neutral-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-neutral-800/50 rounded-full flex items-center justify-center mb-2">
                        <AlertCircle className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="text-lg font-medium text-neutral-400">No organizations found</p>
                      <p className="text-sm max-w-xs mx-auto">Try adjusting your search query or check if there are any registered schools.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
