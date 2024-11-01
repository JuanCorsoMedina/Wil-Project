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

    # Configure upload folder and file size limit
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, '..', 'static', 'uploads')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit file size to 16MB

    # Create the upload folder if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize MySQL and JWT
    mysql.init_app(app)
    jwt = JWTManager(app)
    
    # Initialize Mail
    mail.init_app(app)

    # Allow CORS
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
    # Serve uploaded files using a route
    @app.route('/static/uploads/<path:filename>')
    def serve_uploaded_file(filename):
        return send_from_directory(os.path.join(app.root_path, '..', 'static', 'uploads'), filename)

    # Register blueprints after creating app and initializing other services
    from .routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api')

    from .routes import auth_bp
    app.register_blueprint(auth_bp)

    return app
