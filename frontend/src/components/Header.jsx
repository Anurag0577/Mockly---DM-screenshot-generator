import { useId } from "react";
import { MicIcon, SearchIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import ThemeSwitch from "./comp-130";
import CreditButton from "./CreditButton";
import ProfileDropdown from "./ProfileDropdown";
import SignUpDialogueBox from "./SignupDialogueBox";
import LoginDialogueBox from "./LoginDialogueBox";
import useAuthStore from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();
  const id = useId();
  const { isAuthenticated, initializeAuth } = useAuthStore();


  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);


  // const {
  //   data: userInfo,
  //   isError,
  //   isSuccess,
  // } = useQuery({
  //   queryKey: ["userInfo"],
  //   queryFn: async () => {
  //     const response = await api.get("/auth/userInfo", {
  //       withCredentials: true,
  //     });
  //     console.log("User info response:", response.data);
  //     return response.data.data;
  //   },
  //   enabled: isAuthenticated, 
  //   retry: 1,
  //   staleTime: 1000 * 60 * 5, 
  // });

  // if(isError){
  //   console.error("Error fetching user info");
  // }   

  // if(isSuccess){
  //   console.log("Fetched user info:", userInfo);
  // }

  return (
    <header className=" px-4 border-b">
      <div className="flex flex-col items-center justify-start md:flex-row md:h-16 md:justify-between md:gap-4  rounded-lg md:p-4 ">
        {/* Logo */}
        <div className="md:flex-1">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-black dark:text-primary text-2xl font-bold">
            Mockly
          </a>
        </div>
        {/* Right side */}
        {(!isAuthenticated)?(
            <div className="flex items-center py-1 w-full gap-2 md:py-0 md:justify-end md:w-fit">
              <LoginDialogueBox className="flex-1" /> 
              <SignUpDialogueBox />
              <ThemeSwitch  />
          </div>
        ) 
        :
        (
            <div className="flex items-center py-1 w-full gap-2 md:py-0 md:justify-end md:w-fit">
                <CreditButton />
                <Button asChild size="sm" className="text-sm flex-1">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/buy-credits'); }}> 
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
