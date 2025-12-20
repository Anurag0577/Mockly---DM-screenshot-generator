import ParticipantAvatar from "./ParticipantAvatar"
import { Input } from "./ui/input"
import usePreviewData from "@/stores/usePreviewStore.js"

export function ReceiverParticipant() {

    const receiver = usePreviewData((state) => state.receiver); 
    const updateReceiver = usePreviewData((state) => state.updateReceiver);

    return (
        <div className="flex-1 flex flex-col gap-y-2 p-1 justify-center items-center border rounded-lg lg:min-w-0 lg:min-h-0">
            <p className="text-sm font-medium">Receiver</p>
            <ParticipantAvatar type='receiver' />
            <Input placeholder="Receiver" type="text" value={receiver} onChange={(e) => updateReceiver(e.target.value)} required className='text-center' />
            <span className="text-[10px] p-1 leading-tight md:text-xs text-center text-gray-400 ">
                Enter the name or phone that should appear as the recipient.
            </span>
        </div>
    )
}