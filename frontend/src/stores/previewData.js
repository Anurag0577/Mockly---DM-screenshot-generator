import { create } from "zustand"

const usePreviewData = create((set) => ({
    sender: 'Sam',
    receiver: 'John',
    senderAvatar: null,
    receiverAvatar: null,
    messageArray : [],
    platform : 'Whatsapp',


    updatePreviewData : (data) => {
        console.log('this is data', data);
        set({messageArray: data}) 
    },

    updateSender: (sender) => {
        console.log('this is sender', sender);
        set({sender: sender})
    },

    updateReceiver: (receiver) => {
        console.log('this is receiver buddy', receiver);
        set({receiver: receiver})
    },

    updateSenderAvatar: (senderAvatar) => {
        console.log('this is url sender', senderAvatar)
        set({senderAvatar: senderAvatar})
    },

    updateReceiverAvatar: (receiverAvatar) => {
        console.log('this is url receiver', receiverAvatar)
        set({receiverAvatar: receiverAvatar})
    },
    updatePlatform: (platform) => {
        console.log('this is platform', platform)
        set({platform: platform})
    }
}))


export default usePreviewData;