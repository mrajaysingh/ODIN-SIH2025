# Environment Setup for ODIN Backend

## Required Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/odin_db"

# Prisma Optimize
OPTIMIZE_API_KEY="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ3aWQiOiJjbWZleWx6YmYwM2owMmdmMDRrOHhyaHNmIiwidWlkIjoiY21mZXlsemloMDBjNzAzZnJ1bGp0OXk0ZiIsInRzIjoxNzU4MzQ5MTM0MzMwfQ.Z9dEfdIGsGeTqdW798a1F6Syxr6MwJjTC1X7bbwWxmvWW2_hbpmSRLY8gQBPXb-st7i7X42hcxVNEv6qX7_SDw"

# JWT Secret (add your own secret)
JWT_SECRET="your-jwt-secret-key-here"

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Setup Instructions

1. Copy the above content into a new `.env` file in the `backend` directory
2. Update the `DATABASE_URL` with your actual PostgreSQL connection string
3. Change the `JWT_SECRET` to a secure random string
4. Run `npm run dev` to start the development server

## Prisma Optimize Integration

The backend is now configured with Prisma Optimize extension for enhanced performance monitoring and optimization. The extension is automatically loaded when the Prisma Client is initialized.
