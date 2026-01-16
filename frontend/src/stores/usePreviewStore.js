import { toast } from "sonner";
import { create } from "zustand"

// Helper function to get the initial dark mode state from localStorage
const getInitialIsDarkMode = () => {
    const theme = localStorage.getItem('theme');
    if (!theme) return false;
    return theme === 'dark';
};

const usePreviewData = create((set) => ({
    sender: 'Sam',
    receiver: 'John',
    // Initialized as a boolean state based on localStorage
    isDarkMode: getInitialIsDarkMode(), 
    senderAvatar: null,
    receiverAvatar: null,
    messageArray : [],
    platform : 'Whatsapp',
    isHeaderFooterRendered: true,


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
        console.log("Updating platform to: ", platform)
        set({platform: platform})
        toast(`Platform changed to ${platform}`)
    },
    // This action now correctly updates the boolean state
    updateIsDarkMode: (isDarkMode) => {
        set({isDarkMode: isDarkMode})
        toast(`Switched to ${!isDarkMode ? "light" : "dark"} mode.`);
    },

    updateIsHeaderFooterRendered: (isHeaderFooterRendered) => {
        set({isHeaderFooterRendered : isHeaderFooterRendered})
        toast(`Switched to ${!isHeaderFooterRendered ? 'Hide' : 'Show'} mode.`)
    }
}))


export default usePreviewData;