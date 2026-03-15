import { useState, useEffect, type ReactNode } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthContext } from './createAuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [state, setState] = useState<{ user: User | undefined; loading: boolean }>({
		user: undefined,
		loading: true,
	});

	useEffect(() => {
		// Set up auth state listener
		const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
			if (user) {
				setState({
					user,
					loading: false,
				});
			} else {
				// Auto sign in anonymously
				try {
					const result = await signInAnonymously(auth);
					setState({
						user: result.user,
						loading: false,
					});
				} catch (error) {
					console.error('Failed to sign in anonymously:', error);
					setState({
						user: undefined,
						loading: false,
					});
				}
			}
		});

		return () => unsubscribe();
	}, []);

	return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
