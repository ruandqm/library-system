# Library Management System

A full-stack library management system built with Next.js, tRPC, MongoDB, and NextAuth following Clean Architecture principles.

## Features

- **Role-Based Access Control**: Admin, Librarian, and Member roles
- **Book Management**: Complete CRUD operations for books
- **Loan System**: Track book loans with due dates and returns
- **Reservation System**: Allow members to reserve books
- **User Profiles**: Manage user information and preferences
- **Responsive Design**: Beautiful UI with TailwindCSS

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **API**: tRPC for type-safe APIs
- **Database**: MongoDB
- **Authentication**: NextAuth v5
- **Styling**: TailwindCSS v4
- **Testing**: Vitest (unit/integration)
- **Architecture**: Clean Architecture pattern

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or cloud)

### Installation

\`\`\`bash
npm install
\`\`\`

### Environment Variables

Create a `.env.local` file:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=library
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### Database Setup

Run the seed scripts to create sample users:

\`\`\`bash

# Create admin user

npm run db:create-admin

# Create sample users (including member)

npm run db:create-samples
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials

**Admin:**

- Email: admin@library.com
- Password: admin123

**Member:**

- Email: member@library.com
- Password: member123

## Testing

### Unit Tests

\`\`\`bash
npm run test
\`\`\`

### Integration Tests

\`\`\`bash
npm run test -- **tests**/integration
\`\`\`

### Test Coverage

\`\`\`bash
npm run test:coverage
\`\`\`

## Project Structure

\`\`\`
├── src/
│ ├── domain/ # Domain layer (entities, repositories)
│ ├── application/ # Application layer (use cases)
│ ├── infrastructure/ # Infrastructure layer (MongoDB, etc.)
│ ├── server/ # Server layer (tRPC routers)
│ └── types/ # TypeScript type definitions
├── app/ # Next.js app directory
│ ├── admin/ # Admin dashboard
│ ├── portal/ # Member portal
│ └── auth/ # Authentication pages
├── components/ # React components
│ ├── admin/ # Admin components
│ ├── portal/ # Member components
│ └── ui/ # Shared UI components
├── **tests**/ # Test files
│ ├── use-cases/ # Unit tests
│ └── integration/ # Integration tests
└── scripts/ # Database scripts
\`\`\`

## Architecture

This project follows Clean Architecture principles:

1. **Domain Layer**: Core business entities and repository interfaces
2. **Application Layer**: Use cases containing business logic
3. **Infrastructure Layer**: External concerns (database, APIs)
4. **Presentation Layer**: UI components and pages

## License

MIT
