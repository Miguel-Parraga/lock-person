from flask import Blueprint, jsonify, g
from .decorators import token_required

main = Blueprint('main', __name__)

@main.route('/')
def index():
    """
    Endpoint principal de la API.
    """
    return jsonify({'status': 'success', 'message': 'Bienvenido a la API de Lock-Person.'})

@main.route('/profile')
@token_required
def profile():
    """
    Endpoint para obtener el perfil del usuario autenticado.
    El decorador @token_required se encarga de la autenticación
    y de adjuntar el usuario a g.current_user.
    """
    # g.current_user es establecido por el decorador token_required
    user = g.current_user
    
    return jsonify({
        'status': 'success',
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        }
    })
