import { test, expect } from "@playwright/test"

test.describe("Navigation", () => {
  test("should navigate admin sections", async ({ page }) => {
    // Sign in as admin
    await page.goto("/auth/signin")
    await page.getByPlaceholder(/email/i).fill("admin@library.com")
    await page.getByPlaceholder(/password/i).fill("admin123")
    await page.getByRole("button", { name: /sign in/i }).click()

    // Test navigation links
    await page.getByRole("link", { name: /dashboard/i }).click()
    await expect(page).toHaveURL(/\/admin$/)

    await page.getByRole("link", { name: /books/i }).click()
    await expect(page).toHaveURL(/\/admin\/books/)

    await page.getByRole("link", { name: /loans/i }).click()
    await expect(page).toHaveURL(/\/admin\/loans/)

    await page.getByRole("link", { name: /users/i }).click()
    await expect(page).toHaveURL(/\/admin\/users/)

    await page.getByRole("link", { name: /profile/i }).click()
    await expect(page).toHaveURL(/\/admin\/profile/)
  })

  test("should navigate member sections", async ({ page }) => {
    // Sign in as member
    await page.goto("/auth/signin")
    await page.getByPlaceholder(/email/i).fill("member@library.com")
    await page.getByPlaceholder(/password/i).fill("member123")
    await page.getByRole("button", { name: /sign in/i }).click()

    // Test navigation links
    await page.getByRole("link", { name: /browse books/i }).click()
    await expect(page).toHaveURL(/\/portal$/)

    await page.getByRole("link", { name: /my loans/i }).click()
    await expect(page).toHaveURL(/\/portal\/my-loans/)

    await page.getByRole("link", { name: /profile/i }).click()
    await expect(page).toHaveURL(/\/portal\/profile/)
  })

  test("should prevent member from accessing admin routes", async ({ page }) => {
    // Sign in as member
    await page.goto("/auth/signin")
    await page.getByPlaceholder(/email/i).fill("member@library.com")
    await page.getByPlaceholder(/password/i).fill("member123")
    await page.getByRole("button", { name: /sign in/i }).click()

    // Try to access admin route
    await page.goto("/admin/books")

    // Should be redirected or show unauthorized
    await expect(page).not.toHaveURL(/\/admin\/books/)
  })
})
