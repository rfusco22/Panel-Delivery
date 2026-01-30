# Delivery Panel - Panel de Gestión de Entregas

## Estado Actual

El proyecto tiene implementado:
- ✅ Sistema de autenticación con contraseña hasheada
- ✅ Login seguro con sesiones HTTP-only
- ✅ Middleware de protección de rutas
- ✅ Dashboard placeholder con 4 secciones planeadas
- ✅ Endpoints API para: login, logout, sesión
- ⏳ Base de datos MySQL (esquema creado, esperando conexión)

## Credenciales de Demostración

- **Email:** admin@delivery.com
- **Contraseña:** admin123

## Próximos Pasos

### 1. Conectar Base de Datos MySQL

Opciones disponibles:
- **Neon** (PostgreSQL) - Click en "Connect" en el sidebar
- **AWS Aurora MySQL** - Para MySQL nativo
- **Supabase** - PostgreSQL con auth integrado
- **Tu servidor MySQL existente** - Proporciona DATABASE_URL

Una vez conectada, ejecuta el script de migración:
```bash
cat scripts/database-schema.sql | mysql -u user -p database_name
```

### 2. Secciones del Dashboard a Completar

**Sección 1: Dashboard - Inteligencia de Negocio**
- Mapa de calor (heatmap) de ventas usando Recharts + Leaflet
- Ranking de proveedores de delivery
- Cantidad de pedidos por delivery
- Cantidad de pedidos por pickup

**Sección 2: Flety - Gestión Manual**
- Tabs: Delivery y Delivery Express
- Formulario manual para crear/editar pedidos
- Lista de pedidos con filtros

**Sección 3: Yummy - Integración API**
- Fetch automático de pedidos desde API de Yummy
- Tabs: Delivery y Delivery Express
- Modal detallado con información del producto

**Sección 4: Pickup**
- Vista de datos de tienda y ubicación
- Foto del pedido y descripción
- Información del cliente (tercero o no)
- Estado de entrega (En Tienda/Entregado)
- Para delivery: datos del conductor, info del vehículo, ruta, valoración

## Estructura de Proyecto

```
/app
  /login           - Página de login
  /admin
    /dashboard     - Dashboard principal
    /flety         - Módulo Flety
    /yummy         - Módulo Yummy
  /api
    /auth          - Endpoints de autenticación

/lib
  /auth.ts         - Utilidades de hashing y verificación
  /session.ts      - Configuración de sesiones

/components
  /auth            - Componentes de autenticación
```

## Variables de Entorno Necesarias

Copia `.env.local.example` a `.env.local` y completa:

```
SESSION_SECRET=tu-clave-secreta
DATABASE_URL=mysql://user:password@host:3306/database
YUMMY_API_KEY=tu-api-key
YUMMY_API_URL=https://api.yummy.com
```

## Notas Importantes

1. **Seguridad en Producción:**
   - Cambia SESSION_SECRET a una clave aleatoria fuerte
   - Usa HTTPS en producción
   - Implementa rate limiting en endpoints de login
   - Usa variables de entorno seguras en Vercel

2. **Autenticación Actual:**
   - Usa iron-session para sesiones seguras con HTTP-only cookies
   - Las contraseñas se hashean con bcryptjs
   - El middleware protege todas las rutas /admin/*

3. **Base de Datos:**
   - El esquema soporta roles múltiples (admin, conductor, gerente, etc.)
   - Incluye tablas para pedidos, entregas, conductores, vehículos, etc.
   - Preparado para RLS si usas Supabase

## Desarrollo Local

```bash
npm install
npm run dev
# Abre http://localhost:3000
# Se redirigirá a http://localhost:3000/login
```

Ingresa con:
- Email: admin@delivery.com
- Contraseña: admin123
