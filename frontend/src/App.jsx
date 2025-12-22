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
    { popover: { title: 'Quick Tour Guide', description: 'Here is the guide for how to poperly use generate the screenshot. Let\'s walk you through it.', side: "left", align: 'start' }},
    { element: '#senderParticipant-driver', popover: { title: 'Add sender details', description: 'The image and name you add here will considered as a sender (your) info.', side: "left", align: 'start' }},
    { element: '#receiverParticipant-driver', popover: { title: 'Add Receiver details', description: 'The image and name you add here will considered as a receiver (other person) info.', side: "bottom", align: 'start' }},
    { element: '#massageField-driver', popover: { title: 'Write messages here.', description: 'Write the messages you want to display in the screenshot. There are some rules, Read full Guide for more info.', side: "bottom", align: 'start' }},
    { element: '#renderedUI-driver', popover: { title: 'Real time preview.', description: 'Here you can see the preview of the screenshot. The messages you write in the input box will replicated here.', side: "left", align: 'start' }},
    { element: '#themeToggle-driver', popover: { title: 'Change Theme', description: '', side: "top", align: 'start' }},
    { element: '#platformDropdownBtn-driver', popover: { title: 'Change platform ', description: 'You can choose the platform here for which you want to generate screeenshot.', side: "right", align: 'start' }},
    { element: '#downloadBtn-driver', popover: { title: 'Download screenshot from here.', description: 'Press this button to download the screenshot in your locals.', side: "right", align: 'start' }},
    { popover: { title: 'All the best!', description: 'And that is all, go ahead and start downloading the screenshot!.' } }
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

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App