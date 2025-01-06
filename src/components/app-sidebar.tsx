"use client"

import * as React from "react"
import {
  BookOpen,
  PieChart,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { User } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'

// Add interface for the user data
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData: User;
}

// Update the data object
const data = {
  teams: [
    {
      name: "Test Prep Pro",
      logo: BookOpen,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/workspace/dashboard",
      icon: PieChart,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/workspace/dashboard",
        },
        {
          title: "Progress",
          url: "/workspace/dashboard/progress",
        },
        {
          title: "Analytics",
          url: "/workspace/dashboard/analytics",
        },
      ],
    },
    {
      title: "Practice",
      url: "/workspace/practice",
      icon: SquareTerminal,
      items: [
        {
          title: "Question Bank",
          url: "/workspace/practice/questions",
        },
        {
          title: "Mock Tests",
          url: "/workspace/practice/tests",
        },
      ],
    },
  ],
}

export function AppSidebar({ userData, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  // Update the data object with active states based on pathname
  const navMainWithActive = data.navMain.map(item => ({
    ...item,
    isActive: pathname.startsWith(item.url),
    items: item.items?.map(subItem => ({
      ...subItem,
      isActive: pathname === subItem.url
    }))
  }))
  const user = {
    name: userData.email?.split('@')[0] || 'User',
    email: userData.email || '',
    avatar: `/avatars/${userData.id}.jpg`,
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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
