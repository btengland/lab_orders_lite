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

**What I would have done differently:** If I had more time, I would optimize the the create and search feature so that it doesn't require refetching all data, which currently causes long loading times. The main issue is that the backend returns only the patient ID, not the patient name, so the frontend has to refetch patient details. I would add more validations for number only inputs and other inputs. I would also invest more time in learning best practices for backend testing. While I used AI assistance to help generate many of my tests due to limited unit testing experience, I carefully reviewed and validated all test code. I encountered some type compatibility issues with SQLite. In future projects, I would prefer to use a different database solution. I would have also added more edge cases and error handling. I would also validate the correct data is being sent on both the front and back end (double validations).
