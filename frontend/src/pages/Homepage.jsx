import Header from "@/components/Header";
import HowToUsePopup from "@/components/HowToUsePopup";
import MassegeField from "@/components/MassegeField";
import ParticipantAvatar from "@/components/ParticipantAvatar";
import { Button } from "@/components/ui/button";
import DropdownButton from "@/components/DropdownButton";
import { ArrowDownToLine } from "lucide-react";

export function Homepage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* HEADER - Fixed height */}
      
      
      {/* MAIN CONTENT - Takes remaining height */}
      <div className="flex-1 flex min-h-0">
        <div>
          <Header />
        {/* LEFT SECTION - Participants */}
        <div className="flex">
        <div className="w-[250px] flex flex-col gap-3 p-3 border-r overflow-y-auto">
          {/* PARTICIPANT 1 */}
          <div className="flex-1 min-h-0 flex flex-col justify-center items-center border rounded-lg p-3 gap-2">
            <p className="text-sm font-medium">Sender</p>
            <ParticipantAvatar />
            <input 
              placeholder="John" 
              className="w-full text-center border rounded-lg px-2 py-1 text-sm"
            />
            <span className="text-xs text-center text-gray-400 line-clamp-2">
              Enter sender name or phone
            </span>
          </div>

          {/* PARTICIPANT 2 */}
          <div className="flex-1 min-h-0 flex flex-col justify-center items-center border rounded-lg p-3 gap-2">
            <p className="text-sm font-medium">Receiver</p>
            <ParticipantAvatar />
            <input 
              placeholder="Arya" 
              className="w-full text-center border rounded-lg px-2 py-1 text-sm"
            />
            <span className="text-xs text-center text-gray-400 line-clamp-2">
              Enter receiver name or phone
            </span>
          </div>

          <HowToUsePopup />
        </div>
        

        {/* MIDDLE SECTION - Message Field */}
        <div className="flex-1 min-w-0 flex flex-col gap-3 p-3">
          {/* Message Field - Takes most space */}
          <div className="flex-1 min-h-0 overflow-auto">
            <MassegeField />
          </div>

          {/* Quick Guide - Fixed small height */}
          <div className="h-24 p-3 rounded-lg border overflow-y-auto">
            <div className="text-muted-foreground text-sm font-medium mb-1">
              Quick Guide
            </div>
            <p className="text-muted-foreground text-xs">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. 
              Similique repellat, enim delectus laborum aperiam natus?
            </p>
          </div>
        </div>
        </div>
        </div>

        {/* RIGHT SECTION - Preview */}
        <div className="w-[320px] flex flex-col items-center justify-between p-4 border-l gap-4">
          {/* WhatsApp Preview - Flex to fit available space */}
          <div className="flex-1 w-full max-w-[280px] min-h-0 aspect-[9/16] bg-gray-100 rounded-2xl shadow-md flex items-center justify-center text-gray-400 text-sm">
            -- your fake WhatsApp UI here --
          </div>

          {/* Action Buttons - Fixed height at bottom */}
          <div className="w-full max-w-[280px] flex gap-2">
            <DropdownButton />
            <DropdownButton />
            <Button variant="default" className="flex-1 gap-2">
              <ArrowDownToLine className="w-4 h-4" />
              {/* <span>Download</span> */}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}