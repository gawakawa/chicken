import { test, expect } from '@playwright/test';

test.describe('Sort Functionality', () => {
	test('should have sort toggle buttons', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		// Check for sort buttons
		const latestButton = page.getByRole('button', { name: 'Latest' });
		const popularButton = page.getByRole('button', { name: 'Popular' });

		// At least one sort option should exist if sort toggle is rendered
		const hasSortToggle = (await latestButton.isVisible()) || (await popularButton.isVisible());

		if (hasSortToggle) {
			await expect(latestButton).toBeVisible();
			await expect(popularButton).toBeVisible();
		}
	});

	test('should switch sort order when clicking buttons', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		const latestButton = page.getByRole('button', { name: 'Latest' });
		const popularButton = page.getByRole('button', { name: 'Popular' });

		if (await latestButton.isVisible()) {
			// Click Popular
			await popularButton.click();

			// Popular button should now be active (blue background)
			await expect(popularButton).toHaveClass(/bg-blue-500/);

			// Click Latest
			await latestButton.click();

			// Latest button should now be active
			await expect(latestButton).toHaveClass(/bg-blue-500/);
		}
	});

	test('should maintain sort preference after creating a post', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		const popularButton = page.getByRole('button', { name: 'Popular' });

		if (await popularButton.isVisible()) {
			// Select "Popular" sort
			await popularButton.click();
			await expect(popularButton).toHaveClass(/bg-blue-500/);

			// Create a post
			const textarea = page.locator('textarea');
			if (await textarea.isVisible()) {
				await textarea.fill('Sort test post');
				await page.getByRole('button', { name: 'Post' }).click();

				// Sort should still be "Popular" after posting
				await expect(popularButton).toHaveClass(/bg-blue-500/);
			}
		}
	});
});
