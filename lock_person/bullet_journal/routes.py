from flask import render_template, request, jsonify, current_app
from flask_login import login_required, current_user
from . import bullet_journal_bp
from bson.objectid import ObjectId
import datetime
import calendar

# --- Rutas de la Interfaz de Usuario (UI) ---

@bullet_journal_bp.route('/journal')
@login_required
def journal():
    """
    Muestra la página principal del Bullet Journal, cargando todos los datos
    necesarios para el mes actual.
    """
    db = current_app.db
    user_id = ObjectId(current_user.id)

    # 1. Determinar el mes y año actual
    # Nota: Más adelante, esto se leerá de los argumentos de la solicitud para la navegación
    now = datetime.datetime.utcnow()
    year, month = now.year, now.month
    month_name = now.strftime("%B")

    # 2. Obtener los días del mes
    _, num_days = calendar.monthrange(year, month)
    days_in_month = range(1, num_days + 1)

    # 3. Obtener los hábitos del usuario
    habits_cursor = db.habits.find({"user_id": user_id})
    habits = list(habits_cursor)

    # 4. Obtener los datos de seguimiento (tracking) para el mes actual
    # (Lo implementaremos en el siguiente paso)
    tracking_data = {}

    # 5. Obtener las entradas del diario (Future Log) para el mes actual
    # (Lo implementaremos en el siguiente paso)
    daily_entries = {}

    return render_template('journal.html', 
                           habits=habits, 
                           days=days_in_month,
                           current_month_name=month_name,
                           current_year=year,
                           tracking_data=tracking_data, # Datos vacíos por ahora
                           daily_entries=daily_entries) # Datos vacíos por ahora

# --- Rutas de la API (para llamadas desde JavaScript) ---

@bullet_journal_bp.route('/journal/habit', methods=['POST'])
@login_required
def add_habit():
    """
    API endpoint para crear un nuevo hábito.
    """
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({'status': 'error', 'message': 'El nombre del hábito es requerido.'}), 400

    habit_name = data['name'].strip()
    if not habit_name:
        return jsonify({'status': 'error', 'message': 'El nombre del hábito no puede estar vacío.'}), 400

    db = current_app.db
    new_habit = {
        "name": habit_name,
        "user_id": ObjectId(current_user.id)
    }
    result = db.habits.insert_one(new_habit)

    return jsonify({
        'status': 'success', 
        'message': 'Hábito añadido correctamente.', 
        'habit_id': str(result.inserted_id)
    }), 201
