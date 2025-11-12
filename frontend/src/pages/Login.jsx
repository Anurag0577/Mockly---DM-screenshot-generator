import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LetterGlitch from '../components/LetterGlitch.jsx'
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import api from "@/api/axios.js"
import { useNavigate } from "react-router"

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(null);
  const navigate = useNavigate()
  const loginUser = useMutation({
    mutationKey: ['loginUser'],
    mutationFn: async({email, password}) => {
      await api.post('/auth/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
    },
    onSuccess: (data) => {
      console.log('User login successfull', data)
      navigate('/home')
    },
    onError: (error)=>{
      console.log('Error occurs while login', error)
    }
  })

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
    <LetterGlitch
        glitchSpeed={60}
        centerVignette={true}
        outerVignette={true}
        smooth={true}
        className="relative "
    />    
    <Card className="w-full max-w-sm absolute z-10">
      <CardHeader>
        <CardTitle className="text-3xl tracking-tighter leading-tight">Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={() => navigate('/register')} >Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value= {email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="w-full"
          onClick={() => {
            loginUser.mutate({ firstName, lastName, email, password, userName });
          }}
          disabled={loginUser.isPending} // ⬅ disables the button while request in progress
        >
          {loginUser.isPending ? "Logging in..." : "Login"}
        </Button>
        {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
      </CardFooter>
    </Card>
    </div>
  )
}
