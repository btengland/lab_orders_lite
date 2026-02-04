# Lab Orders Server

A Node.js server with Prisma ORM and PostgreSQL for managing lab orders.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your database:
   - Update the `DATABASE_URL` in your `.env` file with your PostgreSQL connection string
   - Or use Prisma's local development database: `npx prisma dev`

3. Run database migrations:

```bash
npm run db:migrate
```

4. Generate Prisma client:

```bash
npm run db:generate
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:reset` - Reset database and run all migrations

## Database Schema

The database includes the following models:

- **User**: User authentication and management
- **Order**: Lab orders with status tracking
- **Result**: Test results linked to orders

### Order Statuses

- `PENDING` - Order submitted, awaiting processing
- `IN_PROGRESS` - Order being processed
- `COMPLETED` - Order completed with results
- `CANCELLED` - Order cancelled

### Priority Levels

- `LOW` - Non-urgent
- `NORMAL` - Standard priority (default)
- `HIGH` - High priority
- `URGENT` - Critical/urgent

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="your-postgresql-connection-string"
```

## Usage

Test the database connection:

```bash
npm run dev
```

This will test the database connection and display the status.
