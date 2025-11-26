import { create } from "zustand"

const usePreviewData = create((set) => ({
    sender: 'Sam',
    receiver: 'John',
    isDarkMode: false,
    senderAvatar: null,
    receiverAvatar: null,
    messageArray : [],
    platform : 'Whatsapp',


    updatePreviewData : (data) => {
        set({messageArray: data}) 
    },

    updateSender: (sender) => {
        set({sender: sender})
    },

    updateReceiver: (receiver) => {
        set({receiver: receiver})
    },

    updateSenderAvatar: (senderAvatar) => {
        set({senderAvatar: senderAvatar})
    },

    updateReceiverAvatar: (receiverAvatar) => {
        set({receiverAvatar: receiverAvatar})
    },
    updatePlatform: (platform) => {
        set({platform: platform})
    },
    updateIsDarkMode: (isDarkMode) => {
        set({isDarkMode: isDarkMode})
    }
}))


export default usePreviewData;