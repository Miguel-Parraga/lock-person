import sequelize from './config/database';
import { Usuario } from './models';
import dotenv from 'dotenv';

dotenv.config();

const sincronizarBaseDatos = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida.');

    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas.');

    // Crear usuario administrador por defecto si no existe
    const adminExiste = await Usuario.findOne({ where: { email: 'admin@ejemplo.com' } });
    if (!adminExiste) {
      await Usuario.create({
        email: 'admin@ejemplo.com',
        nombre: 'Administrador',
        contraseña: 'admin123',
        esAdministrador: true,
      });
      console.log('✅ Usuario administrador creado: admin@ejemplo.com / admin123');
    }

    console.log('✅ Base de datos lista.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

sincronizarBaseDatos();
