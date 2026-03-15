import { useState, type FormEvent } from 'react';

type Props = {
	onSubmit: (content: string) => Promise<void>;
	maxLength?: number;
};

export const PostForm = ({ onSubmit, maxLength = 1000 }: Props) => {
	const [content, setContent] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | undefined>();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!content.trim() || isSubmitting) return;

		setIsSubmitting(true);
		setError(undefined);

		try {
			await onSubmit(content.trim());
			setContent('');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to post');
		} finally {
			setIsSubmitting(false);
		}
	};

	const remainingChars = maxLength - content.length;

	return (
		<form onSubmit={handleSubmit} className="space-y-3">
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="What's on your mind?"
				maxLength={maxLength}
				rows={3}
				className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
				disabled={isSubmitting}
			/>
			<div className="flex items-center justify-between">
				<span className={`text-sm ${remainingChars < 100 ? 'text-orange-500' : 'text-gray-500'}`}>
					{remainingChars} characters remaining
				</span>
				<button
					type="submit"
					disabled={!content.trim() || isSubmitting}
					className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSubmitting ? 'Posting...' : 'Post'}
				</button>
			</div>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</form>
	);
};
