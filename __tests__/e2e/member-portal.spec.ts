import { test, expect } from "@playwright/test"

test.describe("Member Portal", () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as member
    await page.goto("/auth/signin")
    await page.getByPlaceholder(/email/i).fill("member@library.com")
    await page.getByPlaceholder(/password/i).fill("member123")
    await page.getByRole("button", { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/portal/)
  })

  test("should display member portal home", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /browse books/i })).toBeVisible()
    await expect(page.getByPlaceholder(/search books/i)).toBeVisible()
  })

  test("should search for books", async ({ page }) => {
    await page.getByPlaceholder(/search books/i).fill("Clean")
    await page.getByRole("button", { name: /search/i }).click()

    // Should show search results
    await expect(page.getByText(/clean/i)).toBeVisible()
  })

  test("should view book details", async ({ page }) => {
    // Click on first book card
    const firstBook = page.locator('[data-testid="book-card"]').first()
    if (await firstBook.isVisible()) {
      await firstBook.click()

      // Book details dialog should open
      await expect(page.getByRole("dialog")).toBeVisible()
      await expect(page.getByText(/author/i)).toBeVisible()
      await expect(page.getByText(/isbn/i)).toBeVisible()
    }
  })

  test("should create a reservation", async ({ page }) => {
    // Click on first available book
    const firstBook = page.locator('[data-testid="book-card"]').first()
    if (await firstBook.isVisible()) {
      await firstBook.click()

      // Reserve the book
      const reserveButton = page.getByRole("button", { name: /reserve/i })
      if (await reserveButton.isVisible()) {
        await reserveButton.click()
        await expect(page.getByText(/reserved successfully/i)).toBeVisible()
      }
    }
  })

  test("should view my loans", async ({ page }) => {
    await page.getByRole("link", { name: /my loans/i }).click()
    await expect(page).toHaveURL(/\/portal\/my-loans/)
    await expect(page.getByRole("heading", { name: /my loans/i })).toBeVisible()
  })

  test("should view my reservations", async ({ page }) => {
    await page.goto("/portal/my-loans")
    await page.getByRole("tab", { name: /reservations/i }).click()
    await expect(page.getByText(/book title/i)).toBeVisible()
  })

  test("should cancel a reservation", async ({ page }) => {
    await page.goto("/portal/my-loans")
    await page.getByRole("tab", { name: /reservations/i }).click()

    const cancelButton = page.getByRole("button", { name: /cancel/i }).first()
    if (await cancelButton.isVisible()) {
      await cancelButton.click()
      await expect(page.getByText(/cancelled successfully/i)).toBeVisible()
    }
  })
})
