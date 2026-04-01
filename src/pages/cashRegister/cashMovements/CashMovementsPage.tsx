import { useState, useMemo } from 'react';
import BackButton from '../../../components/BackButton/BackButton';
import { MOVEMENT_META } from '../../../types/cashMovement';
import type { CashMovement, MovementType } from '../../../types/cashMovement';
import './CashMovementsPage.css';

// ─── Mock de datos ───────────────────────────────────────────────────────────
const MOCK_MOVIMIENTOS: CashMovement[] = [
  {
    id: 1,
    type: 'opening',
    date: '2025-03-31T08:00:00.000Z',
    employeeId: 1,
    employeeName: 'Juan Pérez',
    amount: 5000,
    observation: 'Apertura del día',
  },
  {
    id: 2,
    type: 'sale',
    date: '2025-03-31T09:15:00.000Z',
    employeeId: 1,
    employeeName: 'Juan Pérez',
    amount: 12500,
    relatedInvoiceId: 1001,
  },
  {
    id: 3,
    type: 'sale',
    date: '2025-03-31T10:30:00.000Z',
    employeeId: 2,
    employeeName: 'María Gómez',
    amount: 8750,
    relatedInvoiceId: 1002,
  },
  {
    id: 4,
    type: 'input',
    date: '2025-03-31T11:00:00.000Z',
    employeeId: 2,
    employeeName: 'María Gómez',
    amount: 3000,
    observation: 'Ingreso extra por cambio de turno',
  },
  {
    id: 5,
    type: 'output',
    date: '2025-03-31T12:45:00.000Z',
    employeeId: 1,
    employeeName: 'Juan Pérez',
    amount: 1500,
    observation: 'Pago a proveedor de insumos',
  },
  {
    id: 6,
    type: 'client_ingress',
    date: '2025-03-31T13:20:00.000Z',
    employeeId: 2,
    employeeName: 'María Gómez',
    amount: 20000,
    relatedClientId: 5,
    observation: 'Depósito del cliente Tech Solutions S.A.',
  },
  {
    id: 7,
    type: 'client_deposit',
    date: '2025-03-31T14:00:00.000Z',
    employeeId: 1,
    employeeName: 'Juan Pérez',
    amount: 7000,
    relatedClientId: 3,
    observation: 'Devolución saldo a favor al cliente',
  },
  {
    id: 8,
    type: 'sale',
    date: '2025-03-31T15:10:00.000Z',
    employeeId: 2,
    employeeName: 'María Gómez',
    amount: 5300,
    relatedInvoiceId: 1003,
  },
  {
    id: 9,
    type: 'closing',
    date: '2025-03-31T18:00:00.000Z',
    employeeId: 1,
    employeeName: 'Juan Pérez',
    amount: 46050,
    observation: 'Cierre de caja del día',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatMonto(amount: number): string {
  return amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const FILTRO_TODOS = 'todos' as const;
type FiltroTipo = MovementType | typeof FILTRO_TODOS;

// ─── Componente ──────────────────────────────────────────────────────────────
export default function CashMovementsPage() {
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>(FILTRO_TODOS);

  const movimientosFiltrados = useMemo(() => {
    if (filtroTipo === FILTRO_TODOS) return MOCK_MOVIMIENTOS;
    return MOCK_MOVIMIENTOS.filter((m) => m.type === filtroTipo);
  }, [filtroTipo]);

  // Balance siempre sobre el total del día, ignorando el filtro activo
  const balance = useMemo(() => {
    return MOCK_MOVIMIENTOS.reduce(
      (acc, m) => {
        const meta = MOVEMENT_META[m.type];
        if (meta.direction === 'in') acc.totalIn += m.amount;
        else acc.totalOut += m.amount;
        return acc;
      },
      { totalIn: 0, totalOut: 0 }
    );
  }, []);

  const balanceNeto = balance.totalIn - balance.totalOut;

  return (
    <div className="pagina-contenedor">

      {/* ── Cabecera ── */}
      <div className="movements-cabecera-row">
        <BackButton />
        <div>
          <h2 className="pagina-titulo">Movimientos de Caja</h2>
          <p className="pagina-subtitulo">Historial de todos los movimientos del día</p>
        </div>
      </div>

      {/* ── Balance del día ── */}
      <div className="movements-balance-grid">
        <div className="balance-card balance-in">
          <span className="balance-label">Total ingresos</span>
          <span className="balance-monto">+ ${formatMonto(balance.totalIn)}</span>
        </div>
        <div className="balance-card balance-out">
          <span className="balance-label">Total egresos</span>
          <span className="balance-monto">- ${formatMonto(balance.totalOut)}</span>
        </div>
        <div className={`balance-card balance-neto ${balanceNeto >= 0 ? 'positivo' : 'negativo'}`}>
          <span className="balance-label">Balance neto</span>
          <span className="balance-monto">
            {balanceNeto >= 0 ? '+' : '-'} ${formatMonto(Math.abs(balanceNeto))}
          </span>
        </div>
      </div>

      {/* ── Filtros por tipo ── */}
      <div className="movements-filtros">
        <button
          className={`filtro-chip ${filtroTipo === FILTRO_TODOS ? 'activo' : ''}`}
          onClick={() => setFiltroTipo(FILTRO_TODOS)}
        >
          Todos
          <span className="filtro-chip-count">{MOCK_MOVIMIENTOS.length}</span>
        </button>

        {(Object.keys(MOVEMENT_META) as MovementType[]).map((tipo) => {
          const count = MOCK_MOVIMIENTOS.filter((m) => m.type === tipo).length;
          if (count === 0) return null;
          return (
            <button
              key={tipo}
              className={`filtro-chip filtro-chip--${MOVEMENT_META[tipo].color} ${filtroTipo === tipo ? 'activo' : ''}`}
              onClick={() => setFiltroTipo(tipo)}
            >
              {MOVEMENT_META[tipo].label}
              <span className="filtro-chip-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tabla ── */}
      <div className="tabla-contenedor">
        <table className="tabla-datos">
          <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Tipo</th>
            <th>Empleado</th>
            <th>Observación</th>
            <th className="col-monto">Monto</th>
          </tr>
          </thead>
          <tbody>
          {movimientosFiltrados.length > 0 ? (
            movimientosFiltrados.map((mov) => {
              const meta = MOVEMENT_META[mov.type];
              const esIngreso = meta.direction === 'in';
              return (
                <tr key={mov.id}>
                  <td>{formatFecha(mov.date)}</td>
                  <td className="col-hora">{formatHora(mov.date)}</td>
                  <td>
                      <span className={`tipo-badge tipo-badge--${meta.color}`}>
                        {meta.label}
                      </span>
                  </td>
                  <td>{mov.employeeName}</td>
                  <td className="col-observacion">
                    {mov.observation ?? (
                      mov.relatedInvoiceId
                        ? `Factura #${mov.relatedInvoiceId}`
                        : mov.relatedClientId
                          ? `Cliente #${mov.relatedClientId}`
                          : <span className="sin-obs">—</span>
                    )}
                  </td>
                  <td className={`col-monto monto-valor ${esIngreso ? 'monto-in' : 'monto-out'}`}>
                    <span className="monto-signo">{esIngreso ? '+' : '−'}</span>
                    ${formatMonto(mov.amount)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="celda-vacia">
                No hay movimientos para el filtro seleccionado.
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

    </div>
  );
}