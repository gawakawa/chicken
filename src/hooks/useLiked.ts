import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { subscribeToUserLikes, toggleLike } from '../lib/likes';

export const useLiked = (postId: string) => {
	const { user } = useAuth();
	const [isLiked, setIsLiked] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!user) return;

		const unsubscribe = subscribeToUserLikes(postId, user.uid, setIsLiked);
		return () => unsubscribe();
	}, [postId, user]);

	const toggleLikePost = async () => {
		if (!user) return;

		setIsLoading(true);
		try {
			await toggleLike(postId, user.uid, isLiked);
		} catch (error) {
			console.error('Failed to toggle like:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return { isLiked, toggleLikePost, isLoading };
};
