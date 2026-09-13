'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { isCertSlug } from '@/lib/certifications'

export function NewTestButton() {
    const pathname = usePathname()
    const certSlug = pathname.split('/').filter(Boolean)[0]

    if (!isCertSlug(certSlug)) {
        return null
    }

    if (pathname === `/${certSlug}/tests/new`) {
        return null
    }

    return (
        <Button asChild size="sm" variant="secondary">
            <Link href={`/${certSlug}/tests/new`}>
                New Test
            </Link>
        </Button>
    )
}
