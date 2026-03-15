import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPost, postConverter } from '../../src/lib/posts';
import type { Timestamp as FirestoreTimestamp } from 'firebase/firestore';

vi.mock('../../src/lib/firebase', () => ({
	db: {},
}));

vi.mock('firebase/firestore', () => {
	const mockDocRef = { id: 'test-id' };
	return {
		collection: vi.fn(() => ({ withConverter: vi.fn(() => ({})) })),
		addDoc: vi.fn(() => Promise.resolve(mockDocRef)),
		Timestamp: {
			now: () => new Date().getTime(),
		},
	};
});

describe('Posts', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create a post with content', async () => {
		const result = await createPost('Hello world');
		expect(result).toBeDefined();
	});

	it('should reject content over 1000 characters', async () => {
		const longContent = 'a'.repeat(1001);
		await expect(createPost(longContent)).rejects.toThrow('Content exceeds 1000 characters');
	});

	it('postConverter should convert to firestore format', () => {
		const timestamp = {} as FirestoreTimestamp;
		const post = {
			id: 'test-id',
			content: 'Test post',
			likeCount: 5,
			createdAt: timestamp,
		};

		const result = postConverter.toFirestore(post);
		expect(result).toEqual({
			content: 'Test post',
			likeCount: 5,
			createdAt: timestamp,
		});
	});

	it('postConverter should convert from firestore format', () => {
		const timestamp = {} as FirestoreTimestamp;
		const snapshot = {
			id: 'test-id',
			data: () => ({
				content: 'Test post',
				likeCount: 5,
				createdAt: timestamp,
			}),
		} as unknown;

		const result = postConverter.fromFirestore(
			snapshot as Parameters<typeof postConverter.fromFirestore>[0],
		);
		expect(result).toEqual({
			id: 'test-id',
			content: 'Test post',
			likeCount: 5,
			createdAt: timestamp,
		});
	});
});
