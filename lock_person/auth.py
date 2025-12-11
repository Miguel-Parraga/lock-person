from flask import Blueprint, request, jsonify
from .models import User
from . import db
import jwt
import os
import datetime

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup_post():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')

    if not all([email, name, password]):
        return jsonify({'status': 'error', 'message': 'Faltan datos (email, nombre, contraseña)'}), 400

    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({'status': 'error', 'message': 'La dirección de correo electrónico ya está registrada.'}), 409 # 409 Conflict

    new_user = User(email=email, name=name)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Usuario registrado correctamente.'}), 201

@auth.route('/login', methods=['POST'])
def login_post():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'status': 'error', 'message': 'Faltan datos (email, contraseña)'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({'status': 'error', 'message': 'Credenciales incorrectas.'}), 401 # 401 Unauthorized

    # Generar el token JWT
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1), # El token expira en 1 día
            'iat': datetime.datetime.utcnow(),
            'sub': user.id
        }
        token = jwt.encode(
            payload,
            os.getenv('SECRET_KEY'),
            algorithm='HS256'
        )
        return jsonify({'status': 'success', 'token': token})

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
