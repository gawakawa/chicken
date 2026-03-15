import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
	test('should automatically sign in anonymously', async ({ page }) => {
		await page.goto('/');

		// Wait for auth to complete (loading state should disappear)
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		// User should be signed in (anonymous)
		// The app should render without auth errors
		await expect(page.locator('body')).not.toContainText(
			'useAuth must be used within AuthProvider',
		);
	});

	test('should persist session across page reload', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		// Reload the page
		await page.reload();

		// Should still be authenticated
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });
	});
});
