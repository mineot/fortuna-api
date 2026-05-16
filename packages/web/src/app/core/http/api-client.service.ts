import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import { appEnv } from '../config/app-env.js';
import type { ApiClientError, ApiSuccessResponse } from './api.types.js';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly baseUrl = appEnv.apiBaseUrl.replace(/\/+$/, '');

  constructor(private readonly http: HttpClient) {}

  get<TResponse>(path: string, query?: Record<string, string | number | boolean>): Observable<TResponse> {
    const params = this.toHttpParams(query);
    const request$ = params
      ? this.http.get<ApiSuccessResponse<TResponse>>(this.toUrl(path), { params })
      : this.http.get<ApiSuccessResponse<TResponse>>(this.toUrl(path));

    return request$.pipe(map((response) => response.data), catchError((error) => this.handleError(error)));
  }

  post<TRequest, TResponse>(path: string, body: TRequest): Observable<TResponse> {
    return this.http
      .post<ApiSuccessResponse<TResponse>>(this.toUrl(path), body)
      .pipe(map((response) => response.data), catchError((error) => this.handleError(error)));
  }

  put<TRequest, TResponse>(path: string, body: TRequest): Observable<TResponse> {
    return this.http
      .put<ApiSuccessResponse<TResponse>>(this.toUrl(path), body)
      .pipe(map((response) => response.data), catchError((error) => this.handleError(error)));
  }

  patch<TRequest, TResponse>(path: string, body: TRequest): Observable<TResponse> {
    return this.http
      .patch<ApiSuccessResponse<TResponse>>(this.toUrl(path), body)
      .pipe(map((response) => response.data), catchError((error) => this.handleError(error)));
  }

  delete<TResponse>(path: string): Observable<TResponse> {
    return this.http
      .delete<ApiSuccessResponse<TResponse>>(this.toUrl(path))
      .pipe(map((response) => response.data), catchError((error) => this.handleError(error)));
  }

  private toUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${normalizedPath}`;
  }

  private toHttpParams(query?: Record<string, string | number | boolean>): HttpParams | undefined {
    if (!query) {
      return undefined;
    }

    let params = new HttpParams();

    for (const [key, value] of Object.entries(query)) {
      params = params.set(key, String(value));
    }

    return params;
  }

  private handleError(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      const payload = error.error as Partial<ApiClientError & { request_id: string }> | undefined;
      const requestId = payload?.requestId ?? payload?.request_id;

      return throwError(() => ({
        status: error.status,
        ...(requestId ? { requestId } : {}),
        code: payload?.code ?? 'HTTP_ERROR',
        message: payload?.message ?? 'Unexpected request error.',
        ...(payload?.fields ? { fields: payload.fields } : {}),
      } satisfies ApiClientError));
    }

    return throwError(() => ({
      status: 0,
      code: 'UNKNOWN_ERROR',
      message: 'Unexpected request error.',
    } satisfies ApiClientError));
  }
}
