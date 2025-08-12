"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface Certification {
  certification_id: string
  provider: string
  name: string
  code: string
  description: string
  is_active: boolean
  is_user_active: boolean
  question_count: number
  passing_score: number
  exam_duration_minutes: number
  exam_fee_usd: number
}

// Map certification codes to route names
const certCodeToRoute: Record<string, string> = {
  'MLA-C01': 'ml-engineer',
  'CLF-C02': 'cloud-practitioner',
  // Add more mappings as needed
}

// Map route names to certification codes
const routeToCertCode: Record<string, string> = {
  'ml-engineer': 'MLA-C01',
  'cloud-practitioner': 'CLF-C02',
  // Add more mappings as needed
}

export function CertificationSwitcher() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const [certifications, setCertifications] = React.useState<Certification[]>([])
  const [activeCertification, setActiveCertification] = React.useState<Certification | null>(null)
  const [loading, setLoading] = React.useState(true)

  // Extract current certification from pathname
  const currentRoute = pathname.split('/')[1] // Get the certName from /[certName]/...
  const currentCertCode = routeToCertCode[currentRoute] || 'MLA-C01' // Default to ML Engineer

  // Fetch certifications from database
  React.useEffect(() => {
    async function fetchCertifications() {
      const supabase = createClient()
      
      // Get user ID (you'll need to implement this based on your auth setup)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .schema('test_prep')
          .rpc('get_user_certifications', { user_id_param: user.id })
        
        if (data && !error) {
          setCertifications(data)
          // Set active certification based on current route
          const active = data.find((cert: Certification) => cert.code === currentCertCode) || data[0]
          setActiveCertification(active)
        }
      }
      setLoading(false)
    }

    fetchCertifications()
  }, [currentCertCode])

  const handleCertificationChange = async (certification: Certification) => {
    setActiveCertification(certification)
    
    // Get the route name for this certification
    const routeName = certCodeToRoute[certification.code]
    
    if (routeName) {
      // Navigate to the new certification route
      // Extract the current page from pathname (e.g., /ml-engineer/dashboard -> /cloud-practitioner/dashboard)
      const currentPage = pathname.split('/').slice(2).join('/') // Remove the certName part
      const newPath = `/${routeName}/${currentPage}`
      router.push(newPath)
    }
    
    // Update user's active certification in database
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase
        .schema('test_prep')
        .rpc('set_user_active_certification', {
          user_id_param: user.id,
          certification_id_param: certification.certification_id
        })
    }
  }

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ChevronsUpDown className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeCertification?.provider || 'AWS'}
                </span>
                <span className="truncate text-xs">
                  {activeCertification?.name || 'Select Certification'}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Certifications
            </DropdownMenuLabel>
            {certifications.map((certification) => (
              <DropdownMenuItem
                key={certification.certification_id}
                onClick={() => handleCertificationChange(certification)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <ChevronsUpDown className="size-4 shrink-0" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{certification.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {certification.question_count} questions
                  </span>
                </div>
                {activeCertification?.certification_id === certification.certification_id && (
                  <DropdownMenuShortcut>✓</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add certification</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
