export interface Comentario {
  id: number;
  estudiante: string;   // Tipo: Caja de texto
  contenido: string;    // Tipo: Área de texto
  calificacion: number; // Tipo: Combo / Select (1 a 5)
  anonimo: boolean;     // Tipo: Checkbox
  eventoId: number;     // Para asociarlo al Portal de Eventos
  
}
