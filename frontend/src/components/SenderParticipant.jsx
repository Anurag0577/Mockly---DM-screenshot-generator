import ParticipantAvatar from "./ParticipantAvatar"
import { Input } from "./ui/input"
import usePreviewData from "@/stores/usePreviewStore.js"

export function SenderParticipant() {

    const sender = usePreviewData((state) => state.sender)
    const updateSender = usePreviewData((state) => state.updateSender)

    return (
        < div className="flex-1 flex flex-col gap-y-1 p-1 justify-center items-center border rounded-lg lg:min-w-0 lg:min-h-0" >
            <p className="text-sm font-medium">Sender</p>
            <ParticipantAvatar type='sender' />
            <Input placeholder="Sender" type="text" value={sender} onChange={(e) => updateSender(e.target.value)} required className='text-center text-sm' />
            <span className=" text-[10px] p-1 leading-tight md:text-xs text-center text-gray-400 ">
                Enter the name or phone number that should appear as the message sender in the screenshot.
            </span>
        </div >
    )
}