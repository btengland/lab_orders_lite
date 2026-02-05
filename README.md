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

**Development Approach:** This project leverages AI assistance for rapid development, including automated test generation and portions of the Orders module implementation. All AI-generated code has been reviewed and integrated to ensure quality and functionality.
