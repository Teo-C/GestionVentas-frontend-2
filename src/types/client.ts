/**
 * Client interface
 */
export interface Client {
  id?: number;
  name: string; // Client name (mandatory)
  address: string; // Client address (mandatory)
  phone: string; // Client phone (mandatory)
  email?: string; // Client email (optional)
  nationalId?: string; // Client CUIT/DNI (optional)
  observations?: string; // Client notes/observations (optional)
}
