# Lock Person - Documentación Técnica

## 1. Resumen del Proyecto

**Lock Person** es una aplicación web construida con Python y Flask, diseñada como una plataforma modular. El núcleo de la aplicación es un sistema de autenticación seguro que da paso a un panel de control personalizado desde donde los usuarios pueden acceder a diferentes módulos funcionales.

La arquitectura se basa en **Blueprints** para una clara separación de responsabilidades y utiliza una base de datos **MongoDB** para el almacenamiento de datos, gestionada a través de la aplicación.

## 2. Estructura del Proyecto

```
lock-person/
├── backend/           # Aplicación Python
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── decorators.py
│   │   ├── models.py
│   │   ├── routes.py
│   │   └── ...
│   ├── templates/     # ELIMINAR o mover a frontend (ya no se usa)
│   ├── static/        # ELIMINAR (Angular maneja los estáticos)
│   ├── requirements.txt
│   ├── run.py
│   └── ...
├── frontend/          # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/    # AÑADIR para API calls
│   │   │   ├── models/      # AÑADIR para TypeScript interfaces
│   │   │   └── ...
│   │   ├── assets/
│   │   └── ...
│   ├── angular.json
│   └── package.json
└── README.md
```

## 3. Sistema de Autenticación y Roles

- **Registro y Login:** Formularios para crear cuentas e iniciar sesión. Las contraseñas se hashean con `werkzeug.security`.
- **Gestión de Sesión:** Se utiliza `Flask-Login` para manejar las sesiones de usuario.
- **Roles de Usuario:**
    - **`user` (usuario):** Rol por defecto. Puede acceder a su perfil y a los módulos generales.
    - **`admin` (administrador):** Tiene permisos elevados. Puede acceder a paneles especiales como la lista de usuarios.
    - El script `promote_user.py` permite elevar el rol de un usuario a `admin` desde la línea de comandos.
- **Protección de Rutas:**
    - Rutas como `/profile` o `/admin/users` están protegidas y requieren inicio de sesión.
    - Las páginas públicas (`/`, `/login`, `/signup`) redirigen automáticamente al perfil si el usuario ya ha iniciado sesión, evitando flujos confusos.

## 4. Interfaz de Usuario y Experiencia (UI/UX)

Se ha puesto un gran énfasis en una experiencia de usuario fluida y moderna.

- **Tema Oscuro:** La aplicación completa utiliza un diseño oscuro (dark mode) para mayor comodidad visual.
- **Panel de Control en Perfil:** La página `/profile` actúa como un **panel de control central**. En lugar de una simple bienvenida, presenta una cuadrícula de botones modulares que sirven como puntos de entrada a las diferentes funcionalidades de la aplicación.
- **Navegación Centralizada:** El acceso a funciones clave, como el panel de administración, se ha movido desde la barra de navegación superior al panel de control del perfil, creando un único y claro punto de partida.
- **Notificaciones con SweetAlert2:** Se usan alertas emergentes estilizadas para todos los mensajes de la aplicación (éxito, error, confirmación), mejorando la comunicación con el usuario.
- **Mejoras de Usabilidad:** Se han incluido detalles como un botón para visualizar la contraseña en los formularios, facilitando el proceso de registro e inicio de sesión.

## 5. Rendimiento y Optimización

- **Recursos Locales:** Todas las librerías de frontend (Bootstrap, Font Awesome, SweetAlert2) se sirven desde la carpeta `static/` de la propia aplicación. Esto **elimina peticiones a servidores externos (CDNs)**, resultando en tiempos de carga significativamente más rápidos y permitiendo que la aplicación funcione en entornos con conectividad limitada.

## 6. Dependencias Principales

- **Back-End:** Flask, Flask-Login, Werkzeug, pymongo.
- **Front-End:** Bootstrap, Font Awesome, SweetAlert2.
