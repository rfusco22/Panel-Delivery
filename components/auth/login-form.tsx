'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AlertCircle, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[v0] Enviando solicitud de login para:', email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Enviar cookies con la solicitud
      });

      console.log('[v0] Respuesta del servidor:', response.status);
      const data = await response.json();
      console.log('[v0] Datos de respuesta:', data);

      if (!response.ok) {
        console.log('[v0] Login fallido:', data.message);
        setError(data.message || 'Error de autenticación');
        setLoading(false);
        return;
      }

      console.log('[v0] Login exitoso, redirigiendo a dashboard');
      
      // Resetear loading antes de navegar
      setLoading(false);
      
      // Pequeño delay para asegurar que la cookie se establece
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Esperar a que router.push se complete
      await router.push('/admin/dashboard');
      console.log('[v0] Navegación completada');
    } catch (err) {
      console.error('[v0] Error en login:', err);
      setError('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md p-8 shadow-lg">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-100 rounded-lg mb-4">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Delivery Panel</h1>
          <p className="text-sm text-slate-600 mt-2">Sistema de Gestión de Entregas</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@delivery.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className="h-10"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {loading ? 'Conectando...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs font-medium text-slate-700 mb-2">Credenciales de Demostración:</p>
          <p className="text-xs text-slate-600">Email: <span className="font-mono font-semibold">admin@delivery.com</span></p>
          <p className="text-xs text-slate-600">Contraseña: <span className="font-mono font-semibold">admin123</span></p>
        </div>
      </Card>
    </div>
  );
}
