"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Clock,
  FlaskConical,
} from "lucide-react";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LabReport {
  id: string;
  title: string;
  experimentId: string;
  experimentTitle: string;
  aim: string;
  result: string;
  conclusion: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
}

export default function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/signin");
      return;
    }
    if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    const fetchReports = async () => {
      try {
        const res = await fetch(`/api/lab-reports?studentId=${studentId}`);
        if (!res.ok) throw new Error("Failed to load reports");
        const json = await res.json();
        setReports(json.reports);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [session, status, router, studentId]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] text-slate-200 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  const studentInfo = reports[0]?.user;

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <Link href="/dashboard">
          <Button
            variant="outline"
            size="sm"
            className="mb-6 border-slate-700 text-white hover:bg-slate-900"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Student Progress
          </h1>
          {studentInfo && (
            <p className="text-lg text-slate-400">
              {studentInfo.name ?? "Unnamed Student"} — {studentInfo.email}
            </p>
          )}
        </div>

        {reports.length === 0 ? (
          <Card className="border-slate-800/70 bg-slate-950/60 text-white backdrop-blur">
            <CardContent className="py-12 text-center">
              <FlaskConical className="mx-auto w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400">
                This student has not submitted any lab reports yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reports List */}
            <div className="lg:col-span-1 space-y-3">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
                {reports.length} Report{reports.length !== 1 ? "s" : ""}
              </p>
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full text-left rounded-xl border px-5 py-4 transition-colors ${
                    selectedReport?.id === report.id
                      ? "border-blue-500/50 bg-slate-900/60"
                      : "border-slate-800/50 bg-slate-900/30 hover:border-blue-500/30"
                  }`}
                >
                  <p className="font-semibold text-white text-sm">
                    {report.experimentTitle}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>

            {/* Report Detail */}
            <div className="lg:col-span-2">
              {selectedReport ? (
                <Card className="border-slate-800/70 bg-slate-950/60 text-white backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-400" />
                      {selectedReport.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Aim
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selectedReport.aim}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Result
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selectedReport.result}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Conclusion
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selectedReport.conclusion}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-slate-800/70 bg-slate-950/60 text-white backdrop-blur">
                  <CardContent className="py-16 text-center">
                    <p className="text-slate-500">
                      Select a report from the list to view details.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
