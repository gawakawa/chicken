import type { SortOption } from '../types/post';

type Props = {
	sortBy: SortOption;
	onSortChange: (sortBy: SortOption) => void;
};

export const SortToggle = ({ sortBy, onSortChange }: Props) => {
	return (
		<div className="flex gap-2">
			<button
				type="button"
				onClick={() => onSortChange('createdAt')}
				className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
					sortBy === 'createdAt'
						? 'bg-blue-500 text-white'
						: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
				}`}
			>
				Latest
			</button>
			<button
				type="button"
				onClick={() => onSortChange('likeCount')}
				className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
					sortBy === 'likeCount'
						? 'bg-blue-500 text-white'
						: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
				}`}
			>
				Popular
			</button>
		</div>
	);
};
