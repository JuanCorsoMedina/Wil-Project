from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from flask_mail import Mail, Message  # For sending emails
from app import mysql, mail  # Assumes mail instance `mail` is initialized
import datetime
import random

auth_bp = Blueprint('auth', __name__)

# Configure a serializer for generating and validating tokens
s = URLSafeTimedSerializer('supersecretkey')  # Change to your app's secret key

@auth_bp.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Face Detection Security System API"}), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')  # Add this line to capture the email
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Invalid input"}), 400

    hashed_password = generate_password_hash(password)
    role = 'User'
    
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO users(username, email, password, role) VALUES (%s, %s, %s, %s)", 
                   (username, email, hashed_password, role))
    mysql.connection.commit()
    cursor.close()
    
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT username, password, role FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()

    if not user or not check_password_hash(user[1], password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity={'username': user[0], 'role': user[2]})
    return jsonify(access_token=access_token), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "If an account with this email exists, a reset link will be sent shortly."}), 200

    # Generate a reset token with a timestamp
    token = s.dumps(email, salt='password-reset-salt')
    
    # Store the token in the database with an expiration timestamp
    expiration_time = datetime.datetime.now() + datetime.timedelta(hours=1)  # Token valid for 1 hour
    cursor.execute("UPDATE users SET reset_token = %s, token_expiration = %s WHERE email = %s", 
                   (token, expiration_time, email))
    mysql.connection.commit()

    # Construct the password reset URL
    reset_link = url_for('auth.reset_password', token=token, _external=True)

    try:
        msg = Message("Password Reset Request",
                      sender="noreply@yourapp.com",
                      recipients=[email])
        msg.body = f"To reset your password, click the following link: {reset_link}\n\nIf you did not request this, please ignore this email."
        mail.send(msg)
    except Exception as e:
        return jsonify({"message": "Error sending email. Please try again later."}), 500

    cursor.close()
    return jsonify({"message": "If an account with this email exists, a reset link will be sent shortly."}), 200

from flask_mail import Message
from app import mail

@auth_bp.route('/verify-email', methods=['POST'])
def verify_email():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "Email not found."}), 404

    # Generate a simple numeric code for verification (example: 6-digit number)
    verification_code = str(random.randint(100000, 999999))

    # Store the code in the database (consider using expiration logic in a real app)
    cursor.execute("UPDATE users SET verification_code = %s WHERE email = %s", (verification_code, email))
    mysql.connection.commit()

    # Send an email containing the verification code (ensure that Mail is configured)
    try:
        msg = Message(
            subject="Password Reset Verification Code",
            sender="toorpavneet2799@gmail.com",  # Use your verified email here
            recipients=[email]
        )
        msg.body = f"Your verification code is: {verification_code}"
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email: {e}")  # Print specific error message
        return jsonify({"message": "Error sending email. Please try again later."}), 500

    cursor.close()
    return jsonify({"message": "Verification code sent. Please check your email."}), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    verification_code = data.get('verification_code')
    new_password = data.get('new_password')

    if not email or not verification_code or not new_password:
        return jsonify({"message": "All fields are required"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT verification_code FROM users WHERE email = %s", (email,))
    result = cursor.fetchone()

    if not result or result[0] != verification_code:
        return jsonify({"message": "Invalid verification code"}), 400

    # Hash the new password and update it in the database
    hashed_password = generate_password_hash(new_password)
    cursor.execute("UPDATE users SET password = %s, verification_code = NULL WHERE email = %s",
                   (hashed_password, email))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Password updated successfully. You can now log in with your new password."}), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()  # Ensure the user is authenticated with JWT
def profile():
    current_user = get_jwt_identity()
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT username, email FROM users WHERE username = %s", (current_user['username'],))
    user = cursor.fetchone()
    cursor.close()

    if user:
        return jsonify({
            'username': user[0],
            'email': user[1]
        }), 200
    else:
        return jsonify({'message': 'User not found'}), 404

@auth_bp.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')

    current_user = get_jwt_identity()

    if not username or not email:
        return jsonify({'message': 'Username and email are required'}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE users SET username = %s, email = %s WHERE username = %s", 
                   (username, email, current_user['username']))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Profile updated successfully'}), 200

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({"message": "This is a protected route"})
