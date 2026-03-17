export interface Employee {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface EmployeeShort {
  id: number;
  name: string;
}