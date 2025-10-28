import Header from "@/components/Header";
import HowToUsePopup from "@/components/HowToUsePopup";
import MassegeField from "@/components/MassegeField";
import ParticipantAvatar from "@/components/ParticipantAvatar";
import { Button } from "@/components/ui/button";
import DropdownButton from "@/components/DropdownButton";
import { ArrowDownToLine } from "lucide-react"

export function Homepage() {
  return (
    <>
    <div className="flex justify-center items-center gap-2 border-2">
      <div className="flex flex-col flex-1  h-screen ">
        <Header/>
        <div className="flex flex-1 justify-center items-center gap-4">
        <div className="flex flex-col max-w-[250px] h-full gap-y-4 p-4 ">
          <div className=" flex flex-1 flex-col gap-y-14 h-full ">
            {/* PARTICIPANT 1 */}
            <div className="participant-one h-[50%] flex flex-col justify-center items-center border rounded-lg gap-y-4">
              <h1 className="text-2xl font-bold mb-4 " >Sender</h1>
              <ParticipantAvatar/>
              <input placeholder="John" className="text-center border rounded-lg "></input>
              <span className="text-[12px] text-center text-gray-400">Enter the name or phone that should appear as the message sender</span>
            </div>
            {/* PARTICIPANT 2 */}
            <div className="participant-two h-[50%] flex flex-col justify-center items-center border rounded-lg gap-y-4">
              <h1 className="text-2xl font-bold mb-4 " >Receiver</h1>
              <ParticipantAvatar/>
              <input placeholder="Arya" className="text-center border rounded-lg"></input>
              <span className="text-[12px] text-center text-gray-400">Enter the name or phone that should appear as the recipient.</span>
            </div>
          </div>
            <HowToUsePopup/>
          
        </div>
                <div className="flex-1 flex flex-col gap-y-4 h-full p-4">
                  <div className="flex-1">
                    <MassegeField/>
                  </div>
                  <div className=" h-fit p-4 rounded-lg border">
                    <div className="font-bold text-muted-foreground">Quick Guide</div>
                    <p className="text-muted-foreground text-sm">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique repellat, enim delectus laborum aperiam natus? Libero fuga molestias magni architecto, officia obcaecati voluptates provident, consequatur laudantium rerum quod maxime dignissimos.
                    </p>
                  </div>
                </div>
        </div>
      </div>
      <div className="w-fit">
        <div className="flex m-4 h-[calc(100vh-2rem)] rounded-lg flex-col items-center justify-between text-center border p-4">
          <div className="h-full aspect-[9/16] bg-gray-100 rounded-2xl shadow-md">
            -- your fake WhatsApp UI here --
          </div>
          <div className="w-full flex gap-2 justify-between mt-4">
            <DropdownButton/>
            <DropdownButton/>
            <Button asChild variant="default" size="" className="text-sm">
              <div>
                <ArrowDownToLine />
                <a href="#">Download</a>
              </div>
              
            </Button>
          </div>
        </div>
      </div>


    </div>
    
    
    </>
  );
}
