# Testing Guide

This document provides comprehensive information about testing in the Library Management System.

## Test Structure

The project includes three types of tests:

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

### 3. E2E Tests (`__tests__/e2e/`)

End-to-end tests simulate real user interactions using Playwright.

**Location**: `__tests__/e2e/`

**What they test**:
- Complete user flows
- Authentication and authorization
- UI interactions
- Navigation
- Form submissions

**Example**:
\`\`\`typescript
test('should create a new book', async ({ page }) => {
  await signInAsAdmin(page)
  await page.goto('/admin/books')
  // Fill form and submit
})
\`\`\`

## Running Tests

### All Tests
\`\`\`bash
npm run test
\`\`\`

### Unit Tests Only
\`\`\`bash
npm run test -- __tests__/use-cases
\`\`\`

### Integration Tests Only
\`\`\`bash
npm run test -- __tests__/integration
\`\`\`

### E2E Tests
\`\`\`bash
npm run test:e2e
\`\`\`

### With UI
\`\`\`bash
npm run test:ui          # Vitest UI
npm run test:e2e:ui      # Playwright UI
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

### E2E Test Helpers (`__tests__/helpers/e2e-utils.ts`)

Common E2E operations:

\`\`\`typescript
import { signInAsAdmin, createTestBook } from '@/tests/helpers/e2e-utils'

await signInAsAdmin(page)
await createTestBook(page, { title: 'Test Book', ... })
\`\`\`

## Prerequisites

### For Unit and Integration Tests
- Node.js 18+
- MongoDB running locally or connection string

### For E2E Tests
- All of the above
- Playwright browsers installed: `npx playwright install`
- Test users created (run seed scripts)

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
- **E2E Tests**: Run with full environment setup

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

### E2E Test Template

\`\`\`typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await signInAsAdmin(page)
  })

  test('should perform action', async ({ page }) => {
    await page.goto('/path')
    await page.getByRole('button', { name: /action/i }).click()
    await expect(page.getByText(/success/i)).toBeVisible()
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
npm run test:ui  # Visual debugging interface
\`\`\`

### Playwright
\`\`\`bash
npm run test:e2e:ui  # Interactive mode
npx playwright test --debug  # Step-through debugging
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

### Playwright Issues
- Reinstall browsers: `npx playwright install --with-deps`
- Clear browser cache
- Check if dev server is running

### Test Timeouts
- Increase timeout in test file: `test.setTimeout(30000)`
- Check for unresolved promises
- Verify async/await usage

## Coverage Goals

- **Unit Tests**: >80% coverage
- **Integration Tests**: Critical workflows covered
- **E2E Tests**: Main user journeys covered

View coverage report:
\`\`\`bash
npm run test:coverage
open coverage/index.html
