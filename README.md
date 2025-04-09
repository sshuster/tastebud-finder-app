
# TasteBud Finder

TasteBud Finder is a web application that helps users discover restaurants that match their taste preferences and dietary restrictions.

## Features

- User authentication (register, login, logout)
- Personalized restaurant recommendations based on user preferences
- Filtering restaurants by cuisine, dietary options, and price range
- User dashboard with recommendation analytics
- Admin dashboard for user management
- Responsive design for all devices

## Technology Stack

### Frontend
- React
- TypeScript
- TanStack Query
- Tailwind CSS
- Recharts for data visualization
- React Router for navigation

### Backend
- Flask (Python)
- SQLite for database
- JWT for authentication

## Getting Started

### Running the Frontend

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:8080

### Running the Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Run the Flask application:

```bash
python app.py
```

The server will start at http://localhost:5000

## Mock Users

For testing purposes, two mock users are available:

1. **Standard User**
   - Username: muser
   - Password: muser
   - Role: user

2. **Administrator**
   - Username: mvc
   - Password: mvc
   - Role: admin

## API Integration

The frontend includes a mock mode that works without the backend, using data stored in `src/data/mockData.ts`. To use the actual backend API, modify the authentication context and data fetching functions to use the Flask endpoints.
