import { ApiService } from '@shared/api.service';
import { Injectable, computed, signal } from '@angular/core';
import { translations } from './index';
import type { Language, TranslationSchema } from './index';

const STORAGE_KEY = 'language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly defaultLanguage: Language = 'en';
  private readonly currentLanguage = signal<Language>(this.defaultLanguage);

  readonly language = computed(() => this.currentLanguage());

  readonly terms = computed<TranslationSchema>(() => {
    return translations[this.currentLanguage()];
  });

  constructor(private readonly api: ApiService) {}

  async init(): Promise<void> {
    const savedLanguage = this.getStoredLanguage();

    if (savedLanguage) {
      this.currentLanguage.set(savedLanguage);
      return;
    }

    const detectedLanguage = await this.detectSystemLanguage();

    this.currentLanguage.set(detectedLanguage);
    localStorage.setItem(STORAGE_KEY, detectedLanguage);
  }

  t(path: string): string {
    const value = this.getValueByPath(this.terms(), path);

    if (typeof value === 'string') {
      return value;
    }

    return path;
  }

  setLanguage(language: Language): void {
    this.currentLanguage.set(language);
    localStorage.setItem(STORAGE_KEY, language);
    window.location.reload();
  }

  getLanguage(): Language {
    return this.currentLanguage();
  }

  private getStoredLanguage(): Language | null {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === 'en' || stored === 'pt') {
      return stored;
    }

    return null;
  }

  private async detectSystemLanguage(): Promise<Language> {
    try {
      const systemLanguage = await this.api.getSystemLanguage();
      const preferredLanguages = systemLanguage ?? [this.defaultLanguage];

      for (const locale of preferredLanguages) {
        const normalized = this.normalizeLocale(locale);

        if (normalized) {
          return normalized;
        }
      }

      return this.defaultLanguage;
    } catch (err) {
      console.log(err);
      return this.defaultLanguage;
    }
  }

  private normalizeLocale(locale: string): Language | null {
    const normalized = locale.toLowerCase();

    if (normalized.startsWith('pt')) {
      return 'pt';
    }

    if (normalized.startsWith('en')) {
      return 'en';
    }

    return null;
  }

  private getValueByPath(source: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce<unknown>((current, key) => {
      if (typeof current === 'object' && current !== null && key in current) {
        return (current as Record<string, unknown>)[key];
      }

      return undefined;
    }, source);
  }
}
