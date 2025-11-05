import bg from "@/assets/whatsapp_bg.jpg"
import ProfileDropdown from "@/components/ProfileDropdown";
import { ArrowLeft, Video, Phone, EllipsisVertical, Sticker, Link, BadgeIndianRupee, Camera, Mic } from "lucide-react"

export default function WhatsApp(){
    const sender = 'Anurag';
    const reciever = 'Mohan'
    const messages = [
  {
    "sender": "sender",
    "message": "How are you?",
    "time": "02:30 pm"
  },
  {
    "sender": "sender",
    "message": "I am fine. What about you?\nWhere is you father?",
    "time": "2:34 pm"
  },
  {
    "sender": "sender",
    "message": "I am also good. Where is your father?",
    "time": "03:02 pm"
  },
  {
    "sender": "sender",
    "message": "He is out of the station rightnow .",
    "time": "03:05 pm"
  },
  {
    "sender": "sender",
    "message": "How are you?",
    "time": "02:30 pm"
  },
  {
    "sender": "receiver",
    "message": "I am fine. What about you?\nWhere is you father?",
    "time": "2:34 pm"
  },
  {
    "sender": "sender",
    "message": "I am also good. Where is your father?",
    "time": "03:02 pm"
  },
  {
    "sender": "receiver",
    "message": "He is out of the station rightnow .",
    "time": "03:05 pm"
  },
  {
    "sender": "sender",
    "message": "How are you?",
    "time": "02:30 pm"
  },
  {
    "sender": "receiver",
    "message": "I am fine. What about you?\nWhere is you father?",
    "time": "2:34 pm"
  },
  {
    "sender": "sender",
    "message": "I am also good. Where is your father?",
    "time": "03:02 pm"
  },
  {
    "sender": "receiver",
    "message": "He is out of the station rightnow .",
    "time": "03:05 pm"
  },{
    "sender": "sender",
    "message": "How are you?",
    "time": "02:30 pm"
  },
  {
    "sender": "receiver",
    "message": "I am fine. What about you?\nWhere is you father?",
    "time": "2:34 pm"
  },
  {
    "sender": "sender",
    "message": "I am also good. Where is your father?",
    "time": "03:02 pm"
  },
  {
    "sender": "receiver",
    "message": "He is out of the station rightnow .",
    "time": "03:05 pm"
  },
  {
    "sender": "sender",
    "message": "How are you?",
    "time": "02:30 pm"
  },
  {
    "sender": "receiver",
    "message": "I am fine. What about you?\nWhere is you father?",
    "time": "2:34 pm"
  },
  {
    "sender": "receiver",
    "message": "I am also good. Where is your father?",
    "time": "03:02 pm"
  },
  {
    "sender": "receiver",
    "message": "He is out of the station rightnow .",
    "time": "03:05 pm"
  },
  {
    "sender": "receiver",
    "message": "How are you?",
    "time": "02:30 pm"
  },
  {
    "sender": "receiver",
    "message": "I am fine. What about you?\nWhere is you father?",
    "time": "2:34 pm"
  },
  {
    "sender": "receiver",
    "message": "I am also good. Where is your father?",
    "time": "03:02 pm"
  },
  {
    "sender": "receiver",
    "message": "He is out of the station rightnow .",
    "time": "03:05 pm"
  }
]


    return(
        <>
            <div className=" w-full flex flex-col mb-2 rounded-xl aspect-square shadow-2xl ">
                <div className="flex justify-between items-center bg-white border-b-[0.01px] border-gray-300 py-1 gap-x-2 px-2">
                    <ArrowLeft size={17} />
                    <div className="flex-1 flex my-1 items-center">
                        <div className="w-7 aspect-square border rounded-full mr-2 p-1 text-center text-[12px]">M</div>
                        <span>Mohan</span>
                    </div>
                    <div className="flex gap-x-3">
                        <Video size={20}/>
                        <Phone size={17} />
                        <EllipsisVertical size={18} />
                    </div>
                    
                </div>
                {/* import the image so Vite resolves it and use a min-h so it shows even when parent has no explicit height */}
                <div
                    className="flex flex-col justify-between"
                    style={{
                        backgroundImage: `url(${bg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    >
                    {/* ✅ Scrollable messages area */}
                    <ul className="w-full flex-1 overflow-y-auto flex flex-col max-h-[546px] pt-2">
                        {messages.map((msg, index) =>
                        msg.sender === 'sender' ? (
                            <li key={index} className="mb-1 flex justify-end items-center">
                            <div className="relative inline-block py-1 px-2 mr-2.5 bg-[#d9fdd3] max-w-[80%] rounded-l-xl rounded-br-xl">
                                <div
                                className="absolute w-3 h-5"
                                style={{
                                    backgroundColor: 'rgba(217, 253, 211)',
                                    right: '-8px',
                                    top: '0',
                                    clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)',
                                    borderRadius: '4px',
                                }}
                                />
                                <p className="whitespace-pre-wrap text-[12px] after:content-[''] after:inline-block after:w-[50px] after:h-0">
                                {msg.message}
                                </p>
                                <span className="text-xs text-gray-600 block text-right -mt-2.5 text-[10px]">
                                {msg.time}
                                </span>
                            </div>
                            </li>
                        ) : (
                            <li key={index} className="mb-1 flex justify-start items-center">
                            <div className="relative inline-block px-2 py-1 ml-2.5 bg-white max-w-[80%] rounded-r-xl rounded-bl-xl">
                                <div
                                className="absolute w-3 h-5"
                                style={{
                                    backgroundColor: 'white',
                                    left: '-8px',
                                    top: '0',
                                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%)',
                                    borderRadius: '4px',
                                }}
                                />
                                <p className="whitespace-pre-wrap text-[12px] after:content-[''] after:inline-block after:w-[50px] after:h-0">
                                {msg.message}
                                </p>
                                <span className="text-xs text-gray-600 block text-right -mt-2.5 text-[10px]">
                                {msg.time}
                                </span>
                            </div>
                            </li>
                        )
                        )}
                    </ul>

                    {/* ✅ Input bar */}
                    <div className="w-full max-h-fit flex gap-x-1 mt-1.5">
                        <div className="ml-1">
                            <div className="flex items-center gap-2 px-3 py-1 mb-1.5 rounded-3xl bg-white w-full">
                            <Sticker className="shrink-0" size={18} />
                            <input
                                type="text"
                                placeholder="Type a message"
                                className="flex-1 px-1 py-1 text-[12px] bg-transparent outline-none min-w-0"
                            />
                            <div className="flex items-center gap-2 shrink-0">
                                <Link size={16} />
                                <BadgeIndianRupee size={17} />
                                <Camera size={18} />
                            </div>
                            </div>
                        </div>
                        <div className=" flex justify-center items-center aspect-square rounded-full bg-green-600 h-8.5 w-8.5 mr-1 ">
                          <Mic size={20} color="white" />
                        </div> 
                    </div>
                    </div>


                
            </div>
            
        </>
    )
}