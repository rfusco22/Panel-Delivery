'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw } from 'lucide-react';
import { OrderCard } from '@/components/yummy/order-card';
import { OrderDetailModal } from '@/components/yummy/order-detail-modal';
import { toast } from 'sonner';

interface YummyOrder {
  id: string;
  orderNumber: string;
  productName: string;
  productDescription: string;
  productImage: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  subtotal: number;
  deliveryFee: number;
  total: number;
  originAddress: string;
  destinationAddress: string;
  customerName: string;
  customerPhone: string;
  isThirdParty: boolean;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleColor: string;
  rating: number;
  createdAt: string;
}

interface Session {
  userId: string;
  userName: string;
  userRole: string;
}

export default function YummyPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<YummyOrder | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Datos de ejemplo para Delivery Regular
  const [regularOrders, setRegularOrders] = useState<YummyOrder[]>([
    {
      id: '1',
      orderNumber: 'YUM-001',
      productName: 'Burger Deluxe',
      productDescription: 'Hamburguesa con queso, lechuga y tomate',
      productImage: 'https://via.placeholder.com/80?text=Burger',
      status: 'in_transit',
      subtotal: 12.5,
      deliveryFee: 3.0,
      total: 15.5,
      originAddress: 'Restaurant Central - Calle Principal 100',
      destinationAddress: 'Apartamento 5B, Av. Norte 250',
      customerName: 'Laura García',
      customerPhone: '+58-412-1234567',
      isThirdParty: false,
      driverName: 'Miguel Santos',
      driverPhone: '+58-414-9876543',
      driverRating: 4.9,
      vehicleModel: 'Honda Civic 2023',
      vehiclePlate: 'LMN-123',
      vehicleColor: 'Blanco',
      rating: 4.8,
      createdAt: '2024-01-30 12:00',
    },
    {
      id: '2',
      orderNumber: 'YUM-002',
      productName: 'Pizza Margarita',
      productDescription: 'Pizza con queso mozzarella fresco y albahaca',
      productImage: 'https://via.placeholder.com/80?text=Pizza',
      status: 'pending',
      subtotal: 18.0,
      deliveryFee: 3.0,
      total: 21.0,
      originAddress: 'Pizzería Don Antonio - Centro Comercial',
      destinationAddress: 'Oficina 304, Edificio Empresarial',
      customerName: 'Carlos Mendoza',
      customerPhone: '+58-416-5555555',
      isThirdParty: true,
      driverName: 'Juan Pérez',
      driverPhone: '+58-412-7777777',
      driverRating: 4.7,
      vehicleModel: 'Toyota Corolla 2022',
      vehiclePlate: 'XYZ-456',
      vehicleColor: 'Gris',
      rating: 4.5,
      createdAt: '2024-01-30 12:15',
    },
  ]);

  // Datos de ejemplo para Delivery Express
  const [expressOrders, setExpressOrders] = useState<YummyOrder[]>([
    {
      id: '3',
      orderNumber: 'YUM-EXP-001',
      productName: 'Sushi Premium',
      productDescription: 'Set de sushi con atún y salmón fresco',
      productImage: 'https://via.placeholder.com/80?text=Sushi',
      status: 'assigned',
      subtotal: 35.0,
      deliveryFee: 8.0,
      total: 43.0,
      originAddress: 'Sushi Bar Elite - Zona Financiera',
      destinationAddress: 'Hotel de Lujo - Avenida Principal 500',
      customerName: 'Ricardo Valdez',
      customerPhone: '+58-414-2222222',
      isThirdParty: false,
      driverName: 'Fernando López',
      driverPhone: '+58-412-3333333',
      driverRating: 4.95,
      vehicleModel: 'Moto Yamaha YZF-R15',
      vehiclePlate: 'ABC-999',
      vehicleColor: 'Rojo',
      rating: 5.0,
      createdAt: '2024-01-30 13:00',
    },
  ]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setSession(data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('[v0] Session fetch error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('[v0] Logout error:', error);
    }
  };

  const handleSyncWithAPI = async () => {
    setSyncing(true);
    try {
      // Simulamos sincronización con API de Yummy
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Pedidos sincronizados con la API de Yummy');
    } catch (error) {
      toast.error('Error al sincronizar con la API');
    } finally {
      setSyncing(false);
    }
  };

  const handleViewDetails = (order: YummyOrder) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
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
          <h1 className="text-3xl font-bold text-slate-900">Gestión Yummy</h1>
          <p className="text-slate-600 mt-2">
            Administración de entregas con integración API - {session?.userName}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSyncWithAPI}
            disabled={syncing}
            className="gap-2 bg-transparent"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar API'}
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="regular" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="regular">
            Delivery Regular ({regularOrders.length})
          </TabsTrigger>
          <TabsTrigger value="express">
            Delivery Express ({expressOrders.length})
          </TabsTrigger>
        </TabsList>

        {/* Regular Delivery Tab */}
        <TabsContent value="regular" className="space-y-4">
          {regularOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regularOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={() => handleViewDetails(order)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-600">No hay pedidos de Delivery Regular en este momento</p>
            </div>
          )}
        </TabsContent>

        {/* Express Delivery Tab */}
        <TabsContent value="express" className="space-y-4">
          {expressOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expressOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={() => handleViewDetails(order)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-600">No hay pedidos de Delivery Express en este momento</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <OrderDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        order={selectedOrder}
      />
    </div>
  );
}
