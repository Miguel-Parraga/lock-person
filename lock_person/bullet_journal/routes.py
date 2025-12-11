from flask import request, jsonify, g
from . import bullet_journal_bp
from .. import db
from ..models import Habit, HabitTracking, DailyEntry
from ..decorators import token_required
import datetime
import calendar

# --- Rutas de la API (para llamadas desde JavaScript) ---

@bullet_journal_bp.route('/journal/data', methods=['GET'])
@token_required
def get_journal_data():
    try:
        year = int(request.args.get('year', datetime.date.today().year))
        month = int(request.args.get('month', datetime.date.today().month))
    except (ValueError, TypeError):
        today = datetime.date.today()
        year, month = today.year, today.month

    month_name = calendar.month_name[month]
    _, num_days = calendar.monthrange(year, month)
    days_in_month = list(range(1, num_days + 1))

    # Obtener hábitos del usuario autenticado via token
    habits = Habit.query.filter_by(user_id=g.current_user.id).all()
    habits_data = [{'id': habit.id, 'name': habit.name} for habit in habits]

    # Obtener datos de seguimiento para el mes
    start_date = datetime.date(year, month, 1)
    end_date = datetime.date(year, month, num_days)
    
    trackings = HabitTracking.query.filter(
        HabitTracking.user_id == g.current_user.id,
        HabitTracking.date >= start_date,
        HabitTracking.date <= end_date,
        HabitTracking.completed == True
    ).all()

    tracking_data = {}
    for record in trackings:
        habit_id = record.habit_id
        if habit_id not in tracking_data:
            tracking_data[habit_id] = []
        tracking_data[habit_id].append(record.date.day)

    return jsonify({
        'status': 'success',
        'year': year,
        'month': month,
        'month_name': month_name,
        'days': days_in_month,
        'habits': habits_data,
        'tracking_data': tracking_data
    })

@bullet_journal_bp.route('/journal/habit', methods=['POST'])
@token_required
def add_habit():
    data = request.get_json()
    if not data or 'name' not in data or not data['name'].strip():
        return jsonify({'status': 'error', 'message': 'El nombre del hábito no puede estar vacío.'}), 400

    new_habit = Habit(name=data['name'].strip(), user_id=g.current_user.id)
    db.session.add(new_habit)
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'message': 'Hábito añadido.',
        'habit': {'id': new_habit.id, 'name': new_habit.name}
    }), 201

@bullet_journal_bp.route('/journal/track', methods=['POST'])
@token_required
def track_habit():
    data = request.get_json()
    try:
        habit_id = int(data['habit_id'])
        date_obj = datetime.date(int(data['year']), int(data['month']), int(data['day']))
        completed = bool(data['completed'])
    except (KeyError, ValueError, TypeError):
        return jsonify({'status': 'error', 'message': 'Datos inválidos.'}), 400

    tracking_record = HabitTracking.query.filter_by(
        habit_id=habit_id, 
        user_id=g.current_user.id, 
        date=date_obj
    ).first()

    if completed:
        if not tracking_record:
            new_tracking = HabitTracking(
                habit_id=habit_id,
                user_id=g.current_user.id,
                date=date_obj,
                completed=True
            )
            db.session.add(new_tracking)
        else:
            tracking_record.completed = True
        
        db.session.commit()
        return jsonify({'status': 'success', 'action': 'tracked'})
    else:
        if tracking_record:
            db.session.delete(tracking_record)
            db.session.commit()
        
        return jsonify({'status': 'success', 'action': 'untracked'})

@bullet_journal_bp.route('/journal/habit/<int:habit_id>', methods=['DELETE'])
@token_required
def delete_habit(habit_id):
    habit = Habit.query.get_or_404(habit_id)

    if habit.user_id != g.current_user.id:
        return jsonify({'status': 'error', 'message': 'No autorizado'}), 403

    db.session.delete(habit)
    db.session.commit()
    
    return jsonify({'status': 'success', 'message': 'Hábito eliminado.'})
