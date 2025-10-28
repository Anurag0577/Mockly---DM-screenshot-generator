import { ThumbsUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CreditButton() {
  return (
    <Button className="py-0 pe-0" variant="outline">
      <ThumbsUpIcon className="opacity-60" size={16} aria-hidden="true" />
      Credit
      <span className="relative ms-1 inline-flex h-full items-center justify-center rounded-full px-3 text-xs font-medium text-muted-foreground before:absolute before:inset-0 before:left-0 before:w-px before:bg-input">
        01
      </span>
    </Button>
  )
}
