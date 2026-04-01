export type PaymentStatus = 'paid' | 'partial' | 'account' | 'cancelled';
export type InvoiceStatus = 'confirmed' | 'cancelled';
export type DiscountTarget   = 'none' | 'global' | 'per_payment';

export interface InvoicePayment {
  paymentMethodId: number;
  paymentMethodName: string; // snapshot del nombre al confirmar
  amount: number;
  discount: number;          // puede venir del defaultDiscount o ser editado en el momento
  discountAmount: number;    // calculado
}

export interface InvoiceItem {
  id: number;
  stockItemId: number;
  articleId: number;
  codeBar: string;
  description: string;
  brand: string;
  size: string;
  color: string;
  quantity: number;       // editable, mínimo 1
  unitPrice: number;      // snapshot, NO editable
  subtotal: number;       // quantity * unitPrice
}

export interface Invoice {
  id?: number;
  invoiceNumber?: string;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  date: string;
  employeeId: number;
  employeeName: string;
  clientId?: number;
  clientName?: string;
  items: InvoiceItem[];
  subtotal: number;
  discountTarget: DiscountTarget;
  globalDiscount: number;        // % si discountTarget === 'global', si no 0
  globalDiscountAmount: number;
  payments: InvoicePayment[];
  totalPaid: number;
  totalAccount: number;          // total - totalPaid (deuda del cliente)
  total: number;                 // subtotal - descuento activo
  creditNoteId?: number;
}