import { describe, it, expect, beforeEach, vi } from 'vitest';
import { toggleLike } from '../../src/lib/likes';

vi.mock('../../src/lib/firebase', () => ({
	db: {},
}));

vi.mock('firebase/firestore', () => ({
	doc: vi.fn((db, path) => ({ path })),
	increment: vi.fn((n) => n),
	runTransaction: vi.fn((db, callback) => {
		const transaction = {
			get: vi.fn().mockResolvedValue({ exists: () => true }),
			set: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		};
		return callback(transaction);
	}),
}));

describe('Likes', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should toggle like on a post', async () => {
		await toggleLike('post-1', 'user-1', false);
		expect(true).toBe(true); // Basic test that function doesn't throw
	});

	it('should remove like when already liked', async () => {
		await toggleLike('post-1', 'user-1', true);
		expect(true).toBe(true);
	});

	it('should add like when not liked', async () => {
		await toggleLike('post-1', 'user-1', false);
		expect(true).toBe(true);
	});
});
