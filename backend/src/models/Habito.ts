import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AtributosHabito {
  id: number;
  usuarioId: number;
  nombre: string;
  descripcion?: string;
  color: string;
  metaDiaria: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

interface AtributosCreacionHabito extends Optional<AtributosHabito, 'id'> {}

class Habito extends Model<AtributosHabito, AtributosCreacionHabito> 
  implements AtributosHabito {
  public id!: number;
  public usuarioId!: number;
  public nombre!: string;
  public descripcion?: string;
  public color!: string;
  public metaDiaria!: number;
  public readonly fechaCreacion!: Date;
  public readonly fechaActualizacion!: Date;
}

Habito.init(
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
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(7), // #RRGGBB
      defaultValue: '#3498db',
    },
    metaDiaria: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'meta_diaria',
    },
  },
  {
    sequelize,
    tableName: 'habitos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  }
);

export default Habito;
