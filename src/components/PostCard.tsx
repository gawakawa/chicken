import type { Post } from '../types/post';

type Props = {
	post: Post;
	onLike?: (() => void) | undefined;
	onDelete?: (() => void) | undefined;
	isLiked?: boolean | undefined;
	showDelete?: boolean | undefined;
};

export const PostCard = ({
	post,
	onLike,
	onDelete,
	isLiked = false,
	showDelete = false,
}: Props) => {
	const formattedDate = post.createdAt.toDate().toLocaleString();

	return (
		<article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
			<p className="mb-3 whitespace-pre-wrap text-gray-800">{post.content}</p>
			<div className="flex items-center justify-between text-sm text-gray-500">
				<time dateTime={post.createdAt.toDate().toISOString()}>{formattedDate}</time>
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={onLike}
						className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
					>
						<span>{isLiked ? '♥' : '♡'}</span>
						<span>{post.likeCount}</span>
					</button>
					{showDelete && (
						<button type="button" onClick={onDelete} className="text-red-600 hover:text-red-800">
							Delete
						</button>
					)}
				</div>
			</div>
		</article>
	);
};
