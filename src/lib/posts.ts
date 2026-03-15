import {
	collection,
	addDoc,
	serverTimestamp,
	onSnapshot,
	query,
	orderBy,
	type FirestoreDataConverter,
	type Query,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Post, SortOption } from '../types/post';

export const postConverter: FirestoreDataConverter<Post> = {
	toFirestore(post: Post) {
		return {
			content: post.content,
			likeCount: post.likeCount,
			createdAt: post.createdAt,
		};
	},
	fromFirestore(snapshot, options) {
		const data = snapshot.data(options);
		return {
			id: snapshot.id,
			content: data.content,
			likeCount: data.likeCount,
			createdAt: data.createdAt,
		};
	},
};

export const createPost = async (content: string): Promise<string> => {
	if (content.length > 1000) {
		throw new Error('Content exceeds 1000 characters');
	}

	const docRef = await addDoc(collection(db, 'posts').withConverter(postConverter), {
		id: '',
		content,
		likeCount: 0,
		createdAt: serverTimestamp(),
	} as Post);

	return docRef.id;
};

export const subscribeToPostsSnapshot = (
	callback: (posts: Post[]) => void,
	sortBy: SortOption = 'createdAt',
) => {
	const q = query(
		collection(db, 'posts').withConverter(postConverter),
		orderBy(sortBy, 'desc'),
	) as Query<Post>;

	return onSnapshot(q, (snapshot) => {
		const posts = snapshot.docs.map((doc) => doc.data());
		callback(posts);
	});
};

export const deletePost = async (postId: string): Promise<void> => {
	const { deleteDoc, doc } = await import('firebase/firestore');
	await deleteDoc(doc(db, 'posts', postId));
};
