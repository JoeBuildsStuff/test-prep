import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { DynamicBreadcrumbs } from '@/components/dynamic-breadcrumbs'
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function WorkspaceLayout({
  children
}: {
  children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
      redirect('/login')
    }

    return (
      <SidebarProvider>
        <AppSidebar userData={data.user} />
        <SidebarInset>
          <div className="grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
          <header className="sticky top-0 z-10 bg-background/30 backdrop-blur-sm flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 flex-grow">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumbs />
            </div>
            <div className="flex justify-between items-center">
                <Link href="/workspace/tests/new">
                    <Button size="sm" variant="secondary">
                        Create New Test
                    </Button>
                </Link>
            </div>
            <ModeToggle className="ml-auto mr-5 border-none" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
          <footer className="flex justify-center items-center h-16">
         
          </footer>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
}
