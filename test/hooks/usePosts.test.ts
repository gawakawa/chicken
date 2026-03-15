import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from '../../src/hooks/usePosts';
import * as postsModule from '../../src/lib/posts';
import type { SortOption } from '../../src/types/post';

vi.mock('../../src/lib/posts', () => {
	const mockUnsubscribe = vi.fn();
	const mockTimestamp = {
		seconds: 0,
		nanoseconds: 0,
		toDate: () => new Date(0),
		toMillis: () => 0,
		isEqual: () => true,
		valueOf: () => '',
	};
	return {
		subscribeToPostsSnapshot: vi.fn((callback) => {
			const mockPosts = [
				{
					id: '1',
					content: 'First post',
					likeCount: 5,
					createdAt: mockTimestamp,
				},
				{
					id: '2',
					content: 'Second post',
					likeCount: 3,
					createdAt: mockTimestamp,
				},
			];
			setTimeout(() => callback(mockPosts), 10);
			return mockUnsubscribe;
		}),
	};
});

describe('usePosts', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return empty array initially', () => {
		const { result } = renderHook(() => usePosts());
		expect(result.current).toEqual([]);
	});

	it('should return posts when subscription fires', async () => {
		const { result } = renderHook(() => usePosts());

		await waitFor(() => {
			expect(result.current.length).toBe(2);
			expect(result.current[0].content).toBe('First post');
		});
	});

	it('should resubscribe when sortBy changes', () => {
		const { rerender } = renderHook<unknown, { sortBy: SortOption }>(
			({ sortBy }) => usePosts(sortBy),
			{ initialProps: { sortBy: 'createdAt' } },
		);

		expect(postsModule.subscribeToPostsSnapshot).toHaveBeenCalledTimes(1);
		expect(postsModule.subscribeToPostsSnapshot).toHaveBeenLastCalledWith(
			expect.any(Function),
			'createdAt',
		);

		rerender({ sortBy: 'likeCount' });

		expect(postsModule.subscribeToPostsSnapshot).toHaveBeenCalledTimes(2);
		expect(postsModule.subscribeToPostsSnapshot).toHaveBeenLastCalledWith(
			expect.any(Function),
			'likeCount',
		);
	});
});
