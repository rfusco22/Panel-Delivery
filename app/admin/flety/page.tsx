'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { DeliveryOrdersTable } from '@/components/flety/delivery-orders-table';
import { OrderForm } from '@/components/flety/order-form';
import { toast } from 'sonner';

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customer: string;
  destination: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  price: number;
}

interface Session {
  userId: string;
  userName: string;
  userRole: string;
}

export default function FletyPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [formType, setFormType] = useState<'regular' | 'express'>('regular');

  // Orders data (in-memory, will be replaced with API calls when DB is connected)
  const [regularOrders, setRegularOrders] = useState<DeliveryOrder[]>([
    {
      id: '1',
      orderNumber: 'ORD-001',
      customer: 'Juan García',
      destination: 'Calle 10, Apto 5, Centro',
      status: 'in_transit',
      createdAt: '2024-01-30 09:00',
      updatedAt: '2024-01-30 10:30',
      price: 25.5,
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customer: 'María López',
      destination: 'Av. Bolívar, Edificio B, Piso 3',
      status: 'pending',
      createdAt: '2024-01-30 09:15',
      updatedAt: '2024-01-30 09:15',
      price: 18.75,
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      customer: 'Carlos Rodríguez',
      destination: 'Centro Comercial Norte',
      status: 'delivered',
      createdAt: '2024-01-30 08:00',
      updatedAt: '2024-01-30 11:45',
      price: 32.0,
    },
  ]);

  const [expressOrders, setExpressOrders] = useState<DeliveryOrder[]>([
    {
      id: '4',
      orderNumber: 'EXP-001',
      customer: 'Ana Martínez',
      destination: 'Hospital Central',
      status: 'in_transit',
      createdAt: '2024-01-30 10:00',
      updatedAt: '2024-01-30 10:15',
      price: 45.0,
    },
    {
      id: '5',
      orderNumber: 'EXP-002',
      customer: 'Roberto Silva',
      destination: 'Oficina Corporativa Centro',
      status: 'assigned',
      createdAt: '2024-01-30 10:30',
      updatedAt: '2024-01-30 10:35',
      price: 55.5,
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

  const handleAddOrder = (type: 'regular' | 'express') => {
    setFormType(type);
    setSelectedOrder(null);
    setFormOpen(true);
  };

  const handleEditOrder = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setFormOpen(true);
  };

  const handleDeleteOrder = (id: string, type: 'regular' | 'express') => {
    if (type === 'regular') {
      setRegularOrders(regularOrders.filter(o => o.id !== id));
    } else {
      setExpressOrders(expressOrders.filter(o => o.id !== id));
    }
    toast.success('Pedido eliminado');
  };

  const handleSubmitForm = (data: Partial<DeliveryOrder>) => {
    if (selectedOrder) {
      // Edit
      if (formType === 'regular') {
        setRegularOrders(
          regularOrders.map(o =>
            o.id === selectedOrder.id ? { ...o, ...data, updatedAt: new Date().toLocaleString() } : o
          )
        );
      } else {
        setExpressOrders(
          expressOrders.map(o =>
            o.id === selectedOrder.id ? { ...o, ...data, updatedAt: new Date().toLocaleString() } : o
          )
        );
      }
      toast.success('Pedido actualizado');
    } else {
      // Create
      const newOrder: DeliveryOrder = {
        id: Date.now().toString(),
        ...data as DeliveryOrder,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };

      if (formType === 'regular') {
        setRegularOrders([...regularOrders, newOrder]);
      } else {
        setExpressOrders([...expressOrders, newOrder]);
      }
      toast.success('Pedido creado');
    }

    setSelectedOrder(null);
    setFormOpen(false);
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
          <h1 className="text-3xl font-bold text-slate-900">Gestión Flety</h1>
          <p className="text-slate-600 mt-2">
            Administración manual de entregas - {session?.userName}
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
        <TabsContent value="regular" className="space-y-6">
          <DeliveryOrdersTable
            orders={regularOrders}
            type="regular"
            onAddOrder={() => handleAddOrder('regular')}
            onEditOrder={handleEditOrder}
            onDeleteOrder={(id) => handleDeleteOrder(id, 'regular')}
          />
        </TabsContent>

        {/* Express Delivery Tab */}
        <TabsContent value="express" className="space-y-6">
          <DeliveryOrdersTable
            orders={expressOrders}
            type="express"
            onAddOrder={() => handleAddOrder('express')}
            onEditOrder={handleEditOrder}
            onDeleteOrder={(id) => handleDeleteOrder(id, 'express')}
          />
        </TabsContent>
      </Tabs>

      {/* Order Form Dialog */}
      <OrderForm
        open={formOpen}
        onOpenChange={setFormOpen}
        order={selectedOrder}
        onSubmit={handleSubmitForm}
        type={formType}
      />
    </div>
  );
}
