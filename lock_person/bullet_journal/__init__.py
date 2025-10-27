from flask import Blueprint

# Definimos el Blueprint para el módulo de Bullet Journal
# 'bullet_journal' es el nombre del Blueprint.
# __name__ ayuda a Flask a localizar la raíz del Blueprint (la carpeta actual).
# template_folder='templates' le dice a este Blueprint que busque sus plantillas en una subcarpeta llamada 'templates'.
# Aunque no la usaremos de inmediato, es una buena práctica.
bullet_journal_bp = Blueprint('bullet_journal', __name__, template_folder='templates')

# Importamos las rutas al final para evitar importaciones circulares.
# Las rutas usarán el 'bullet_journal_bp' que acabamos de definir.
from . import routes
