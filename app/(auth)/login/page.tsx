"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useForm } from "@tanstack/react-form";

import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      });
      if (error) {
        setServerError("بيانات الدخول غير صحيحة");
        return;
      }
      router.push("/");
      router.refresh();
    },
  });

  return (
    <Card className="w-full max-w-sm border-[rgba(201,168,76,0.3)] bg-[#0F1F3D]">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3">
          {/* Safwa logo SVG */}
          <svg width="48" height="48" viewBox="0 0 38 38" fill="none">
            <defs>
              <linearGradient
                id="sg"
                x1="0"
                y1="0"
                x2="38"
                y2="38"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#B8960C" />
                <stop offset="1" stopColor="#E8C84A" />
              </linearGradient>
            </defs>
            <line
              x1="19"
              y1="3"
              x2="19"
              y2="35"
              stroke="url(#sg)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="19"
              y1="12"
              x2="9"
              y2="4"
              stroke="url(#sg)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="19"
              y1="18"
              x2="9"
              y2="10"
              stroke="url(#sg)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="19"
              y1="24"
              x2="9"
              y2="16"
              stroke="url(#sg)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="19"
              y1="12"
              x2="29"
              y2="4"
              stroke="url(#sg)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="19"
              y1="18"
              x2="29"
              y2="10"
              stroke="url(#sg)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="19"
              y1="24"
              x2="29"
              y2="16"
              stroke="url(#sg)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="19" cy="2.5" r="2.5" fill="url(#sg)" />
          </svg>
        </div>
        <CardTitle className="bg-gradient-to-r from-[#C9A84C] to-[#E8C84A] bg-clip-text text-2xl font-bold text-transparent">
          الصفوة
        </CardTitle>
        <p className="text-sm text-[#8A9BB5]">نظام إدارة الأعمال</p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="email">
            {(field) => (
              <div className="space-y-1">
                <Label className="text-[#8A9BB5]">البريد الإلكتروني</Label>
                <Input
                  type="email"
                  dir="ltr"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border-[rgba(138,155,181,0.15)] bg-[rgba(10,22,40,0.6)] text-[#E8EDF5]"
                />
                {field.state.meta.errors?.[0] && (
                  <p className="text-xs text-red-400">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-1">
                <Label className="text-[#8A9BB5]">كلمة المرور</Label>
                <Input
                  type="password"
                  dir="ltr"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border-[rgba(138,155,181,0.15)] bg-[rgba(10,22,40,0.6)] text-[#E8EDF5]"
                />
                {field.state.meta.errors?.[0] && (
                  <p className="text-xs text-red-400">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          {serverError && <p className="text-sm text-red-400">{serverError}</p>}
          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#C9A84C] to-[#E8C84A] font-semibold text-[#0A1628] hover:opacity-90"
              >
                {isSubmitting ? "جاري الدخول..." : "دخول"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
