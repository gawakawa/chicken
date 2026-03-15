import { useState, useEffect } from 'react';
import { subscribeToPostsSnapshot } from '../lib/posts';
import type { Post, SortOption } from '../types/post';

export const usePosts = (sortBy: SortOption = 'createdAt') => {
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		return subscribeToPostsSnapshot(setPosts, sortBy);
	}, [sortBy]);

	return posts;
};
