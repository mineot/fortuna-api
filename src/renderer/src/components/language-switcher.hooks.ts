import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { changeLanguage } from '../i18n';
import type { AppLanguage } from '../i18n/types';

type Activation = {
  portuguese: string;
  english: string;
};

export function useLanguageSwitcher() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<string>(i18n.language);

  useEffect(() => {
    void changeLanguage(language as AppLanguage);
  }, [language]);

  const activation: Activation = useMemo(
    () => ({
      portuguese: language === 'pt-BR' ? 'flag active' : 'flag',
      english: language === 'en-US' ? 'flag active' : 'flag',
    }),
    [language],
  );

  return { setLanguage, activation };
}
