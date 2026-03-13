"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Lock, AlertTriangle, CreditCard, School, LogOut } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OrganizationStatusGuardProps {
  children: React.ReactNode;
}

export const OrganizationStatusGuard = ({ children }: OrganizationStatusGuardProps) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      // 1. ALWAYS ALLOW SUPER ADMIN PANEL
      const isSuperAdminPath = pathname.startsWith("/super-admin");
      if (isSuperAdminPath) {
        setIsActive(true);
        setLoading(false);
        return;
      }

      // 2. ALWAYS ALLOW AUTH FLOW PAGES (Necessary for login/fix)
      const isAuthPath = pathname.startsWith("/signin") || 
                        pathname.startsWith("/signup") ||
                        pathname.startsWith("/verify-email") ||
                        pathname.startsWith("/onboarding");
      
      if (isAuthPath) {
        setIsActive(true);
        setLoading(false);
        return;
      }

      // 3. ROLE-BASED BYPASS
      // Always allow Super Admins to bypass guards everywhere else
      if (session?.user?.role === "SUPER_ADMIN") {
        setIsActive(true);
        setLoading(false);
        return;
      }

      // 4. LANDING PAGE & GUEST ACCESS
      const isLandingPage = pathname === "/" || 
                           pathname.startsWith("/pricing") || 
                           pathname.startsWith("/solutions") ||
                           pathname.startsWith("/docs");

      // If it's a landing/public page and user is NOT logged in, allow
      if (isLandingPage && !session?.user) {
        setIsActive(true);
        setLoading(false);
        return;
      }

      // 5. ORGANIZATION STATUS CHECK (For logged-in users)
      if (session?.user?.organizationId) {
        try {
          const res = await fetch(`/api/organization/status?id=${session.user.organizationId}`);
          if (res.ok) {
            const data = await res.json();
            console.log("[StatusGuard] Status for", session.user.organizationId, ":", data);
            setIsActive(data.isActive);
          }
        } catch (error) {
          console.error("[StatusGuard] Failed to check org status", error);
          setIsActive(true); // Fail open on network error to avoid trapping users
        } finally {
          setLoading(false);
        }
      } else {
        // Logged in but no org (e.g. fresh account), allow
        setIsActive(true);
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      checkStatus();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setIsActive(true);
    }
  }, [session, status, pathname]);

  if (loading) return null;

  if (isActive === false) {
    const isOperator = session?.user?.role === "ADMIN" || session?.user?.role === "TEACHER";

    return (
      <div className="fixed inset-0 z-[100] bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-neutral-800 bg-neutral-900 text-white overflow-hidden shadow-2xl">
          <div className="h-2 bg-red-500" />
          <CardHeader className="text-center pt-8">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Access Restricted</CardTitle>
            <CardDescription className="text-neutral-400 mt-2">
              {isOperator 
                ? "Your organization (school) stop due to the payment" 
                : "Your school is pause due to some reason"}
              </CardDescription>
          </CardHeader>
          <CardContent className="pb-4 text-center">
            {isOperator ? (
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-neutral-800/50 rounded-xl border border-neutral-700 flex items-start gap-3 text-left">
                  <CreditCard className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-300">Please contact the platform administrator to resolve payment issues and restore access.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                 <div className="p-4 bg-neutral-800/50 rounded-xl border border-neutral-700 flex items-start gap-3 text-left">
                  <School className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-300">Please contact your school administrator for more information regarding this pause.</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center pb-8 pt-2">
            <Button 
              variant="outline" 
              onClick={() => signOut()}
              className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
