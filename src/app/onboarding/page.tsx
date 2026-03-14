"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, UserCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function OnboardingContent() {
  const { t } = useLanguage();
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const [error, setError] = useState<string | null>(null);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (status === "loading" || processed) return;

    if (!session) {
      router.push("/signin");
      return;
    }

    const updateRole = async () => {
      // If no role is provided or it's already set to something other than STUDENT (default), 
      // just redirect to dashboard
      if (!role || (role !== "TEACHER" && role !== "STUDENT" && role !== "OWNER")) {
        router.push("/dashboard");
        return;
      }

      try {
        const response = await fetch("/api/user/update-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        });

        if (!response.ok) {
          throw new Error(t('onboarding.error'));
        }

        // Force session update to reflect new role
        await update();
        setProcessed(true);
        router.push("/dashboard");
      } catch (err) {
        setError(t('onboarding.error'));
        console.error(err);
      }
    };

    updateRole();
  }, [session, status, role, router, update, processed]);

  if (error) {
    return (
      <div className="text-center p-6 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      <p className="text-slate-400 font-medium">{t('onboarding.finalizing')}</p>
    </div>
  );
}

export default function OnboardingPage() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-500" />
            {t('onboarding.title')}
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            {t('onboarding.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>}>
            <OnboardingContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
