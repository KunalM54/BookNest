import { Injectable, signal } from '@angular/core';

export interface AuthUser {
  fullName: string;
  email: string;
  role: string;
  userId?: number;
}

export interface AuthSession extends AuthUser {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly sessionStorageKey = 'auth.session';
  private readonly sessionState = signal<AuthSession | null>(this.restoreSession());

  private get tabStorage(): Storage | null {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  }

  private get sharedStorage(): Storage | null {
    return typeof window === 'undefined' ? null : window.localStorage;
  }

  setSession(session: AuthSession): void {
    const normalizedSession = this.normalizeSession(session);
    const storage = this.tabStorage;

    if (!normalizedSession.token) {
      this.logout();
      return;
    }

    this.sessionState.set(normalizedSession);
    storage?.setItem(this.sessionStorageKey, JSON.stringify(normalizedSession));
    this.clearLegacyAuthData();
  }

  getToken(): string | null {
    return this.sessionState()?.token ?? null;
  }

  getUser(): AuthUser | null {
    const session = this.sessionState();

    if (!session) {
      return null;
    }

    return {
      fullName: session.fullName,
      email: session.email,
      role: session.role,
      userId: session.userId
    };
  }

  getUserId(): number | null {
    return this.sessionState()?.userId ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    return this.sessionState()?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isStudent(): boolean {
    return this.getUserRole() === 'STUDENT';
  }

  logout(): void {
    this.sessionState.set(null);
    this.tabStorage?.removeItem(this.sessionStorageKey);
    this.clearLegacyAuthData();
  }

  private restoreSession(): AuthSession | null {
    const storage = this.tabStorage;

    if (!storage) {
      return null;
    }

    const storedSession = storage.getItem(this.sessionStorageKey);
    if (storedSession) {
      try {
        this.clearLegacyAuthData();
        return this.normalizeSession(JSON.parse(storedSession));
      } catch {
        storage.removeItem(this.sessionStorageKey);
      }
    }

    const sharedStorage = this.sharedStorage;
    if (!sharedStorage) {
      return null;
    }

    const sharedSession = sharedStorage.getItem(this.sessionStorageKey);
    if (sharedSession) {
      try {
        const restoredSession = this.normalizeSession(JSON.parse(sharedSession));
        storage.setItem(this.sessionStorageKey, JSON.stringify(restoredSession));
        this.clearLegacyAuthData();
        return restoredSession;
      } catch {
        sharedStorage.removeItem(this.sessionStorageKey);
      }
    }

    const legacyToken = sharedStorage.getItem('token');
    const legacyUser = sharedStorage.getItem('user');
    const legacyUserId = sharedStorage.getItem('userId');

    if (!legacyToken || !legacyUser) {
      return null;
    }

    try {
      const parsedUser = JSON.parse(legacyUser);
      const restoredSession = this.normalizeSession({
        token: legacyToken,
        ...parsedUser,
        userId: parsedUser.userId ?? this.parseUserId(legacyUserId)
      });

      storage.setItem(this.sessionStorageKey, JSON.stringify(restoredSession));
      this.clearLegacyAuthData();
      return restoredSession;
    } catch {
      this.clearLegacyAuthData();
      return null;
    }
  }

  private clearLegacyAuthData(): void {
    const storages = [this.tabStorage, this.sharedStorage];

    for (const storage of storages) {
      storage?.removeItem('token');
      storage?.removeItem('user');
      storage?.removeItem('userId');
    }

    this.sharedStorage?.removeItem(this.sessionStorageKey);
  }

  private normalizeSession(session: Partial<AuthSession>): AuthSession {
    return {
      token: session.token ?? '',
      fullName: session.fullName ?? '',
      email: session.email ?? '',
      role: session.role ?? '',
      userId: session.userId != null ? Number(session.userId) : undefined
    };
  }

  private parseUserId(userId: string | null): number | undefined {
    if (!userId) {
      return undefined;
    }

    const parsedUserId = Number.parseInt(userId, 10);
    return Number.isNaN(parsedUserId) ? undefined : parsedUserId;
  }
}
