import Header from "@/components/Header";
import HowToUsePopup from "@/components/HowToUsePopup";
import MassegeField from "@/components/MassegeField";
import ParticipantAvatar from "@/components/ParticipantAvatar";
import { Button } from "@/components/ui/button";
import DropdownButton from "@/components/DropdownButton";
import { ArrowDownToLine } from "lucide-react";
import WhatsApp from "@/plateform/WhatsApp";
import usePreviewData from "@/stores/previewData";
import { Input } from "@/components/ui/input";

export function Homepage() {
  const sender = usePreviewData((state) => state.sender);
  const receiver = usePreviewData((state) => state.receiver); 
  const updateSender = usePreviewData((state) => state.updateSender);
  const updateReceiver = usePreviewData((state) => state.updateReceiver);
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* HEADER - Fixed height */}
      
      
      {/* MAIN CONTENT - Takes remaining height */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="flex flex-col flex-1">
          <Header />
        {/* LEFT SECTION - Participants */}
        <div className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-[250px] flex flex-row lg:flex-col gap-3 p-3 border-b lg:border-b-0 lg:border-r overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto">
          <h1 className="text-center">Participants</h1>
          {/* PARTICIPANT 1 */}
          <div className="flex-1 min-w-[140px] lg:min-w-0 lg:min-h-0 flex flex-col justify-center items-center border rounded-lg p-3 gap-2">
            <p className="text-sm font-medium">Sender</p>
            <ParticipantAvatar type= 'sender' />
            {/* <input 
              className="w-full text-center border rounded-lg px-2 py-1 text-sm"
              value={sender}
              onChange={(e) => updateSender(e.target.value)}
            /> */}
            <Input placeholder="Sender" type="text" value={sender} onChange={(e) => updateSender(e.target.value)} required />
            <span className="text-xs text-center text-gray-400 ">
              Enter the name or phone number that should appear as the message sender in the screenshot.
            </span>
          </div>

          {/* PARTICIPANT 2 */}
          <div className="flex-1 min-w-[140px] lg:min-w-0 lg:min-h-0 flex flex-col justify-center items-center border rounded-lg p-3 gap-2">
            <p className="text-sm font-medium">Receiver</p>
            <ParticipantAvatar type= 'receiver' />
            {/* <input 
              placeholder="Arya" 
              className="w-full text-center border rounded-lg px-2 py-1 text-sm"
              value={receiver}
              onChange={(e) => updateReceiver(e.target.value)}
            /> */}
              <Input placeholder="Receiver" type="text" value={receiver} onChange={(e) => updateReceiver(e.target.value)} required />
            <span className="text-xs text-center text-gray-400 line-clamp-2">
              Enter the name or phone that should appear as the recipient.
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
          <div className="max-h-[40%] p-3 rounded-lg border overflow-y-auto">
            <h1 className="text-muted-foreground font-medium mb-1">
              Quick Guide
            </h1>
            <div className="text-muted-foreground text-xs space-y-2">
              <p className="font-medium">Rules of the input text field:</p>
              
              <ul className="space-y-1 pl-4">
                <li>1. Use @ symbol to represent sender</li>
                <li>2. Use # symbol to represent receiver</li>
                <li>3. Add timestamp using format @(time)</li>
              </ul>
              
              <div className="pt-2">
                <span className="font-medium">Example:</span>
                <br />
                <span className="text-blue-500">@ says hello to # @(2:30 PM)</span>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>

        {/* RIGHT SECTION - Preview */}
        <div className="bg-gray-100 dark:bg-gray-900 p-4 border-t lg:border-t-0 lg:border-l gap-4 flex flex-col w-[30%]">
          {/* WhatsApp Preview - Flex to fit available space */}

            <WhatsApp />

          {/* Action Buttons - Fixed height at bottom */}
          <div className="flex gap-2">
            <DropdownButton />
            <DropdownButton />
            <Button variant="default" className="flex-1 gap-2">
              <ArrowDownToLine className="w-4 h-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}