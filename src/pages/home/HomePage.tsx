import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import appModules from '../../constants/appModules';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  // Estados de navegación
  const [moduloActivo, setModuloActivo] = useState<number>(0);
  const [submoduloActivo, setSubmoduloActivo] = useState<number>(0);
  // 'izquierda' = lista de módulos, 'derecha' = lista de submódulos
  const [areaFoco, setAreaFoco] = useState<'izquierda' | 'derecha'>('izquierda');

  const manejarTeclado = useCallback((e: KeyboardEvent) => {
    const submodulos = appModules[moduloActivo].submodules;

    if (areaFoco === 'izquierda') {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setModuloActivo((prev) => (prev + 1) % appModules.length);
          setSubmoduloActivo(0); // Reinicia el submódulo al cambiar de categoría
          break;
        case 'ArrowUp':
          e.preventDefault();
          setModuloActivo((prev) => (prev - 1 + appModules.length) % appModules.length);
          setSubmoduloActivo(0);
          break;
        case 'ArrowRight':
        case 'Enter':
          e.preventDefault();
          // Solo pasamos a la derecha si hay submódulos
          if (submodulos.length > 0) {
            setAreaFoco('derecha');
          }
          break;
      }
    } else if (areaFoco === 'derecha') {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSubmoduloActivo((prev) => (prev + 1) % submodulos.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSubmoduloActivo((prev) => (prev - 1 + submodulos.length) % submodulos.length);
          break;
        case 'ArrowLeft':
        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          setAreaFoco('izquierda'); // Volvemos al menú principal
          break;
        case 'Enter':
          e.preventDefault();
          // Navegamos a la ruta final
          navigate(submodulos[submoduloActivo].route);
          break;
      }
    }
  }, [areaFoco, moduloActivo, submoduloActivo, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', manejarTeclado);
    return () => window.removeEventListener('keydown', manejarTeclado);
  }, [manejarTeclado]);

  return (
    <div className="home-contenedor">
      <div className="home-cabecera">
        <h2>Bienvenidp/a al sistema de ventas</h2>
      </div>

      {/* Tarjeta única y compacta que contiene ambos paneles */}
      <div className="home-tarjeta-doble">

        {/* Panel Izquierdo: Módulos Principales */}
        <div className={`panel-izquierdo ${areaFoco === 'izquierda' ? 'panel-activo' : ''}`}>
          <h3 className="titulo-panel">Módulos</h3>
          <ul className="lista-navegacion">
            {appModules.map((modulo, index) => (
              <li
                key={modulo.id}
                // Si está seleccionado pero el foco está a la derecha, queda con un color suave.
                // Si está seleccionado y el foco está a la izquierda, resalta con fuerza.
                className={`item-lista 
                  ${moduloActivo === index ? 'seleccionado' : ''} 
                  ${moduloActivo === index && areaFoco === 'izquierda' ? 'enfocado' : ''}
                `}
                onClick={() => {
                  setModuloActivo(index);
                  setSubmoduloActivo(0);
                  setAreaFoco('izquierda');
                }}
              >
                {modulo.label}
                {/* Un pequeño indicador visual de que hay opciones adentro */}
                <span className="flecha-indicador">›</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Panel Derecho: Submódulos */}
        <div className={`panel-derecho ${areaFoco === 'derecha' ? 'panel-activo' : ''}`}>
          <h3 className="titulo-panel">{appModules[moduloActivo].label}</h3>
          <ul className="lista-navegacion">
            {appModules[moduloActivo].submodules.map((sub, index) => (
              <li
                key={sub.id}
                className={`item-lista 
                  ${submoduloActivo === index && areaFoco === 'derecha' ? 'enfocado' : ''}
                `}
                onClick={() => {
                  setSubmoduloActivo(index);
                  setAreaFoco('derecha');
                  navigate(sub.route);
                }}
              >
                {sub.label}
              </li>
            ))}
            {appModules[moduloActivo].submodules.length === 0 && (
              <p className="mensaje-vacio">No hay opciones disponibles.</p>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}