export interface Evento {
    id?:number | string;
    organizadorId:number;
    titulo:string;
    tipoEventoId:string | number;
    fecha:string;
    detalles:string;
    imagen:string;
}