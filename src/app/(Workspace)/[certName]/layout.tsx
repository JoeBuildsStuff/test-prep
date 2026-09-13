import { redirect } from 'next/navigation'
import { isCertSlug } from '@/lib/certifications'

export default async function CertLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ certName: string }>
}) {
  const { certName } = await params

  if (!isCertSlug(certName)) {
    redirect('/')
  }

  return children
}
