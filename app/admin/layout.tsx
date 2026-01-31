import React from "react"
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { verifySessionToken } from '@/lib/jwt';
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
  const token = cookieStore.get('auth-token')?.value;

  console.log('[v0] Admin layout - Token exists:', !!token);

  if (!token) {
    console.log('[v0] Admin layout - No token, redirecting to login');
    redirect('/login');
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    console.log('[v0] Admin layout - Invalid token, redirecting to login');
    redirect('/login');
  }

  console.log('[v0] Admin layout - Valid session for user:', payload.userId);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Aquí irá la navegación lateral en la siguiente tarea */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
