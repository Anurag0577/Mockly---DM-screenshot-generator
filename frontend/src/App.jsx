import { Login } from "@/pages/Login.jsx"  
import { Signup } from "@/pages/Signup.jsx" 
import { NotFound } from "@/pages/NotFound.jsx"
import { Homepage } from '@/pages/Homepage.jsx'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BuyCredits from "./components/BuyCredits"
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Toaster} from 'sonner'
import usePreviewData from "@/stores/usePreviewStore.js";


// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Optional: disable auto-refetch on window focus
      retry: 1, // Optional: retry failed requests once
    },
  },
})



const driverObj = driver({
  popoverClass: 'driverjs-theme',
  showProgress: true,
  steps: [
    { 
      popover: { 
        title: 'Welcome to Screenshot Gen!', 
        description: 'Need a perfect chat mockup? Let’s show you how to build one in seconds.', 
        side: "center", 
        align: 'start' 
      }
    },
    { 
      element: '#senderParticipant-driver', 
      popover: { 
        title: 'Your Profile', 
        description: 'Set your name and avatar here. This will represent "You" in the chat bubbles.', 
        side: "left", 
        align: 'start' 
      }
    },
    { 
      element: '#receiverParticipant-driver', 
      popover: { 
        title: 'Recipient Profile', 
        description: 'Add the details of the person you are "chatting" with.', 
        side: "bottom", 
        align: 'start' 
      }
    },
    { 
      element: '#massageField-driver', 
      popover: { 
        title: 'Draft Your Conversation', 
        description: 'Type your messages here. Remember you have to follow some rules to write a message. Please check out full details at bottom left.', 
        side: "bottom", 
        align: 'start' 
      }
    },
    { 
      element: '#renderedUI-driver', 
      popover: { 
        title: 'Live Preview', 
        description: 'Watch your chat come to life instantly. What you see here is exactly what your screenshot will look like.', 
        side: "left", 
        align: 'start' 
      }
    },
    { 
      element: '#platformDropdownBtn-driver', 
      popover: { 
        title: 'Select Platform', 
        description: 'Switch between apps like WhatsApp and Instagram to change the UI style.', 
        side: "right", 
        align: 'start' 
      }
    },
    { 
      element: '#themeToggle-driver', 
      popover: { 
        title: 'Dark/Light Mode', 
        description: 'Toggle the theme to match the vibe of your conversation.', 
        side: "top", 
        align: 'start' 
      }
    },
    { 
      element: '#downloadBtn-driver', 
      popover: { 
        title: 'Save Your Work', 
        description: 'Once you’re happy with the preview, hit download to save the high-res image to your device.', 
        side: "right", 
        align: 'start' 
      }
    },
    { 
      popover: { 
        title: 'Ready to go!', 
        description: 'You’re all set. Start creating your first mock conversation now!', 
        side: "center" 
      } 
    }
  ]
});

driverObj.drive();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Signup />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/buy-credits",
    element: <BuyCredits />
  }
]);

function App() {
  const isDarkMode = usePreviewData((state) => state.isDarkMode);
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster 
        position="bottom-left" 
        richColors 
        theme={isDarkMode ? "dark" : "light"}
        toastOptions={{
          style: {
            background: isDarkMode ? '#1a1a1a' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            border: isDarkMode ? '1px solid #333' : '1px solid #ddd',
          },
          classNameStack: isDarkMode ? 'dark-toast-stack' : 'light-toast-stack',
        }}
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App