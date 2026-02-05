## Setup

### Prerequisites

- Node.js (v16+)

### Installation

1. **Backend Setup**

```bash
cd server
npm install
echo "DATABASE_URL=\"file:./dev.db\"" > .env
npx prisma generate
npx prisma migrate dev
```

2. **Frontend Setup**

```bash
cd client
npm install
```

## Running

1. **Start Backend** (from `server` folder):

```bash
npm start
```

2. **Start Frontend** (from `client` folder):

```bash
npm run dev
```

3. **Open Browser**: http://localhost:5173

## Technology Stack

**Frontend:** React with Reactstrap for UI components and styling, providing a responsive interface.

**Backend:** Node.js with Express.js for the REST API server.

**Database:** SQLite with Prisma.

**What I would have done differently:** If I had more time, I would optimize the the create features so that it doesn't require refetching all data, which currently causes long loading times.

I would add more validations for number only inputs and other inputs.

I would also invest more time in learning and implementing best practices for testing. I would have also added more edge cases and better error handling.

I encountered some type compatibility issues with SQLite. In future projects, I would prefer to use a different database solution.
