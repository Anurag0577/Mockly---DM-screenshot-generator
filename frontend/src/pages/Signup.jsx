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
import { useQuery } from "@tanstack/react-query"
import api from "@/api/axios.js"


export function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const userSignup = async() => {
    const res = await api.post('/auth/register', {
      firstName,
      lastName,
      email,
      password
    })
    const savedUserDetail = res.data;

    if(savedUserDetail.data && savedUserDetail){
      console.log('User register successfully!', savedUserDetail)
    } else {
      throw new Error('Invalid response formate.')
    }
  }

  const registerUser = async(firstName, lastName, email, password) => {
    const query = useQuery({
      queryKey: ['register'],
      queryFn: userSignup
    })
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
    <LetterGlitch
        glitchSpeed={100}
        centerVignette={true}
        outerVignette={true}
        smooth={true}
        className="relative"
    />        
    <Card className="w-full max-w-sm absolute z-10">
      <CardHeader>
        <CardTitle className="text-3xl tracking-tighter">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Login</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="firstname">Firstname</Label>
              <Input
                id="firstname"
                type="text"
                placeholder="John"
                onChange={(e) => {
                  e.preventDefault();
                  setFirstName(e.target.value);
                }}
                value={firstName}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastname">Lastname</Label>
              <Input
                id="lastname"
                type="text"
                placeholder="Doe"
                onChange={(e) => {
                  e.preventDefault();
                  setLastName(e.target.value);
                }}
                value={lastName}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => {
                  e.preventDefault(); // if we did not use it, the page would refresh whenever we type  
                  setEmail(e.target.value);
                }}
                value={email}
                required
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
              <Input 
                id="password" 
                type="password" 
                onChange={(e) => {
                  e.preventDefault();
                  setPassword(e.target.value);
                }}
                value={password}
                required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={() => {
          registerUser(firstName, lastName, email, password);
          // Handle signup logic here
        }}>
          Create an account
        </Button>
        {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
      </CardFooter>
    </Card>
    </div>
  )
}
