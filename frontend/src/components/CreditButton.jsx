import { ThumbsUpIcon } from "lucide-react"
import useAuthStore from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios.js"
export default function CreditButton() {

    const { isAuthenticated } = useAuthStore();

    const {
    data: userInfo,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const response = await api.get("/auth/userInfo", {
        withCredentials: true,
      });
      return response.data.data;
    },
    enabled: isAuthenticated, 
    retry: 1,
    staleTime: 1000 * 60 * 5,  // 5 minutes
  });

  if(isError){
    console.error("Error fetching user info");
  }   

  if(isSuccess){
    console.log("Fetched user info:", userInfo);
  }

  return (
    <Button className="py-0 pe-0" variant="outline">
      <ThumbsUpIcon className="opacity-60" size={16} aria-hidden="true" />
      Credit
      <span className="relative ms-1 inline-flex h-full items-center justify-center rounded-full px-3 text-xs font-medium text-muted-foreground before:absolute before:inset-0 before:left-0 before:w-px before:bg-input">
        {userInfo?.credit ?? 0}
      </span>
    </Button>
  )
}
  