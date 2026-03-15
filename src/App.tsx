import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { usePosts } from './hooks/usePosts';
import { PostForm } from './components/PostForm';
import { PostList } from './components/PostList';
import { SortToggle } from './components/SortToggle';
import { createPost } from './lib/posts';
import { toggleLike } from './lib/likes';
import type { SortOption } from './types/post';

const Board = () => {
	const { user, loading } = useAuth();
	const [sortBy, setSortBy] = useState<SortOption>('createdAt');
	const posts = usePosts(sortBy);
	const [likedPostIds] = useState(new Set<string>());

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p className="text-gray-500">Loading...</p>
			</div>
		);
	}

	const handleSubmit = async (content: string) => {
		await createPost(content);
	};

	const handleLike = async (postId: string) => {
		if (!user) return;
		const isLiked = likedPostIds.has(postId);
		await toggleLike(postId, user.uid, isLiked);
	};

	return (
		<div className="mx-auto max-w-2xl px-4 py-8">
			<header className="mb-8">
				<h1 className="mb-2 text-3xl font-bold text-gray-900">Bulletin Board</h1>
				<p className="text-gray-600">Share your thoughts anonymously</p>
			</header>

			<section className="mb-8">
				<PostForm onSubmit={handleSubmit} />
			</section>

			<section>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-xl font-semibold text-gray-800">Posts</h2>
					<SortToggle sortBy={sortBy} onSortChange={setSortBy} />
				</div>
				<PostList posts={posts} likedPostIds={likedPostIds} onLike={handleLike} />
			</section>
		</div>
	);
};

const App = () => {
	return (
		<AuthProvider>
			<Board />
		</AuthProvider>
	);
};

export default App;
