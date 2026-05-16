import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private accessToken: string | null = null;

  setAccessToken(token: string): void {
    this.accessToken = token.trim();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clear(): void {
    this.accessToken = null;
  }

  isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }
}
