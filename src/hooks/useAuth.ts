import { useContext } from 'react';
import { AuthContext } from '../contexts/createAuthContext';

export const useAuth = () => {
	const authState = useContext(AuthContext);
	if (!authState) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return authState;
};
