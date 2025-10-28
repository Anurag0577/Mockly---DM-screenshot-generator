import { useId } from "react"
import { MicIcon, SearchIcon } from "lucide-react"
import { SparklesIcon } from "lucide-react"


// import ThemeToggle from "@/registry/default/components/navbar-components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ThemeSwitch from "./comp-130"
import CreditButton from "./CreditButton"
import ProfileDropdown from "./ProfileDropdown"
import SignUpDialogueBox from "./SignupDialogueBox"
import LoginDialogueBox from "./LoginDialogueBox"

export default function Header() {
  const id = useId()
    const booleanFlag = false;
  return (
    <header className=" px-4 md:px-4">
      <div className="flex h-16 items-center justify-between gap-4 border mt-4 rounded-lg p-4 ">
        {/* Logo */}
        <div className="flex-1">
          <a href="#" className="text-primary hover:text-primary/90 font-bold">
            Mockly
          </a>
        </div>
        {/* Right side */}
        {(!booleanFlag)?(
            <div className="flex flex-1 items-center justify-end gap-2">
                <CreditButton/>
            {/* <Button asChild variant="ghost" size="sm" className="text-sm">
                <a href="#">Login</a>
            </Button> */}
            <SignUpDialogueBox/>
            {/* <Button asChild size="sm" className="text-sm">
                <a href="#">Signup</a>
            </Button> */}
            <LoginDialogueBox/>
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
