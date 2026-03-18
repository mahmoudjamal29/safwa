"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "./user-dropdown";

export function HeaderToolbar() {
  const t = useTranslations("layout.header");
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<"en" | "ar">("en");

  useEffect(() => {
    const cookieMatch = document.cookie.match(/NEXT_LOCALE=(en|ar)/);
    if (cookieMatch) {
      setCurrentLocale(cookieMatch[1] as "en" | "ar");
    }
  }, []);

  const switchLocale = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=lax`;
    router.refresh();
  };

  return (
    <nav className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => switchLocale(currentLocale === "en" ? "ar" : "en")}
      >
        {t("switchLanguage")}
      </Button>
      <UserDropdown />
    </nav>
  );
}
