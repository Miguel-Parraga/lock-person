
# Lock Person - Documentación Técnica

## 1. Resumen del Proyecto

**Lock Person** es una aplicación web construida con Python y el micro-framework Flask. El objetivo principal hasta la fecha ha sido establecer un sistema de autenticación de usuarios robusto, seguro y con una interfaz de usuario moderna y amigable.

La aplicación utiliza una estructura basada en **Blueprints** para modularizar el código, separando la lógica de autenticación de las rutas principales de la aplicación.

## 2. Estructura del Proyecto

```
lock_person/
|-- __init__.py       # Inicializa la aplicación Flask y las extensiones.
|-- auth.py           # Blueprint para rutas de autenticación (/login, /signup, /logout).
|-- db.py             # Configuración de la base de datos (actualmente SQLite).
|-- main.py           # Blueprint para las rutas principales (/, /profile).
|-- models.py         # Define los modelos de la base de datos (ej. User).
|-- static/           # Archivos estáticos (CSS, JS, imágenes como el favicon).
|-- templates/        # Plantillas HTML de Jinja2.
|   |-- base.html     # Plantilla principal con la estructura común.
|   |-- index.html    # Página de inicio.
|   |-- login.html    # Formulario de inicio de sesión.
|   |-- profile.html  # Página de perfil de usuario.
|   `-- signup.html   # Formulario de registro.
`-- extensions.py     # Inicialización de extensiones de Flask (ej. LoginManager).
```

## 3. Sistema de Autenticación

- **Registro (`/signup`):** Permite a los nuevos usuarios crear una cuenta. Las contraseñas se hashean de forma segura utilizando `werkzeug.security` antes de guardarlas en la base de datos.
- **Inicio de Sesión (`/login`):** Valida las credenciales del usuario y gestiona las sesiones a través de la extensión `Flask-Login`.
- **Gestión de Sesiones:** Se utiliza `Flask-Login` para recordar a los usuarios autenticados y proteger las rutas que requieren inicio de sesión.
- **Traducción:** Todos los mensajes de error y notificaciones de cara al usuario han sido traducidos al español para una mejor experiencia local.

## 4. Mejoras en la Interfaz de Usuario (UI/UX)

Se ha puesto especial atención en crear una interfaz moderna y funcional.

- **Diseño Oscuro (Dark Mode):** Se ha implementado un tema oscuro consistente en toda la aplicación utilizando **Bootstrap** y estilos CSS personalizados.
- **Visualizador de Contraseña:** 
    - En los formularios de registro e inicio de sesión, se ha añadido un icono de un **ojo** junto al campo de la contraseña.
    - Este icono, importado de **Font Awesome**, permite al usuario hacer clic para mostrar u ocultar la contraseña que está escribiendo, mejorando la usabilidad y reduciendo errores de tipeo.
    - El icono ha sido estilizado para ser blanco y visible en el tema oscuro.
- **Notificaciones Modernas con SweetAlert2:**
    - Se ha reemplazado el sistema de mensajes `flash` por defecto de Flask por notificaciones emergentes de la librería **SweetAlert2**.
    - Estas alertas (ej. "Contraseña incorrecta", "El correo ya está registrado") son más visuales, interactivas y se han estilizado para integrarse perfectamente con el diseño oscuro de la aplicación.

## 5. Dependencias

### Back-End (Python)
- **Flask:** El framework principal.
- **Flask-Login:** Para la gestión de sesiones de usuario.
- **Werkzeug:** Para el hasheo seguro de contraseñas.
- **SQLAlchemy & Flask-SQLAlchemy:** Para la interacción con la base de datos.

### Front-End
- **Bootstrap:** Para el diseño responsive y la estructura de los componentes.
- **Font Awesome:** Para el uso de iconos vectoriales (ej. el ojo).
- **SweetAlert2:** Para las notificaciones y alertas personalizadas.
