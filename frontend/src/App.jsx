import { Login } from "@/pages/Login.jsx"  
import { Signup } from "@/pages/Signup.jsx" 
import { NotFound } from "@/pages/NotFound.jsx"
import { Homepage } from '@/pages/Homepage.jsx'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Optional: disable auto-refetch on window focus
      retry: 1, // Optional: retry failed requests once
    },
  },
})

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