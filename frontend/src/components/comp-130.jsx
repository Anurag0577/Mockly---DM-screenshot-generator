import { useEffect } from "react"; // Removed useState
import { MoonIcon, SunIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import usePreviewData from "@/stores/usePreviewStore";

export default function ThemeSwitch() {
  // 1. Listen to the store
  const isDarkMode = usePreviewData(state => state.isDarkMode)
  const updateIsDarkMode = usePreviewData(state => state.updateIsDarkMode)

  // 2. DERIVE the theme directly from the store. 
  // No useState needed. If store changes, this recalculates automatically.
  const theme = isDarkMode ? "dark" : "light";

  // 3. Sync DOM with theme (This runs whenever isDarkMode changes)
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 4. Simplified Toggle Handler
  const handleToggle = () => {
    // Just toggle the global boolean. 
    // The component will re-render, update 'theme', and run the useEffect above automatically.
    updateIsDarkMode(!isDarkMode);
  }

  return (
    <div>
      <Toggle
        variant="outline"
        className="group size-9 relative data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted"
        pressed={isDarkMode} // Use isDarkMode directly
        onPressedChange={handleToggle}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >

        <MoonIcon
          size={16}
          className="shrink-0 scale-0 opacity-0 transition-all duration-300 group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100 text-white"
          aria-hidden="true"
        />

        <SunIcon
          size={16}
          className="absolute shrink-0 scale-100 opacity-100 transition-all duration-300 group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  );
}