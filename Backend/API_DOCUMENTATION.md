# GenMark Backend API Documentation

## Overview
The GenMark Backend is a Flask-based REST API with MongoDB for data persistence. It provides user authentication using JWT tokens and is designed to be extended with AI model integration in the future.

## Technology Stack
- **Framework**: Flask 2.2.5
- **Database**: MongoDB (Local instance)
- **Authentication**: JWT (Flask-JWT-Extended)
- **Security**: Rate Limiting (Flask-Limiter), Password Hashing (Bcrypt)
- **Documentation**: Swagger UI (Flasgger)
- **Scheduling**: APScheduler (for cleanup jobs)

## Database Configuration

### MongoDB Connection
The backend connects to your local MongoDB instance via MongoDB Compass:
- **Connection String**: `mongodb://localhost:27017/`
- **Database Name**: `GenMarkDB` (auto-created on first user registration)

### Collections
1. **users**: Stores user accounts
   - `username` (String, Unique)
   - `email` (String, Unique)
   - `password_hash` (String)
   - `created_at` (DateTime)

2. **content**: Stores generated content history (for future use)
   - `user_reference` (Reference to User)
   - `type` (String: 'text' or 'image')
   - `input_prompt` (String)
   - `output_content` (String)
   - `created_at` (DateTime)

## API Endpoints

### Base URL
```
http://localhost:5000
```

### Interactive Documentation
Access the Swagger UI at: **http://localhost:5000/apidocs/**

![Swagger Documentation](file:///C:/Users/idiot/.gemini/antigravity/brain/7f60877c-9f0e-4976-9197-076610be5cb9/swagger_auth_endpoints_1768749742715.png)

### Authentication Endpoints

#### 1. Register User
**POST** `/api/auth/register`

**Rate Limit**: 5 requests per minute

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Responses**:
- `201`: User registered successfully
- `400`: Missing fields or password too short (min 6 characters)
- `409`: Username or email already exists

#### 2. Login
**POST** `/api/auth/login`

**Rate Limit**: 10 requests per minute

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Success Response** (200):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "johndoe",
  "message": "Login successful"
}
```

**Error Responses**:
- `400`: Missing email or password
- `401`: Invalid credentials

#### 3. Get Current User
**GET** `/api/auth/me`

**Authentication**: Requires JWT token in `Authorization` header

**Header**:
```
Authorization: Bearer <your_access_token>
```

**Success Response** (200):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "created_at": "2026-01-18T14:30:00Z"
}
```

**Error Response**:
- `404`: User not found

### Health Check
**GET** `/health`

Returns server status and database connectivity.

## Security Features

### Rate Limiting
- **Register**: 5 attempts per minute
- **Login**: 10 attempts per minute
- **Global**: 200 requests per day, 50 per hour

### Password Security
- Minimum length: 6 characters
- Hashed using Bcrypt before storage
- Never returned in API responses

### JWT Tokens
- Stateless authentication
- Include token in `Authorization: Bearer <token>` header
- Used for protected endpoints like `/api/auth/me`

## Background Jobs

### Cleanup Job
Runs daily to delete content older than 30 days (configurable in `app/jobs/cleanup.py`).

## Testing the API

### Using Swagger UI
1. Navigate to http://localhost:5000/apidocs/
2. Click on any endpoint to expand it
3. Click "Try it out"
4. Fill in the request body
5. Click "Execute"

### Using cURL

**Register**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@genmark.io","password":"test123456"}'
```

**Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@genmark.io","password":"test123456"}'
```

**Get Profile** (replace TOKEN):
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Verifying Database in MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017/`
3. You should see the `GenMarkDB` database
4. Expand it to view collections:
   - `users`: Contains registered users
   - `content`: Will store generated content (when models are integrated)

## Environment Variables

Located in `.env`:
```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=<your-secret-key>
MONGO_URI=mongodb://localhost:27017/
```

## Future Extensions

The backend is designed to support:
- Text-to-Text generation endpoints
- Text-to-Image generation endpoints
- Image-to-Text analysis endpoints
- User content history management
- Advanced analytics and reporting
