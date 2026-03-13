"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  CreditCard, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function FinancialsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user && (session.user.role as any) !== "SUPER_ADMIN")) {
      router.push("/signin");
    } else if (status === "authenticated") {
      fetchStats();
    }
  }, [status, session, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/super-admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="p-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-white">Financial <span className="text-blue-500">Analytics</span></h2>
        <p className="text-neutral-400 mt-1">Platform-wide revenue, collections, and pending dues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white mb-1">${(stats?.totalRevenue || 0).toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Pending Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white mb-1">${(stats?.totalPending || 0).toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white mb-1">{stats?.collectionRate || 0}%</div>
            <div className="h-1.5 w-full bg-neutral-800 rounded-full mt-2 overflow-hidden">
               <div className="h-full bg-blue-500" style={{ width: `${stats?.collectionRate || 0}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Active Trials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white mb-1">{stats?.activeTrials || 0}</div>
            <div className="text-xs text-neutral-500">Organizations in trial phase</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="p-6 border-b border-neutral-800 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <div className="flex gap-3">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
               <Input className="pl-10 h-9 bg-neutral-950 border-neutral-800 w-64" placeholder="Search transactions..." />
             </div>
             <Button variant="outline" size="sm" className="border-neutral-800 h-9">
               <Filter className="w-4 h-4 mr-2" />
               Filters
             </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="text-neutral-500 text-[10px] uppercase tracking-widest border-b border-neutral-800 bg-neutral-950/20">
                <th className="px-6 py-4 font-semibold">School</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {(stats?.recentTransactions || []).map((tx: any, idx: number) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{tx.school}</td>
                  <td className="px-6 py-4 text-neutral-400 text-sm">{tx.type}</td>
                  <td className="px-6 py-4 font-bold text-white">${tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-neutral-500 text-sm">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      tx.status === "PAID" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!stats?.recentTransactions || stats.recentTransactions.length === 0) && (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 italic text-sm">
                     No recent transactions found.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
