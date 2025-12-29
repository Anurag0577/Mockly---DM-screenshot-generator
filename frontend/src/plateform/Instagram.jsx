import { IoArrowBackOutline } from "react-icons/io5";
import { LuPhone, LuVideo } from "react-icons/lu";
import { RiFlag2Line } from "react-icons/ri";
import { FaCamera } from "react-icons/fa";
import { FiMic } from "react-icons/fi";
import { HiOutlinePhoto } from "react-icons/hi2";
import { PiStickerBold } from "react-icons/pi";
import { IoMdAddCircleOutline } from "react-icons/io";
import InstagramAvatar from '../assets/instagramAvatar.jpeg'
export default function Instagram({ receiver, receiverAvatar, messages }) {
    return (
        <>
            <div className="instagram-container flex-1 min-h-0 flex flex-col mb-2 shadow-2xl border rounded-none bg-white dark:bg-black" id="renderedUI-driver" >

                {/* Header */}
                <div className="instagram-header flex items-center h-fit p-2">
                    <IoArrowBackOutline size={20} />

                    {/* Receiver Info */}
                    <div className="flex-1 ml-7 flex content-center gap-3">
                        <img className="h-8 w-8 rounded-full" src={(receiverAvatar === null) ? InstagramAvatar : receiverAvatar} />
                        <div className="flex flex-col justify-center">
                            <div className="bold text-sm leading-tight">{receiver}</div>
                            {/* <div className="lighter text-xs  -mt-2">Eren0eth</div> */}
                        </div>
                    </div>

                    {/* Call Icons */}
                    <div className="flex gap-4 items-center">
                        <LuPhone size={16} />
                        <LuVideo size={20} />
                        <RiFlag2Line size={20} />
                    </div>
                </div>

                {/* Chat Body */}
                <div className="instagram-chat flex-1 min-h-0">
                    <div className="flex flex-col h-full min-h-0 justify-end">

                        {/* Scrollable messages section */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-gutter-stable px-2 py-3 ">

                            <ul>
                                {messages.map((msg, index) => {
                                    const isPreviousSenderSame =
                                        index > 0 && messages[index - 1].sender === msg.sender;

                                    const isNextSenderSame =
                                        index < messages.length - 1 && messages[index + 1].sender === msg.sender;

                                    const gapClass = isPreviousSenderSame
                                        ? "mt-[2px]"
                                        : "mt-[12px]";

                                    const roundTop = !isPreviousSenderSame;
                                    const roundBottom = !isNextSenderSame;

                                    const showAvatar =
                                        msg.sender !== "sender" && !isNextSenderSame;

                                    return msg.sender === "sender" ? (

                                        <li key={index} className={`${gapClass} flex justify-end`}>
                                            <div
                                                className={`relative inline-block py-1 px-2 max-w-[60%] rounded-tl-[10px] rounded-bl-[10px]
                                                    ${roundTop ? "rounded-tr-[10px]" : "rounded-tr-none"}
                                                    ${roundBottom ? "rounded-br-[10px]" : "rounded-br-none"}`}

                                                style={{
                                                    backgroundImage: 'linear-gradient(to bottom, #b117db, #614afa)'
                                                }}
                                            >
                                                <p className="whitespace-pre-wrap text-xs text-white">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </li>
                                    ) : (
                                        <li key={index} className={`${gapClass} flex items-end gap-1`}>

                                            {showAvatar ? (
                                                <img
                                                    src={(receiverAvatar === null) ? InstagramAvatar : receiverAvatar}
                                                    className="h-4 w-4 rounded-full mb-1 ml-1"
                                                />
                                            ) : (
                                                <div className="w-4 ml-1" />
                                            )}

                                            <div
                                                className={`relative inline-block px-2 py-1
                                                    bg-[#eeefef] dark:bg-[#262726]
                                                    max-w-[60%] rounded-tr-[10px] rounded-br-[10px]
                                                    ${roundTop ? "rounded-tl-[10px]" : "rounded-tl-none"}
                                                    ${roundBottom ? "rounded-bl-[10px]" : "rounded-bl-none"}`}
                                            >
                                                <p className="whitespace-pre-wrap text-xs dark:text-white">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                        </div>

                        <div className="instagram-input w-full flex gap-x-1 mt-1.5 h-fit bg-transparent p-2">
                            <div className="flex items-center justify-between w-full gap-4 p-2 bg-gray-100 dark:bg-[#262726] rounded-full">

                                <div className="p-2 rounded-full bg-pink-600">
                                    <FaCamera color="#fff" size={14} />
                                </div>

                                <div className="text-sm">Messages...</div>

                                <div className="flex-1 flex justify-end items-center gap-4">
                                    <FiMic size={18} />
                                    <HiOutlinePhoto size={20} />
                                    <PiStickerBold size={20} />
                                    <IoMdAddCircleOutline size={20} />
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
}
