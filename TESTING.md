# Testing Guide

This document provides comprehensive information about testing in the Library Management System.

## Test Structure

The project includes two types of tests:

### 1. Unit Tests (`__tests__/use-cases/`)

Unit tests focus on individual use cases in isolation using mocked dependencies.

**Location**: `__tests__/use-cases/`

**What they test**:

- Business logic in use cases
- Input validation
- Error handling
- Edge cases

**Example**:
\`\`\`typescript
describe('CreateBookUseCase', () => {
it('should create a book successfully', async () => {
const mockRepository = { create: vi.fn() }
const useCase = new CreateBookUseCase(mockRepository)
// Test implementation
})
})
\`\`\`

### 2. Integration Tests (`__tests__/integration/`)

Integration tests verify that multiple components work together correctly, including database operations.

**Location**: `__tests__/integration/`

**What they test**:

- Repository implementations with MongoDB
- Complete workflows (loan lifecycle, reservation flow)
- Data persistence and retrieval
- Transaction integrity

**Example**:
\`\`\`typescript
describe('Loan Workflow Integration Tests', () => {
it('should complete full loan lifecycle', async () => {
// Create book, create loan, verify availability, return loan
})
})
\`\`\`

## Running Tests

### All Tests

\`\`\`bash
npm run test
\`\`\`

### Unit Tests Only

\`\`\`bash
npm run test -- **tests**/use-cases
\`\`\`

### Integration Tests Only

\`\`\`bash
npm run test -- **tests**/integration
\`\`\`

### With UI

\`\`\`bash
npm run test:ui # Vitest UI
\`\`\`

### Coverage Report

\`\`\`bash
npm run test:coverage
\`\`\`

## Test Helpers

### Unit Test Helpers (`__tests__/helpers/test-utils.ts`)

Utility functions for creating mock data:

\`\`\`typescript
import { createMockBook, createMockLoan } from '@/tests/helpers/test-utils'

const book = createMockBook({ title: 'Custom Title' })
const loan = createMockLoan({ status: 'OVERDUE' })
\`\`\`

## Prerequisites

### For Unit and Integration Tests

- Node.js 18+
- MongoDB running locally or connection string

## Environment Variables

Create `.env.test` for test environment:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=library-test
NEXTAUTH_SECRET=test-secret-key
NEXTAUTH_URL=http://localhost:3000
\`\`\`

## CI/CD

Tests run automatically on GitHub Actions:

- **Unit Tests**: Run on every push/PR
- **Integration Tests**: Run with MongoDB service

See `.github/workflows/test.yml` for configuration.

## Writing New Tests

### Unit Test Template

\`\`\`typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('YourUseCase', () => {
let mockRepository: YourRepository
let useCase: YourUseCase

beforeEach(() => {
mockRepository = {
method: vi.fn(),
}
useCase = new YourUseCase(mockRepository)
})

it('should do something', async () => {
// Arrange
vi.mocked(mockRepository.method).mockResolvedValue(expectedValue)

    // Act
    const result = await useCase.execute(input)

    // Assert
    expect(result).toEqual(expectedValue)

})
})
\`\`\`

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up test data after each test
3. **Descriptive Names**: Use clear, descriptive test names
4. **Arrange-Act-Assert**: Follow AAA pattern
5. **Mock External Dependencies**: Don't rely on external services
6. **Test Edge Cases**: Include error scenarios
7. **Keep Tests Fast**: Unit tests should run in milliseconds

## Debugging

### Vitest

\`\`\`bash
npm run test:ui # Visual debugging interface
\`\`\`

### VS Code

Add to `.vscode/launch.json`:
\`\`\`json
{
"type": "node",
"request": "launch",
"name": "Vitest",
"runtimeExecutable": "npm",
"runtimeArgs": ["run", "test"],
"console": "integratedTerminal"
}
\`\`\`

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod`
- Check connection string in `.env.test`
- Verify database permissions

### Test Timeouts

- Increase timeout in test file: `test.setTimeout(30000)`
- Check for unresolved promises
- Verify async/await usage

## Coverage Goals

- **Unit Tests**: >80% coverage
- **Integration Tests**: Critical workflows covered

View coverage report:
\`\`\`bash
npm run test:coverage
open coverage/index.html
