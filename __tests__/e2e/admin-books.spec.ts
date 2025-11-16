import { test, expect } from "@playwright/test"

test.describe("Admin Book Management", () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as admin
    await page.goto("/auth/signin")
    await page.getByPlaceholder(/email/i).fill("admin@library.com")
    await page.getByPlaceholder(/password/i).fill("admin123")
    await page.getByRole("button", { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/admin/)

    // Navigate to books page
    await page.getByRole("link", { name: /books/i }).click()
    await expect(page).toHaveURL(/\/admin\/books/)
  })

  test("should display books page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /books/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /add book/i })).toBeVisible()
  })

  test("should create a new book", async ({ page }) => {
    await page.getByRole("button", { name: /add book/i }).click()

    await page.getByLabel(/title/i).fill("Test Book E2E")
    await page.getByLabel(/author/i).fill("Test Author")
    await page.getByLabel(/isbn/i).fill("978-1234567890")
    await page.getByLabel(/category/i).fill("Testing")
    await page.getByLabel(/total copies/i).fill("5")
    await page.getByLabel(/publisher/i).fill("Test Publisher")
    await page.getByLabel(/published year/i).fill("2024")
    await page.getByLabel(/description/i).fill("A test book for E2E testing")

    await page.getByRole("button", { name: /create book/i }).click()

    await expect(page.getByText(/test book e2e/i)).toBeVisible()
    await expect(page.getByText(/test author/i)).toBeVisible()
  })

  test("should search for books", async ({ page }) => {
    // Create a book first
    await page.getByRole("button", { name: /add book/i }).click()
    await page.getByLabel(/title/i).fill("Searchable Book")
    await page.getByLabel(/author/i).fill("Search Author")
    await page.getByLabel(/isbn/i).fill("978-9999999999")
    await page.getByLabel(/category/i).fill("Search")
    await page.getByLabel(/total copies/i).fill("3")
    await page.getByRole("button", { name: /create book/i }).click()

    // Search for the book
    await page.getByPlaceholder(/search books/i).fill("Searchable")
    await expect(page.getByText(/searchable book/i)).toBeVisible()

    // Clear search
    await page.getByPlaceholder(/search books/i).clear()
  })

  test("should update a book", async ({ page }) => {
    // Create a book first
    await page.getByRole("button", { name: /add book/i }).click()
    await page.getByLabel(/title/i).fill("Book to Update")
    await page.getByLabel(/author/i).fill("Original Author")
    await page.getByLabel(/isbn/i).fill("978-1111111111")
    await page.getByLabel(/category/i).fill("Update Test")
    await page.getByLabel(/total copies/i).fill("2")
    await page.getByRole("button", { name: /create book/i }).click()

    // Update the book
    await page.getByRole("button", { name: /edit/i }).first().click()
    await page.getByLabel(/title/i).clear()
    await page.getByLabel(/title/i).fill("Updated Book Title")
    await page.getByRole("button", { name: /update book/i }).click()

    await expect(page.getByText(/updated book title/i)).toBeVisible()
  })

  test("should delete a book", async ({ page }) => {
    // Create a book first
    await page.getByRole("button", { name: /add book/i }).click()
    await page.getByLabel(/title/i).fill("Book to Delete")
    await page.getByLabel(/author/i).fill("Delete Author")
    await page.getByLabel(/isbn/i).fill("978-2222222222")
    await page.getByLabel(/category/i).fill("Delete Test")
    await page.getByLabel(/total copies/i).fill("1")
    await page.getByRole("button", { name: /create book/i }).click()

    // Delete the book
    await page
      .getByRole("button", { name: /delete/i })
      .first()
      .click()
    await page.getByRole("button", { name: /confirm/i }).click()

    await expect(page.getByText(/book to delete/i)).not.toBeVisible()
  })
})
