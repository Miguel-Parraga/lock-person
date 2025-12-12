import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AtributosEntradaDiario {
  id: number;
  usuarioId: number;
  fecha: Date;
  contenido: string;
  tipo: 'tarea' | 'evento' | 'nota';
  completada: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

interface AtributosCreacionEntradaDiario extends Optional<AtributosEntradaDiario, 'id'> {}

class EntradaDiario extends Model<AtributosEntradaDiario, AtributosCreacionEntradaDiario> 
  implements AtributosEntradaDiario {
  public id!: number;
  public usuarioId!: number;
  public fecha!: Date;
  public contenido!: string;
  public tipo!: 'tarea' | 'evento' | 'nota';
  public completada!: boolean;
  public readonly fechaCreacion!: Date;
  public readonly fechaActualizacion!: Date;
}

EntradaDiario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuario_id',
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('tarea', 'evento', 'nota'),
      allowNull: false,
      defaultValue: 'nota',
    },
    completada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'entradas_diario',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default EntradaDiario;
