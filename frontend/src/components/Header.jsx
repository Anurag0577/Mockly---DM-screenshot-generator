import { useEffect, useId } from "react"
import { MicIcon, SearchIcon } from "lucide-react"
import { SparklesIcon } from "lucide-react"
import {jwtDecode} from "jwt-decode"


// import ThemeToggle from "@/registry/default/components/navbar-components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ThemeSwitch from "./comp-130"
import CreditButton from "./CreditButton"
import ProfileDropdown from "./ProfileDropdown"
import SignUpDialogueBox from "./SignupDialogueBox"
import LoginDialogueBox from "./LoginDialogueBox"
import useAuthStore from "@/stores/authStore"

export default function Header() {
  const id = useId()

  const {isAuthenticated, initializeAuth} = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth])
  


  return (
    <header className=" px-4 md:px-4 border-b">
      <div className="flex h-16 items-center justify-between gap-4  rounded-lg p-4 ">
        {/* Logo */}
        <div className="flex-1">
          <a href="#" className=" text-2xl hover:text-primary/90 font-bold ">
            DM Screenshot Generator 
          </a>
          <span className="text-[12px] text-gray-400 ml-3 tracking-normal">by Anurag</span>
        </div>
        {/* Right side */}
        {(!isAuthenticated)?(
            <div className="flex flex-1 items-center justify-end gap-2">
                <CreditButton/>
            {/* <Button asChild variant="ghost" size="sm" className="text-sm">
                <a href="#">Login</a>
            </Button> */}
            <LoginDialogueBox/>
            <SignUpDialogueBox/>
            {/* <Button asChild size="sm" className="text-sm">
                <a href="#">Signup</a>
            </Button> */}
            
            <ThemeSwitch />
            </div>
        ) 
        :
        (
            <div className="flex flex-1 items-center justify-end gap-2">
                <CreditButton/>
                <Button asChild size="sm" className="text-sm">
                    <a href="#">
                        <SparklesIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
                        Buy Credits
                    </a>
                </Button>
                <ProfileDropdown/>
                <ThemeSwitch />
            </div>
        )}
        
      </div>
    </header>
  )
}
