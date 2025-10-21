import { Login } from "@/pages/Login.jsx"  
import { Signup } from "@/pages/Signup.jsx" 
import { NotFound } from "@/pages/NotFound.jsx"
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Homepage } from './pages/Homepage'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Signup />,
  },
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
