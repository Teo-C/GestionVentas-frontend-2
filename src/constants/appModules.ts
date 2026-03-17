import type {AppModule} from '../types/appModules';

const appModules: AppModule[] = [
  {
    id: 1,
    label: '1. Facturación',
    submodules: [
      { id: 1, label: 'Nueva Factura', route: '/facturacion/nueva' },
      { id: 2, label: 'Notas de Crédito/Débito', route: '/facturacion/notas' },
      { id: 3, label: 'Historial y Consultas', route: '/facturacion/historial' },
    ]
  },
  {
    id: 2,
    label: '2. Clientes',
    submodules: [
      { id: 1, label: 'Directorio de Clientes', route: '/clientes' },
    ]
  },
  {
    id: 3,
    label: '3. Artículos',
    submodules: [
      { id: 1, label: 'Catálogo de Artículos', route: '/articulos' },
    ]
  },
  {
    id: 4,
    label: '4. Caja',
    submodules: [
      { id: 1, label: 'Abrir/Cerrar Caja', route: '/caja' },
      { id: 2, label: 'Ingresar Dinero', route: '/caja/ingreso' },
      { id: 3, label: 'Egresar Dinero', route: '/caja/egreso' },
      { id: 4, label: 'Movimientos', route: '/caja/movimientos' },
      { id: 5, label: 'Historial de Cajas', route: '/caja/historial' },
    ]
  },
  {
    id: 5,
    label: '5. Administración',
    submodules: [
      { id: 1, label: 'Edición de Facturación', route: '/admin/facturacion' },
      { id: 2, label: 'Edición de Clientes', route: '/admin/clientes' },
      { id: 3, label: 'Edición de Artículos', route: '/admin/articulos' },
      { id: 4, label: 'Marcas', route: '/admin/marcas' },
      { id: 5, label: 'Categorías', route: '/admin/categorias' },
      { id: 6, label: 'Medios de Pago', route: '/admin/medios-pago' },
      { id: 7, label: 'Empleados', route: '/admin/empleados' },
    ]
  },
  {
    id: 6,
    label: '6. Estadísticas',
    submodules: [
      { id: 1, label: 'Ventas', route: '/estadisticas/ventas' },
      { id: 2, label: 'Clientes', route: '/estadisticas/clientes' },
    ]
  }
];

export default appModules;