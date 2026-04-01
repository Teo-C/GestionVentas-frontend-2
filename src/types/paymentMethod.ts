export interface PaymentMethod {
  id: number;
  name: string;            // "Efectivo", "Visa", "Transferencia", etc.
  defaultDiscount: number; // % predeterminado (0 si no tiene)
}