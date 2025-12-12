import Usuario from './Usuario';
import EntradaDiario from './EntradaDiario';
import Habito from './Habito';
import SeguimientoHabito from './SeguimientoHabito';

// Definir relaciones
Usuario.hasMany(EntradaDiario, {
  foreignKey: 'usuarioId',
  as: 'entradasDiario',
});

EntradaDiario.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

Usuario.hasMany(Habito, {
  foreignKey: 'usuarioId',
  as: 'habitos',
});

Habito.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

Habito.hasMany(SeguimientoHabito, {
  foreignKey: 'habitoId',
  as: 'seguimientos',
});

SeguimientoHabito.belongsTo(Habito, {
  foreignKey: 'habitoId',
  as: 'habito',
});

// Exportar todos los modelos
export { 
  Usuario, 
  EntradaDiario, 
  Habito, 
  SeguimientoHabito 
};
