"use client"

import { useRouter } from "next/navigation"
import { LogOut, UserPlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/providers/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AccountSwitcher() {
  const router = useRouter()
  const { username, logout } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2">
          <Avatar className="h-8 w-8 border border-primary/40">
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {username?.slice(0, 2).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[80px] truncate font-mono text-sm sm:inline md:max-w-none">
            @{username}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="gap-2">
          <span className="font-mono">@{username}</span>
          <span className="ml-auto text-xs text-muted-foreground">Current</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/login?add=1")}
          className="gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Sign in another account
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            void logout()
            router.replace("/login")
          }}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
