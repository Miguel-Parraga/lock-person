export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  esAdministrador: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface CredencialesLogin {
  email: string;
  contraseña: string;
  recordarme?: boolean;
}

export interface DatosRegistro {
  email: string;
  nombre: string;
  contraseña: string;
}

export interface RespuestaAuth {
  token: string;
  usuario: Usuario;
  mensaje: string;
}

export interface ActualizarPerfil {
  nombre?: string;
  email?: string;
  contraseñaActual?: string;
  nuevaContraseña?: string;
}
