import { useLiked } from '../hooks/useLiked';

type Props = {
	postId: string;
};

export const LikeButton = ({ postId }: Props) => {
	const { isLiked, toggleLikePost, isLoading } = useLiked(postId);

	return (
		<button
			type="button"
			onClick={toggleLikePost}
			disabled={isLoading}
			className={`flex items-center gap-1 transition-colors ${
				isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
			} disabled:opacity-50`}
		>
			<span>{isLiked ? '♥' : '♡'}</span>
		</button>
	);
};
