import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DynamicBreadcrumbs } from '@/components/dynamic-breadcrumbs'
import { ModeToggle } from "@/components/ui/mode-toggle"
import { NewTestButton } from "@/components/new-test-button"

// Map certName to certification code for validation
const validCertNames = ['ml-engineer', 'cloud-practitioner']

export default async function CertLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ certName: string }>
}) {
  const { certName } = await params
  
  // Validate the certName
  if (!validCertNames.includes(certName)) {
    redirect('/ml-engineer/dashboard')
  }

  // Get user session
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  return (
    <SidebarProvider>
      <AppSidebar userData={user} />
      <SidebarInset>
        <div className="grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
          <header className="sticky top-0 z-10 bg-background/30 backdrop-blur-sm flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 flex-grow">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumbs />
            </div>
            <div className="flex justify-between items-center">
              <NewTestButton />
            </div>
            <ModeToggle className="ml-auto mr-5 border-none" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
          <footer className="flex justify-center items-center h-16">
            {/* Footer content */}
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
