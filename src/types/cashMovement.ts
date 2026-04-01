// ─── Tipos base ─────────────────────────────────────────────────────────────

export type MovementType =
  | 'opening'        // Apertura de caja
  | 'closing'        // Cierre de caja
  | 'input'          // Ingreso manual de efectivo
  | 'output'         // Egreso manual de efectivo
  | 'sale'           // Venta (factura)
  | 'client_deposit' // La empresa deposita dinero a cuenta del cliente (salida)
  | 'client_ingress'; // El cliente deposita dinero a su cuenta (entrada)

export type MovementDirection = 'in' | 'out';
export type MovementColor = 'green' | 'red' | 'blue' | 'orange';

// ─── Metadatos por tipo (fuente única de verdad para UI) ─────────────────────
export interface MovementMeta {
  label: string;
  direction: MovementDirection;
  color: MovementColor;
}

export const MOVEMENT_META: Record<MovementType, MovementMeta> = {
  opening:        { label: 'Apertura de caja',  direction: 'in',  color: 'blue'   },
  closing:        { label: 'Cierre de caja',    direction: 'out', color: 'blue'   },
  input:          { label: 'Ingreso manual',    direction: 'in',  color: 'green'  },
  output:         { label: 'Egreso manual',     direction: 'out', color: 'red'    },
  sale:           { label: 'Venta',             direction: 'in',  color: 'green'  },
  client_deposit: { label: 'Depósito a cliente',direction: 'out', color: 'orange' },
  client_ingress: { label: 'Ingreso de cliente',direction: 'in',  color: 'green'  },
};

// ─── Interfaz principal ──────────────────────────────────────────────────────
export interface CashMovement {
  id: number;
  type: MovementType;
  date: string;               // ISO string: "2025-03-31T14:30:00.000Z"
  employeeId: number;
  employeeName: string;
  amount: number;             // Siempre positivo; la dirección la da MOVEMENT_META
  observation?: string;       // Opcional; generalmente ausente en ventas
  relatedInvoiceId?: number;  // Solo relevante cuando type === 'sale'
  relatedClientId?: number;   // Solo relevante en 'client_deposit' | 'client_ingress'
}