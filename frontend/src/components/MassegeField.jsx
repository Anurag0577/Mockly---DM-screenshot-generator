import { useId } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function MassegeField() {
  const id = useId()
  return (
    <div className="flex flex-col h-full">
      <Label htmlFor={id} className="mb-4 font-bold text-2xl">Type Your Messages Here...</Label>
      <Textarea
        id={id}
        placeholder="Leave a comment"
        className="flex-1 resize-none overflow-auto border-black"
      />
    </div>
  )
}

