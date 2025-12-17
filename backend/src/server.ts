import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);

// Rutas de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    estado: 'OK', 
    mensaje: 'Backend funcionando',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test-db', async (req, res) => {
  try {
    await testConnection();
    res.json({ 
      estado: 'OK', 
      mensaje: 'Conexión a PostgreSQL exitosa'
    });
  } catch (error: any) {
    res.status(500).json({ 
      estado: 'ERROR', 
      mensaje: 'Error en conexión a PostgreSQL',
      error: error.message 
    });
  }
});

// Ruta por defecto
app.get('/', (req, res) => {
  res.json({
    estado: 'OK',
    mensaje: 'API de Bullet Journal',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/api/health',
      testDb: '/api/test-db'
    }
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    await testConnection();
    console.log('✅ Conexión a PostgreSQL establecida.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
      console.log(`📁 Base de datos: ${process.env.DB_NAME}`);
      console.log(`👤 Usuario BD: ${process.env.DB_USER}`);
      console.log(`🔗 Frontend: ${process.env.CORS_ORIGIN}`);
      console.log(`🔐 Endpoints disponibles:`);
      console.log(`   POST /api/auth/login`);
      console.log(`   POST /api/auth/registro`);
      console.log(`   GET  /api/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
