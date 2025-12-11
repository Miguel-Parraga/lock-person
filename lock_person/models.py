from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from . import db  # Importa la instancia de SQLAlchemy

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(10), nullable=False, default='user')

    # Relaciones con otros modelos
    habits = db.relationship('Habit', backref='user', lazy=True, cascade="all, delete-orphan")
    daily_entries = db.relationship('DailyEntry', backref='user', lazy=True, cascade="all, delete-orphan")
    habit_trackings = db.relationship('HabitTracking', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_admin(self):
        return self.role == 'admin'

class Habit(db.Model):
    __tablename__ = 'habits'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relación con el seguimiento de hábitos
    trackings = db.relationship('HabitTracking', backref='habit', lazy=True, cascade="all, delete-orphan")

class DailyEntry(db.Model):
    __tablename__ = 'daily_entries'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class HabitTracking(db.Model):
    __tablename__ = 'habit_trackings'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    habit_id = db.Column(db.Integer, db.ForeignKey('habits.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Restricción para evitar entradas duplicadas
    __table_args__ = (db.UniqueConstraint('date', 'habit_id', 'user_id', name='_date_habit_user_uc'),)
