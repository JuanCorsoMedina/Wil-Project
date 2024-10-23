class Config:
    SECRET_KEY = 'your_secret_key'
    JWT_SECRET_KEY = 'your_jwt_secret_key'

    # MySQL Configuration
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'Pavneet@99'
    MYSQL_DB = 'face_detection'

    # Flask-Mail Configuration for SendGrid
    MAIL_SERVER = 'smtp.sendgrid.net'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'apikey'  # Use 'apikey' as the username for SendGrid
    # MAIL_PASSWORD = ''  # Your SendGrid API Key
    MAIL_DEFAULT_SENDER = 'toorpavneet2799@gmail.com'  # Your verified sender email
