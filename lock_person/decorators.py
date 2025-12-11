from functools import wraps
from flask import request, jsonify, g
import jwt
import os
from .models import User

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        # El token se espera en la cabecera 'Authorization' como 'Bearer <token>'
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                # Extrae el token de "Bearer <token>"
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'status': 'error', 'message': 'Formato de token inválido. Usa "Bearer <token>".'}), 401

        if not token:
            return jsonify({'status': 'error', 'message': 'Falta el token de autorización.'}), 401

        try:
            # Decodificar el token
            data = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
            # Buscar el usuario y adjuntarlo al contexto global 'g' de la petición
            g.current_user = User.query.get(data['sub'])
            if g.current_user is None:
                return jsonify({'status': 'error', 'message': 'Token inválido: usuario no encontrado.'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'status': 'error', 'message': 'El token ha expirado.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'status': 'error', 'message': 'Token inválido.'}), 401

        # Llamar a la ruta original con el usuario en el contexto
        return f(*args, **kwargs)

    return decorated_function
