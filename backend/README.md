# Qlinic Backend - Deployment Guide

## Overview
Backend API for Qlinic healthcare app built with Node.js, Express, TypeScript, and PostgreSQL. Designed for deployment on Nobus FCS.

## Prerequisites
- Node.js 20+
- PostgreSQL database (hosted on Nobus FCS or external provider)
- Google Maps API key
- Nobus FCS account

## Local Development

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Edit .env with your database URL and settings
```

### 3. Set up the database
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with initial data
npm run prisma:seed
```

### 4. Start development server
```bash
npm run dev
```

Server runs on `http://localhost:8000`

## Deploy to Nobus FCS

### Option 1: Docker Deployment (Recommended)

1. **Build the Docker image:**
```bash
cd backend
docker build -t qlinic-backend .
```

2. **Push to your container registry** (or use Nobus FCS image import)

3. **Launch instance on Nobus FCS:**
   - Go to Nobus Cloud Dashboard → Compute → Instances
   - Click "Launch Instance"
   - Select your Docker image or use the import service
   - Choose instance type (si.2.4.30.l recommended for production)
   - Configure security groups (open port 8000)
   - Set environment variables:
     - `DATABASE_URL` = your PostgreSQL connection string
     - `JWT_SECRET` = strong random secret
     - `CORS_ORIGIN` = your frontend URL
     - `NODE_ENV` = production
     - `PORT` = 8000

4. **Run database migrations:**
```bash
# SSH into your instance
docker exec -it <container-id> npx prisma migrate deploy
docker exec -it <container-id> npx prisma db push
```

### Option 2: Direct Deployment on VM

1. SSH into your Nobus FCS instance
2. Install Node.js 20 and PostgreSQL client
3. Clone the repository
4. Run `npm ci --only=production`
5. Run `npx prisma generate`
6. Run `npm run build`
7. Set environment variables
8. Start with `npm start`

## API Endpoints

### Health
- `GET /api/health` - Health check

### Clinics
- `GET /api/clinics` - List clinics (supports ?query, ?service, ?openOnly, ?remoteOnly, ?shortest)
- `GET /api/clinics/:id` - Get clinic details

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/phone + password
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and get token

### Appointments (Auth required)
- `GET /api/appointments` - List user appointments
- `POST /api/appointments` - Book new appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Profile (Auth required)
- `GET /api/profile` - Get user profile with preferences
- `PATCH /api/profile` - Update user profile

## Database Schema

The database includes the following models:
- **User** - Patient accounts with email, phone, role, language
- **Session** - JWT session management
- **Clinic** - Healthcare facilities with location, hours, wait times
- **ClinicService** - Services offered at each clinic
- **ClinicDirection** - Transit directions for clinics
- **Appointment** - Booked appointments with status tracking
- **PastAppointment** - Historical appointment records
- **Reminder** - User notification preferences
- **Permission** - User location/notification permissions
- **Accessibility** - Accessibility settings (high contrast, large text, TTS)
- **VisitPrep** - Visit preparation checklist state

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 8000) |
| `NODE_ENV` | Environment (development/production) | No |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for signing JWT tokens | Yes |
| `CORS_ORIGIN` | Allowed CORS origin | No (default: *) |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | No |

## Nobus FCS Security Groups

Create a security group with these rules:
- **Inbound TCP 8000** - API traffic (from 0.0.0.0/0 or restrict to your frontend)
- **Inbound TCP 22** - SSH access (from your IP only)
- **Inbound TCP 5432** - PostgreSQL (only if DB is on same instance, restrict tightly)

## Monitoring

Health check endpoint: `GET /api/health`
Returns `{"status": "healthy", "timestamp": "..."}` when database is connected.

## Support

For Nobus FCS deployment issues, contact Nobus Cloud support via the dashboard.