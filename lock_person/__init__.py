from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize SQLAlchemy so it can be imported in other files
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # --- CORS Configuration ---
    CORS(app, resources={r"/*": {"origins": "*"}})

    # --- Database Configuration ---
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", 'your_secret_key')

    # Initialize the database with the Flask app
    db.init_app(app)

    # --- Blueprints ---
    with app.app_context():
        # Import and register blueprints
        from .auth import auth as auth_blueprint
        app.register_blueprint(auth_blueprint)

        from .main import main as main_blueprint
        app.register_blueprint(main_blueprint)

        from .bullet_journal import bullet_journal_bp
        app.register_blueprint(bullet_journal_bp)
        
        # We need to import the models so that create_all knows about them
        from . import models

        # Create all database tables
        db.create_all()

    return app
