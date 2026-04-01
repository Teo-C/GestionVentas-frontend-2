import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import Modal from '../../../components/modal/Modal';
import BackButton from '../../../components/BackButton/BackButton';
import type Brand from '../../../types/brand';
import './BrandsPage.css';

// ─── Mock de datos iniciales ─────────────────────────────────────────────────
const MOCK_MARCAS: Brand[] = [
  { id: 1, name: 'Nike' },
  { id: 2, name: 'Adidas' },
  { id: 3, name: 'Puma' },
  { id: 4, name: 'Genérica' },
];

const ESTADO_INICIAL = { name: '' };

// ─── Componente ──────────────────────────────────────────────────────────────
export default function BrandsPage() {
  const [marcas, setMarcas] = useState<Brand[]>(MOCK_MARCAS);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  // null = nuevo, number = editando ese id
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formulario, setFormulario] = useState(ESTADO_INICIAL);

  const marcasFiltradas = useMemo(
    () => marcas.filter((m) => m.name.toLowerCase().includes(busqueda.toLowerCase())),
    [busqueda, marcas]
  );

  // ── Abrir modal ────────────────────────────────────────────────────────────
  const abrirNuevo = () => {
    setEditandoId(null);
    setFormulario(ESTADO_INICIAL);
    setMostrarModal(true);
  };

  const abrirEditar = (marca: Brand) => {
    setEditandoId(marca.id!);
    setFormulario({ name: marca.name });
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

    const nombre = formulario.name.trim();

    const duplicado = marcas.some(
      (m) => m.name.toLowerCase() === nombre.toLowerCase() && m.id !== editandoId
    );
    if (duplicado) {
      toast.error(`Ya existe una marca con el nombre "${nombre}".`);
      return;
    }

    if (editandoId === null) {
      const nueva: Brand = { id: Date.now(), name: nombre };
      setMarcas([...marcas, nueva]);
      toast.success(`✅ Marca "${nombre}" creada.`);
    } else {
      setMarcas(marcas.map((m) => (m.id === editandoId ? { ...m, name: nombre } : m)));
      toast.success(`✅ Marca actualizada correctamente.`);
    }

    cerrarModal();
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const manejarEliminar = (marca: Brand) => {
    if (
      !window.confirm(
        `¿Eliminar la marca "${marca.name}"? Esta acción no se puede deshacer.`
      )
    )
      return;
    setMarcas(marcas.filter((m) => m.id !== marca.id));
    toast.success(`🗑️ Marca "${marca.name}" eliminada.`);
  };

  const tituloModal = editandoId === null ? 'Nueva Marca' : 'Editar Marca';

  return (
    <div className="pagina-contenedor">

      {/* ── Cabecera ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '0.5rem' }}>
        <BackButton />
        <div>
          <h2 className="pagina-titulo">Marcas</h2>
          <p className="pagina-subtitulo">Administrá las marcas disponibles para los artículos</p>
        </div>
      </div>

      {/* ── Acción principal ── */}
      <button className="boton-primario" onClick={abrirNuevo}>
        + Nueva Marca
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
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          {marcasFiltradas.length > 0 ? (
            marcasFiltradas.map((marca) => (
              <tr key={marca.id}>
                <td>#{marca.id}</td>
                <td className="celda-principal">{marca.name}</td>
                <td className="celda-acciones">
                  <button className="boton-texto" onClick={() => abrirEditar(marca)}>
                    Editar
                  </button>
                  <button
                    className="boton-texto boton-texto--danger"
                    onClick={() => manejarEliminar(marca)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="celda-vacia">
                No se encontraron marcas.
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
            <label htmlFor="brand-nombre">Nombre *</label>
            <input
              id="brand-nombre"
              type="text"
              required
              autoFocus
              placeholder="Ej: Nike, Adidas, Genérica..."
              value={formulario.name}
              onChange={(e) => setFormulario({ name: e.target.value })}
              className="input-formulario"
            />
          </div>

          <div className="modal-acciones">
            <button type="button" className="boton-secundario" onClick={cerrarModal}>
              Cancelar
            </button>
            <button type="submit" className="boton-primario">
              {editandoId === null ? 'Crear Marca' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}