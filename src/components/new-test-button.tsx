'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from 'next/navigation'

export function NewTestButton() {
    const pathname = usePathname()
    
    if (pathname === '/workspace/tests/new') {
        return null
    }

    return (
        <Link href="/workspace/tests/new">
            <Button size="sm" variant="secondary">
                New Test
            </Button>
        </Link>
    )
}