"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Users, 
  PlayCircle, 
  PauseCircle, 
  Calendar, 
  ArrowLeft,
  ChevronRight,
  CreditCard,
  BookOpen,
  PieChart,
  UserCheck,
  Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SchoolDetails {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  roleStats: {
    ADMIN: number;
    TEACHER: number;
    STUDENT: number;
    OWNER: number;
  };
  financials: {
    totalDue: number;
    totalPaid: number;
    totalPending: number;
  };
  _count: {
    members: number;
    projects: number;
    labReports: number;
  };
}

export default function OrganizationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [school, setSchool] = useState<SchoolDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user && (session.user.role as any) !== "SUPER_ADMIN")) {
      router.push("/signin");
    } else if (status === "authenticated") {
      fetchSchoolDetails();
    }
  }, [status, session, router, id]);

  const fetchSchoolDetails = async () => {
    try {
      const response = await fetch(`/api/super-admin/schools/${id}`);
      if (!response.ok) throw new Error("Failed to fetch details");
      const data = await response.json();
      setSchool(data);
    } catch (error) {
      toast.error("Could not load school details");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!school) return;
    try {
      const response = await fetch("/api/super-admin/schools", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: school.id, isActive: !school.isActive }),
      });

      if (!response.ok) throw new Error("Update failed");
      
      setSchool({ ...school, isActive: !school.isActive });
      toast.success(`School ${!school.isActive ? 'started' : 'paused'} successfully`);
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  if (loading) {
    return <div className="p-20 flex justify-center items-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (!school) return <div className="p-20 text-center">Not found</div>;

  return (
    <div className="p-8 pb-20">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/super-admin/organizations")}
            className="text-neutral-400 hover:text-white group px-0 h-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Organizations
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black text-white">{school.name}</h2>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  school.isActive ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                )}>
                  {school.isActive ? "Active" : "Paused"}
                </span>
              </div>
              <p className="text-neutral-500 font-mono text-sm leading-none">{school.slug}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={toggleStatus}
            className={cn(
              "shadow-lg transition-all h-12 px-6 rounded-xl font-bold gap-2",
              school.isActive 
                ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
            )}
          >
            {school.isActive ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
            {school.isActive ? "Pause School" : "Start School"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metrics and Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-neutral-900 border-neutral-800 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Education</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Total Labs</span>
                  <span className="text-lg font-bold text-white">{school._count.labReports}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Active Projects</span>
                  <span className="text-lg font-bold text-white">{school._count.projects}</span>
                </div>
              </div>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Members</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Total Registered</span>
                  <span className="text-lg font-bold text-white">{school._count.members}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Creation Date</span>
                  <span className="text-sm font-medium text-white">{new Date(school.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-600/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Finance</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Paid Fees</span>
                  <span className="text-lg font-bold text-green-500">${school.financials.totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Pending</span>
                  <span className="text-lg font-bold text-red-500">${school.financials.totalPending.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* User Role Breakdown UI */}
          <Card className="bg-neutral-900 border-neutral-800 overflow-hidden">
            <CardHeader className="border-b border-neutral-800 bg-neutral-950/20">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-500" />
                Organization Member Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-3xl font-black text-white mb-1">{school.roleStats.STUDENT}</div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Students</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-3xl font-black text-white mb-1">{school.roleStats.TEACHER}</div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-blue-400">Teachers</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-3xl font-black text-white mb-1">{school.roleStats.ADMIN}</div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-purple-400">Admins</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-3xl font-black text-white mb-1">{school.roleStats.OWNER}</div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-amber-500">Owners</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Status & Warnings */}
        <div className="space-y-8">
          <Card className="bg-neutral-900 border-neutral-800 p-6 overflow-hidden relative">
             {/* Gradient Shine */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20" />
             
             <CardTitle className="text-lg mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                School Activity
             </CardTitle>
             
             <div className="space-y-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
                   <UserCheck className="w-6 h-6 text-green-500" />
                 </div>
                 <div>
                   <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Registration</div>
                   <div className="text-sm font-medium text-white">Created on {new Date(school.createdAt).toDateString()}</div>
                 </div>
               </div>

               <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl text-xs text-neutral-400 leading-relaxed">
                 This organization is currently <strong className="text-blue-400">{school.isActive ? 'Active' : 'Paused' }</strong>. 
                 When paused, members will be redirected to the "Access Restricted" gate until access is manually restored.
               </div>

               <div className="pt-4 border-t border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Server Load</span>
                    <span className="text-xs text-green-500 font-bold">Stable</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[24%]" />
                  </div>
               </div>
             </div>
          </Card>

          <Card className="bg-red-500/5 border-red-500/10 p-6">
             <CardTitle className="text-lg mb-4 flex items-center gap-2 text-red-500/80">
                <Ban className="w-5 h-5" />
                Management Controls
             </CardTitle>
             <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
               Pausing a school prevents students from accessing their virtual labs and projects. 
               Use this primarily for overdue payments or policy violations.
             </p>
             <Button 
                variant="outline" 
                className="w-full border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest h-11"
                onClick={toggleStatus}
              >
                {school.isActive ? 'Deactivate School' : 'Activate School'}
             </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
