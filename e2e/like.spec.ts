import { test, expect } from '@playwright/test';

test.describe('Like Functionality', () => {
	test('should toggle like when clicking the heart button', async ({ page }) => {
		page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
		page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));
		await page.goto('/');
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		// Create a post
		const textarea = page.locator('textarea');
		await textarea.fill('Like test post');
		await page.getByRole('button', { name: 'Post' }).click();

		// Get the like button (empty heart)
		const likeButton = page.locator('button').filter({ hasText: '♡' }).first();
		await expect(likeButton).toBeVisible();

		// Click like
		await likeButton.click();

		// Verify heart becomes filled
		const filledHeart = page.locator('button').filter({ hasText: '♥' }).first();
		await expect(filledHeart).toBeVisible({ timeout: 10000 });
	});

	test('should unlike when clicking the filled heart button', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		// Create a post
		const textarea = page.locator('textarea');
		await textarea.fill('Unlike test post');
		await page.getByRole('button', { name: 'Post' }).click();

		// Like the post
		const likeButton = page.locator('button').filter({ hasText: '♡' }).first();
		await likeButton.click();
		await expect(page.locator('button').filter({ hasText: '♥' }).first()).toBeVisible({
			timeout: 5000,
		});

		// Unlike the post
		const filledHeart = page.locator('button').filter({ hasText: '♥' }).first();
		await filledHeart.click();

		// Verify heart becomes empty
		await expect(page.locator('button').filter({ hasText: '♡' }).first()).toBeVisible({
			timeout: 5000,
		});
	});

	test('should persist like state after page reload', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		// Create a post
		const textarea = page.locator('textarea');
		await textarea.fill('Persist like test');
		await page.getByRole('button', { name: 'Post' }).click();

		// Click like
		const likeButton = page.locator('button').filter({ hasText: '♡' }).first();
		await likeButton.click();
		await expect(page.locator('button').filter({ hasText: '♥' }).first()).toBeVisible({
			timeout: 5000,
		});

		// Reload page
		await page.reload();
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		// Verify like state persisted
		await expect(page.locator('button').filter({ hasText: '♥' }).first()).toBeVisible();
	});

	test('should not add multiple likes when clicking rapidly', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		// Create a post with unique content
		const uniqueContent = `Spam click test ${Date.now()}`;
		const textarea = page.locator('textarea');
		await textarea.fill(uniqueContent);
		await page.getByRole('button', { name: 'Post' }).click();

		// Wait for post to appear
		const post = page.locator('article').filter({ hasText: uniqueContent });
		await expect(post).toBeVisible();

		// Get the like button for this specific post
		const likeButton = post.locator('button').filter({ hasText: '♡' });
		await expect(likeButton).toBeVisible();

		// Click rapidly multiple times using Promise.all for concurrent clicks
		const clicks = [];
		for (let i = 0; i < 5; i++) {
			clicks.push(likeButton.click({ force: true }));
		}
		await Promise.all(clicks);

		// Wait for all requests to settle
		await page.waitForTimeout(2000);

		// Verify like count is exactly 1 (Firestore document structure prevents duplicates)
		const likeButtonAfter = post.locator('button').filter({ hasText: '♥' });
		await expect(likeButtonAfter).toContainText('1');
	});
});
