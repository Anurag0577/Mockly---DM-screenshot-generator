import { useId } from "react";
import { MicIcon, SearchIcon, SparklesIcon } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ThemeSwitch from "./comp-130";
import CreditButton from "./CreditButton";
import ProfileDropdown from "./ProfileDropdown";
import SignUpDialogueBox from "./SignupDialogueBox";
import LoginDialogueBox from "./LoginDialogueBox";
import useAuthStore from "@/stores/authStore";
import api from "@/api/axios";

export default function Header() {
  const id = useId();
  const { isAuthenticated, initializeAuth } = useAuthStore();

  // Run once on mount to check token / auth state
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Only fetch user info if the user is authenticated
  const {
    data: userInfo,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const response = await api.get("/auth/userInfo", {
        withCredentials: true,
      });
      console.log("User info response:", response.data);
      return response.data.data;
    },
    enabled: isAuthenticated, // This is the key line!
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
  });

  if(isLoading){
    return <div>Loading...</div>;
  }

  if(isError){
    console.error("Error fetching user info");
  }   

  if(isSuccess){
    console.log("Fetched user info:", userInfo);
  }

  return (
    <header className=" px-4 md:px-4 border-b">
      <div className="flex h-16 items-center justify-between gap-4  rounded-lg p-4 ">
        {/* Logo */}
        <div className="flex-1">
          <a href="#" className="text-primary hover:text-primary/90 font-bold">
            Mockly
          </a>
        </div>
        {/* Right side */}
        {(!isAuthenticated)?(
            <div className="flex flex-1 items-center justify-end gap-2">
                <CreditButton userInfo={userInfo}/>
            {/* <Button asChild variant="ghost" size="sm" className="text-sm                <CreditButton user={userInfo} />Login</a>
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
                <CreditButton userInfo={userInfo} />
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
