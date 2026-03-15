import {
	doc,
	increment,
	runTransaction,
	onSnapshot,
	type DocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

export const toggleLike = async (
	postId: string,
	userId: string,
	isCurrentlyLiked: boolean,
): Promise<void> => {
	const likesRef = doc(db, `posts/${postId}/likes/${userId}`);
	const postRef = doc(db, 'posts', postId);

	return runTransaction(db, async (transaction) => {
		if (isCurrentlyLiked) {
			// Remove like
			const docSnapshot = await transaction.get(likesRef);
			if (docSnapshot.exists()) {
				transaction.delete(likesRef);
				transaction.update(postRef, { likeCount: increment(-1) });
			}
		} else {
			// Add like
			transaction.set(likesRef, { userId, createdAt: new Date() });
			transaction.update(postRef, { likeCount: increment(1) });
		}
	});
};

export const checkIfUserLikedPost = async (postId: string, userId: string): Promise<boolean> => {
	const { getDoc } = await import('firebase/firestore');
	const likesRef = doc(db, `posts/${postId}/likes/${userId}`);
	const docSnapshot = await getDoc(likesRef);
	return docSnapshot.exists();
};

export const subscribeToUserLikes = (
	postId: string,
	userId: string,
	callback: (isLiked: boolean) => void,
) => {
	const likesRef = doc(db, `posts/${postId}/likes/${userId}`);

	return onSnapshot(likesRef, (snapshot: DocumentSnapshot) => {
		callback(snapshot.exists());
	});
};
