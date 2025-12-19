import Header from "@/components/Header";
import HowToUsePopup from "@/components/HowToUsePopup";
import MassegeField from "@/components/MassegeField";
import ParticipantAvatar from "@/components/ParticipantAvatar";
import RenderPlatformUI from "@/components/RenderPlatformUI";
import usePreviewData from "@/stores/usePreviewStore";
import { Input } from "@/components/ui/input";
import PlatformDropdownBtn from "@/components/PlatformDropdownBtn";
import ToolDropDownBtn from "@/components/ToolDropDownBtn";
import { useEffect } from "react";
import Download from "@/components/Download.jsx";


export function Homepage() {
  const sender = usePreviewData((state) => state.sender);
  const receiver = usePreviewData((state) => state.receiver); 
  const updateSender = usePreviewData((state) => state.updateSender);
  const updateReceiver = usePreviewData((state) => state.updateReceiver);
  const isDarkMode = usePreviewData((state) => state.isDarkMode);



    useEffect(() => {
      const root = document.documentElement;
      if (isDarkMode) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }, [isDarkMode]);

  

  
    
  return (
    <div className="md:h-screen flex flex-col overflow-hidden">

      {/* Main Content Wrapper: Changed lg:flex-row to md:flex-row */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div className="flex flex-col flex-1">
          <Header />
          
          {/* Secondary Wrapper: Changed lg:flex-row to md:flex-row */}
          <div className="flex flex-col md:flex-row flex-1">
            
            {/* LEFT SECTION - Participants (w-full to md:w-[250px]) */}
            <div className="w-full md:w-[250px] md:flex flex-row md:flex-col lg:flex-col gap-3 p-3 border-b md:border-b-0 md:border-r overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto">
              <h1 className="text-center">Participants</h1>
              {/* PARTICIPANT 1 */}

              <div className="flex flex-1 gap-2 md:min-w-[140px] md:flex-col ">
                <div className="flex-1 flex flex-col gap-y-1 p-1 justify-center items-center border rounded-lg lg:min-w-0 lg:min-h-0">
                  <p className="text-sm font-medium">Sender</p>
                  <ParticipantAvatar type= 'sender' />
                  <Input placeholder="Sender" type="text" value={sender} onChange={(e) => updateSender(e.target.value)} required className='text-center text-sm' />
                  <span className=" text-[10px] p-1 leading-tight md:text-xs text-center text-gray-400 ">
                    Enter the name or phone number that should appear as the message sender in the screenshot.
                  </span>
                </div>

                {/* PARTICIPANT 2 */}
                <div className="flex-1 flex flex-col gap-y-2 p-1 justify-center items-center border rounded-lg lg:min-w-0 lg:min-h-0">
                  <p className="text-sm font-medium">Receiver</p>
                  <ParticipantAvatar type= 'receiver' />
                    <Input placeholder="Receiver" type="text" value={receiver} onChange={(e) => updateReceiver(e.target.value)} required  className='text-center'/>
                  <span className="text-[10px] p-1 leading-tight md:text-xs text-center text-gray-400 ">
                    Enter the name or phone that should appear as the recipient.
                  </span>
                </div>
              </div>

              <HowToUsePopup />
            </div>
            

            {/* MIDDLE SECTION - Message Field */}
            <div className="min-w-0 flex flex-col gap-3 p-3 h-[40vh] md:h-auto md:flex-1 ">
              {/* Message Field - Takes most space */}
              <div className="flex-1 min-h-0 overflow-auto">
                <MassegeField />
              </div>

              {/* Quick Guide - Fixed small height */}
              <div className="hidden md:block max-h-[40%] p-3 rounded-lg border overflow-y-auto">
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
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Preview */}
        <div className="bg-gray-100 dark:bg-[#262626] p-4 border-t md:border-t-0 md:border-l gap-4 flex flex-col-reverse md:flex-col md:w-[30%]">
          {/* WhatsApp Preview - Flex to fit available space */}

            <RenderPlatformUI />

          {/* Action Buttons - Fixed height at bottom */}
          <div className="flex gap-2">
            <ToolDropDownBtn />
            <PlatformDropdownBtn/>
            <Download/>
          </div>
        </div>
      </div>
    </div>
  );
}