export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export function getUsers(): User[] {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is User =>
        typeof item?.id === 'string' &&
        typeof item?.name === 'string' &&
        typeof item?.email === 'string' &&
        typeof item?.password === 'string',
    );
  } catch (error) {
    console.error('Could not read registered users:', error);
    return [];
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): CurrentUser | null {
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (!saved) return null;

    const user: unknown = JSON.parse(saved);
    if (typeof user !== 'object' || user === null) return null;

    if (
      !('id' in user) ||
      !('name' in user) ||
      !('email' in user) ||
      typeof user.id !== 'string' ||
      typeof user.name !== 'string' ||
      typeof user.email !== 'string'
    ) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
    } satisfies CurrentUser),
  );
}

export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem('isLoggedIn');
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}
