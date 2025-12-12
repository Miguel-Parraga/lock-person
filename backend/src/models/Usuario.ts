import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

interface AtributosUsuario {
  id: number;
  email: string;
  nombre: string;
  contraseña: string;
  esAdministrador: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

interface AtributosCreacionUsuario extends Optional<AtributosUsuario, 'id'> {}

class Usuario extends Model<AtributosUsuario, AtributosCreacionUsuario> 
  implements AtributosUsuario {
  public id!: number;
  public email!: string;
  public nombre!: string;
  public contraseña!: string;
  public esAdministrador!: boolean;
  public readonly fechaCreacion!: Date;
  public readonly fechaActualizacion!: Date;

  // Método para verificar contraseña
  public async verificarContraseña(contraseña: string): Promise<boolean> {
    return bcrypt.compare(contraseña, this.contraseña);
  }
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nombre',
    },
    contraseña: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'contraseña',
    },
    esAdministrador: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'es_administrador',
    },
  },
  {
    sequelize,
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    hooks: {
      beforeCreate: async (usuario: Usuario) => {
        if (usuario.contraseña) {
          const salt = await bcrypt.genSalt(10);
          usuario.contraseña = await bcrypt.hash(usuario.contraseña, salt);
        }
      },
      beforeUpdate: async (usuario: Usuario) => {
        if (usuario.changed('contraseña')) {
          const salt = await bcrypt.genSalt(10);
          usuario.contraseña = await bcrypt.hash(usuario.contraseña, salt);
        }
      },
    },
  }
);

export default Usuario;
