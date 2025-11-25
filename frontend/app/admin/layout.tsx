import React from 'react'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side check for admin session
  const session = await getServerSession(authOptions)
  const isAdmin = Boolean((session as any)?.user?.isAdmin)

  if (!isAdmin) {
    // Redirect to admin login with an AccessDenied error
    redirect('/admin-access')
  }

  return <>{children}</>
}
