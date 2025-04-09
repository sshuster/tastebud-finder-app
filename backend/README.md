
# TasteBud Finder Backend

This is the Flask backend for the TasteBud Finder application.

## Setup

1. Install the required Python packages:

```bash
pip install -r requirements.txt
```

2. Run the Flask application:

```bash
python app.py
```

The server will start at http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login and get authentication token

### User Management
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/<user_id>` - Delete a user (admin only)

### User Preferences
- `GET /api/user/preferences` - Get current user preferences
- `PUT /api/user/preferences` - Update current user preferences

### Restaurants
- `GET /api/restaurants` - Get all restaurants

## Mock Users

The database is initialized with two mock users:

1. **Standard User**
   - Username: muser
   - Password: muser
   - Role: user

2. **Administrator**
   - Username: mvc
   - Password: mvc
   - Role: admin
