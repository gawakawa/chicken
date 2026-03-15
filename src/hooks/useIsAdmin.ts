import { useAuth } from './useAuth';

export const useIsAdmin = (): boolean => {
	const { user } = useAuth();

	if (!user) {
		return false;
	}

	return (user.customClaims?.admin ?? false) === true;
};
