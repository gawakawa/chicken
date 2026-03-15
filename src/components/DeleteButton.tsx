import { useState } from 'react';
import { deletePost } from '../lib/posts';

type Props = {
	postId: string;
	onDeleted?: () => void;
};

export const DeleteButton = ({ postId, onDeleted }: Props) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | undefined>();

	const handleDelete = async () => {
		if (!window.confirm('Are you sure you want to delete this post?')) {
			return;
		}

		setIsDeleting(true);
		setError(undefined);

		try {
			await deletePost(postId);
			onDeleted?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete post');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={handleDelete}
				disabled={isDeleting}
				className="text-red-600 hover:text-red-800 disabled:opacity-50"
			>
				{isDeleting ? 'Deleting...' : 'Delete'}
			</button>
			{error && <p className="text-xs text-red-500">{error}</p>}
		</>
	);
};
