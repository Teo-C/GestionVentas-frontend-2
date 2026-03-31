import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StockItem, Article } from "../../types/article.ts";
import './NewArticlePage.css';

// Mocks auxiliares
const MOCK_MARCAS = [{ id: 1, name: 'Nike' }, { id: 2, name: 'Adidas' }, { id: 3, name: 'Genérica' }];
const MOCK_CATEGORIAS = [{ id: 1, name: 'Calzado' }, { id: 2, name: 'Indumentaria' }, { id: 3, name: 'Accesorios' }];

export default function CrearArticuloPage() {
  const navigate = useNavigate();

  const [articulo, setArticulo] = useState<Article>({
    codeBar: '', description: '', brandId: 0, purchasePrice: 0, categoryId: 0, stock: []
  });

  // --- Manejo Dinámico de Variantes (Stock) ---
  const agregarVariante = () => {
    setArticulo({
      ...articulo,
      stock: [...articulo.stock, { size: '', color: '', quantity: 1, price: 0 }]
    });
  };

  const eliminarVariante = (index: number) => {
    const nuevoStock = [...articulo.stock];
    nuevoStock.splice(index, 1);
    setArticulo({ ...articulo, stock: nuevoStock });
  };

  const actualizarVariante = (index: number, campo: keyof StockItem, valor: string | number) => {
    const nuevoStock = [...articulo.stock];
    nuevoStock[index] = { ...nuevoStock[index], [campo]: valor as never };
    setArticulo({ ...articulo, stock: nuevoStock });
  };

  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica adicional a los 'required' del HTML
    if (!articulo.description || !articulo.codeBar) return;
    if (articulo.stock.length === 0) {
      alert("Debes agregar al menos una variante (talle/color) para guardar el artículo.");
      return;
    }

    console.log("Guardando artículo en backend:", articulo);
    // Aquí iría tu fetch/axios al backend.
    // Al terminar, volvemos a la lista de artículos:
    navigate('/articulos');
  };

  return (
    <div className="pagina-contenedor">

      <div className="pagina-cabecera">
        <div>
          <button className="boton-volver" onClick={() => navigate(-1)}>
            ← Volver al Catálogo
          </button>
          <h2 className="pagina-titulo">Crear Nuevo Artículo</h2>
          <p className="pagina-subtitulo">Completa los datos del producto y sus variantes de stock</p>
        </div>
      </div>

      <form className="formulario-tarjeta" onSubmit={manejarGuardar}>

        {/* SECCIÓN 1: Información Básica */}
        <div className="formulario-seccion">
          <h3 className="seccion-titulo">1. Información General</h3>

          <div className="formulario-grid">
            <div className="campo-grupo">
              <label>Código de Barras *</label>
              <input
                type="text" required autoFocus
                value={articulo.codeBar}
                onChange={(e) => setArticulo({...articulo, codeBar: e.target.value})}
                className="input-formulario font-mono"
                placeholder="Ej: 7791234567890"
              />
            </div>

            <div className="campo-grupo span-2">
              <label>Descripción del Producto *</label>
              <input
                type="text" required
                value={articulo.description}
                onChange={(e) => setArticulo({...articulo, description: e.target.value})}
                className="input-formulario"
                placeholder="Ej: Zapatilla Running Ultra Ligera"
              />
            </div>

            <div className="campo-grupo">
              <label>Marca</label>
              <select
                value={articulo.brandId}
                onChange={(e) => setArticulo({...articulo, brandId: Number(e.target.value)})}
                className="input-formulario"
              >
                <option value={0}>Seleccione una marca...</option>
                {MOCK_MARCAS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div className="campo-grupo">
              <label>Categoría</label>
              <select
                value={articulo.categoryId}
                onChange={(e) => setArticulo({...articulo, categoryId: Number(e.target.value)})}
                className="input-formulario"
              >
                <option value={0}>Seleccione una categoría...</option>
                {MOCK_CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="campo-grupo">
              <label>Precio de Compra (Costo)</label>
              <div className="input-con-icono">
                <span className="icono-moneda">$</span>
                <input
                  type="number" step="0.01" min="0"
                  value={articulo.purchasePrice}
                  onChange={(e) => setArticulo({...articulo, purchasePrice: Number(e.target.value)})}
                  className="input-formulario pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="divisor" />

        {/* SECCIÓN 2: Variantes y Stock */}
        <div className="formulario-seccion">
          <div className="cabecera-variantes">
            <div>
              <h3 className="seccion-titulo">2. Variantes y Stock *</h3>
              <p className="seccion-descripcion">Agrega los talles, colores y precios de venta para este producto.</p>
            </div>
            <button type="button" className="boton-secundario" onClick={agregarVariante}>
              + Añadir Variante
            </button>
          </div>

          <div className="contenedor-tabla-variantes">
            {articulo.stock.length === 0 ? (
              <div className="estado-vacio">
                <p>No has agregado ninguna variante.</p>
                <button type="button" className="boton-texto" onClick={agregarVariante}>
                  Haz clic aquí para empezar
                </button>
              </div>
            ) : (
              <table className="tabla-variantes">
                <thead>
                <tr>
                  <th>Talle / Tamaño</th>
                  <th>Color</th>
                  <th>Cantidad</th>
                  <th>Precio Venta ($)</th>
                  <th className="celda-centrada">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {articulo.stock.map((variante, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text" placeholder="Ej: 42, L" required
                        value={variante.size}
                        onChange={(e) => actualizarVariante(index, 'size', e.target.value)}
                        className="input-tabla"
                      />
                    </td>
                    <td>
                      <input
                        type="text" placeholder="Ej: Rojo" required
                        value={variante.color}
                        onChange={(e) => actualizarVariante(index, 'color', e.target.value)}
                        className="input-tabla"
                      />
                    </td>
                    <td>
                      <input
                        type="number" min="0" required
                        value={variante.quantity}
                        onChange={(e) => actualizarVariante(index, 'quantity', Number(e.target.value))}
                        className="input-tabla"
                      />
                    </td>
                    <td>
                      <input
                        type="number" step="0.01" min="0" required
                        value={variante.price}
                        onChange={(e) => actualizarVariante(index, 'price', Number(e.target.value))}
                        className="input-tabla"
                      />
                    </td>
                    <td className="celda-centrada">
                      <button
                        type="button"
                        className="boton-eliminar-variante"
                        onClick={() => eliminarVariante(index)}
                        title="Eliminar esta variante"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* SECCIÓN 3: Acciones Finales */}
        <div className="formulario-acciones">
          <button type="button" className="boton-secundario-grande" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="boton-primario-grande">
            Guardar Artículo
          </button>
        </div>

      </form>
    </div>
  );
}