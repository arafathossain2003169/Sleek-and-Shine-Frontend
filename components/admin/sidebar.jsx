"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, ShoppingCart, Package, Settings, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: Package,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      label: "Shop",
      href: "/",
      icon: ShoppingCart,
    }
  ]

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center justify-between h-16 border-b border-sidebar-border px-4",
            isCollapsed ? "flex-col" : "",
          )}
        >
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                S&S
              </div>
              <span className="hidden lg:inline">Sleek & Shine</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1 hover:bg-sidebar-accent rounded transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed ? "rotate-180" : "")} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                  isCollapsed ? "justify-center px-2" : "",
                )}
                title={isCollapsed ? item.label : ""}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
