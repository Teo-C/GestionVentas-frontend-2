import { useState, useMemo } from 'react';
import Modal from '../../../components/modal/Modal';
import type {Employee} from "../../../types/employee.ts";
import './EmployeesPage.css';

// Mock de datos iniciales
const MOCK_EMPLEADOS: Employee[] = [
  { id: 1, name: 'Juan Pérez', address: 'Av. Corrientes 123', phone: '11-1234-5678', email: 'juan@empresa.com' },
  { id: 2, name: 'María Gómez', address: 'Belgrano 456', phone: '11-9876-5432' },
  { id: 3, name: 'Carlos López', email: 'carlos@empresa.com' },
];

export default function EmployeesPage() {
  const [empleados, setEmpleados] = useState<Employee[]>(MOCK_EMPLEADOS);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  // Estado para el formulario de nuevo empleado
  const [nuevoEmpleado, setNuevoEmpleado] = useState<Partial<Employee>>({
    name: '', address: '', phone: '', email: ''
  });

  // Filtramos la lista en el frontend usando useMemo para que no se recalcule
  // innecesariamente en cada render, solo cuando cambia la búsqueda o la lista.
  const empleadosFiltrados = useMemo(() => {
    return empleados.filter(emp =>
      emp.name.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, empleados]);

  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoEmpleado.name) return;

    // Simulamos la creación con un ID aleatorio (el backend hará esto luego)
    const empleadoCreado: Employee = {
      id: Date.now(),
      name: nuevoEmpleado.name,
      address: nuevoEmpleado.address,
      phone: nuevoEmpleado.phone,
      email: nuevoEmpleado.email,
    };

    setEmpleados([...empleados, empleadoCreado]);
    setMostrarModal(false);
    setNuevoEmpleado({ name: '', address: '', phone: '', email: '' }); // Limpiamos el form
  };

  return (
    <div className="pagina-contenedor">

      {/* Cabecera y Controles */}
      <div className="pagina-cabecera">
        <div>
          <h2 className="pagina-titulo">Gestión de Empleados</h2>
          <p className="pagina-subtitulo">Administra el personal del comercio</p>
        </div>
        <button
          className="boton-primario"
          onClick={() => setMostrarModal(true)}
        >
          + Nuevo Empleado
        </button>
      </div>

      <div className="controles-tabla">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />
      </div>

      {/* Tabla de Datos */}
      <div className="tabla-contenedor">
        <table className="tabla-datos">
          <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          {empleadosFiltrados.length > 0 ? (
            empleadosFiltrados.map((emp) => (
              <tr key={emp.id}>
                <td>#{emp.id}</td>
                <td className="celda-principal">{emp.name}</td>
                <td>{emp.phone || '-'}</td>
                <td>{emp.email || '-'}</td>
                <td>{emp.address || '-'}</td>
                <td>
                  <button className="boton-texto">Editar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="celda-vacia">
                No se encontraron empleados con ese nombre.
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {/* Modal para Nuevo Empleado */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        titulo="Agregar Nuevo Empleado"
      >
        <form onSubmit={manejarGuardar} className="modal-formulario">
          <div className="campo-grupo">
            <label>Nombre Completo *</label>
            <input
              type="text"
              required
              value={nuevoEmpleado.name}
              onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, name: e.target.value})}
              className="input-formulario"
            />
          </div>
          <div className="campo-grupo">
            <label>Teléfono</label>
            <input
              type="text"
              value={nuevoEmpleado.phone}
              onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, phone: e.target.value})}
              className="input-formulario"
            />
          </div>
          <div className="campo-grupo">
            <label>Email</label>
            <input
              type="email"
              value={nuevoEmpleado.email}
              onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, email: e.target.value})}
              className="input-formulario"
            />
          </div>
          <div className="campo-grupo">
            <label>Dirección</label>
            <input
              type="text"
              value={nuevoEmpleado.address}
              onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, address: e.target.value})}
              className="input-formulario"
            />
          </div>

          <div className="modal-acciones">
            <button type="button" className="boton-secundario" onClick={() => setMostrarModal(false)}>
              Cancelar
            </button>
            <button type="submit" className="boton-primario">
              Guardar
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}