import type { Page } from "@playwright/test"

export async function signInAsAdmin(page: Page) {
  await page.goto("/auth/signin")
  await page.getByPlaceholder(/email/i).fill("admin@library.com")
  await page.getByPlaceholder(/password/i).fill("admin123")
  await page.getByRole("button", { name: /sign in/i }).click()
  await page.waitForURL(/\/admin/)
}

export async function signInAsMember(page: Page) {
  await page.goto("/auth/signin")
  await page.getByPlaceholder(/email/i).fill("member@library.com")
  await page.getByPlaceholder(/password/i).fill("member123")
  await page.getByRole("button", { name: /sign in/i }).click()
  await page.waitForURL(/\/portal/)
}

export async function createTestBook(
  page: Page,
  bookData: {
    title: string
    author: string
    isbn: string
    category: string
    totalCopies: number
  },
) {
  await page.goto("/admin/books")
  await page.getByRole("button", { name: /add book/i }).click()

  await page.getByLabel(/title/i).fill(bookData.title)
  await page.getByLabel(/author/i).fill(bookData.author)
  await page.getByLabel(/isbn/i).fill(bookData.isbn)
  await page.getByLabel(/category/i).fill(bookData.category)
  await page.getByLabel(/total copies/i).fill(bookData.totalCopies.toString())

  await page.getByRole("button", { name: /create book/i }).click()
  await page.waitForTimeout(1000) // Wait for creation
}

export async function cleanupTestData(page: Page) {
  // Navigate to books page and delete all test books
  await page.goto("/admin/books")

  const deleteButtons = page.getByRole("button", { name: /delete/i })
  const count = await deleteButtons.count()

  for (let i = 0; i < count; i++) {
    const button = deleteButtons.first()
    if (await button.isVisible()) {
      await button.click()
      await page.getByRole("button", { name: /confirm/i }).click()
      await page.waitForTimeout(500)
    }
  }
}
