"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2 } from "@/lib/icons";
import { FcGoogle } from "react-icons/fc";
import { useLanguage } from "@/context/LanguageContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type SigninValues = z.infer<ReturnType<typeof getSigninSchema>>;
type PendingAction = "signin" | "forgot" | "resend" | null;

const getSigninSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('auth.signin.errors.invalidEmail')),
  password: z.string().min(8, t('auth.signin.errors.passwordLength')),
});

export default function SigninPage() {
  const { t } = useLanguage();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const router = useRouter();

  const signinSchema = getSigninSchema(t);

  const form = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const runAction = async (action: PendingAction, fn: () => Promise<void>) => {
    setPendingAction(action);
    try {
      await fn();
    } catch (error) {
      console.error(error);
      setServerError(t('auth.signin.errors.generic'));
    } finally {
      setPendingAction(null);
    }
  };

  const handleSubmit = async (values: SigninValues) => {
    setServerMessage(null);
    setServerError(null);

    await runAction("signin", async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError(result.error);
        return;
      }

      setServerMessage(t('auth.signin.messages.signinSuccess'));
      form.reset({ email: values.email, password: "" });
      router.push("/");
    });
  };

  const handleGoogleSignIn = async () => {
    setServerMessage(null);
    setServerError(null);
    await signIn("google", { callbackUrl: "/" });
  };

  const triggerForgotPassword = async () => {
    setServerMessage(null);
    setServerError(null);
    const email = form.getValues("email");

    if (!email) {
      setServerError(t('auth.signin.errors.missingEmail'));
      return;
    }

    await runAction("forgot", async () => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error ?? t('auth.signin.errors.forgotFail'));
        return;
      }

      setServerMessage(
        data.message ?? t('auth.signin.messages.resetSent')
      );
    });
  };

  const triggerResendVerification = async () => {
    setServerMessage(null);
    setServerError(null);
    const email = form.getValues("email");

    if (!email) {
      setServerError(t('auth.signin.errors.missingEmail'));
      return;
    }

    await runAction("resend", async () => {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error ?? t('auth.signin.errors.resendFail'));
        return;
      }

      setServerMessage(
        data.message ?? t('auth.signin.messages.resendSent')
      );
    });
  };

  const isPending = (action: PendingAction) => pendingAction === action;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#0f172a,_#020617)] px-4 py-12 text-white">
      <Card className="w-full max-w-md border-slate-800/70 bg-slate-950/60 text-white backdrop-blur">
        <CardHeader>
          <CardTitle>{t('auth.signin.title')}</CardTitle>
          <CardDescription className="text-slate-400">
            {t('auth.signin.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.signin.email')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder={t('auth.signin.emailPlaceholder')}
                        className="bg-slate-900/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.signin.password')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="current-password"
                        placeholder={t('auth.signin.passwordPlaceholder')}
                        className="bg-slate-900/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isPending("signin")}
              >
                {isPending("signin") && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t('auth.signin.button')}
              </Button>
            </form>
          </Form>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-slate-800" />
              <span className="text-xs uppercase tracking-widest text-slate-500">
                {t('auth.signin.or')}
              </span>
              <span className="h-px flex-1 bg-slate-800" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-700 bg-transparent text-white hover:bg-slate-900"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              {t('auth.signin.google')}
            </Button>
          </div>

          <div className="space-y-2 text-sm">
            <button
              type="button"
              onClick={triggerForgotPassword}
              className="text-slate-300 transition hover:text-white"
              disabled={isPending("forgot")}
            >
              {isPending("forgot") ? t('auth.signin.sendingReset') : t('auth.signin.forgotPassword')}
            </button>
            <button
              type="button"
              onClick={triggerResendVerification}
              className="text-slate-300 transition hover:text-white"
              disabled={isPending("resend")}
            >
              {isPending("resend")
                ? t('auth.signin.resending')
                : t('auth.signin.resendEmail')}
            </button>
          </div>

          {serverMessage && (
            <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
              {serverMessage}
            </p>
          )}

          {serverError && (
            <p className="rounded-md bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
              {serverError}
            </p>
          )}

          <p className="text-center text-sm text-slate-400">
            {t('auth.signin.needAccount')}{" "}
            <Link
              href="/signup"
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              {t('auth.signin.createOne')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

