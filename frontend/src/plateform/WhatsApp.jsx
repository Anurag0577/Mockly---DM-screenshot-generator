import bg from "@/assets/whatsapp_bg.jpg";
import bgDark from "@/assets/whatsapp_bg_dark.jpg";
import ProfileDropdown from "@/components/ProfileDropdown";
import { ArrowLeft, Video, Phone, EllipsisVertical, Sticker, Link, BadgeIndianRupee, Camera, Mic } from "lucide-react"
import usePreviewData from "@/stores/previewData";  // ✅ Named import with curly braces

export default function WhatsApp(){
    const sender = usePreviewData((state) => state.sender);
    const receiver = usePreviewData((state) => state.receiver);
    const receiverAvatar = usePreviewData((state) => state.receiverAvatar);
    const messages = usePreviewData((state) => state.messageArray);

    return(
        <>
            <div className="flex-1 min-h-0 flex flex-col mb-2 shadow-2xl border rounded-none">
  {/* Header */}
  <div className="flex justify-between items-center bg-white dark:bg-black border-b border-gray-300 py-1 gap-x-2 px-2 dark:text-white dark:border-gray-700">
    <ArrowLeft size={17} />
    <div className="flex-1 flex my-1 items-center">
      <div className="w-7 aspect-square rounded-full mr-2 text-center text-[12px]">
        {receiverAvatar ? (
          <img
            src={receiverAvatar}
            alt="Receiver Avatar"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full"
          >
            <span className="text-gray-500 dark:text-gray-300">
              {receiver ? receiver.charAt(0).toUpperCase() : 'R'}
            </span>
          </div>
        )}
      </div>
      <span>{receiver}</span>
    </div>
    <div className="flex gap-x-3">
      <Video size={20} />
      <Phone size={17} />
      <EllipsisVertical size={18} />
    </div>
  </div>

  {/* Chat area */}
  <div
    className="flex flex-col flex-1 min-h-0  bg-[url('@/assets/whatsapp_bg.jpg')] dark:bg-[url('@/assets/whatsappDark.png')]"
    style={{
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <ul className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-gutter-stable px-1">
      {messages.map((msg, index) =>
        msg.sender === 'sender' ? (
          <li key={index} className="mb-3 flex justify-end items-center">
            <div className="relative inline-block py-1 px-2 mr-2.5 bg-[#d9fdd3] dark:bg-[#144d37] max-w-[60%] rounded-tl-[10px] rounded-bl-[10px] rounded-br-[10px]">
              <div
                className="absolute w-3 h-5 bg-[#d9fdd3] dark:bg-[#144d37]"
                style={{
                  right: '-8px',
                  top: '0',
                  clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)',
                  borderRadius: '4px',
                }}
              />
              <p className="whitespace-pre-wrap text-[12px] dark:text-white after:content-[''] after:inline-block after:w-[50px] after:h-0">
                {msg.message}
              </p>
              <span className="text-xs text-gray-600 dark:text-gray-300 block text-right -mt-2.5 text-[10px]">
                {msg.time}
              </span>
            </div>
          </li>
        ) : (
          <li key={index} className="mb-3 flex justify-start items-center">
            <div className="relative inline-block px-2 py-1 ml-2.5 bg-white dark:bg-[#20272b] max-w-[60%] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]">
              <div
                className="absolute w-3 h-5 bg-white dark:bg-[#20272b]"
                style={{
                  left: '-8px',
                  top: '0',
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%)',
                  borderRadius: '4px',
                }}
              />
              <p className="whitespace-pre-wrap text-[12px] dark:text-white after:content-[''] after:inline-block after:w-[50px] after:h-0">
                {msg.message}
              </p>
              <span className="text-xs text-gray-600 dark:text-gray-300 block text-right -mt-2.5 text-[10px]">
                {msg.time}
              </span>
            </div>
          </li>
        )
      )}
    </ul>

    {/* Input bar */}
    <div className="w-full flex gap-x-1 mt-1.5 h-fit bg-transparent">
      <div className="flex items-center gap-2 px-3 py-1 mb-1.5 rounded-3xl bg-white dark:bg-[#20272b] w-full">
        <Sticker className="shrink-0 dark:text-gray-600" size={18} />
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 px-1 py-1 text-[12px] bg-transparent outline-none min-w-0 dark:text-white"
        />
        <div className="flex items-center gap-2 shrink-0">
          <Link size={16} className="dark:text-gray-600" />
          <BadgeIndianRupee size={17} className="dark:text-gray-600" />
          <Camera size={18} className="dark:text-gray-600" />
        </div>
      </div>
      <div className="flex justify-center items-center aspect-square rounded-full bg-green-600 h-8.5 w-8.5 mr-1">
        <Mic size={20} className=" text-white dark:text-black" />
      </div>
    </div>
  </div>
</div>

        </>
    )
}