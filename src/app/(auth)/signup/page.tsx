"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2, Eye, EyeOff, Zap } from "@/lib/icons";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getSignupSchema = (t: (key: string) => string) => z.object({
  fullName: z
    .string()
    .min(2, t('auth.signup.errors.nameMin'))
    .max(60, t('auth.signup.errors.nameMax')),
  email: z.string().email(t('auth.signup.errors.invalidEmail')),
  phone: z.string().optional(),
  password: z.string().min(8, t('auth.signup.errors.passwordLength')),
  confirmPassword: z.string().min(8, t('auth.signup.errors.confirmPasswordLength')),
  role: z.enum(["STUDENT", "TEACHER", "OWNER"]),
  intent: z.enum(["create", "join"]),
  organizationName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('auth.signup.errors.passwordMismatch'),
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.intent === "create" && (!data.organizationName || data.organizationName.trim() === "")) return false;
  return true;
}, {
  message: t('auth.signup.errors.orgNameRequired'),
  path: ["organizationName"],
});

type SignupValues = z.infer<ReturnType<typeof getSignupSchema>>;

export default function SignupPage() {
  const { t } = useLanguage();
  const signupSchema = getSignupSchema(t);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "STUDENT",
      intent: "create",
      organizationName: "",
    },
  });

  const intent = form.watch("intent");

  const onSubmit = async (values: SignupValues) => {
    setServerMessage(null);
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error ?? t('auth.signup.errors.signupFail'));
        return;
      }

      setServerMessage(
        data.message ??
          t('auth.signup.messages.success')
      );
      form.reset();
    } catch (error) {
      console.error(error);
      setServerError(t('auth.signup.errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setServerMessage(null);
    setServerError(null);
    const selectedRole = form.getValues("role");
    await signIn("google", { callbackUrl: `/onboarding?role=${selectedRole}` });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-16 text-slate-900">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">{t('auth.signup.title')}</h1>
          <p className="text-slate-500 font-medium">{t('auth.signup.description')}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Intent Toggle */}
            <FormField
              control={form.control}
              name="intent"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-slate-900 font-bold">{t('auth.signup.intent')}</FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        className={`flex-1 h-14 text-sm font-bold rounded-xl border-2 transition-all ${
                          field.value === "create"
                            ? "bg-slate-950 text-white border-slate-950 scale-[1.02]"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => field.onChange("create")}
                      >
                        {t('auth.signup.createOrg')}
                      </Button>
                      <Button
                        type="button"
                        className={`flex-1 h-14 text-sm font-bold rounded-xl border-2 transition-all ${
                          field.value === "join"
                            ? "bg-slate-950 text-white border-slate-950 scale-[1.02]"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => field.onChange("join")}
                      >
                        {t('auth.signup.joinOrg')}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organization Name - Conditional */}
            {intent === "create" && (
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 font-bold">{t('auth.signup.orgName')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('auth.signup.orgPlaceholder')}
                        className="h-14 bg-white border-slate-200 rounded-xl focus:ring-slate-950 focus:border-slate-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 font-bold">{t('auth.signup.fullName')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('auth.signup.fullNamePlaceholder')}
                        className="h-14 bg-white border-slate-200 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 font-bold">{t('auth.signup.email')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder={t('auth.signup.emailPlaceholder')}
                        className="h-14 bg-white border-slate-200 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 font-bold">{t('auth.signup.phone')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('auth.signup.phonePlaceholder')}
                      className="h-14 bg-white border-slate-200 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 font-bold">{t('auth.signup.password')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-14 bg-white border-slate-200 rounded-xl pr-12"
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400">
                      {t('auth.signup.passwordHint')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 font-bold">{t('auth.signup.confirmPassword')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-14 bg-white border-slate-200 rounded-xl pr-12"
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 font-bold">{t('auth.signup.role')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 bg-white border-slate-200 rounded-xl">
                        <SelectValue placeholder={t('auth.signup.rolePlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STUDENT">{t('auth.signup.student')}</SelectItem>
                      <SelectItem value="TEACHER">{t('auth.signup.teacher')}</SelectItem>
                      <SelectItem value="OWNER">{t('auth.signup.owner')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-16 text-lg font-black bg-slate-950 hover:bg-slate-800 text-white rounded-2xl shadow-xl shadow-slate-950/20 transition-all active:scale-[0.98]" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              )}
              {t('auth.signup.button')}
            </Button>
          </form>
        </Form>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {t('auth.signup.orContinue')}
            </span>
            <span className="h-px flex-1 bg-slate-100" />
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full h-14 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-all active:scale-[0.98]"
            onClick={handleGoogleSignUp}
          >
            <FcGoogle className="mr-3 h-6 w-6" />
            {t('auth.signup.google')}
          </Button>

          <p className="text-center text-sm font-medium text-slate-500">
            {t('auth.signup.alreadyHave')}{" "}
            <Link
              href="/signin"
              className="font-bold text-slate-950 hover:underline underline-offset-4"
            >
              {t('auth.signup.signin')}
            </Link>
          </p>
        </div>

        {serverMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700">
            <Zap className="w-5 h-5 fill-emerald-500 text-emerald-500" />
            <p className="text-sm font-bold">{serverMessage}</p>
          </div>
        )}

        {serverError && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700">
            <p className="text-sm font-bold">{serverError}</p>
          </div>
        )}
      </div>
    </div>
  );
}

