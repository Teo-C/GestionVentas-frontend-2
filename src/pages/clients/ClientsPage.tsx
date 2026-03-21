import { useState, useMemo } from 'react';
import type {Client} from '../../types/client';
import Modal from '../../components/modal/Modal';
import './ClientsPage.css';

// Mock de datos iniciales
const MOCK_CLIENTES: Client[] = [
  {
    id: 1,
    name: 'Consumidor Final',
    address: 'S/D',
    phone: '0000000000',
    nationalId: '99999999'
  },
  {
    id: 2,
    name: 'Tech Solutions S.A.',
    address: 'Av. Libertador 1000',
    phone: '11-4444-5555',
    email: 'compras@techsolutions.com',
    nationalId: '30-12345678-9',
    observations: 'Cliente corporativo, paga a 30 días.'
  },
];

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Client[]>(MOCK_CLIENTES);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  const estadoInicialFormulario: Client = {
    name: '', address: '', phone: '', email: '', nationalId: '', observations: ''
  };
  const [nuevoCliente, setNuevoCliente] = useState<Client>(estadoInicialFormulario);

  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cli =>
      cli.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      (cli.nationalId && cli.nationalId.includes(busqueda))
    );
  }, [busqueda, clientes]);

  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCliente.name || !nuevoCliente.address || !nuevoCliente.phone) return;

    const clienteCreado: Client = {
      ...nuevoCliente,
      id: Date.now(),
    };

    setClientes([...clientes, clienteCreado]);
    setMostrarModal(false);
    setNuevoCliente(estadoInicialFormulario);
  };

  return (
    <div className="pagina-contenedor">

      <div className="pagina-cabecera">
        <div>
          <h2 className="pagina-titulo">Directorio de Clientes</h2>
          <p className="pagina-subtitulo">Administra los clientes y sus datos de facturación</p>
        </div>
        <button className="boton-primario" onClick={() => setMostrarModal(true)}>
          + Nuevo Cliente
        </button>
      </div>

      <div className="controles-tabla">
        <input
          type="text"
          placeholder="Buscar por nombre o CUIT/DNI..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />
      </div>

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
                <td>
                  <button className="boton-texto">Editar</button>
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

      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        titulo="Agregar Nuevo Cliente"
      >
        <form onSubmit={manejarGuardar} className="modal-formulario">

          <div className="campo-grupo">
            <label>Nombre o Razón Social *</label>
            <input
              type="text"
              required
              value={nuevoCliente.name}
              onChange={(e) => setNuevoCliente({...nuevoCliente, name: e.target.value})}
              className="input-formulario"
            />
          </div>

          <div className="fila-formulario">
            <div className="campo-grupo">
              <label>CUIT / DNI</label>
              <input
                type="text"
                value={nuevoCliente.nationalId}
                onChange={(e) => setNuevoCliente({...nuevoCliente, nationalId: e.target.value})}
                className="input-formulario"
              />
            </div>
            <div className="campo-grupo">
              <label>Teléfono *</label>
              <input
                type="text"
                required
                value={nuevoCliente.phone}
                onChange={(e) => setNuevoCliente({...nuevoCliente, phone: e.target.value})}
                className="input-formulario"
              />
            </div>
          </div>

          <div className="campo-grupo">
            <label>Dirección *</label>
            <input
              type="text"
              required
              value={nuevoCliente.address}
              onChange={(e) => setNuevoCliente({...nuevoCliente, address: e.target.value})}
              className="input-formulario"
            />
          </div>

          <div className="campo-grupo">
            <label>Email</label>
            <input
              type="email"
              value={nuevoCliente.email}
              onChange={(e) => setNuevoCliente({...nuevoCliente, email: e.target.value})}
              className="input-formulario"
            />
          </div>

          <div className="campo-grupo">
            <label>Observaciones</label>
            <textarea
              value={nuevoCliente.observations}
              onChange={(e) => setNuevoCliente({...nuevoCliente, observations: e.target.value})}
              className="input-formulario textarea-formulario"
              rows={3}
            />
          </div>

          <div className="modal-acciones">
            <button type="button" className="boton-secundario" onClick={() => setMostrarModal(false)}>
              Cancelar
            </button>
            <button type="submit" className="boton-primario">
              Guardar Cliente
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}