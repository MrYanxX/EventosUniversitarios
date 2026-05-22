export interface StudentUser {
  nombre: string;
  email: string;
  password: string;
  carrera?: string;
  tipo: 'estudiante';
}
