import { test, expect } from "@playwright/test"

test.describe("User Profile Management", () => {
  test("should update admin profile", async ({ page }) => {
    // Sign in as admin
    await page.goto("/auth/signin")
    await page.getByPlaceholder(/email/i).fill("admin@library.com")
    await page.getByPlaceholder(/password/i).fill("admin123")
    await page.getByRole("button", { name: /sign in/i }).click()

    // Navigate to profile
    await page.getByRole("link", { name: /profile/i }).click()
    await expect(page).toHaveURL(/\/admin\/profile/)

    // Update profile
    await page.getByLabel(/name/i).clear()
    await page.getByLabel(/name/i).fill("Admin Updated")
    await page.getByLabel(/phone/i).fill("+1234567890")
    await page.getByLabel(/address/i).fill("123 Library St")

    await page.getByRole("button", { name: /update profile/i }).click()

    await expect(page.getByText(/profile updated/i)).toBeVisible()
  })

  test("should update member profile", async ({ page }) => {
    // Sign in as member
    await page.goto("/auth/signin")
    await page.getByPlaceholder(/email/i).fill("member@library.com")
    await page.getByPlaceholder(/password/i).fill("member123")
    await page.getByRole("button", { name: /sign in/i }).click()

    // Navigate to profile
    await page.getByRole("link", { name: /profile/i }).click()
    await expect(page).toHaveURL(/\/portal\/profile/)

    // Update profile
    await page.getByLabel(/name/i).clear()
    await page.getByLabel(/name/i).fill("Member Updated")
    await page.getByLabel(/phone/i).fill("+9876543210")

    await page.getByRole("button", { name: /update profile/i }).click()

    await expect(page.getByText(/profile updated/i)).toBeVisible()
  })

  test("should display profile statistics for member", async ({ page }) => {
    // Sign in as member
    await page.goto("/auth/signin")
    await page.getByPlaceholder(/email/i).fill("member@library.com")
    await page.getByPlaceholder(/password/i).fill("member123")
    await page.getByRole("button", { name: /sign in/i }).click()

    await page.goto("/portal/profile")

    // Check statistics are visible
    await expect(page.getByText(/active loans/i)).toBeVisible()
    await expect(page.getByText(/total books borrowed/i)).toBeVisible()
    await expect(page.getByText(/pending reservations/i)).toBeVisible()
  })
})
