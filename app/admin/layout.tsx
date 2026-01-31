import React from "react"
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { cookies } from 'next/headers';

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
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  if (!session.isLoggedIn) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Aquí irá la navegación lateral en la siguiente tarea */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
