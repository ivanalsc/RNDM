"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { Bell, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"

// Importar DropdownMenu dinámicamente solo en el cliente
const DropdownMenu = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenu), { ssr: false })
const DropdownMenuContent = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuContent), { ssr: false })
const DropdownMenuGroup = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuGroup), { ssr: false })
const DropdownMenuItem = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuItem), { ssr: false })
const DropdownMenuLabel = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuLabel), { ssr: false })
const DropdownMenuSeparator = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuSeparator), { ssr: false })
const DropdownMenuTrigger = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuTrigger), { ssr: false })

export function UserNav() {
  const [isClient, setIsClient] = useState(false)

  // Asegurarse de que estamos en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
      </Button>

      {isClient ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@username" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">username</p>
                <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@username" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        </Button>
      )}
    </div>
  )
}

