import { useId } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import api from "@/api/axios.js"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"

export default function SignUpDialogueBox() {
  const id = useId()
  const [open , setOpen] = useState(false)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const navigate = useNavigate();
  const registerUser = useMutation({
    mutationKey: ['registerUser'],
    mutationFn: async ({firstName, lastName, email, password, userName}) => { // newUser should contain firstName, lastName, email, password. the difference between newUser and data is that newUser is the argument passed to the mutation function, while data is the response from the server after the mutation is executed
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
      if(data?.accessToken){
        localStorage.setItem('accessToken', data.accessToken);
      }
      setOpen(false)
      navigate('/');
    },
    onError: (error) => {
      console.error('Error registering user:', error);
    },
    onMutate: () => {
      console.log('Registering user...');
    }
  })

  return (
    <Dialog open ={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="default">Create account</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true">
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true">
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Create new account
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              We just need a few details to get you started.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="flex gap-x-3"> 
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-name`}>Firstname</Label>
              <Input id={`${id}-name`} placeholder="Matt" type="text" value={firstName} 
              onChange={(e)=>{
                setFirstName(e.target.value)
              }
      } required />
            </div>
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-name`}>Lastname</Label>
              <Input id={`${id}-name`} placeholder="Welsh" type="text" value={lastName} 
              onChange={(e)=>{
                setLastName(e.target.value)
              } } />
            </div>
            </div>
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-name`}>Username</Label>
              <Input id={`${id}-name`} placeholder="matt123" type="text" value={userName} 
              onChange={(e)=>{
                setUserName(e.target.value)
              } } required />
            </div>
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input id={`${id}-email`} placeholder="hi@yourcompany.com" type="email" value={email} 
              onChange={(e)=>{
                setEmail(e.target.value)
              } }  
              required />
            </div>
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                required />
            </div>
          </div>
          <Button 
            type="button" 
            className="w-full"
            onClick={() => registerUser.mutate({ firstName, lastName, email, password, userName })}
            disabled={registerUser.isPending}
            >
            {(registerUser.isPending) ? ('Creating...') :('Create account')}
          </Button>
        </form>

        <div
          className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Or</span>
        </div>

        <Button variant="outline">Continue with Google</Button>

        <p className="text-center text-xs text-muted-foreground">
          By signing up you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Terms
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}
