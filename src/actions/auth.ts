'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { createClient } from '@/utils/supabase/server'

const authSchema = z.object({
  email: z.string().email(),
})

async function isCurrentUserAnonymous(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.is_anonymous ?? false
}

export async function signInWithMagicLink(formData: FormData) {
  'use server'
  
  const supabase = await createClient()

  const result = authSchema.safeParse({
    email: formData.get('email'),
  })

  if (!result.success) {
    console.log("validation-error", result.error)
    redirect('/error')
  }

  const anonymous = await isCurrentUserAnonymous()

  if (anonymous) {
    const { error } = await supabase.auth.updateUser({
      email: result.data.email,
    })

    if (error) {
      console.log("link-email-error", error)
      redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/verify-email')
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: result.data.email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
  })

  if (error) {
    console.log("magic-link-error", error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/verify-email')
}

export async function signInWithGoogle() {
  'use server'

  const supabase = await createClient()
  const anonymous = await isCurrentUserAnonymous()

  if (anonymous) {
    const { data, error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })

    if (error) {
      console.log("link-google-error", error)
      redirect('/error')
    }

    if (data.url) {
      redirect(data.url)
    }

    revalidatePath('/', 'layout')
    return
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  })

  if (error) {
    console.log("google-signin-error", error)
    redirect('/error')
  }

  if (data.url) {
    redirect(data.url)
  }

  revalidatePath('/', 'layout')
}

export async function signInWithGithub() {
  'use server'
  
  const supabase = await createClient()
  const anonymous = await isCurrentUserAnonymous()

  if (anonymous) {
    const { data, error } = await supabase.auth.linkIdentity({
      provider: 'github',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })

    if (error) {
      console.log("link-github-error", error)
      redirect('/error')
    }

    if (data.url) {
      redirect(data.url)
    }

    revalidatePath('/', 'layout')
    return
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  })

  if (error) {
    console.log("github-signin-error", error)
    redirect('/error')
  }

  if (data.url) {
    redirect(data.url)
  }

  revalidatePath('/', 'layout')
}