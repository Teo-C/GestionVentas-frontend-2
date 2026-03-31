import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from '../../components/BackButton/BackButton';
import type { EmployeeShort } from '../../types/employee';
import type { CashMovement } from '../../types/cashMovement';
import './IngressCashRegisterPage.css';

// ─── Constantes Mock ────────────────────────────────────────────────────────
const MOCK_EMPLEADOS: EmployeeShort[] = [
  { id: 1, name: 'Juan Pérez' },
  { id: 2, name: 'María Gómez' },
  { id: 3, name: 'Carlos López' },
];

const STORAGE_KEY_CAJA = 'caja_estado';

// ─── Helpers ────────────────────────────────────────────────────────────────
function getNowDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getNowTime(): string {
  return new Date().toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function isCajaAbierta(): boolean {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY_CAJA);
    if (stored) {
      const parsed = JSON.parse(stored) as { abierta: boolean };
      return parsed.abierta ?? false;
    }
  } catch {
    // ignorar
  }
  return false;
}

// ─── Componente ─────────────────────────────────────────────────────────────
export default function IngressCashRegisterPage() {
  const navigate = useNavigate();

  const [horaActual, setHoraActual] = useState<string>(getNowTime());
  const [cajaAbierta] = useState<boolean>(isCajaAbierta());

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

  const empleadoSeleccionado = MOCK_EMPLEADOS.find((e) => e.id === empleadoId);

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cajaAbierta) {
      toast.error('La caja debe estar abierta para registrar un ingreso.');
      return;
    }

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      toast.error('El monto debe ser mayor a cero.');
      return;
    }

    setCargando(true);

    // Simula llamada al backend
    setTimeout(() => {
      const movimiento: CashMovement = {
        id: Date.now(),
        type: 'input',
        date: new Date().toISOString(),
        employeeId: empleadoId,
        employeeName: empleadoSeleccionado?.name ?? '',
        amount: montoNum,
        observation: observacion || undefined,
      };

      console.log('Ingreso registrado:', movimiento);
      toast.success(`✅ Ingreso de $${montoNum.toLocaleString('es-AR')} registrado correctamente.`);

      // Limpiar formulario
      setMonto('');
      setObservacion('');
      setCargando(false);
    }, 800);
  };

  return (
    <div className="pagina-contenedor">

      {/* ── Cabecera ── */}
      <div className="cashinput-cabecera-row">
        <BackButton />
        <div>
          <h2 className="pagina-titulo">Ingreso de Dinero</h2>
          <p className="pagina-subtitulo">Registrá un ingreso manual de efectivo en caja</p>
        </div>
      </div>

      {/* ── Alerta si la caja está cerrada ── */}
      {!cajaAbierta && (
        <div className="cashinput-alerta">
          <span className="cashinput-alerta-icono">⚠️</span>
          <div>
            <strong>La caja está cerrada.</strong>
            <span> Debés abrir la caja antes de registrar un ingreso.</span>
          </div>
        </div>
      )}

      {/* ── Formulario ── */}
      <div className="cashinput-form-card">
        <div className="cashinput-form-header">
          <h3 className="cashinput-form-titulo">Datos del ingreso</h3>
          <p className="cashinput-form-subtitulo">
            Todos los campos marcados con * son obligatorios
          </p>
        </div>

        <form onSubmit={manejarSubmit} className="cashinput-form">

          {/* Fila 1: Fecha y Hora */}
          <div className="cashinput-fila">
            <div className="campo-grupo">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                type="date"
                readOnly
                value={getNowDate()}
                className="input-formulario cashinput-readonly"
              />
            </div>

            <div className="campo-grupo">
              <label htmlFor="hora">Hora</label>
              <input
                id="hora"
                type="text"
                readOnly
                value={horaActual}
                className="input-formulario cashinput-readonly cashinput-hora"
              />
            </div>
          </div>

          {/* Fila 2: Empleado y Monto */}
          <div className="cashinput-fila">
            <div className="campo-grupo">
              <label htmlFor="empleado">Empleado *</label>
              <select
                id="empleado"
                required
                value={empleadoId}
                onChange={(e) => setEmpleadoId(Number(e.target.value))}
                className="input-formulario"
                disabled={!cajaAbierta}
              >
                {MOCK_EMPLEADOS.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-grupo">
              <label htmlFor="monto">Monto a ingresar ($) *</label>
              <div className="input-con-icono">
                <span className="icono-moneda">$</span>
                <input
                  id="monto"
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="input-formulario pl-8"
                  disabled={!cajaAbierta}
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
              placeholder="Ej: Ingreso de efectivo por venta fuera de sistema..."
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="input-formulario textarea-formulario"
              disabled={!cajaAbierta}
            />
          </div>

          {/* Acciones */}
          <div className="cashinput-form-acciones">
            <button
              type="button"
              className="boton-secundario"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!cajaAbierta || cargando}
              className="boton-primario boton-ingresar"
              title={!cajaAbierta ? 'La caja debe estar abierta' : 'Registrar ingreso'}
            >
              {cargando ? 'Registrando...' : 'Registrar Ingreso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}