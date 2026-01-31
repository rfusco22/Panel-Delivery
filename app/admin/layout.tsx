import React from "react"
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/sessions-memory';
import { cookies as getCookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Admin - Delivery Panel',
  description: 'Panel de administración de entregas',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validar sesión en el servidor
  const cookieStore = await getCookies();
  const sessionId = cookieStore.get('session-id')?.value;

  console.log('[v0] Admin layout - SessionId exists:', !!sessionId);

  if (!sessionId) {
    console.log('[v0] Admin layout - No session, redirecting to login');
    redirect('/login');
  }

  const session = getSession(sessionId);
  if (!session) {
    console.log('[v0] Admin layout - Invalid/expired session, redirecting to login');
    redirect('/login');
  }

  console.log('[v0] Admin layout - Valid session for user:', session.userId);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Aquí irá la navegación lateral en la siguiente tarea */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
