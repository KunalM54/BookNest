import { Injectable, signal } from '@angular/core';

export interface AuthUser {
  fullName: string;
  email: string;
  role: string;
  userId?: number;
  studentId?: string;
  sid?: string;
}

export interface AuthSession extends AuthUser {
  token: string;
  studentId?: string;
  sid?: string;
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
    const sharedStorage = this.sharedStorage;

    if (!normalizedSession.token) {
      this.logout();
      return;
    }

    this.sessionState.set(normalizedSession);
    storage?.setItem(this.sessionStorageKey, JSON.stringify(normalizedSession));
    sharedStorage?.setItem(this.sessionStorageKey, JSON.stringify(normalizedSession));
    this.clearLegacyAuthData();
  }

  getToken(): string | null {
    return this.ensureSession()?.token ?? null;
  }

  getUser(): AuthUser | null {
    const session = this.ensureSession();

    if (!session) {
      return null;
    }

    return {
      fullName: session.fullName,
      email: session.email,
      role: session.role,
      userId: session.userId,
      studentId: (session as any).studentId,
      sid: (session as any).sid
    };
  }

  getUserId(): number | null {
    return this.ensureSession()?.userId ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const session = this.ensureSession();
    if (!session) {
      return null;
    }

    if (session.role) {
      return session.role;
    }

    const tokenRole = this.extractRoleFromToken(session.token);
    if (!tokenRole) {
      return null;
    }

    const updatedSession = { ...session, role: tokenRole };
    this.sessionState.set(updatedSession);
    this.tabStorage?.setItem(this.sessionStorageKey, JSON.stringify(updatedSession));
    this.sharedStorage?.setItem(this.sessionStorageKey, JSON.stringify(updatedSession));
    return tokenRole;
  }

  isAdmin(): boolean {
    const role = (this.getUserRole() || '').toUpperCase();
    if (role === 'ADMIN') {
      return true;
    }
    const email = (this.ensureSession()?.email || '').toLowerCase();
    return email === 'admin@booknest.com';
  }

  isStudent(): boolean {
    return (this.getUserRole() || '').toUpperCase() === 'STUDENT';
  }

  logout(): void {
    this.sessionState.set(null);
    this.tabStorage?.removeItem(this.sessionStorageKey);
    this.sharedStorage?.removeItem(this.sessionStorageKey);
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
  }

  private normalizeSession(session: Partial<AuthSession>): AuthSession {
    return {
      token: session.token ?? '',
      fullName: session.fullName ?? '',
      email: session.email ?? '',
      role: session.role ?? '',
      userId: session.userId != null ? Number(session.userId) : undefined,
      studentId: session.studentId ?? (session as any).sid ?? '',
      sid: session.sid ?? (session as any).studentId ?? ''
    };
  }

  private parseUserId(userId: string | null): number | undefined {
    if (!userId) {
      return undefined;
    }

    const parsedUserId = Number.parseInt(userId, 10);
    return Number.isNaN(parsedUserId) ? undefined : parsedUserId;
  }

  private ensureSession(): AuthSession | null {
    const existing = this.sessionState();
    if (existing?.token) {
      return existing;
    }

    const restored = this.restoreSession();
    if (restored?.token) {
      this.sessionState.set(restored);
      return restored;
    }

    return null;
  }

  private extractRoleFromToken(token: string): string | null {
    if (!token) {
      return null;
    }

    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    try {
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '='));
      const data = JSON.parse(decoded);
      return typeof data.role === 'string' ? data.role : null;
    } catch {
      return null;
    }
  }
}
