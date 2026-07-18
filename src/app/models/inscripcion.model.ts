export interface Inscripcion {
    id?: number;
    eventoId: number;
    nombre: string;
    cedula: string;
    tipoAsistencia: string;
    requiereCertificado: boolean;
}