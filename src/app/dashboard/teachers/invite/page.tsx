"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UserPlus, Copy, Check, Link as LinkIcon } from "@/lib/icons";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["TEACHER", "ADMIN"]),
});

type InviteValues = z.infer<typeof inviteSchema>;

export default function InviteTeacherPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "TEACHER",
    },
  });

  const onSubmit = async (values: InviteValues) => {
    setIsSubmitting(true);
    setInviteLink(null);

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation");
      }

      setInviteLink(data.inviteLink);
      toast.success("Invitation created successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <Card className="border-slate-800 bg-slate-900 text-slate-100">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-500 uppercase tracking-wider">Administration</span>
          </div>
          <CardTitle className="text-2xl">Invite School Staff</CardTitle>
          <CardDescription className="text-slate-400">
            Send an email invitation to teachers and staff members to join your school.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!inviteLink ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="teacher@school.com" 
                          {...field} 
                          className="bg-slate-800 border-slate-700 text-slate-100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                          <SelectItem value="TEACHER">Teacher</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Invitation...
                    </>
                  ) : (
                    "Send Invitation Email"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
                <p className="text-sm text-emerald-400 font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" /> Invitation sent!
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  An email invitation has been sent to {form.getValues().email}. They can also join using the link below.
                </p>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-md p-2 text-sm text-slate-300 font-mono truncate">
                  {inviteLink}
                </div>
                <Button variant="outline" size="icon" onClick={copyToClipboard} className="border-slate-700 hover:bg-slate-800 text-slate-100">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full text-slate-400 hover:text-white"
                onClick={() => {
                  setInviteLink(null);
                  form.reset();
                }}
              >
                Send another invitation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
