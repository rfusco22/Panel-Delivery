import React from "react"
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Delivery Panel',
  description: 'Panel de administración de entregas',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Aquí irá la navegación lateral en la siguiente tarea */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
