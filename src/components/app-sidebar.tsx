"use client"

import * as React from "react"
import {
  CircleHelp,
  Clock,
  File,
  PieChart,
} from "lucide-react"
import { usePathname } from 'next/navigation'

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { CertificationSwitcher } from "@/components/certification-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { User } from '@supabase/supabase-js'

// Add interface for the user data
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData: User;
}

// Update the data object to work with dynamic routes
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: PieChart,
    },
    {
      title: "Questions",
      url: "questions",
      icon: CircleHelp,
    },
    {
      title: "Tests",
      url: "tests",
      icon: File,
    },
    {
      title: "History",
      url: "history",
      icon: Clock,
    },
  ],
}

export function AppSidebar({ userData, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  // Extract the current certification and page from pathname
  const pathParts = pathname.split('/')
  const currentCert = pathParts[1] || 'ml-engineer' // Default to ml-engineer
  const currentPage = pathParts[2] || 'dashboard' // Default to dashboard

  // Update the data object with active states and dynamic URLs
  const navMainWithActive = data.navMain.map(item => {
    const isActive = currentPage === item.url
    const url = `/${currentCert}/${item.url}`
    
    return {
      ...item,
      url,
      isActive,
    }
  })

  const user = {
    name: userData.user_metadata?.full_name || userData.user_metadata?.name || userData.email?.split('@')[0] || 'User',
    email: userData.email || '',
    avatar: userData.user_metadata?.avatar_url || userData.user_metadata?.picture || '',
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CertificationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
