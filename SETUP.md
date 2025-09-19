# Corgea Setup Guide

This guide will help you set up the Corgea AI Code Security Scanner with proper error handling.

## 🚀 Quick Start

### 1. Database Setup (PostgreSQL)

#### Install PostgreSQL
1. Download PostgreSQL from https://www.postgresql.org/download/
2. Install with default settings
3. Remember the password you set for the `postgres` user

#### Create Database
1. Open pgAdmin or psql command line
2. Create a new database named `corgea_auth`:
   ```sql
   CREATE DATABASE corgea_auth;
   ```

#### Set Environment Variables
Create a `.env` file in the `Backend` directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=corgea_auth
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-make-it-long-and-random
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=4000
```

### 2. Backend Setup

```bash
cd Backend
npm install
npm run init-db
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔧 Troubleshooting

### Database Connection Issues

**Error: `password authentication failed for user "postgres"`**

1. **Check your PostgreSQL password**:
   - Make sure the password in your `.env` file matches your PostgreSQL password
   - Try connecting with pgAdmin or psql to verify credentials

2. **Reset PostgreSQL password** (if needed):
   ```bash
   # Windows (run as Administrator)
   net stop postgresql-x64-13
   net start postgresql-x64-13
   
   # Then connect and reset password
   psql -U postgres
   ALTER USER postgres PASSWORD 'new_password';
   ```

3. **Check PostgreSQL service**:
   - Make sure PostgreSQL service is running
   - Check if it's listening on port 5432

### Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `28P01` | Authentication failed | Check database credentials |
| `ECONNREFUSED` | Connection refused | Start PostgreSQL service |
| `3D000` | Database doesn't exist | Create the database |
| `23505` | Unique constraint violation | User already exists |
| `NETWORK_ERROR` | Frontend can't reach backend | Check if backend is running |

### Frontend Issues

**Error: `Unable to connect to server`**

1. Make sure backend is running on port 4000
2. Check if `NEXT_PUBLIC_API_URL` is set correctly
3. Verify CORS settings in backend

**Error: `shadcn/ui not working`**

1. Restart the development server
2. Clear Next.js cache: `rm -rf .next`
3. Check if Tailwind CSS is processing correctly

## 🧪 Testing the Setup

### 1. Test Database Connection
Visit: `http://localhost:4000/api/auth/profile` (should return 401 - this is expected)

### 2. Test Frontend
Visit: `http://localhost:3000` (should show login form)

### 3. Test Registration
1. Click "Sign up"
2. Fill in the form
3. Should redirect to main page after successful registration

### 4. Test Code Scanning
1. Login to the app
2. Try scanning the sample code
3. Should show vulnerability results

## 📝 Environment Variables Reference

### Backend (.env)
```env
DB_HOST=localhost          # PostgreSQL host
DB_PORT=5432              # PostgreSQL port
DB_NAME=corgea_auth       # Database name
DB_USER=postgres          # Database user
DB_PASSWORD=your_password # Database password
JWT_SECRET=your_secret    # JWT signing secret
JWT_EXPIRES_IN=24h        # Token expiration
PORT=4000                 # Backend port
```

### Frontend (.env.local)
```env
GEMINI_API_KEY=your_gemini_key    # Google Gemini API key
NEXT_PUBLIC_API_URL=http://localhost:4000  # Backend URL
```

## 🆘 Getting Help

If you're still having issues:

1. **Check the console logs** for detailed error messages
2. **Verify all environment variables** are set correctly
3. **Make sure all services are running** (PostgreSQL, Backend, Frontend)
4. **Check the network tab** in browser dev tools for API errors

The improved error handling will now show you specific error messages to help diagnose issues!


