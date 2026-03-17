export type MovementType = 'opening' | 'input' | 'output' | 'sale' | 'closing';

export interface CashMovement {
  id: number;
  type: MovementType;
  date: string;
  employeeId: number;
  employeeName: string;
  amount: number;
  observation?: string;
  relatedInvoiceId?: number; // For sales
}
