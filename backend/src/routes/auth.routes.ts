import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// Rutas de autenticación
router.post('/login', authController.login.bind(authController));
router.post('/registro', authController.registro.bind(authController));
router.get('/perfil', authController.perfil.bind(authController));

export default router;
