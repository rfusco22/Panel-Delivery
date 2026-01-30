'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogOut, MapPin, Phone, User, Package, Truck } from 'lucide-react';
import { toast } from 'sonner';

interface PickupOrder {
  id: string;
  orderNumber: string;
  productName: string;
  productImage: string;
  productDescription: string;
  storeData: {
    name: string;
    address: string;
    phone: string;
  };
  storeLocation: {
    lat: number;
    lng: number;
  };
  customerData: {
    name: string;
    phone: string;
    isThirdParty: boolean;
  };
  deliveryStatus: 'in_store' | 'in_transit' | 'delivered';
  driverData?: {
    name: string;
    phone: string;
    vehicle: string;
    plate: string;
  };
  rating?: number;
}

interface Session {
  userId: string;
  userName: string;
  userRole: string;
}

export default function PickupPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<PickupOrder | null>(null);

  const [pickupOrders] = useState<PickupOrder[]>([
    {
      id: '1',
      orderNumber: 'PICK-001',
      productName: 'Set de Ropa Casual',
      productImage: 'https://via.placeholder.com/200?text=Ropa',
      productDescription: 'Conjunto de camisetas y pantalones para hombre',
      storeData: {
        name: 'Fashion Mall Centro',
        address: 'Centro Comercial Principal, Local 205',
        phone: '+58-212-1234567',
      },
      storeLocation: { lat: 10.480, lng: -66.903 },
      customerData: {
        name: 'Roberto García',
        phone: '+58-414-5555555',
        isThirdParty: false,
      },
      deliveryStatus: 'in_store',
      rating: 4.5,
    },
    {
      id: '2',
      orderNumber: 'PICK-002',
      productName: 'Laptop Gamer',
      productImage: 'https://via.placeholder.com/200?text=Laptop',
      productDescription: 'Laptop gaming con RTX 3060, 16GB RAM, SSD 512GB',
      storeData: {
        name: 'TechStore Elite',
        address: 'Zona Financiera, Edificio B',
        phone: '+58-212-9876543',
      },
      storeLocation: { lat: 10.485, lng: -66.900 },
      customerData: {
        name: 'Mariana López',
        phone: '+58-416-2222222',
        isThirdParty: true,
      },
      deliveryStatus: 'in_transit',
      driverData: {
        name: 'Carlos Fernández',
        phone: '+58-412-8888888',
        vehicle: 'Toyota Hilux 2024',
        plate: 'TUV-321',
      },
      rating: 4.9,
    },
    {
      id: '3',
      orderNumber: 'PICK-003',
      productName: 'Electrodoméstico',
      productImage: 'https://via.placeholder.com/200?text=Electrodomestico',
      productDescription: 'Refrigerador de acero inoxidable, 28 pies cúbicos',
      storeData: {
        name: 'Electro Plus',
        address: 'Avenida de los Próceres, Centro Comercial',
        phone: '+58-212-5555555',
      },
      storeLocation: { lat: 10.475, lng: -66.910 },
      customerData: {
        name: 'José Rodríguez',
        phone: '+58-412-3333333',
        isThirdParty: false,
      },
      deliveryStatus: 'delivered',
      driverData: {
        name: 'Miguel Santos',
        phone: '+58-414-4444444',
        vehicle: 'Chevrolet N300 2023',
        plate: 'ABC-789',
      },
      rating: 5.0,
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

  const handleUpdateStatus = (order: PickupOrder, newStatus: string) => {
    toast.success(`Pedido ${order.orderNumber} actualizado a: ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      in_store: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-amber-100 text-amber-800',
      delivered: 'bg-green-100 text-green-800',
    };
    return colors[status as keyof typeof colors] || colors.in_store;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      in_store: 'En Tienda',
      in_transit: 'En Tránsito',
      delivered: 'Entregado',
    };
    return labels[status as keyof typeof labels] || status;
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
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Pickup</h1>
          <p className="text-slate-600 mt-2">
            Control de recogidas en tienda - {session?.userName}
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

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pickupOrders.map((order) => (
          <Card key={order.id} className="p-4 hover:shadow-lg transition-shadow">
            {/* Imagen del Producto */}
            <div className="w-full h-40 bg-slate-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              <img
                src={order.productImage || "/placeholder.svg"}
                alt={order.productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* Info básica */}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-mono text-sm text-slate-600">{order.orderNumber}</p>
                  <p className="font-semibold text-slate-900">{order.productName}</p>
                </div>
                <Badge className={getStatusColor(order.deliveryStatus)}>
                  {getStatusLabel(order.deliveryStatus)}
                </Badge>
              </div>
              <p className="text-sm text-slate-600">{order.productDescription}</p>
            </div>

            {/* Datos de Tienda */}
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs font-semibold text-slate-700 mb-2">TIENDA</p>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-slate-900">{order.storeData.name}</p>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{order.storeData.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3 h-3" />
                  <span>{order.storeData.phone}</span>
                </div>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-slate-700 mb-2">CLIENTE</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span className="font-semibold text-slate-900">{order.customerData.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3 h-3" />
                  <span>{order.customerData.phone}</span>
                </div>
                <Badge className={order.customerData.isThirdParty ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}>
                  {order.customerData.isThirdParty ? 'Tercero' : 'Cliente Directo'}
                </Badge>
              </div>
            </div>

            {/* Datos del Conductor (si aplica) */}
            {order.driverData && order.deliveryStatus !== 'in_store' && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-slate-700 mb-2">CONDUCTOR</p>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-slate-900">{order.driverData.name}</p>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3 h-3" />
                    <span>{order.driverData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Truck className="w-3 h-3" />
                    <span className="truncate">{order.driverData.vehicle}</span>
                  </div>
                  <p className="font-mono text-xs text-slate-600">Placa: {order.driverData.plate}</p>
                </div>
              </div>
            )}

            {/* Rating */}
            {order.rating && (
              <div className="mb-4 p-2 bg-amber-50 rounded text-center">
                <p className="text-xs text-slate-600">Valoración</p>
                <p className="text-lg font-bold text-amber-600">{order.rating}/5.0</p>
              </div>
            )}

            {/* Actions */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full gap-2" onClick={() => setSelectedOrder(order)}>
                  <Package className="w-4 h-4" />
                  Ver Detalles Completos
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Detalles de Pickup - {selectedOrder?.orderNumber}</DialogTitle>
                </DialogHeader>
                {selectedOrder && (
                  <div className="space-y-4">
                    <div>
                      <img
                        src={selectedOrder.productImage || "/placeholder.svg"}
                        alt="Producto"
                        className="w-full h-48 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <p className="font-semibold text-slate-900 text-lg">{selectedOrder.productName}</p>
                      <p className="text-slate-600 mt-2">{selectedOrder.productDescription}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-2">UBICACIÓN DE LA TIENDA</p>
                      <p className="text-sm text-slate-600">Lat: {selectedOrder.storeLocation.lat.toFixed(4)}</p>
                      <p className="text-sm text-slate-600">Lng: {selectedOrder.storeLocation.lng.toFixed(4)}</p>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => handleUpdateStatus(selectedOrder, 'En Tránsito')}
                        disabled={selectedOrder.deliveryStatus !== 'in_store'}
                        className="w-full"
                      >
                        Marcar como En Tránsito
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(selectedOrder, 'Entregado')}
                        disabled={selectedOrder.deliveryStatus === 'delivered'}
                        variant="outline"
                        className="w-full"
                      >
                        Marcar como Entregado
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </Card>
        ))}
      </div>

      {pickupOrders.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No hay pedidos de pickup en este momento</p>
        </div>
      )}
    </div>
  );
}
