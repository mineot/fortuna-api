import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private static readonly ACCESS_TOKEN_KEY = 'fortuna.access_token';
  private accessToken: string | null = null;

  setAccessToken(token: string): void {
    this.accessToken = token.trim();
    sessionStorage.setItem(AuthSessionService.ACCESS_TOKEN_KEY, this.accessToken);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clear(): void {
    this.accessToken = null;
    sessionStorage.removeItem(AuthSessionService.ACCESS_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }

  initializeFromStorage(): void {
    const savedToken = sessionStorage.getItem(AuthSessionService.ACCESS_TOKEN_KEY);

    if (!savedToken) {
      return;
    }

    this.accessToken = savedToken;
  }
}
