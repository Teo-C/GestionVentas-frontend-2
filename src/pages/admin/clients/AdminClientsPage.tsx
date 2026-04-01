import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import Modal from '../../../components/modal/Modal';
import BackButton from '../../../components/BackButton/BackButton';
import type { Client } from '../../../types/client';
import './AdminClientsPage.css';

// ─── Mock de datos iniciales ─────────────────────────────────────────────────
const MOCK_CLIENTES: Client[] = [
  {
    id: 1,
    name: 'Consumidor Final',
    address: 'S/D',
    phone: '0000000000',
    nationalId: '99999999',
  },
  {
    id: 2,
    name: 'Tech Solutions S.A.',
    address: 'Av. Libertador 1000',
    phone: '11-4444-5555',
    email: 'compras@techsolutions.com',
    nationalId: '30-12345678-9',
    observations: 'Cliente corporativo, paga a 30 días.',
  },
  {
    id: 3,
    name: 'María Fernández',
    address: 'San Martín 456',
    phone: '11-2233-4455',
    nationalId: '28-456789-0',
  },
];

const ESTADO_INICIAL: Omit<Client, 'id'> = {
  name: '',
  address: '',
  phone: '',
  email: '',
  nationalId: '',
  observations: '',
};

// ─── Componente ──────────────────────────────────────────────────────────────
export default function AdminClientsPage() {
  const [clientes, setClientes] = useState<Client[]>(MOCK_CLIENTES);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  // null = nuevo, number = editando ese id
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formulario, setFormulario] = useState<Omit<Client, 'id'>>(ESTADO_INICIAL);

  const clientesFiltrados = useMemo(
    () =>
      clientes.filter(
        (c) =>
          c.name.toLowerCase().includes(busqueda.toLowerCase()) ||
          (c.nationalId && c.nationalId.includes(busqueda))
      ),
    [busqueda, clientes]
  );

  // ── Abrir modal ────────────────────────────────────────────────────────────
  const abrirNuevo = () => {
    setEditandoId(null);
    setFormulario(ESTADO_INICIAL);
    setMostrarModal(true);
  };

  const abrirEditar = (cliente: Client) => {
    setEditandoId(cliente.id!);
    setFormulario({
      name:         cliente.name,
      address:      cliente.address,
      phone:        cliente.phone,
      email:        cliente.email        ?? '',
      nationalId:   cliente.nationalId   ?? '',
      observations: cliente.observations ?? '',
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setFormulario(ESTADO_INICIAL);
    setEditandoId(null);
  };

  // ── Guardar (crear o editar) ───────────────────────────────────────────────
  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (editandoId === null) {
      const nuevo: Client = { ...formulario, id: Date.now() };
      setClientes([...clientes, nuevo]);
      toast.success(`✅ Cliente "${nuevo.name}" creado.`);
    } else {
      setClientes(
        clientes.map((c) =>
          c.id === editandoId ? { ...formulario, id: editandoId } : c
        )
      );
      toast.success(`✅ Cliente actualizado correctamente.`);
    }

    cerrarModal();
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const manejarEliminar = (cliente: Client) => {
    if (
      !window.confirm(
        `¿Eliminar el cliente "${cliente.name}"? Esta acción no se puede deshacer.`
      )
    )
      return;
    setClientes(clientes.filter((c) => c.id !== cliente.id));
    toast.success(`🗑️ Cliente "${cliente.name}" eliminado.`);
  };

  const tituloModal = editandoId === null ? 'Nuevo Cliente' : 'Editar Cliente';

  return (
    <div className="pagina-contenedor">

      {/* ── Cabecera ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '0.5rem' }}>
        <BackButton />
        <div>
          <h2 className="pagina-titulo">Edición de Clientes</h2>
          <p className="pagina-subtitulo">
            Creá, editá y eliminá clientes del sistema
          </p>
        </div>
      </div>

      {/* ── Acción principal ── */}
      <button className="boton-primario" onClick={abrirNuevo}>
        + Nuevo Cliente
      </button>

      {/* ── Búsqueda ── */}
      <div className="controles-tabla">
        <input
          type="text"
          placeholder="Buscar por nombre o CUIT/DNI..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />
      </div>

      {/* ── Tabla ── */}
      <div className="tabla-contenedor">
        <table className="tabla-datos">
          <thead>
          <tr>
            <th>ID</th>
            <th>Nombre / Razón Social</th>
            <th>CUIT / DNI</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          {clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cli) => (
              <tr key={cli.id}>
                <td>#{cli.id}</td>
                <td className="celda-principal">{cli.name}</td>
                <td>{cli.nationalId || '-'}</td>
                <td>{cli.phone}</td>
                <td>{cli.address}</td>
                <td className="celda-acciones">
                  <button
                    className="boton-texto"
                    onClick={() => abrirEditar(cli)}
                  >
                    Editar
                  </button>
                  <button
                    className="boton-texto boton-texto--danger"
                    onClick={() => manejarEliminar(cli)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="celda-vacia">
                No se encontraron clientes con esa búsqueda.
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {/* ── Modal crear / editar ── */}
      <Modal isOpen={mostrarModal} onClose={cerrarModal} titulo={tituloModal}>
        <form onSubmit={manejarGuardar} className="modal-formulario">

          <div className="campo-grupo">
            <label>Nombre o Razón Social *</label>
            <input
              type="text"
              required
              autoFocus
              value={formulario.name}
              onChange={(e) => setFormulario({ ...formulario, name: e.target.value })}
              className="input-formulario"
              placeholder="Ej: Juan García, Tech S.A."
            />
          </div>

          <div className="fila-formulario">
            <div className="campo-grupo">
              <label>CUIT / DNI</label>
              <input
                type="text"
                value={formulario.nationalId}
                onChange={(e) =>
                  setFormulario({ ...formulario, nationalId: e.target.value })
                }
                className="input-formulario"
                placeholder="Ej: 20-12345678-9"
              />
            </div>
            <div className="campo-grupo">
              <label>Teléfono *</label>
              <input
                type="text"
                required
                value={formulario.phone}
                onChange={(e) =>
                  setFormulario({ ...formulario, phone: e.target.value })
                }
                className="input-formulario"
                placeholder="Ej: 11-1234-5678"
              />
            </div>
          </div>

          <div className="campo-grupo">
            <label>Dirección *</label>
            <input
              type="text"
              required
              value={formulario.address}
              onChange={(e) =>
                setFormulario({ ...formulario, address: e.target.value })
              }
              className="input-formulario"
              placeholder="Ej: Av. Corrientes 1234"
            />
          </div>

          <div className="campo-grupo">
            <label>Email</label>
            <input
              type="email"
              value={formulario.email}
              onChange={(e) =>
                setFormulario({ ...formulario, email: e.target.value })
              }
              className="input-formulario"
              placeholder="Ej: cliente@email.com"
            />
          </div>

          <div className="campo-grupo">
            <label>Observaciones</label>
            <textarea
              rows={3}
              value={formulario.observations}
              onChange={(e) =>
                setFormulario({ ...formulario, observations: e.target.value })
              }
              className="input-formulario textarea-formulario"
              placeholder="Notas internas sobre el cliente..."
            />
          </div>

          <div className="modal-acciones">
            <button type="button" className="boton-secundario" onClick={cerrarModal}>
              Cancelar
            </button>
            <button type="submit" className="boton-primario">
              {editandoId === null ? 'Crear Cliente' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}