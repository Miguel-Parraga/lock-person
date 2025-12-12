export interface Habito {
  id: number;
  usuarioId: number;
  nombre: string;
  descripcion?: string;
  color: string;
  metaDiaria: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface SeguimientoHabitoRequest {
  habitoId: number;
  fecha: string;
  completado: boolean;
}

export interface DatosDiarioResponse {
  estado: string;
  habitos: Habito[];
  dias: string[];
  datosSeguimiento: { [habitoId: string]: string[] };
}

export interface CrearHabitoRequest {
  nombre: string;
  descripcion?: string;
  color?: string;
  metaDiaria?: number;
}
