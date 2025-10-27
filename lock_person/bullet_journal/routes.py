from flask import render_template, request, jsonify, current_app
from flask_login import login_required, current_user
from . import bullet_journal_bp
from bson.objectid import ObjectId
import datetime
import calendar

# --- Ruta de la Interfaz de Usuario (UI) ---

@bullet_journal_bp.route('/journal')
@login_required
def journal_ui():
    """
    Renderiza la página principal del Journal. El frontend se encarga
    de solicitar los datos dinámicamente a la API.
    """
    return render_template('journal.html')

# --- Rutas de la API (para llamadas desde JavaScript) ---

@bullet_journal_bp.route('/journal/data', methods=['GET'])
@login_required
def get_journal_data():
    db = current_app.db
    user_id = ObjectId(current_user.id)

    try:
        # Esperamos el mes como 1-12, consistente con el frontend
        year = int(request.args.get('year', datetime.datetime.utcnow().year))
        month = int(request.args.get('month', datetime.datetime.utcnow().month))
    except (ValueError, TypeError):
        now = datetime.datetime.utcnow()
        year, month = now.year, now.month

    month_name = calendar.month_name[month]
    _, num_days = calendar.monthrange(year, month)
    days_in_month = list(range(1, num_days + 1))

    habits_cursor = db.habits.find({"user_id": user_id})
    habits = []
    for habit in habits_cursor:
        habit['_id'] = str(habit['_id'])
        habits.append(habit)

    start_date = datetime.datetime(year, month, 1)
    end_date = datetime.datetime(year, month, num_days, 23, 59, 59)
    tracking_cursor = db.habit_tracking.find({
        "user_id": user_id,
        "date": {"$gte": start_date, "$lte": end_date}
    })
    
    tracking_data = {}
    for record in tracking_cursor:
        habit_id = str(record['habit_id'])
        if habit_id not in tracking_data:
            tracking_data[habit_id] = []
        tracking_data[habit_id].append(record['date'].day)

    return jsonify({
        'status': 'success',
        'year': year,
        'month': month, 
        'month_name': month_name,
        'days': days_in_month,
        'habits': habits,
        'tracking_data': tracking_data
    })

@bullet_journal_bp.route('/journal/habit', methods=['POST'])
@login_required
def add_habit():
    data = request.get_json()
    if not data or 'name' not in data or not data['name'].strip():
        return jsonify({'status': 'error', 'message': 'El nombre del hábito no puede estar vacío.'}), 400

    db = current_app.db
    new_habit = {
        "name": data['name'].strip(),
        "user_id": ObjectId(current_user.id)
    }
    result = db.habits.insert_one(new_habit)
    return jsonify({
        'status': 'success', 
        'message': 'Hábito añadido.', 
        'habit_id': str(result.inserted_id)
    }), 201

@bullet_journal_bp.route('/journal/track', methods=['POST'])
@login_required
def track_habit():
    data = request.get_json()
    db = current_app.db

    try:
        habit_id = ObjectId(data['habit_id'])
        date_obj = datetime.datetime(int(data['year']), int(data['month']), int(data['day']))
        completed = bool(data['completed'])
    except (KeyError, ValueError, TypeError):
        return jsonify({'status': 'error', 'message': 'Datos inválidos.'}), 400

    query = {"habit_id": habit_id, "user_id": ObjectId(current_user.id), "date": date_obj}

    if completed:
        db.habit_tracking.update_one(query, {"$set": {"completed": True}}, upsert=True)
        return jsonify({'status': 'success', 'action': 'tracked'})
    else:
        db.habit_tracking.delete_one(query)
        return jsonify({'status': 'success', 'action': 'untracked'})
