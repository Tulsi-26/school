"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User, Mail, Phone, Briefcase, MapPin, AlignLeft, CheckCircle2, School, Copy } from "@/lib/icons";
import { toast } from "sonner";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const profileSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [schoolCode, setSchoolCode] = useState<string | null>(null);
   const [schoolName, setSchoolName] = useState<string | null>(null);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      address: "",
      bio: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          const roleMap: Record<string, string> = {
            OWNER: "School Owner",
            TEACHER: "Teacher",
            STUDENT: "Student",
            ADMIN: "Admin",
          };
          
            form.reset({
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
              position: data.position || roleMap[data.role] || "",
              address: data.address || "",
              bio: data.bio || "",
            });
            setSchoolCode(data.schoolCode);
            setSchoolName(data.schoolName);
          }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  const onSubmit = async (values: ProfileValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        // Update session name if changed
        if (values.name !== session?.user?.name) {
          await update({ name: values.name });
        }
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-slate-400">Manage your personal information and preferences.</p>
        </div>

        <Card className="border-slate-800/70 bg-slate-950/60 text-white backdrop-blur shadow-2xl">
          <CardHeader className="border-b border-slate-800/50 pb-8">
            <CardTitle className="text-xl flex items-center gap-2">
              Personal Information
            </CardTitle>
            <CardDescription className="text-slate-500">
              Update your basic details and how others see you in the school.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Full Name *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input {...field} className="bg-slate-900/50 border-slate-800 pl-10 h-12 focus:ring-blue-500/20" />
                          </div>
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
                        <FormLabel className="text-slate-300">Email Address *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input {...field} disabled className="bg-slate-900/30 border-slate-800/50 pl-10 h-12 text-slate-500 cursor-not-allowed" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input {...field} value={field.value || ""} placeholder="Enter phone number" className="bg-slate-900/50 border-slate-800 pl-10 h-12" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* School Name */}
                  <div className="space-y-2">
                    <FormLabel className="text-slate-300">School Name</FormLabel>
                    <div className="relative">
                      <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        value={schoolName || "Not affiliated"} 
                        readOnly 
                        className="bg-slate-900/30 border-slate-800 pl-10 h-12 text-slate-400 cursor-default" 
                      />
                    </div>
                  </div>
                </div>

                {/* Position */}
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Position</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <Input {...field} value={field.value || ""} placeholder="e.g. Head of Physics" className="bg-slate-900/50 border-slate-800 pl-10 h-12" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* School Code */}
                <div className="md:col-span-1">
                  <FormLabel className="text-slate-300">School Code</FormLabel>
                  <div className="mt-2 flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-500">ID</span>
                      </div>
                      <Input 
                        value={schoolCode || "Not affiliated"} 
                        readOnly 
                        className="bg-slate-900/30 border-slate-800 pl-10 h-12 text-slate-400 cursor-default" 
                      />
                    </div>
                    {schoolCode && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-12 border-slate-800 text-slate-300 hover:bg-slate-800" 
                        onClick={() => { 
                          navigator.clipboard.writeText(schoolCode); 
                          toast.success("School code copied!"); 
                        }}
                      >
                         <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Use this code to invite others to your school.</p>
                </div>

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-4 w-4 h-4 text-slate-500" />
                          <Textarea {...field} value={field.value || ""} placeholder="Enter your full school address..." className="bg-slate-900/50 border-slate-800 pl-10 min-h-[100px] py-3" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Bio</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <AlignLeft className="absolute left-3 top-4 w-4 h-4 text-slate-500" />
                          <Textarea {...field} value={field.value || ""} placeholder="Tell us about yourself..." className="bg-slate-900/50 border-slate-800 pl-10 min-h-[120px] py-3" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSubmitting} className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
