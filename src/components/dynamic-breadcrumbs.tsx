'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getCertBySlug, isCertSlug } from '@/lib/certifications'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const SECTION_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  questions: 'Questions',
  tests: 'Tests',
  history: 'History',
  new: 'New Test',
}

type Crumb = {
  name: string
  href?: string
}

function titleCase(value: string) {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function labelForSegment(segment: string, parent?: string) {
  if (SECTION_LABELS[segment]) return SECTION_LABELS[segment]
  if (UUID_RE.test(segment)) {
    if (parent === 'questions') return 'Question'
    if (parent === 'tests') return 'Test'
    return 'Details'
  }
  return titleCase(segment)
}

function generateBreadcrumbs(pathname: string, searchParams: URLSearchParams): Crumb[] {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return [{ name: 'Certifications' }]
  }

  const crumbs: Crumb[] = [{ name: 'Certifications', href: '/' }]
  const [maybeCert, ...rest] = segments

  if (!isCertSlug(maybeCert)) {
    rest.unshift(maybeCert)
    rest.forEach((segment, index) => {
      const isLast = index === rest.length - 1
      crumbs.push({
        name: labelForSegment(segment, rest[index - 1]),
        href: isLast ? undefined : '/' + rest.slice(0, index + 1).join('/'),
      })
    })
    return crumbs
  }

  const cert = getCertBySlug(maybeCert)
  const hasFilters = Boolean(searchParams.get('section') || searchParams.get('subsection'))

  crumbs.push({
    name: cert?.shortName ?? titleCase(maybeCert),
    href: rest.length === 0 ? undefined : `/${maybeCert}/dashboard`,
  })

  rest.forEach((segment, index) => {
    const isLast = index === rest.length - 1 && !hasFilters
    crumbs.push({
      name: labelForSegment(segment, rest[index - 1]),
      href: isLast ? undefined : `/${maybeCert}/${rest.slice(0, index + 1).join('/')}`,
    })
  })

  const page = rest[0] ?? 'questions'
  const section = searchParams.get('section')
  const subsection = searchParams.get('subsection')

  if (section) {
    crumbs.push({
      name: section,
      href: subsection ? `/${maybeCert}/${page}?section=${encodeURIComponent(section)}` : undefined,
    })
  }

  if (subsection) {
    crumbs.push({ name: subsection })
  }

  return crumbs
}

export function DynamicBreadcrumbs() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const breadcrumbs = generateBreadcrumbs(pathname, searchParams)

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={`${crumb.name}-${crumb.href ?? 'current'}`}>
            <BreadcrumbItem className="shrink-0">
              {crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href} className="truncate max-w-[10rem] sm:max-w-[16rem]">
                    {crumb.name}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="truncate max-w-[12rem] sm:max-w-[20rem]">
                  {crumb.name}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
