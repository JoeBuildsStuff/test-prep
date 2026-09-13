"use client"

import * as React from "react"
import { ChevronsUpDown, LayoutGrid } from "lucide-react"
import Link from "next/link"
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
import {
  getCertSlugFromCode,
  isCertSlug,
  isWorkspaceSection,
} from "@/lib/certifications"

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

export function CertificationSwitcher() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const [certifications, setCertifications] = React.useState<Certification[]>([])
  const [activeCertification, setActiveCertification] = React.useState<Certification | null>(null)
  const [loading, setLoading] = React.useState(true)

  const currentRoute = pathname.split('/').filter(Boolean)[0]

  React.useEffect(() => {
    async function fetchCertifications() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase
          .schema('test_prep')
          .rpc('get_user_certifications', { user_id_param: user.id })

        if (data && !error) {
          setCertifications(data)
          const matchingCode = isCertSlug(currentRoute)
            ? data.find((cert: Certification) => getCertSlugFromCode(cert.code) === currentRoute)
            : null
          setActiveCertification(matchingCode ?? null)
        }
      }
      setLoading(false)
    }

    fetchCertifications()
  }, [currentRoute])

  const handleCertificationChange = async (certification: Certification) => {
    setActiveCertification(certification)

    const routeName = getCertSlugFromCode(certification.code)

    if (routeName) {
      const pathParts = pathname.split('/').filter(Boolean)
      const currentSection = isWorkspaceSection(pathParts[1]) ? pathParts[1] : 'dashboard'
      router.push(`/${routeName}/${currentSection}`)
    }

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
              <div className="size-4 animate-spin rounded-full border-b-2 border-white"></div>
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
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                {activeCertification?.provider?.[0] || 'C'}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeCertification?.provider || 'Certifications'}
                </span>
                <span className="truncate text-xs">
                  {activeCertification?.name || 'Select an exam'}
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
                <div className="flex size-6 items-center justify-center rounded-sm border text-xs font-medium">
                  {certification.provider[0]}
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
            <DropdownMenuItem asChild className="gap-2 p-2">
              <Link href="/">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <LayoutGrid className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Browse all certifications</div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
