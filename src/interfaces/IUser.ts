export interface IUser {
  id: number;
  name: string;
  lastname: string;
  document_id: number;
  document_number: string;
  tel: string;
  email: string;
  password?: string;
  role: string;
  permissions?: string;
}
