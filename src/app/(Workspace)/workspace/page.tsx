import { redirect } from 'next/navigation'

export default function WorkspacePage() {
  // Redirect to the default certification (ML Engineer)
  redirect('/ml-engineer/dashboard')
}