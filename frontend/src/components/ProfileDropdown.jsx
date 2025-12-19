import {
  BoltIcon,
  BadgeDollarSign,
  BookOpenIcon,
  ChevronDownIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useAuthStore from "@/stores/useAuthStore"

export default function ProfileDropdown() {
 const {user, isAuthenticated} = useAuthStore();
 const navigate = useNavigate();
  const handleLogout = () => {
    const {logout} = useAuthStore.getState();
    logout();
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src="/origin/avatar.jpg" alt="Profile image" />
            <AvatarFallback className='text-white dark:text-black'>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {user?.username }
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user?.email }
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={(e) => { e.preventDefault(); navigate('/buy-credits'); }}>
            <BadgeDollarSign size={16} className="opacity-60" aria-hidden="true" />
            <span>Buy more credits</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span onClick={handleLogout}>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
