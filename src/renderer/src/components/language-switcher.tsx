import { useLanguageSwitcher } from './language-switcher.hooks';

export function LanguageSwitcher() {
  const { setLanguage, activation } = useLanguageSwitcher();

  return (
    <div className="language-switcher">
      <div className={activation.english} onClick={() => setLanguage('en-US')}>
        <span>🇺🇸</span>
      </div>
      <div className={activation.portuguese} onClick={() => setLanguage('pt-BR')}>
        <span>🇧🇷</span>
      </div>
    </div>
  );
}
