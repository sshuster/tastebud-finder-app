
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import hashlib
import uuid
from datetime import datetime, timedelta
import jwt

app = Flask(__name__)
CORS(app)

# Secret key for JWT
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable

# Connect to SQLite database
def get_db_connection():
    conn = sqlite3.connect('tastebud.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    ''')
    
    # Create user_preferences table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_preferences (
        user_id TEXT PRIMARY KEY,
        dietary_restrictions TEXT,
        cuisine_preferences TEXT,
        price_range TEXT,
        allergies TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Create restaurants table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS restaurants (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        cuisine_type TEXT NOT NULL,
        price_range INTEGER NOT NULL,
        rating REAL,
        address TEXT,
        image TEXT,
        dietary_options TEXT,
        popular_dishes TEXT
    )
    ''')
    
    # Insert mock users if they don't exist
    cursor.execute("SELECT * FROM users WHERE username = 'muser'")
    if not cursor.fetchone():
        # Mock user
        user_id = str(uuid.uuid4())
        hash_password = hashlib.sha256("muser".encode()).hexdigest()
        cursor.execute(
            "INSERT INTO users (id, username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, "muser", "muser@example.com", hash_password, "user", datetime.now().isoformat())
        )
        cursor.execute(
            "INSERT INTO user_preferences (user_id, dietary_restrictions, cuisine_preferences, price_range, allergies) VALUES (?, ?, ?, ?, ?)",
            (user_id, "vegetarian", "italian,japanese,mexican", "[1,3]", "nuts")
        )
    
    cursor.execute("SELECT * FROM users WHERE username = 'mvc'")
    if not cursor.fetchone():
        # Mock admin
        admin_id = str(uuid.uuid4())
        hash_password = hashlib.sha256("mvc".encode()).hexdigest()
        cursor.execute(
            "INSERT INTO users (id, username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (admin_id, "mvc", "mvc@example.com", hash_password, "admin", datetime.now().isoformat())
        )
    
    conn.commit()
    conn.close()

# Initialize DB before first request
@app.before_first_request
def before_first_request():
    init_db()

# Hash password
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Generate JWT token
def generate_token(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Verify JWT token
def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except:
        return None

# Auth middleware
def auth_required(roles=None):
    def decorator(f):
        def wrapper(*args, **kwargs):
            token = request.headers.get('Authorization', '').replace('Bearer ', '')
            
            if not token:
                return jsonify({'error': 'Authentication required'}), 401
                
            payload = verify_token(token)
            if not payload:
                return jsonify({'error': 'Invalid or expired token'}), 401
                
            if roles and payload.get('role') not in roles:
                return jsonify({'error': 'Insufficient privileges'}), 403
                
            return f(payload, *args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not all(key in data for key in ['username', 'email', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400
        
    username = data['username']
    email = data['email']
    password = data['password']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if username exists
    cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Username already exists'}), 409
    
    # Check if email exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Email already exists'}), 409
    
    # Create user
    user_id = str(uuid.uuid4())
    password_hash = hash_password(password)
    
    try:
        cursor.execute(
            "INSERT INTO users (id, username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, username, email, password_hash, "user", datetime.now().isoformat())
        )
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not all(key in data for key in ['username', 'password']):
        return jsonify({'error': 'Missing username or password'}), 400
        
    username = data['username']
    password = data['password']
    password_hash = hash_password(password)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT id, username, email, role, created_at FROM users WHERE username = ? AND password_hash = ?",
        (username, password_hash)
    )
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Get user preferences if they exist
    cursor.execute("SELECT * FROM user_preferences WHERE user_id = ?", (user['id'],))
    preferences = cursor.fetchone()
    
    conn.close()
    
    # Create user object with preferences
    user_dict = dict(user)
    
    if preferences:
        user_dict['preferences'] = {
            'dietaryRestrictions': preferences['dietary_restrictions'].split(',') if preferences['dietary_restrictions'] else [],
            'cuisinePreferences': preferences['cuisine_preferences'].split(',') if preferences['cuisine_preferences'] else [],
            'priceRange': eval(preferences['price_range']) if preferences['price_range'] else [],
            'allergies': preferences['allergies'].split(',') if preferences['allergies'] else [],
        }
    
    # Generate and return token
    token = generate_token(user['id'], user['role'])
    
    return jsonify({
        'token': token,
        'user': user_dict
    }), 200

@app.route('/api/users', methods=['GET'])
@auth_required(roles=['admin'])
def get_users(payload):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, username, email, role, created_at FROM users")
    users = [dict(user) for user in cursor.fetchall()]
    
    conn.close()
    
    return jsonify(users), 200

@app.route('/api/users/<user_id>', methods=['DELETE'])
@auth_required(roles=['admin'])
def delete_user(payload, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Delete user preferences first (foreign key constraint)
        cursor.execute("DELETE FROM user_preferences WHERE user_id = ?", (user_id,))
        
        # Delete user
        cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'User not found'}), 404
            
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM restaurants")
    restaurants = []
    
    for row in cursor.fetchall():
        restaurant = dict(row)
        # Parse JSON-like fields
        restaurant['cuisineType'] = restaurant['cuisine_type'].split(',')
        restaurant['dietaryOptions'] = restaurant['dietary_options'].split(',') if restaurant['dietary_options'] else []
        restaurant['popularDishes'] = restaurant['popular_dishes'].split(',') if restaurant['popular_dishes'] else []
        restaurants.append(restaurant)
    
    conn.close()
    
    return jsonify(restaurants), 200

@app.route('/api/user/preferences', methods=['GET', 'PUT'])
@auth_required(roles=['user', 'admin'])
def user_preferences(payload):
    user_id = payload['user_id']
    
    if request.method == 'GET':
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM user_preferences WHERE user_id = ?", (user_id,))
        preferences = cursor.fetchone()
        
        conn.close()
        
        if not preferences:
            return jsonify({}), 200
            
        return jsonify({
            'dietaryRestrictions': preferences['dietary_restrictions'].split(',') if preferences['dietary_restrictions'] else [],
            'cuisinePreferences': preferences['cuisine_preferences'].split(',') if preferences['cuisine_preferences'] else [],
            'priceRange': eval(preferences['price_range']) if preferences['price_range'] else [],
            'allergies': preferences['allergies'].split(',') if preferences['allergies'] else [],
        }), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            dietary_restrictions = ','.join(data.get('dietaryRestrictions', []))
            cuisine_preferences = ','.join(data.get('cuisinePreferences', []))
            price_range = str(data.get('priceRange', []))
            allergies = ','.join(data.get('allergies', []))
            
            # Check if preferences exist
            cursor.execute("SELECT 1 FROM user_preferences WHERE user_id = ?", (user_id,))
            if cursor.fetchone():
                cursor.execute(
                    "UPDATE user_preferences SET dietary_restrictions = ?, cuisine_preferences = ?, price_range = ?, allergies = ? WHERE user_id = ?",
                    (dietary_restrictions, cuisine_preferences, price_range, allergies, user_id)
                )
            else:
                cursor.execute(
                    "INSERT INTO user_preferences (user_id, dietary_restrictions, cuisine_preferences, price_range, allergies) VALUES (?, ?, ?, ?, ?)",
                    (user_id, dietary_restrictions, cuisine_preferences, price_range, allergies)
                )
                
            conn.commit()
            conn.close()
            
            return jsonify({'message': 'Preferences updated successfully'}), 200
        except Exception as e:
            conn.rollback()
            conn.close()
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
