/** Conteo agrupado devuelto por el backend (por facultad, por cargo). */
export interface ConteoPorGrupo {
  grupo: string;
  cantidad: number;
}

/** Respuesta de GET /api/organizadores/dashboard */
export interface DashboardOrganizadores {
  total: number;
  activos: number;
  inactivos: number;
  porFacultad: ConteoPorGrupo[];
  porCargo: ConteoPorGrupo[];
}
