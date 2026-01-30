'use client';

import { Card } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { SalesHeatmap, type HeatmapPoint } from '@/components/dashboard/sales-heatmap';
import { DeliveryProviderRanking } from '@/components/dashboard/delivery-provider-ranking';
import { OrderStats } from '@/components/dashboard/order-stats';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Session {
  userId: string;
  userName: string;
  userRole: string;
}

function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        console.log('[v0] Dashboard mounted, fetching session...');
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        });
        console.log('[v0] Session response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('[v0] Session data received:', data);
          setSession(data);
          setLoading(false);
        } else {
          const errorData = await response.text();
          console.log('[v0] Session validation failed - Status:', response.status, 'Body:', errorData);
          setLoading(false);
          // No redirigir automáticamente - el usuario acaba de hacer login
        }
      } catch (error) {
        console.error('[v0] Session fetch error:', error);
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('[v0] Logout error:', error);
    }
  };

  // Datos de ejemplo para el heatmap (coordenadas de ejemplo)
  const heatmapData: HeatmapPoint[] = [
    { lat: 10.480, lng: -66.903, value: 85 },
    { lat: 10.485, lng: -66.900, value: 70 },
    { lat: 10.475, lng: -66.910, value: 90 },
    { lat: 10.490, lng: -66.895, value: 65 },
    { lat: 10.470, lng: -66.905, value: 80 },
  ];

  // Datos de ejemplo para ranking de proveedores
  const providerData = [
    { name: 'Flety', deliveries: 342, rating: 4.8, completionRate: 98 },
    { name: 'Yummy', deliveries: 289, rating: 4.6, completionRate: 96 },
    { name: 'Express', deliveries: 156, rating: 4.4, completionRate: 92 },
  ];

  // KPI Data
  const kpiData = {
    todayOrders: 127,
    avgDeliveryTime: 28,
    completionRate: 96.5,
    activeDeliveries: 34,
  };

  // Order Stats
  const orderStats = {
    delivery: 85,
    deliveryExpress: 32,
    pickup: 10,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
          <p className="text-slate-600 mt-2">
            Bienvenido, {session?.userName} • {session?.userRole}
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="gap-2 bg-transparent"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 mb-8">
        <Button
          onClick={() => router.push('/admin/dashboard')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Dashboard BI
        </Button>
        <Button
          onClick={() => router.push('/admin/flety')}
          variant="outline"
        >
          Flety
        </Button>
        <Button
          onClick={() => router.push('/admin/yummy')}
          variant="outline"
        >
          Yummy
        </Button>
        <Button
          onClick={() => router.push('/admin/pickup')}
          variant="outline"
        >
          Pickup
        </Button>
      </div>

      {/* Dashboard Content */}
      <div className="space-y-6">
        <KPICards data={kpiData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesHeatmap data={heatmapData} />
          </div>
          <div>
            <DeliveryProviderRanking data={providerData} />
          </div>
        </div>

        <OrderStats stats={orderStats} />
      </div>
    </div>
  );
}

export default DashboardPage;
