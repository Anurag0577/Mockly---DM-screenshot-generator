"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState(() => {
    // ✅ Try to load previously saved theme from localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  // ✅ Apply theme to <html> element whenever it changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div>
      <Toggle
        variant="outline"
        className="group size-9 relative data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted"
        pressed={theme === "dark"}
        onPressedChange={() =>
          setTheme((prev) => (prev === "dark" ? "light" : "dark"))
        }
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {/* 🌙 Moon for dark mode */}
        <MoonIcon
          size={16}
          className="shrink-0 scale-0 opacity-0 transition-all duration-300 group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100 text-white"
          aria-hidden="true"
        />

        {/* ☀️ Sun for light mode */}
        <SunIcon
          size={16}
          className="absolute shrink-0 scale-100 opacity-100 transition-all duration-300 group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  );
}

