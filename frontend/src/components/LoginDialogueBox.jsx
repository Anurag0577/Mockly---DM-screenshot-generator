import {useId } from "react"
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useMutation } from "@tanstack/react-query"
import api from "@/api/axios.js"
import { useNavigate } from "react-router"
import useAuthStore from "@/stores/useAuthStore"

export default function LoginDialogueBox() {
  const id = useId()
  // const [open, setOpen] = useState(false) // this is default code
  const {openLoginDialog: open, setOpenLoginDialog: setOpen} = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const {login} = useAuthStore();
  const loginUser = useMutation({
    mutationKey: ['loginUser'],
    mutationFn: async ({ email, password }) => {
      return await api.post('/auth/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
    },
    onSuccess: (data) => {
      console.log('User login successful', data)
      if (data?.data?.data?.accessToken) {
        login(data.data?.data.accessToken);
      }
      toast.success('You are logged in!');
      setOpen(false)
      navigate('/')
    },
    onError: (error) => {
      console.error('Error occurs while login', error)
      toast.error(`${error?.response?.data?.message}`);
    }
  })
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 md:flex-none">Log in</Button>
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
            <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your credentials to login to your account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input id={`${id}-email`} placeholder="hi@yourcompany.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox id={`${id}-remember`} />
              <Label htmlFor={`${id}-remember`} className="font-normal text-muted-foreground">
                Remember me
              </Label>
            </div>
            <a className="text-sm underline hover:no-underline" href="#">
              Forgot password?
            </a>
          </div>
          <Button 
            type="button" 
            className="w-full"
            onClick={()=> loginUser.mutate({email, password})}
            disabled= {loginUser.isPending}
            >
            {loginUser.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div
          className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Or</span>
        </div>

        <Button variant="outline">Login with Google</Button>
      </DialogContent>
    </Dialog>
  );
}
