"use client";
import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ToolDropDownBtn() {
  const [nextjs, setNextjs] = useState(false)
  const [sveltekit, setSveltekit] = useState(true)
  const [astro, setAstro] = useState(false)
  const [remix, setRemix] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Settings
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
        <DropdownMenuCheckboxItem checked={astro} onCheckedChange={setAstro}>
          Dark Mode
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
