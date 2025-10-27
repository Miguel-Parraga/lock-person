from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.email = user_data['email']
        self.password_hash = user_data['password']
        self.name = user_data['name']
        # Añadimos el atributo de rol. Si no existe, por defecto es 'user'.
        self.role = user_data.get('role', 'user')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_active(self):
        return True

    # Método para comprobar fácilmente si el usuario es administrador
    def is_admin(self):
        return self.role == 'admin'

# --- Modelos para el Bullet Journal ---

class Habit:
    """
    Representa un hábito individual que un usuario quiere seguir.
    Cada usuario tendrá su propia lista de hábitos.
    """
    def __init__(self, name, user_id, id=None):
        self.id = id
        self.name = name
        self.user_id = user_id

class DailyEntry:
    """
    Representa la entrada de texto de un diario para un día específico.
    Corresponde a las notas del 'Future Log'.
    """
    def __init__(self, date, content, user_id, id=None):
        self.id = id
        self.date = date
        self.content = content
        self.user_id = user_id

class HabitTracking:
    """
    Representa el estado (completado o no) de un hábito en una fecha concreta.
    Es el 'check' que se hace en la tabla de seguimiento.
    """
    def __init__(self, date, completed, habit_id, user_id, id=None):
        self.id = id
        self.date = date
        self.completed = completed
        self.habit_id = habit_id
        self.user_id = user_id
