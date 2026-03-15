import type { Post } from '../types/post';
import { PostCard } from './PostCard';
import { useLiked } from '../hooks/useLiked';

type PostCardWithLikeProps = {
	post: Post;
	onDelete?: (() => void) | undefined;
	showDelete: boolean;
};

const PostCardWithLike = ({ post, onDelete, showDelete }: PostCardWithLikeProps) => {
	const { isLiked, toggleLikePost } = useLiked(post.id);

	return (
		<PostCard
			post={post}
			isLiked={isLiked}
			onLike={toggleLikePost}
			onDelete={onDelete}
			showDelete={showDelete}
		/>
	);
};

type Props = {
	posts: Post[];
	onDelete?: (postId: string) => void;
	isAdmin?: boolean;
};

export const PostList = ({ posts, onDelete, isAdmin = false }: Props) => {
	if (posts.length === 0) {
		return <p className="py-8 text-center text-gray-500">No posts yet. Be the first to post!</p>;
	}

	return (
		<div className="space-y-4">
			{posts.map((post) => (
				<PostCardWithLike
					key={post.id}
					post={post}
					onDelete={onDelete ? () => onDelete(post.id) : undefined}
					showDelete={isAdmin}
				/>
			))}
		</div>
	);
};
