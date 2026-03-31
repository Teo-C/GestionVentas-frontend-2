import { useState, useMemo } from 'react';
import type {StockItem, Article} from "../../types/article.ts";
import './ArticlePage.css';
import {useNavigate} from "react-router-dom";
import BackButton from '../../components/BackButton/BackButton';

// Mocks auxiliares para los selectores y la tabla
const MOCK_MARCAS = [{ id: 1, name: 'Nike' }, { id: 2, name: 'Adidas' }, { id: 3, name: 'Genérica' }];
const MOCK_CATEGORIAS = [{ id: 1, name: 'Calzado' }, { id: 2, name: 'Indumentaria' }, { id: 3, name: 'Accesorios' }];

// Mock de datos iniciales
const MOCK_ARTICULOS: Article[] = [
  {
    id: 1,
    codeBar: '7791234567890',
    description: 'Zapatilla Running Ultra',
    brandId: 1,
    purchasePrice: 45000,
    categoryId: 1,
    stock: [
      { id: 1, size: '40', color: 'Negro', quantity: 5, price: 85000 },
      { id: 2, size: '41', color: 'Negro', quantity: 3, price: 85000 },
      { id: 3, size: '40', color: 'Blanco', quantity: 2, price: 85000 },
    ]
  },
  {
    id: 2,
    codeBar: '7791234qdwq90',
    description: 'Remera Running Ultra',
    brandId: 2,
    purchasePrice: 45000,
    categoryId: 1,
    stock: [
      { id: 1, size: '40', color: 'Negro', quantity: 5, price: 85000 },
      { id: 2, size: '41', color: 'Negro', quantity: 3, price: 85000 },
      { id: 3, size: '40', color: 'Blanco', quantity: 2, price: 85000 },
    ]
  }
];

export default function ArticlePage() {
  const navigate = useNavigate();
  const [articulos, _] = useState<Article[]>(MOCK_ARTICULOS);
  const [busqueda, setBusqueda] = useState('');

  const articulosFiltrados = useMemo(() => {
    return articulos.filter(art =>
      art.description.toLowerCase().includes(busqueda.toLowerCase()) ||
      art.codeBar.includes(busqueda)
    );
  }, [busqueda, articulos]);

  const getNombreMarca = (id: number) => MOCK_MARCAS.find(m => m.id === id)?.name || 'Desconocida';
  const getNombreCategoria = (id: number) => MOCK_CATEGORIAS.find(c => c.id === id)?.name || 'Desconocida';

  const getStockTotal = (stockArray: StockItem[]) => stockArray.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleNewArticle = () => {
    navigate('/articulos/nuevo');
  }

  return (
    <div className="pagina-contenedor">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2em', marginBottom: '0.5em' }}>
        <BackButton />
        {/* Cabecera y Controles */}
        <div>
          <h2 className="pagina-titulo">Catálogo de Artículos</h2>
          <p className="pagina-subtitulo">Gestiona productos, precios y variantes de stock</p>
        </div>
      </div>

      <button className="boton-primario" onClick={handleNewArticle}>
        + Nuevo Artículo
      </button>

      <div className="controles-tabla">
        <input
          type="text"
          placeholder="Buscar por código de barras o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />
      </div>

      <div className="tabla-contenedor">
        <table className="tabla-datos">
          <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Marca</th>
            <th>Categoría</th>
            <th>Stock Total</th>
            <th>Variantes</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          {articulosFiltrados.length > 0 ? (
            articulosFiltrados.map((art) => (
              <tr key={art.id}>
                <td className="celda-codigo">{art.codeBar}</td>
                <td className="celda-principal">{art.description}</td>
                <td>{getNombreMarca(art.brandId)}</td>
                <td>{getNombreCategoria(art.categoryId)}</td>
                <td>
                  <span className="badge-stock">{getStockTotal(art.stock)}</span>
                </td>
                <td>{art.stock.length}</td>
                <td>
                  <button className="boton-texto">Editar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="celda-vacia">No se encontraron artículos.</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}