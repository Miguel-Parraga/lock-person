from flask import Flask
from flask_login import LoginManager
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from bson.objectid import ObjectId

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = 'your_secret_key'  # Change this!

    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME")

    client = MongoClient(mongo_uri)
    app.db = client[db_name]

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.login_message = "Por favor, inicia sesión para acceder a esta página."
    login_manager.init_app(app)

    from .models import User

    @login_manager.user_loader
    def load_user(user_id):
        try:
            # Convert user_id string to ObjectId before querying
            user_data = app.db.users.find_one({"_id": ObjectId(user_id)})
        except Exception:
            return None # Handle invalid ObjectId format
            
        if user_data:
            return User(user_data)
        return None

    # blueprint for auth routes in our app
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    # blueprint for non-auth parts of app
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
