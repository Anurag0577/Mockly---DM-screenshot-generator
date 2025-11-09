import { useId } from "react"
import whatsappLogo from "@/assets/WhatsAppPNG.webp"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PlatformDropdownBtn() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Select defaultValue="1">
        <SelectTrigger
          id={id}
          className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent
          className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
          <SelectGroup>
            <SelectLabel className="ps-2">Select Plateform</SelectLabel>
            <SelectItem value="1">
              <img
                className="size-5 rounded"
                src={whatsappLogo}

                width={20}
                height={20} />
              <span className="truncate">WhatsApp</span>
            </SelectItem>

          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
