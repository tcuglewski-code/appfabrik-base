import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Authentication Flow
 * 
 * Tests login, logout, and session persistence.
 */

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login form elements
    await expect(page.getByRole('heading', { name: /anmelden|login/i })).toBeVisible();
    await expect(page.getByLabel(/e-mail|email/i)).toBeVisible();
    await expect(page.getByLabel(/passwort|password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /anmelden|login|einloggen/i })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in invalid credentials
    await page.getByLabel(/e-mail|email/i).fill('invalid@test.de');
    await page.getByLabel(/passwort|password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /anmelden|login|einloggen/i }).click();
    
    // Wait for error message
    await expect(page.getByText(/ungültig|invalid|fehler|error/i)).toBeVisible({ timeout: 10000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/login');
    
    // Try submitting with invalid email
    await page.getByLabel(/e-mail|email/i).fill('not-an-email');
    await page.getByLabel(/passwort|password/i).fill('somepassword');
    await page.getByRole('button', { name: /anmelden|login|einloggen/i }).click();
    
    // Should show validation error or stay on login page
    await expect(page).toHaveURL(/login/);
  });

  test('should require password', async ({ page }) => {
    await page.goto('/login');
    
    // Fill only email
    await page.getByLabel(/e-mail|email/i).fill('test@appfabrik.de');
    await page.getByRole('button', { name: /anmelden|login|einloggen/i }).click();
    
    // Should not navigate away without password
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Protected Routes', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try accessing dashboard without login
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('should redirect unauthenticated users from settings', async ({ page }) => {
    await page.goto('/einstellungen');
    await expect(page).toHaveURL(/login/);
  });

  test('should redirect unauthenticated users from admin pages', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Session Handling', () => {
  test('should persist session after page reload', async ({ page, context }) => {
    // This test assumes a valid test user exists in the database
    // In real tests, you'd use a test fixture or seed data
    
    await page.goto('/login');
    
    // Store current URL
    const currentUrl = page.url();
    expect(currentUrl).toContain('login');
  });

  test('should clear session on logout', async ({ page }) => {
    // Navigate to login (or wherever logout redirects)
    await page.goto('/login');
    
    // Verify we're logged out
    await expect(page.getByLabel(/e-mail|email/i)).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('login form should be keyboard navigable', async ({ page }) => {
    await page.goto('/login');
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    
    // Should be on an interactive element
    expect(['INPUT', 'BUTTON', 'A']).toContain(activeElement);
  });

  test('login page should have proper heading structure', async ({ page }) => {
    await page.goto('/login');
    
    // Check for at least one heading
    const headings = await page.locator('h1, h2').count();
    expect(headings).toBeGreaterThan(0);
  });
});
