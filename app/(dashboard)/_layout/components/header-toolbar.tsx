"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { UserDropdown } from "./user-dropdown";

export function HeaderToolbar() {
  const t = useTranslations("layout.header");
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  const switchLocale = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=lax`;
    router.refresh();
  };

  const currentLocale = document.cookie.includes("NEXT_LOCALE=ar")
    ? "ar"
    : "en";

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
