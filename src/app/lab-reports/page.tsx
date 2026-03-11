"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Loader2,
  Clock,
  FlaskConical,
  ChevronDown,
  ChevronUp,
} from "@/lib/icons";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
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
  apparatus: string[];
  theory: string;
  observations: Record<string, unknown>[];
  calculations: string | null;
  result: string;
  conclusion: string;
  createdAt: string;
}

export default function LabReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/signin");
      return;
    }

    const fetchReports = async () => {
      try {
        const res = await fetch("/api/lab-reports");
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
  }, [session, status, router]);

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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            My Lab{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Reports
            </span>
          </h1>
          <p className="text-lg text-slate-400">
            View your automatically generated lab reports from completed experiments.
          </p>
        </div>

        {reports.length === 0 ? (
          <Card className="border-slate-800/70 bg-slate-950/60 text-white backdrop-blur">
            <CardContent className="py-16 text-center">
              <FlaskConical className="mx-auto w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400 mb-2">No lab reports yet.</p>
              <p className="text-sm text-slate-500">
                Complete experiments in the Physics Lab to generate reports automatically.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const isExpanded = expandedId === report.id;
              return (
                <Card
                  key={report.id}
                  className="border-slate-800/70 bg-slate-950/60 text-white backdrop-blur"
                >
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : report.id)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="w-5 h-5 text-purple-400" />
                        {report.title}
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-6 border-t border-slate-800/50 pt-6">
                      <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                          Aim
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {report.aim}
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                          Apparatus
                        </h3>
                        <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                          {report.apparatus.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                          Theory
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {report.theory}
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                          Observations
                        </h3>
                        {Array.isArray(report.observations) &&
                        report.observations.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead>
                                <tr className="border-b border-slate-800">
                                  <th className="px-3 py-2 text-slate-500 font-medium">
                                    #
                                  </th>
                                  {Object.keys(report.observations[0])
                                    .filter((k) => k !== "timestamp")
                                    .map((key) => (
                                      <th
                                        key={key}
                                        className="px-3 py-2 text-slate-500 font-medium capitalize"
                                      >
                                        {key}
                                      </th>
                                    ))}
                                </tr>
                              </thead>
                              <tbody>
                                {report.observations.map((obs, i) => (
                                  <tr
                                    key={i}
                                    className="border-b border-slate-800/50"
                                  >
                                    <td className="px-3 py-2 text-slate-400">
                                      {i + 1}
                                    </td>
                                    {Object.entries(obs)
                                      .filter(([k]) => k !== "timestamp")
                                      .map(([key, val]) => (
                                        <td
                                          key={key}
                                          className="px-3 py-2 text-slate-300"
                                        >
                                          {String(val)}
                                        </td>
                                      ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-slate-500 text-sm">
                            No observations recorded.
                          </p>
                        )}
                      </section>

                      {report.calculations && (
                        <section>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                            Calculations
                          </h3>
                          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {report.calculations}
                          </p>
                        </section>
                      )}

                      <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                          Result
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {report.result}
                        </p>
                      </section>

                      <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                          Conclusion
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {report.conclusion}
                        </p>
                      </section>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
