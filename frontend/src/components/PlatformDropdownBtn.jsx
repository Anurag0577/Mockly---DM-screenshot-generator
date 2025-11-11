import { useId } from "react"
import whatsappLogo from "@/assets/WhatsAppPNG.webp"
import instagramLogo from "@/assets/Instagram.png"
import telegramLogo from "@/assets/Telegram.webp"
import xLogo from "@/assets/X.jpg"
import snapLogo from "@/assets/SnapLogo.png"
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
            <SelectItem value="2">
              <img
                className="size-5 rounded"
                src={instagramLogo}
                width={10}
                height={10} />
              <span className="truncate">Instagram</span>
            </SelectItem>
            <SelectItem value="3">
              <img
                className="size-5 rounded"
                src={telegramLogo}
                width={20}
                height={20} />
              <span className="truncate">Telegram</span>
            </SelectItem>
            <SelectItem value="4">
              <img
                className="size-5 rounded"
                src={snapLogo}

                width={20}
                height={20} />
              <span className="truncate">SnapChat</span>
            </SelectItem>
            <SelectItem value="6">
              <img
                className="size-5 rounded"
                src={xLogo}
                width={20}
                height={20} />
              <span className="truncate">X.com</span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
