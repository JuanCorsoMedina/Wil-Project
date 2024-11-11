from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename  # Add this import statement
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from flask_mail import Mail, Message  # For sending emails
from app import mysql, mail  # Assumes mail instance `mail` is initialized
import datetime
import random
import os

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
    cursor.execute("SELECT id, username, password, role FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()

    if not user or not check_password_hash(user[2], password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity={'user_id': user[0], 'username': user[1], 'role': user[3]})
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

@auth_bp.route('/add-user', methods=['POST'])
@jwt_required()
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def add_user():
    current_user = get_jwt_identity()  # Get the current logged-in user's identity (username or email)
    user_name = request.form.get('user_name')
    role = request.form.get('role')
    image = request.files.get('image')

    if not user_name or not role or not image:
        return jsonify({"message": "All fields are required"}), 400

    if not allowed_file(image.filename):
        return jsonify({"message": "Invalid file type"}), 400

    # Generate a secure filename and define the image path
    filename = secure_filename(image.filename)
    image_path = os.path.join('static/uploads', filename)
    image.save(image_path)

    # Associate the added user with the logged-in user
    cursor = mysql.connection.cursor()
    cursor.execute(
        "INSERT INTO user_roles (user_name, role, image_path, added_by) VALUES (%s, %s, %s, %s)", 
        (user_name, role, image_path, current_user['username'])
    )
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "User added successfully"}), 201


@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        current_user = get_jwt_identity()  # Get the identity of the currently logged-in user
        cursor = mysql.connection.cursor()
        # Fetch id, user_name, role, and image_path from the user_roles table where added_by matches the current user
        cursor.execute(
            "SELECT id, user_name, role, image_path FROM user_roles WHERE added_by = %s", 
            (current_user['username'],)
        )
        users = cursor.fetchall()
        cursor.close()

        users_list = []
        for user in users:
            users_list.append({
                "id": user[0],
                "user_name": user[1],
                "role": user[2],
                "image_path": user[3]  # Include image path in the response
            })
        
        return jsonify({"users": users_list}), 200
    except Exception as e:
        print(f"Error fetching users: {e}")
        return jsonify({"message": "Failed to fetch users"}), 500

    
@auth_bp.route('/delete-user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    try:
        cursor = mysql.connection.cursor()
        # Delete the user with the given user_id
        cursor.execute("DELETE FROM user_roles WHERE id = %s", (user_id,))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting user: {e}")
        return jsonify({"message": "Failed to delete user"}), 500
    
@auth_bp.route('/edit-user/<int:user_id>', methods=['PUT'])
@jwt_required()  # Ensure JWT token is required for this route
def edit_user(user_id):
    data = request.get_json()
    new_role = data.get('role')

    if not new_role:
        return jsonify({"message": "Role is required"}), 400

    try:
        cursor = mysql.connection.cursor()
        # Update the user's role in the database
        cursor.execute("UPDATE user_roles SET role = %s WHERE id = %s", (new_role, user_id))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "User role updated successfully."}), 200

    except Exception as e:
        print(f"Error editing user role: {e}")
        return jsonify({"message": "Failed to update user role. Please try again."}), 500

# Helper function to fetch stored faces from the database
def get_stored_faces():
    """Fetch user images and roles from the database for face recognition using OpenCV."""
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT image_path, role FROM user_roles")
    stored_faces = cursor.fetchall()
    cursor.close()

    known_faces = []
    known_face_roles = []

    for face in stored_faces:
        image_path = face[0]
        role = face[1]

        # Load each image using OpenCV
        try:
            image = cv2.imread(image_path)
            if image is not None:
                known_faces.append(image)  # Store the image for comparison
                known_face_roles.append(role)
            else:
                logging.error(f"Failed to load image: {image_path}. File might be missing or corrupted.")
        except cv2.error as e:
            logging.error(f"OpenCV error processing image {image_path}: {e}")
        except Exception as e:
            logging.error(f"Unexpected error processing image {image_path}: {e}")

    return known_faces, known_face_roles

# Start live detection (runs in a separate thread)
def start_live_detection(app):
    global camera_active, last_detected_role

    with app.app_context():  # Ensure the app context is active
        camera_active = True

        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            print("Could not start camera.")
            return

        # Load the Haar Cascade model for face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        known_faces, known_face_roles = get_stored_faces()

        while camera_active:
            ret, frame = camera.read()
            if not ret:
                print("Failed to read from the camera.")
                break

            # Convert the frame to grayscale for face detection
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

            detected_roles = []

            for (x, y, w, h) in faces:
                detected_face = frame[y:y + h, x:x + w]

                match_found = False
                for idx, known_face in enumerate(known_faces):
                    resized_known_face = cv2.resize(known_face, (w, h))

                    # Calculate the histogram for both images
                    hist_detected = cv2.calcHist([detected_face], [0], None, [256], [0, 256])
                    hist_known = cv2.calcHist([resized_known_face], [0], None, [256], [0, 256])

                    # Normalize histograms and compare them using correlation
                    cv2.normalize(hist_detected, hist_detected, 0, 1, cv2.NORM_MINMAX)
                    cv2.normalize(hist_known, hist_known, 0, 1, cv2.NORM_MINMAX)
                    correlation = cv2.compareHist(hist_detected, hist_known, cv2.HISTCMP_CORREL)

                    if correlation > 0.7:  # Adjust this threshold based on testing
                        detected_roles.append(known_face_roles[idx])
                        match_found = True
                        break

                if not match_found:
                    detected_roles.append("Unauthorized")

            # Update the global variable with the last detected role(s)
            last_detected_role = detected_roles

            # Encode the frame as JPEG and send it to the frontend as base64
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_base64 = base64.b64encode(buffer).decode('utf-8')
            socketio.emit('video_frame', {'frame': frame_base64, 'roles': detected_roles})

            socketio.sleep(0.05)  # Adjust the frame rate as needed (lower this to reduce CPU load)

        camera.release()
        print("Camera released. Live detection ended.")

@socketio.on('start_live_detection')
def handle_start_detection():
    print("Starting live detection.")
    global camera_active
    if not camera_active:
        # Get the current Flask app instance context correctly using current_app
        detection_thread = Thread(target=start_live_detection, args=(current_app._get_current_object(),))
        detection_thread.start()

@socketio.on('stop_live_detection')
def handle_stop_detection():
    print("Stopping live detection.")
    global camera_active
    camera_active = False
    socketio.emit('stop_detection')
    
def send_alerts(role, frame):
    """Send email alert."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S") 
    send_sms_alert("Unauthorized face detected at " + timestamp)


def send_email_alert(body, frame):
    try:
        msg = Message(
            subject="Alert: Unauthorized Face Detected",
            recipients=["xyx@gmail.com"] 
        )
        msg.body = body

        # Attach the frame image
        ret, buffer = cv2.imencode('.jpg', frame)
        msg.attach("detected_face.jpg", "image/jpeg", buffer.tobytes())

        mail.send(msg)
        print("Email alert sent successfully!")
    except Exception as e:
        print(f"Failed to send email alert: {e}")
        
def send_sms_alert(message_body):
    """Send an SMS alert for unauthorized detection."""
    account_sid = current_app.config['TWILIO_ACCOUNT_SID']
    auth_token = current_app.config['TWILIO_AUTH_TOKEN']
    twilio_number = current_app.config['TWILIO_PHONE_NUMBER']
    recipient_number = current_app.config['ALERT_PHONE_NUMBER']

    client = Client(account_sid, auth_token)

    try:
        message = client.messages.create(
            body=message_body,
            from_=twilio_number,
            to=recipient_number
        )
        print(f"SMS alert sent successfully: {message.sid}")
    except Exception as e:
        print(f"Failed to send SMS alert: {e}")

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({"message": "This is a protected route"})