export interface StudentUser {
  nombre: string;
  email: string;
  password: string;
  carrera?: string;
  tipo: 'estudiante';
}

export interface OrganizerUser {
  id: number;
  nombre: string;
  email: string;
  password: string;
  facultad: string;
  cargo: string;
  telefono: string;
  activo: boolean;
  tipo: 'organizador';
}

export type AppUser = StudentUser | OrganizerUser;
