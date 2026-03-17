/**
 * Payment method type
 */
export type PaymentMethod = 
  | 'Efectivo'
  | 'Visa'
  | 'Mastercard'
  | 'American Express'
  | 'Transferencia'
  | 'Débito'
  | 'Otro';

/**
 * Invoice item interface
 */
export interface InvoiceItem {
  id: number;
  articleCode: string;
  description: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Invoice interface
 */
export interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string; // ISO date string
  customerName: string;
  employeeName: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number; // discount percentage (0-100)
  discountAmount: number; // calculated discount amount
  total: number;
  paymentMethod: PaymentMethod;
}
