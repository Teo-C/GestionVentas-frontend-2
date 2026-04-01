import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import Modal from '../../../components/modal/Modal';
import BackButton from '../../../components/BackButton/BackButton';
import type { PaymentMethod } from '../../../types/paymentMethod';
import './PaymentMethodsPage.css';

// ─── Mock de datos iniciales ─────────────────────────────────────────────────
const MOCK_MEDIOS: PaymentMethod[] = [
  { id: 1, name: 'Efectivo',      defaultDiscount: 0  },
  { id: 2, name: 'Débito',        defaultDiscount: 0  },
  { id: 3, name: 'Visa',          defaultDiscount: 10 },
  { id: 4, name: 'Mastercard',    defaultDiscount: 10 },
  { id: 5, name: 'Transferencia', defaultDiscount: 5  },
];

const ESTADO_INICIAL: Omit<PaymentMethod, 'id'> = {
  name: '',
  defaultDiscount: 0,
};

// ─── Componente ──────────────────────────────────────────────────────────────
export default function PaymentMethodsPage() {
  const [medios, setMedios] = useState<PaymentMethod[]>(MOCK_MEDIOS);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  // null = nuevo, number = editando ese id
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formulario, setFormulario] = useState<Omit<PaymentMethod, 'id'>>(ESTADO_INICIAL);

  const mediosFiltrados = useMemo(
    () => medios.filter((m) => m.name.toLowerCase().includes(busqueda.toLowerCase())),
    [busqueda, medios]
  );

  // ── Abrir modal ────────────────────────────────────────────────────────────
  const abrirNuevo = () => {
    setEditandoId(null);
    setFormulario(ESTADO_INICIAL);
    setMostrarModal(true);
  };

  const abrirEditar = (medio: PaymentMethod) => {
    setEditandoId(medio.id);
    setFormulario({ name: medio.name, defaultDiscount: medio.defaultDiscount });
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

    const descuento = Number(formulario.defaultDiscount);
    if (descuento < 0 || descuento > 100) {
      toast.error('El descuento debe estar entre 0 y 100.');
      return;
    }

    if (editandoId === null) {
      // Crear
      const nuevo: PaymentMethod = {
        id: Date.now(),
        name: formulario.name.trim(),
        defaultDiscount: descuento,
      };
      setMedios([...medios, nuevo]);
      toast.success(`✅ Medio de pago "${nuevo.name}" creado.`);
    } else {
      // Editar
      setMedios(medios.map((m) =>
        m.id === editandoId
          ? { ...m, name: formulario.name.trim(), defaultDiscount: descuento }
          : m
      ));
      toast.success(`✅ Medio de pago actualizado.`);
    }

    cerrarModal();
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const manejarEliminar = (medio: PaymentMethod) => {
    if (!window.confirm(`¿Eliminár el medio de pago "${medio.name}"? Esta acción no se puede deshacer.`)) return;
    setMedios(medios.filter((m) => m.id !== medio.id));
    toast.success(`🗑️ Medio de pago "${medio.name}" eliminado.`);
  };

  const tituloModal = editandoId === null ? 'Nuevo Medio de Pago' : 'Editar Medio de Pago';

  return (
    <div className="pagina-contenedor">

      {/* ── Cabecera ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '0.5rem' }}>
        <BackButton />
        <div>
          <h2 className="pagina-titulo">Medios de Pago</h2>
          <p className="pagina-subtitulo">Administrá los métodos de cobro y sus descuentos predeterminados</p>
        </div>
      </div>

      {/* ── Acciones ── */}
      <button className="boton-primario" onClick={abrirNuevo}>
        + Nuevo Medio de Pago
      </button>

      {/* ── Búsqueda ── */}
      <div className="controles-tabla">
        <input
          type="text"
          placeholder="Buscar por nombre..."
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
            <th>Nombre</th>
            <th>Descuento predeterminado</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          {mediosFiltrados.length > 0 ? (
            mediosFiltrados.map((medio) => (
              <tr key={medio.id}>
                <td>#{medio.id}</td>
                <td className="celda-principal">{medio.name}</td>
                <td>
                  {medio.defaultDiscount > 0 ? (
                    <span className="badge-descuento">{medio.defaultDiscount}%</span>
                  ) : (
                    <span className="sin-descuento">Sin descuento</span>
                  )}
                </td>
                <td className="celda-acciones">
                  <button className="boton-texto" onClick={() => abrirEditar(medio)}>
                    Editar
                  </button>
                  <button className="boton-texto boton-texto--danger" onClick={() => manejarEliminar(medio)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="celda-vacia">
                No se encontraron medios de pago.
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {/* ── Modal ── */}
      <Modal isOpen={mostrarModal} onClose={cerrarModal} titulo={tituloModal}>
        <form onSubmit={manejarGuardar} className="modal-formulario">

          <div className="campo-grupo">
            <label htmlFor="pm-nombre">Nombre *</label>
            <input
              id="pm-nombre"
              type="text"
              required
              autoFocus
              placeholder="Ej: Efectivo, Visa, Transferencia..."
              value={formulario.name}
              onChange={(e) => setFormulario({ ...formulario, name: e.target.value })}
              className="input-formulario"
            />
          </div>

          <div className="campo-grupo">
            <label htmlFor="pm-descuento">Descuento predeterminado (%)</label>
            <input
              id="pm-descuento"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0"
              value={formulario.defaultDiscount}
              onChange={(e) =>
                setFormulario({ ...formulario, defaultDiscount: Number(e.target.value) })
              }
              className="input-formulario"
            />
            <span className="campo-ayuda">
              Se pre-cargará automáticamente al seleccionar este medio en una factura. El usuario puede modificarlo.
            </span>
          </div>

          <div className="modal-acciones">
            <button type="button" className="boton-secundario" onClick={cerrarModal}>
              Cancelar
            </button>
            <button type="submit" className="boton-primario">
              {editandoId === null ? 'Crear' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}