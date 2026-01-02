import express, { Request, Response, NextFunction } from 'express';
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

// ====== MIDDLEWARE DE LOGGING SIMPLIFICADO ======
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Solo log para métodos que envían body
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log(`\n📥 ${new Date().toISOString()} ${req.method} ${req.path}`);
    console.log('📋 Content-Type:', req.get('Content-Type'));
    
    // Mostrar body (ocultar contraseña)
    if (req.body) {
      const logBody = { ...req.body };
      if (logBody.contraseña) logBody.contraseña = '***OCULTA***';
      if (logBody.password) logBody.password = '***OCULTA***';
      console.log('📦 Body:', logBody);
    }
  }
  
  // Interceptar respuesta para log
  const originalSend = res.send;
  res.send = function(body: any): Response {
    const duration = Date.now() - start;
    
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      console.log(`📤 ${new Date().toISOString()} ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    }
    
    return originalSend.call(this, body);
  };
  
  next();
});

// Rutas
app.use('/api/auth', authRoutes);

// Rutas de prueba
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    estado: 'OK', 
    mensaje: 'Backend funcionando',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test-db', async (req: Request, res: Response) => {
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
app.get('/', (req: Request, res: Response) => {
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
      console.log(`🔗 Frontend: ${process.env.CORS_ORIGIN || 'http://localhost:4200'}`);
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