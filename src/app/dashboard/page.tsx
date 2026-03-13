"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  FlaskConical,
  Building2,
  Plus,
  Loader2,
  ArrowRight,
  Clock,
  Link as LinkIcon,
} from "@/lib/icons";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Student {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  reportCount: number;
}

interface RecentReport {
  id: string;
  title: string;
  experimentTitle: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
}

interface DashboardData {
  organization: { id: string; name: string; slug: string } | null;
  students: Student[];
  recentReports: RecentReport[];
  stats: {
    totalStudents: number;
    totalReports: number;
    activeExperiments: number;
  };
}

export default function TeacherDashboard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create org state
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgDesc, setOrgDesc] = useState("");
  const [creatingOrg, setCreatingOrg] = useState(false);

  // Add member state
  const [memberEmail, setMemberEmail] = useState("");
  const [newMemberRole, setMemberRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [addingMember, setAddingMember] = useState(false);
  const [memberMessage, setMemberMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/signin");
      return;
    }
    if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
      router.push("/");
      return;
    }
    fetchDashboard();
  }, [session, status, router]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to load dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrg = async () => {
    if (!orgName.trim()) return;
    setCreatingOrg(true);
    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: orgName, description: orgDesc || undefined }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to create organization");
        return;
      }
      setShowCreateOrg(false);
      setOrgName("");
      setOrgDesc("");
      fetchDashboard();
      update();
    } catch {
      setError("Failed to create organization");
    } finally {
      setCreatingOrg(false);
    }
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim()) return;
    setAddingMember(true);
    setMemberMessage(null);
    try {
      const res = await fetch("/api/organizations/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: memberEmail, role: newMemberRole }),
      });
      const d = await res.json();
      if (!res.ok) {
        setMemberMessage(d.error ?? "Failed to add member");
        return;
      }
      setMemberMessage(`${memberEmail} added as ${newMemberRole.toLowerCase()}`);
      setMemberEmail("");
      fetchDashboard();
    } catch {
      setMemberMessage("Failed to add member");
    } finally {
      setAddingMember(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] text-slate-200 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            {session?.user?.role === "OWNER" ? "Owner" : "Teacher"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Dashboard
            </span>
          </h1>
          <p className="text-lg text-slate-400">
            Monitor student progress, manage your organization, and review lab reports.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-rose-400">
            {error}
          </div>
        )}

        {/* Organization Section */}
        {!data?.organization ? (
          <Card className="mb-12 border-slate-800/70 bg-slate-950/60 text-white backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Create Your School Organization
              </CardTitle>
              <CardDescription className="text-slate-400">
                Set up an organization to manage classes and track student progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showCreateOrg ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Organization name (e.g., Springfield High School)"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="bg-slate-900/60"
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={orgDesc}
                    onChange={(e) => setOrgDesc(e.target.value)}
                    className="bg-slate-900/60"
                  />
                  <div className="flex gap-3">
                    <Button onClick={handleCreateOrg} disabled={creatingOrg}>
                      {creatingOrg && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Organization
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-700 text-white hover:bg-slate-900"
                      onClick={() => setShowCreateOrg(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowCreateOrg(true)}>
                  <Plus className="mr-2 w-4 h-4" />
                  Create Organization
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-slate-800/70 bg-slate-950/60 text-white backdrop-blur">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{data.stats.totalStudents}</p>
                      <p className="text-sm text-slate-400">Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800/70 bg-slate-950/60 text-white backdrop-blur">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{data.stats.totalReports}</p>
                      <p className="text-sm text-slate-400">Lab Reports</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800/70 bg-slate-950/60 text-white backdrop-blur">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <FlaskConical className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{data.stats.activeExperiments}</p>
                      <p className="text-sm text-slate-400">Active Experiments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Organization Info + Add Member */}
            <Card className="mb-12 border-slate-800/70 bg-slate-950/60 text-white backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  {data.organization.name}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Add students and teachers to your organization by email.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="student@example.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="bg-slate-900/60 flex-1"
                  />
                  <Select
                    value={newMemberRole}
                    onValueChange={(v) => setMemberRole(v as "STUDENT" | "TEACHER")}
                  >
                    <SelectTrigger className="bg-slate-900/60 w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddMember} disabled={addingMember}>
                    {addingMember ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 w-4 h-4" />
                    )}
                    Add
                  </Button>
                  <Link href="/dashboard/teachers/invite">
                    <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                      <LinkIcon className="mr-2 w-4 h-4" />
                      Invite Link
                    </Button>
                  </Link>
                </div>
                {memberMessage && (
                  <p className="mt-3 text-sm text-slate-400">{memberMessage}</p>
                )}
              </CardContent>
            </Card>

            {/* Students List */}
            <Card className="mb-12 border-slate-800/70 bg-slate-950/60 text-white backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.students.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    No students yet. Add members above to get started.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between rounded-xl bg-slate-900/40 border border-slate-800/50 px-5 py-4 hover:border-blue-500/30 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-white">
                            {student.name ?? "Unnamed Student"}
                          </p>
                          <p className="text-sm text-slate-400">{student.email}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-400">
                              {student.reportCount}
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500">
                              Reports
                            </p>
                          </div>
                          <Link href={`/dashboard/student/${student.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-700 text-white hover:bg-slate-800"
                            >
                              View <ArrowRight className="ml-1 w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card className="border-slate-800/70 bg-slate-950/60 text-white backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Recent Lab Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.recentReports.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    No reports submitted yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.recentReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between rounded-xl bg-slate-900/40 border border-slate-800/50 px-5 py-4"
                      >
                        <div>
                          <p className="font-semibold text-white">{report.title}</p>
                          <p className="text-sm text-slate-400">
                            by {report.user.name ?? report.user.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
