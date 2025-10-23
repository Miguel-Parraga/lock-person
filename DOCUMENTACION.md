# Lock Person - Documentación Técnica

## 1. Resumen del Proyecto

**Lock Person** es una aplicación web construida con Python y Flask, diseñada como una plataforma modular. El núcleo de la aplicación es un sistema de autenticación seguro que da paso a un panel de control personalizado desde donde los usuarios pueden acceder a diferentes módulos funcionales.

La arquitectura se basa en **Blueprints** para una clara separación de responsabilidades y utiliza una base de datos **MongoDB** para el almacenamiento de datos, gestionada a través de la aplicación.

## 2. Estructura del Proyecto

```
lock_person/
|-- __init__.py         # Fábrica de la aplicación. Inicializa Flask y las extensiones.
|-- auth.py             # Blueprint para rutas de autenticación (/login, /signup, /logout).
|-- main.py             # Blueprint para las rutas principales (/, /profile, /admin/users).
|-- models.py           # Define el modelo de datos `User` para Flask-Login.
|-- static/             # Archivos estáticos.
|   |-- css/            # Hojas de estilo locales (Bootstrap, Font Awesome).
|   |-- js/             # Scripts locales (SweetAlert2).
|   `-- favicon.svg     # Ícono de la aplicación.
|-- templates/          # Plantillas HTML de Jinja2.
|   |-- base.html       # Plantilla principal con la estructura y navegación común.
|   |-- index.html      # Página de inicio para visitantes.
|   |-- login.html      # Formulario de inicio de sesión.
|   |-- profile.html    # Panel de control del usuario con módulos.
|   |-- signup.html     # Formulario de registro.
|   `-- users_list.html # Tabla de administración de usuarios.
|-- extensions.py       # Inicialización de extensiones (LoginManager).
|-- promote_user.py     # Script para dar permisos de administrador a un usuario.
|-- NOTAS.md            # Notas de desarrollo y tareas pendientes.
`-- DOCUMENTACION.md    # Este mismo archivo.
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
