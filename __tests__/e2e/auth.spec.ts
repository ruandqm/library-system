import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("should display sign in page", async ({ page }) => {
    await page.goto("/auth/signin")
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible()
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
  })

  test("should sign in as admin", async ({ page }) => {
    await page.goto("/auth/signin")

    await page.getByPlaceholder(/email/i).fill("admin@library.com")
    await page.getByPlaceholder(/password/i).fill("admin123")
    await page.getByRole("button", { name: /sign in/i }).click()

    await expect(page).toHaveURL(/\/admin/)
    await expect(page.getByText(/admin dashboard/i)).toBeVisible()
  })

  test("should sign in as member", async ({ page }) => {
    await page.goto("/auth/signin")

    await page.getByPlaceholder(/email/i).fill("member@library.com")
    await page.getByPlaceholder(/password/i).fill("member123")
    await page.getByRole("button", { name: /sign in/i }).click()

    await expect(page).toHaveURL(/\/portal/)
    await expect(page.getByText(/browse books/i)).toBeVisible()
  })

  test("should show error with invalid credentials", async ({ page }) => {
    await page.goto("/auth/signin")

    await page.getByPlaceholder(/email/i).fill("invalid@example.com")
    await page.getByPlaceholder(/password/i).fill("wrongpassword")
    await page.getByRole("button", { name: /sign in/i }).click()

    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })

  test("should sign out", async ({ page }) => {
    // Sign in first
    await page.goto("/auth/signin")
    await page.getByPlaceholder(/email/i).fill("admin@library.com")
    await page.getByPlaceholder(/password/i).fill("admin123")
    await page.getByRole("button", { name: /sign in/i }).click()

    await expect(page).toHaveURL(/\/admin/)

    // Sign out
    await page.getByRole("button", { name: /admin@library.com/i }).click()
    await page.getByRole("menuitem", { name: /sign out/i }).click()

    await expect(page).toHaveURL("/")
  })
})
