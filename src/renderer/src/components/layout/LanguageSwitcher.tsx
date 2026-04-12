import { useTranslation } from 'react-i18next';

import { changeLanguage } from '../../i18n';
import type { AppLanguage } from '../../i18n/types';

const LANGUAGES: AppLanguage[] = ['en-US', 'pt-BR'];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="language-switcher">
      <span className="language-switcher-label">{t('app.language.label')}</span>
      <div className="language-switcher-actions">
        {LANGUAGES.map((language) => (
          <button
            key={language}
            type="button"
            className={
              i18n.language === language
                ? 'language-switcher-button language-switcher-button-active'
                : 'language-switcher-button'
            }
            onClick={() => {
              void changeLanguage(language);
            }}
          >
            {language}
          </button>
        ))}
      </div>
    </div>
  );
}
