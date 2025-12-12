// ...\lock-person\frontend\src\app\models\habit.ts

export interface Habito {
  id: number;           // Cambiado de string a number
  usuarioId: number;    // Cambiado de string a number
  nombre: string;       // Cambiado de name a nombre
  descripcion?: string; // Cambiado de description a descripcion
  color: string;        // Nuevo campo
  metaDiaria: number;   // Nuevo campo
  fechaCreacion?: Date; // Cambiado de createdAt
  fechaActualizacion?: Date; // Nuevo campo
}

export interface SeguimientoHabitoRequest {
  habitoId: number;     // Cambiado habit_id a habitoId
  fecha: string;        // Formato: YYYY-MM-DD
  completado: boolean;  // Cambiado completed a completado
}

export interface DatosDiarioResponse {
  estado: string;       // Cambiado status a estado
  habitos: Habito[];    // Cambiado habits a habitos
  dias: string[];       // Cambiado days a dias
  datosSeguimiento: { [habitoId: string]: string[] }; // Cambiado tracking_data
}

export interface CrearHabitoRequest {
  nombre: string;       // Cambiado de name
  descripcion?: string; // Cambiado de description
  color?: string;
  metaDiaria?: number;
}