import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useIsAdmin = (): boolean => {
	const { user } = useAuth();
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		if (!user) {
			setIsAdmin(false);
			return;
		}

		user
			.getIdTokenResult()
			.then((idTokenResult) => {
				setIsAdmin(idTokenResult.claims.admin === true);
			})
			.catch(() => {
				setIsAdmin(false);
			});
	}, [user]);

	return isAdmin;
};
