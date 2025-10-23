from flask import Blueprint, render_template, current_app, abort
from flask_login import login_required, current_user

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)

@main.route('/admin/users')
@login_required
def users_list():
    """
    Ruta protegida para mostrar una lista de todos los usuarios registrados.
    Solo accesible para usuarios administradores.
    """
    # Comprobamos si el usuario actual es administrador.
    # El método is_admin() lo definimos en el modelo User.
    if not current_user.is_admin():
        # Si no es admin, abortamos la petición con un error 403 (Prohibido).
        abort(403)

    users_cursor = current_app.db.users.find()
    all_users = list(users_cursor)
    
    return render_template('users_list.html', users=all_users, title="Admin - Lista de Usuarios")
