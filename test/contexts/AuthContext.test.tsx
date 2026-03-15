import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { useAuth } from '../../src/hooks/useAuth';

vi.mock('../../src/lib/firebase', () => ({
	auth: {},
}));

vi.mock('firebase/auth', () => {
	const mockUnsubscribe = vi.fn();
	return {
		signInAnonymously: vi.fn(),
		onAuthStateChanged: vi.fn((auth, callback) => {
			// Simulate loading state then authenticated state
			setTimeout(() => {
				callback({
					uid: 'test-user-id',
					email: null,
					displayName: null,
				});
			}, 100);
			return mockUnsubscribe;
		}),
	};
});

const TestComponent = () => {
	const { user, loading } = useAuth();
	return (
		<div>
			<div>{loading ? 'Loading' : 'Loaded'}</div>
			<div>{user ? `User: ${user.uid}` : 'No user'}</div>
		</div>
	);
};

describe('AuthContext', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should have loading true initially', () => {
		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>,
		);

		expect(screen.getByText('Loading')).toBeDefined();
	});

	it('should set user after authentication completes', async () => {
		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>,
		);

		await waitFor(() => {
			expect(screen.getByText('Loaded')).toBeDefined();
			expect(screen.getByText('User: test-user-id')).toBeDefined();
		});
	});

	it('should provide useAuth hook', () => {
		const TestHook = () => {
			const auth = useAuth();
			return <div>{auth ? `Auth available: ${typeof auth.user}` : 'No auth'}</div>;
		};

		render(
			<AuthProvider>
				<TestHook />
			</AuthProvider>,
		);

		expect(screen.getByText(/Auth available/)).toBeDefined();
	});
});
