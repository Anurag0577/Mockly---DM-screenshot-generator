import { useId } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function MassegeField() {
  const id = useId()
  return (
    <div className="flex flex-col h-full">
      <h1 htmlFor={id} className="mb-4">Type Your Messages Here...</h1>
      <Textarea
        id={id}
        placeholder="Leave a comment"
        className="flex-1 resize-none overflow-auto"
      />
    </div>
  )
}

