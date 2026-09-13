"use client"

import * as React from "react"
import {
  CircleHelp,
  Clock,
  File,
  LayoutGrid,
  PieChart,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { CertificationSwitcher } from "@/components/certification-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {
  CERTIFICATIONS,
  LAST_CERT_STORAGE_KEY,
  isCertSlug,
} from "@/lib/certifications"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData: User;
}

const workspaceNav = [
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
]

export function AppSidebar({ userData, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const pathParts = pathname.split('/').filter(Boolean)
  const slugFromPath = isCertSlug(pathParts[0]) ? pathParts[0] : null
  const [storedCert, setStoredCert] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (slugFromPath) {
      window.localStorage.setItem(LAST_CERT_STORAGE_KEY, slugFromPath)
      setStoredCert(slugFromPath)
      return
    }

    const saved = window.localStorage.getItem(LAST_CERT_STORAGE_KEY)
    if (isCertSlug(saved)) {
      setStoredCert(saved)
    }
  }, [slugFromPath])

  const currentCert = slugFromPath ?? (isCertSlug(storedCert) ? storedCert : CERTIFICATIONS[0].slug)
  const currentPage = slugFromPath ? pathParts[1] : undefined
  const isHome = pathname === '/'

  const navMainWithActive = workspaceNav.map((item) => ({
    ...item,
    url: `/${currentCert}/${item.url}`,
    isActive: currentPage === item.url,
  }))

  const isAnonymous = userData.is_anonymous ?? false

  const user = {
    name: isAnonymous ? 'Guest' : (userData.user_metadata?.full_name || userData.user_metadata?.name || userData.email?.split('@')[0] || 'User'),
    email: isAnonymous ? 'No account' : (userData.email || ''),
    avatar: isAnonymous ? '' : (userData.user_metadata?.avatar_url || userData.user_metadata?.picture || ''),
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CertificationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isHome} tooltip="Certifications">
                  <Link href="/">
                    <LayoutGrid />
                    <span>Certifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavMain items={navMainWithActive} />
      </SidebarContent>
      <SidebarFooter>
        {isAnonymous && (
          <Card className="m-0 gap-2 border-none p-4">
            <CardHeader className="m-0 p-0">
              <CardTitle className="text-sm">Don&apos;t Lose Your Progress!</CardTitle>
              <CardDescription className="text-xs">
                Without an account, your data may be lost after 30 days or if you switch devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <Button asChild size="sm" className="w-full">
                <Link href="/login">Create Account</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        <NavUser user={user} isAnonymous={isAnonymous} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
