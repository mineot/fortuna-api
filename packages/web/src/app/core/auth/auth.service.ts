import { Injectable } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';

import { ApiClientService } from '../http/api-client.service.js';
import type { AuthenticatedUser, LoginRequest, LoginResponse } from './auth.types.js';
import { AuthSessionService } from './auth-session.service.js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly apiClient: ApiClientService,
    private readonly session: AuthSessionService,
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.apiClient
      .post<LoginRequest, LoginResponse>('/auth/login', payload)
      .pipe(tap((response) => this.session.setAccessToken(response.access_token)));
  }

  me(): Observable<AuthenticatedUser> {
    return this.apiClient.get<AuthenticatedUser>('/auth/me');
  }

  refresh(): Observable<LoginResponse> {
    return this.apiClient
      .post<Record<string, never>, LoginResponse>('/auth/refresh', {})
      .pipe(tap((response) => this.session.setAccessToken(response.access_token)));
  }

  logout(): Observable<void> {
    return this.apiClient.post<Record<string, never>, void>('/auth/logout', {}).pipe(
      finalize(() => {
        this.session.clear();
      }),
    );
  }
}
