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
import api from "@/api/axios.js"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"


export function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const navigate = useNavigate();
  const registerUser = useMutation({
    mutationKey: ['registerUser'],
    mutationFn: async ({firstName, lastName, email, password, userName}) => { // newUser should contain firstName, lastName, email, password. the difference between newUser and data is that newUser is the argument passed to the mutation function, while data is the response from the server after the mutation is executed
      console.log('Registering user with data:', {firstName, lastName, email, password, userName});
      const response = await api.post('/auth/register', {firstName, lastName, email, password, userName}, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('User registered successfully:', data);
      navigate('/home');
    },
    onError: (error) => {
      console.error('Error registering user:', error);
    },
    onMutate: () => {
      console.log('Registering user...');
    }
  })

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
          <Button variant="link" onClick={() => navigate('/login')}>Login</Button>
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
              <Label htmlFor="userName">userName</Label>
              <Input
                id="userName"
                type="text"
                placeholder="John123"
                onChange={(e) => {
                  e.preventDefault();
                  setUserName(e.target.value);
                }}
                value={userName}
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
        <Button
          type="submit"
          className="w-full"
          onClick={() => {
            registerUser.mutate({ firstName, lastName, email, password, userName });
          }}
          disabled={registerUser.isPending} // ⬅ disables the button while request in progress
        >
          {registerUser.isPending ? "Creating new user..." : "Create an account"}
        </Button>
        {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
      </CardFooter>
    </Card>
    </div>
  )
}
