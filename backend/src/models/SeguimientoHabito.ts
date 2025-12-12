import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AtributosSeguimientoHabito {
  id: number;
  habitoId: number;
  fecha: Date;
  completado: boolean;
  fechaCreacion?: Date;
}

interface AtributosCreacionSeguimientoHabito extends Optional<AtributosSeguimientoHabito, 'id'> {}

class SeguimientoHabito extends Model<AtributosSeguimientoHabito, AtributosCreacionSeguimientoHabito> 
  implements AtributosSeguimientoHabito {
  public id!: number;
  public habitoId!: number;
  public fecha!: Date;
  public completado!: boolean;
  public readonly fechaCreacion!: Date;
}

SeguimientoHabito.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    habitoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'habito_id',
      references: {
        model: 'habitos',
        key: 'id',
      },
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    completado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'seguimiento_habitos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false, // No necesitamos updatedAt para seguimientos
    indexes: [
      {
        unique: true,
        fields: ['habito_id', 'fecha'],
        name: 'seguimiento_unico_por_dia'
      }
    ]
  }
);

export default SeguimientoHabito;
