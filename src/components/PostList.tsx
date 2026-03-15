import type { Post } from '../types/post';
import { PostCard } from './PostCard';

type Props = {
	posts: Post[];
	likedPostIds?: Set<string>;
	onLike?: (postId: string) => void;
	onDelete?: (postId: string) => void;
	isAdmin?: boolean;
};

export const PostList = ({
	posts,
	likedPostIds = new Set(),
	onLike,
	onDelete,
	isAdmin = false,
}: Props) => {
	if (posts.length === 0) {
		return <p className="py-8 text-center text-gray-500">No posts yet. Be the first to post!</p>;
	}

	return (
		<div className="space-y-4">
			{posts.map((post) => (
				<PostCard
					key={post.id}
					post={post}
					isLiked={likedPostIds.has(post.id)}
					onLike={onLike ? () => onLike(post.id) : undefined}
					onDelete={onDelete ? () => onDelete(post.id) : undefined}
					showDelete={isAdmin}
				/>
			))}
		</div>
	);
};
