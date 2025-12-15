export interface EntradaDiario {
  id: number;
  usuarioId: number;
  fecha: Date;
  contenido: string;
  tipo: 'tarea' | 'evento' | 'nota';
  completada: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface CrearEntradaRequest {
  contenido: string;
  tipo: 'tarea' | 'evento' | 'nota';
  fecha?: Date;
}

export interface ActualizarEntradaRequest {
  contenido?: string;
  tipo?: 'tarea' | 'evento' | 'nota';
  completada?: boolean;
}