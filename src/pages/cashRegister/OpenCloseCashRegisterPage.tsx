import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from '../../components/BackButton/BackButton';
import type { EmployeeShort } from '../../types/employee';
import type { CashMovement } from '../../types/cashMovement';
import './OpenCloseCashRegisterPage.css';

// ─── Constantes Mock ────────────────────────────────────────────────────────
const MOCK_EMPLEADOS: EmployeeShort[] = [
  { id: 1, name: 'Juan Pérez' },
  { id: 2, name: 'María Gómez' },
  { id: 3, name: 'Carlos López' },
];

// Simula si hay una caja abierta persistida (en producción vendría del backend)
const STORAGE_KEY_CAJA = 'caja_estado';

interface EstadoCaja {
  abierta: boolean;
  movimientoApertura?: CashMovement;
}

function getEstadoCajaInicial(): EstadoCaja {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY_CAJA);
    if (stored) return JSON.parse(stored) as EstadoCaja;
  } catch {
    // ignorar errores de parseo
  }
  return { abierta: false };
}

function getNowDate(): string {
  return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
}

function getNowTime(): string {
  return new Date().toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// ─── Componente ─────────────────────────────────────────────────────────────
export default function OpenCloseCashRegisterPage() {
  const navigate = useNavigate();

  const [estadoCaja, setEstadoCaja] = useState<EstadoCaja>(getEstadoCajaInicial);
  const [horaActual, setHoraActual] = useState<string>(getNowTime());

  // Formulario
  const [empleadoId, setEmpleadoId] = useState<number>(MOCK_EMPLEADOS[0].id);
  const [monto, setMonto] = useState<string>('');
  const [observacion, setObservacion] = useState<string>('');
  const [cargando, setCargando] = useState(false);

  // Reloj en vivo
  useEffect(() => {
    const interval = setInterval(() => setHoraActual(getNowTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Persiste estado en sessionStorage cada vez que cambia
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_CAJA, JSON.stringify(estadoCaja));
  }, [estadoCaja]);

  const empleadoSeleccionado = MOCK_EMPLEADOS.find((e) => e.id === empleadoId);

  const ejecutarAccion = (tipo: CashMovement['type']) => {
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum < 0) {
      toast.error('El monto debe ser un número válido y mayor o igual a cero.');
      return;
    }

    setCargando(true);

    // Simula llamada al backend
    setTimeout(() => {
      const movimiento: CashMovement = {
        id: Date.now(),
        type: tipo,
        date: new Date().toISOString(),
        employeeId: empleadoId,
        employeeName: empleadoSeleccionado?.name ?? '',
        amount: montoNum,
        observation: observacion || undefined,
      };

      if (tipo === 'opening') {
        setEstadoCaja({ abierta: true, movimientoApertura: movimiento });
        toast.success('✅ Caja abierta correctamente.');
      } else {
        setEstadoCaja({ abierta: false });
        toast.success('🔒 Caja cerrada correctamente.');
      }

      setMonto('');
      setObservacion('');
      setCargando(false);
    }, 800);
  };

  const manejarSubmit = (e: React.FormEvent, tipo: CashMovement['type']) => {
    e.preventDefault();
    ejecutarAccion(tipo);
  };

  const montoLabel = estadoCaja.abierta ? 'Monto de cierre' : 'Monto inicial';

  return (
    <div className="pagina-contenedor">
      {/* ── Cabecera ── */}
      <div className="caja-cabecera-row">
        <BackButton />
        <div>
          <h2 className="pagina-titulo">Gestión de Caja</h2>
          <p className="pagina-subtitulo">Apertura y cierre de caja diaria</p>
        </div>
      </div>

      {/* ── Estado actual ── */}
      <div className={`caja-estado-banner ${estadoCaja.abierta ? 'abierta' : 'cerrada'}`}>
        <div className="caja-estado-dot" />
        <div className="caja-estado-info">
          <span className="caja-estado-texto">
            {estadoCaja.abierta ? 'Caja abierta' : 'Caja cerrada'}
          </span>
          {estadoCaja.abierta && estadoCaja.movimientoApertura && (
            <span className="caja-estado-detalle">
              Apertura realizada por{' '}
              <strong>{estadoCaja.movimientoApertura.employeeName}</strong> —
              Monto inicial:{' '}
              <strong>
                ${estadoCaja.movimientoApertura.amount.toLocaleString('es-AR')}
              </strong>
            </span>
          )}
        </div>
      </div>

      {/* ── Formulario ── */}
      <div className="caja-form-card">
        <div className="caja-form-header">
          <h3 className="caja-form-titulo">Registrar movimiento</h3>
          <p className="caja-form-subtitulo">
            Completá los datos y seleccioná la acción a realizar
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="caja-form">

          {/* Fila 1: Fecha y Hora */}
          <div className="caja-fila">
            <div className="campo-grupo">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                type="date"
                readOnly
                value={getNowDate()}
                className="input-formulario caja-input-readonly"
              />
            </div>

            <div className="campo-grupo">
              <label htmlFor="hora">Hora</label>
              <input
                id="hora"
                type="text"
                readOnly
                value={horaActual}
                className="input-formulario caja-input-readonly caja-hora"
              />
            </div>
          </div>

          {/* Fila 2: Empleado y Monto */}
          <div className="caja-fila">
            <div className="campo-grupo">
              <label htmlFor="empleado">Empleado *</label>
              <select
                id="empleado"
                required
                value={empleadoId}
                onChange={(e) => setEmpleadoId(Number(e.target.value))}
                className="input-formulario"
              >
                {MOCK_EMPLEADOS.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-grupo">
              <label htmlFor="monto">{montoLabel} ($) *</label>
              <div className="input-con-icono">
                <span className="icono-moneda">$</span>
                <input
                  id="monto"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="input-formulario pl-8"
                />
              </div>
            </div>
          </div>

          {/* Observación */}
          <div className="campo-grupo">
            <label htmlFor="observacion">Observación (opcional)</label>
            <textarea
              id="observacion"
              rows={3}
              placeholder="Notas adicionales sobre la apertura / cierre..."
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="input-formulario textarea-formulario"
            />
          </div>

          {/* Acciones: siempre dos botones, habilitados/deshabilitados según estado */}
          <div className="caja-form-acciones">
            <button
              type="button"
              className="boton-secundario"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>

            <div className="caja-botones-accion">
              <button
                type="button"
                disabled={estadoCaja.abierta || cargando}
                className="boton-primario boton-abrir"
                onClick={(e) => manejarSubmit(e, 'opening')}
                title={estadoCaja.abierta ? 'La caja ya está abierta' : 'Abrir caja'}
              >
                Abrir Caja
              </button>

              <button
                type="button"
                disabled={!estadoCaja.abierta || cargando}
                className="boton-primario boton-cerrar"
                onClick={(e) => manejarSubmit(e, 'closing')}
                title={!estadoCaja.abierta ? 'La caja ya está cerrada' : 'Cerrar caja'}
              >
                Cerrar Caja
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}