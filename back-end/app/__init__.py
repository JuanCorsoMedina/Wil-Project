from flask import Flask
from flask_jwt_extended import JWTManager
from flask_mysqldb import MySQL
from flask_cors import CORS  # Import CORS
from .config import Config
from flask_mail import Mail
from dotenv import load_dotenv  # Import the function to load .env variables
import os

# Load environment variables from .env file
load_dotenv()

mysql = MySQL()
mail = Mail()  # Initialize mail

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize MySQL and JWT
    mysql.init_app(app)
    jwt = JWTManager(app)
    
    # Initialize Mail
    mail.init_app(app)

    # Allow CORS
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    from .routes import auth_bp
    app.register_blueprint(auth_bp)

    return app
