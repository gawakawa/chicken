import type { Timestamp } from 'firebase/firestore';

export type { Timestamp };

export type Post = {
	id: string;
	content: string;
	likeCount: number;
	createdAt: Timestamp;
};

export type SortOption = 'createdAt' | 'likeCount';
