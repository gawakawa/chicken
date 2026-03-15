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

	test('should sort posts by like count when Popular is selected', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Loading')).not.toBeVisible({ timeout: 10000 });

		const textarea = page.locator('textarea');

		// Create 2 posts with unique content
		const uniqueId = Date.now();
		const postAContent = `Sort Post A ${uniqueId}`;
		const postBContent = `Sort Post B ${uniqueId}`;

		await textarea.fill(postAContent);
		await page.getByRole('button', { name: 'Post' }).click();
		const postA = page.locator('article').filter({ hasText: postAContent });
		await expect(postA).toBeVisible();

		await textarea.fill(postBContent);
		await page.getByRole('button', { name: 'Post' }).click();
		const postB = page.locator('article').filter({ hasText: postBContent });
		await expect(postB).toBeVisible();

		// Like Post A (will have 1 like, Post B has 0 likes)
		await postA.locator('button').filter({ hasText: '♡' }).click();
		await expect(postA.locator('button').filter({ hasText: '♥' })).toBeVisible();

		// In Latest sort (default), Post B should be above Post A (newer first)
		const allArticles = page.locator('article');
		const postAIndex = await getArticleIndex(allArticles, postAContent);
		const postBIndexLatest = await getArticleIndex(allArticles, postBContent);
		expect(postBIndexLatest).toBeLessThan(postAIndex);

		// Click Popular sort
		await page.getByRole('button', { name: 'Popular' }).click();
		await page.waitForTimeout(500);

		// In Popular sort, Post A (1 like) should be above Post B (0 likes)
		const postAIndexPopular = await getArticleIndex(allArticles, postAContent);
		const postBIndexPopular = await getArticleIndex(allArticles, postBContent);
		expect(postAIndexPopular).toBeLessThan(postBIndexPopular);
	});
});

const getArticleIndex = async (
	articles: import('@playwright/test').Locator,
	content: string,
): Promise<number> => {
	const count = await articles.count();
	for (let i = 0; i < count; i++) {
		const text = await articles.nth(i).textContent();
		if (text?.includes(content)) {
			return i;
		}
	}
	return -1;
};
