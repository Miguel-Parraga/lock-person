from flask import Blueprint, render_template, redirect, url_for, request, flash, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from .models import User

auth = Blueprint('auth', __name__)

@auth.route('/login')
def login():
    # Si el usuario ya ha iniciado sesión, redirigir a la página de perfil
    if current_user.is_authenticated:
        return redirect(url_for('main.profile'))
    return render_template('login.html')

@auth.route('/login', methods=['POST'])
def login_post():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    user_data = current_app.db.users.find_one({'email': email})

    if not user_data or not check_password_hash(user_data['password'], password):
        flash('Los datos de inicio de sesión son incorrectos. Por favor, inténtalo de nuevo.')
        return redirect(url_for('auth.login'))

    user = User(user_data)
    login_user(user, remember=remember)
    return redirect(url_for('main.profile'))

@auth.route('/signup')
def signup():
    # Si el usuario ya ha iniciado sesión, redirigir a la página de perfil
    if current_user.is_authenticated:
        return redirect(url_for('main.profile'))
    return render_template('signup.html')

@auth.route('/signup', methods=['POST'])
def signup_post():
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')

    user_data = current_app.db.users.find_one({'email': email})

    if user_data:
        flash('La dirección de correo electrónico ya está registrada.')
        return redirect(url_for('auth.signup'))

    new_user = {
        'email': email,
        'name': name,
        'password': generate_password_hash(password, method='pbkdf2:sha256'),
        'role': 'user'
    }

    current_app.db.users.insert_one(new_user)

    return redirect(url_for('auth.login'))

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))
