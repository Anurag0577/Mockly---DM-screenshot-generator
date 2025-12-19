"use client";
import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { IoSettingsSharp } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import usePreviewData from "@/stores/usePreviewStore"

export default function ToolDropDownBtn() {
  const [nextjs, setNextjs] = useState(false)
  const [sveltekit, setSveltekit] = useState(true)
  // const [astro, setAstro] = useState(false)
  // const [remix, setRemix] = useState(false)

  const isDarkMode = usePreviewData((state) => state.isDarkMode);
  const updateIsDarkMode = usePreviewData((state) => state.updateIsDarkMode);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {/* Settings */}
          <IoSettingsSharp  size={20} />
          <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem checked={nextjs} onCheckedChange={setNextjs}>
          Show Header
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={sveltekit} onCheckedChange={setSveltekit}>
          Show Footer
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={isDarkMode} onCheckedChange={updateIsDarkMode}>
          Dark Mode
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
