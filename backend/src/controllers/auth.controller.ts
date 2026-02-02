// auth.controller.ts - CON DEBUGGING
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, contraseña } = req.body;

      if (!email || !contraseña) {
        return res.status(400).json({ estado: 'error', mensaje: 'Campos requeridos' });
      }

      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ estado: 'error', mensaje: 'Credenciales inválidas' });
      }

      const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!contraseñaValida) {
        return res.status(401).json({ estado: 'error', mensaje: 'Credenciales inválidas' });
      }

      // Token simple sin expiresIn complicado
      const token = jwt.sign(
        { userId: usuario.id, email: usuario.email },
        process.env.JWT_SECRET || 'secreto_temporal',
        { expiresIn: '24h' }
      );

      res.json({
        estado: 'success',
        mensaje: 'Login exitoso',
        token,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          esAdministrador: usuario.esAdministrador
        }
      });

    } catch (error: any) {
      console.error('Error en login:', error);
      res.status(500).json({ estado: 'error', mensaje: error.message });
    }
  }

  async registro(req: Request, res: Response) {
    try {
      // ======= AGREGAR ESTOS CONSOLE.LOG =======
      console.log('=== 🔍 REGISTRO INICIADO ===');
      console.log('Body recibido en controller:', req.body);
      
      const { email, nombre, contraseña } = req.body;
      
      console.log('Campos extraídos:', { 
        email, 
        nombre, 
        contraseña: contraseña ? 'PRESENTE' : 'AUSENTE' 
      });
      
      // Validación EXPLÍCITA con logs
      if (!email) {
        console.log('❌ Falta email');
        return res.status(400).json({ 
          estado: 'error', 
          mensaje: 'El email es requerido' 
        });
      }
      
      if (!nombre) {
        console.log('❌ Falta nombre');
        return res.status(400).json({ 
          estado: 'error', 
          mensaje: 'El nombre es requerido' 
        });
      }
      
      if (!contraseña) {
        console.log('❌ Falta contraseña');
        return res.status(400).json({ 
          estado: 'error', 
          mensaje: 'La contraseña es requerida' 
        });
      }
      
      console.log('✅ Todos los campos presentes');
      // ======= FIN DE LOS CONSOLE.LOG =======

      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ estado: 'error', mensaje: 'Email ya registrado' });
      }

      const nuevoUsuario = await Usuario.create({
        email,
        nombre,
        contraseña,
        esAdministrador: false
      });

      const token = jwt.sign(
        { userId: nuevoUsuario.id, email: nuevoUsuario.email },
        process.env.JWT_SECRET || 'secreto_temporal',
        { expiresIn: '24h' }
      );

      console.log('✅ Usuario creado con ID:', nuevoUsuario.id);  // Este también

      res.status(201).json({
        estado: 'success',
        mensaje: 'Usuario registrado',
        token,
        usuario: {
          id: nuevoUsuario.id,
          email: nuevoUsuario.email,
          nombre: nuevoUsuario.nombre
        }
      });

    } catch (error: any) {
      console.error('💥 ERROR en registro:', error);
      console.error('Stack:', error.stack);  // Agregar stack trace
      res.status(500).json({ 
        estado: 'error', 
        mensaje: 'Error interno: ' + error.message 
      });
    }
  }

  // Método perfil que falta
  async perfil(req: Request, res: Response) {
    try {
      // Por ahora solo devolvemos un mensaje básico
      // Más adelante agregaremos autenticación JWT
      res.json({
        estado: 'success',
        mensaje: 'Endpoint de perfil (en desarrollo)',
        nota: 'La autenticación JWT se implementará próximamente'
      });

    } catch (error: any) {
      console.error('Error en perfil:', error);
      res.status(500).json({ estado: 'error', mensaje: error.message });
    }
  }
}