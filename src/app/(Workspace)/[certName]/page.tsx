import { redirect } from 'next/navigation'

export default async function WorkspacePage({
  params
}: {
  params: Promise<{ certName: string }>
}) {
  const { certName } = await params
  redirect(`/${certName}/dashboard`)
}