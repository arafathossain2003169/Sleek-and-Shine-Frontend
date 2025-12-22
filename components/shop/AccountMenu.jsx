"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut, Settings, Home, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export default function AccountMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const isAdmin = user?.role === "admin"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {user ? (
          <>
            {/* User Info */}
            <div className="px-2 py-1.5 text-sm">
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>

            <DropdownMenuSeparator />

            {/* Common Links */}
            <DropdownMenuItem asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" /> Home
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/user/profile">My Account</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/user/orders">My Orders</Link>
            </DropdownMenuItem>

            {/* Admin Section */}
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/user/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/">Home</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/auth/login">Sign In</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/auth/register">Create Account</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
