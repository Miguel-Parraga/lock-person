# Notas de Desarrollo y Tareas Pendientes

## Comandos Útiles

- **Activar entorno virtual:** `source .venv/bin/activate`
- **Convertir un usuario en administrador:** `python promote_user.py TU_EMAIL@EJEMPLO.COM` (reemplazar con el correo del usuario)

---

## Tareas de Diseño y UX

- **[ ] Cambiar el ícono del botón "Admin"**: Buscar y asignar un ícono más representativo y visualmente atractivo para el módulo de administración en la página de perfil. El ícono actual de base de datos es provisional.

---

## Próximos Módulos

- **[ ] Módulo de Registro de Hábitos Diarios**: Desarrollar la funcionalidad para que los usuarios puedan registrar sus hábitos diarios. Esto incluirá:
    - Creación del modelo de datos para los hábitos.
    - Diseño de la interfaz para el registro diario.
    - Lógica del backend para almacenar los datos.
    - Preparación de los datos para futuras visualizaciones (gráficas).

Correcciones pendientes:
    - Modificar para colocar el mes y el año en el título de la página.
    - El tracker de habitos no esta añadiendo los datos a la base de datos y tampoco se ve reflejada en la pagina.
    - Que se utilice el grafico en funcion del registro de los habitos.
    - Registros de Eventos no tiene las filas para colocarlas.
    - **[] IMPORTANTE** **Hacer migracion a postgresql para poder manejar mejor todo**

--- 

