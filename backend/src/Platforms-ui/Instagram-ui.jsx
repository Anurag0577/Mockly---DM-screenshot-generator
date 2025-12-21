import { IoArrowBackOutline } from "react-icons/io5";
import { LuPhone, LuVideo } from "react-icons/lu";
import { RiFlag2Line } from "react-icons/ri";
import { FaCamera } from "react-icons/fa";
import { FiMic } from "react-icons/fi";
import { HiOutlinePhoto } from "react-icons/hi2";
import { PiStickerBold } from "react-icons/pi";
import { IoMdAddCircleOutline } from "react-icons/io";

export default function InstagramExtra({ sender, receiver, receiverAvatar, messages }) {
    return (
        <>
            <div className="instagram-container flex-1 min-h-0 flex flex-col mb-2 shadow-2xl border rounded-none bg-white dark:bg-black text-black dark:text-white">

                {/* Header */}
                <div className="instagram-header flex items-center h-fit p-2 bg-white dark:bg-black text-black dark:text-white">
                    <IoArrowBackOutline size={20} />

                    {/* Receiver Info */}
                    <div className="flex-1 ml-7 flex content-center gap-3">
                        <img className="h-8 w-8 rounded-full" src={receiverAvatar} alt="avatar" />
                        <div className="flex flex-col justify-center">
                            <div className="bold text-[14px] leading-tight">{receiver}</div>
                            <div className="lighter text-[10px] -mt-2">Eren0eth</div>
                        </div>
                    </div>

                    {/* Call Icons */}
                    <div className="flex gap-4 items-center">
                        <LuPhone size={18} />
                        <LuVideo size={20} />
                        <RiFlag2Line size={20} />
                    </div>
                </div>

                {/* Chat Body */}
                <div className="instagram-chat flex-1 min-h-0">
                    <div className="flex flex-col h-full min-h-0 justify-end">

                        {/* Scrollable messages section */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-gutter-stable px-2 py-3 bg-white dark:bg-black text-black dark:text-white">

                            <ul>
                                {messages.map((msg, index) => {
                                    const isPreviousSenderSame =
                                        index > 0 && messages[index - 1].sender === msg.sender;

                                    const isNextSenderSame =
                                        index < messages.length - 1 && messages[index + 1].sender === msg.sender;

                                    const roundTop = !isPreviousSenderSame;
                                    const roundBottom = !isNextSenderSame;

                                    const showAvatar =
                                        msg.sender !== "sender" && !isNextSenderSame;

                                    // Dynamic Styles Objects
                                    // Use marginTop instead of borderTopWidth so spacing is an actual margin
                                    const liStyle = {
                                        marginTop: isPreviousSenderSame ? '2px' : '12px',
                                    };

                                    const senderBubbleStyle = {
                                        background: 'linear-gradient(135deg, #b117db 0%, #614afa 100%)',
                                        borderTopRightRadius: roundTop ? '10px' : '0px',
                                        borderBottomRightRadius: roundBottom ? '10px' : '0px'
                                    };

                                    const receiverBubbleStyle = {
                                        borderTopLeftRadius: roundTop ? '10px' : '0px',
                                        borderBottomLeftRadius: roundBottom ? '10px' : '0px'
                                    };

                                    return msg.sender === "sender" ? (
                                        // ------------------- SENDER -------------------
                                        <li key={index} className="flex justify-end" style={liStyle}>
                                            <div
                                                style={senderBubbleStyle}
                                                className="relative inline-block py-1 px-2 max-w-[60%] max-h-[200px] overflow-y-auto rounded-tl-[10px] rounded-bl-[10px] "
                                            >
                                                <p className="whitespace-pre-wrap text-[12px] text-white dark:text-white">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </li>
                                    ) : (
                                        // ------------------- RECEIVER -------------------
                                        <li key={index} className="flex items-end gap-1" style={liStyle}>

                                            {showAvatar ? (
                                                <img
                                                    src={receiverAvatar}
                                                    className="h-4 w-4 rounded-full mb-1 ml-1"
                                                    alt="avatar"
                                                />
                                            ) : (
                                                <div className="w-4 ml-1" />
                                            )}

                                            <div
                                                style={receiverBubbleStyle}
                                                className="relative inline-block px-2 py-1 bg-gray-200 dark:bg-gray-700 max-w-[60%] max-h-[200px] overflow-y-auto rounded-tr-[10px] rounded-br-[10px]"
                                            >
                                                <p className="whitespace-pre-wrap text-[12px] ">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Input Bar */}
                        <div className="instagram-input w-full flex gap-x-1 mt-1.5 h-fit bg-transparent p-2">
                            <div className="flex items-center justify-between w-full gap-4 p-2 bg-gray-100 dark:bg-[#262726] rounded-full">

                                <div className="p-2 rounded-full bg-pink-600">
                                    <FaCamera color="#fff" size={22} />
                                </div>

                                <div className="text-sm">Messages...</div>

                                <div className="flex-1 flex justify-end items-center gap-4">
                                    <FiMic size={24} />
                                    <HiOutlinePhoto size={26} />
                                    <PiStickerBold size={26} />
                                    <IoMdAddCircleOutline size={26} />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}