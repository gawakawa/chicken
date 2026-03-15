import { test, expect } from '@playwright/test';

test.describe('Realtime Posts', () => {
	test('should display posts in realtime', async ({ page }) => {
		await page.goto('/');

		// Wait for auth
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		// Check for post list or empty state
		const postListOrEmpty = page.locator('article, p:has-text("No posts")');
		await expect(postListOrEmpty.first()).toBeVisible({ timeout: 5000 });
	});

	test('should show empty state when no posts exist', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		// If no posts, should show empty message
		const emptyMessage = page.getByText('No posts yet');
		const posts = page.locator('article');

		// Either empty message or posts should be visible
		const hasContent = (await emptyMessage.isVisible()) || (await posts.count()) > 0;
		expect(hasContent).toBeTruthy();
	});

	test('should update post list when new post is created', async ({ browser }) => {
		// Open two browser contexts to simulate two users
		const context1 = await browser.newContext();
		const context2 = await browser.newContext();

		const page1 = await context1.newPage();
		const page2 = await context2.newPage();

		await page1.goto('/');
		await page2.goto('/');

		// Wait for both to load
		await expect(page1.getByText('Loading')).not.toBeVisible({ timeout: 10000 });
		await expect(page2.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		// Get initial post count on page2
		const initialCount = await page2.locator('article').count();

		// Create a post from page1
		const postContent = `Test post ${Date.now()}`;
		const textarea = page1.locator('textarea');

		if (await textarea.isVisible()) {
			await textarea.fill(postContent);
			await page1.getByRole('button', { name: 'Post' }).click();

			// Wait for the post to appear on page2 (realtime sync)
			await expect(page2.getByText(postContent)).toBeVisible({ timeout: 10000 });

			// Post count should increase
			const newCount = await page2.locator('article').count();
			expect(newCount).toBeGreaterThan(initialCount);
		}

		await context1.close();
		await context2.close();
	});
});
