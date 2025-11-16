import { test, expect } from "@playwright/test"

test.describe("Admin Loan Management", () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as admin
    await page.goto("/auth/signin")
    await page.getByPlaceholder(/email/i).fill("admin@library.com")
    await page.getByPlaceholder(/password/i).fill("admin123")
    await page.getByRole("button", { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/admin/)
  })

  test("should display loans page", async ({ page }) => {
    await page.getByRole("link", { name: /loans/i }).click()
    await expect(page).toHaveURL(/\/admin\/loans/)
    await expect(page.getByRole("heading", { name: /loans & reservations/i })).toBeVisible()
  })

  test("should display active loans tab", async ({ page }) => {
    await page.goto("/admin/loans")
    await page.getByRole("tab", { name: /active loans/i }).click()
    await expect(page.getByText(/book title/i)).toBeVisible()
    await expect(page.getByText(/borrower/i)).toBeVisible()
  })

  test("should display reservations tab", async ({ page }) => {
    await page.goto("/admin/loans")
    await page.getByRole("tab", { name: /reservations/i }).click()
    await expect(page.getByText(/book title/i)).toBeVisible()
    await expect(page.getByText(/reserved by/i)).toBeVisible()
  })

  test("should create a new loan", async ({ page }) => {
    // First create a book
    await page.goto("/admin/books")
    await page.getByRole("button", { name: /add book/i }).click()
    await page.getByLabel(/title/i).fill("Loan Test Book")
    await page.getByLabel(/author/i).fill("Loan Author")
    await page.getByLabel(/isbn/i).fill("978-3333333333")
    await page.getByLabel(/category/i).fill("Loan Test")
    await page.getByLabel(/total copies/i).fill("3")
    await page.getByRole("button", { name: /create book/i }).click()

    // Navigate to loans and create a loan
    await page.goto("/admin/loans")
    await page.getByRole("button", { name: /create loan/i }).click()

    // Fill loan form
    await page.getByLabel(/book/i).click()
    await page.getByText(/loan test book/i).click()
    await page.getByLabel(/user/i).click()
    await page.getByText(/member@library.com/i).click()

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 14)
    await page.getByLabel(/due date/i).fill(futureDate.toISOString().split("T")[0])

    await page.getByRole("button", { name: /create loan/i }).click()

    await expect(page.getByText(/loan test book/i)).toBeVisible()
  })

  test("should return a loan", async ({ page }) => {
    await page.goto("/admin/loans")
    await page.getByRole("tab", { name: /active loans/i }).click()

    // Return the first loan if available
    const returnButton = page.getByRole("button", { name: /return/i }).first()
    if (await returnButton.isVisible()) {
      await returnButton.click()
      await expect(page.getByText(/returned successfully/i)).toBeVisible()
    }
  })
})
