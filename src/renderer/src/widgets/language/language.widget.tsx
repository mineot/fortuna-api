import { changeLanguage, type AppLanguage } from '@i18n';
import { useTranslation } from 'react-i18next';

export function Language() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as AppLanguage;

  const handleChangeLanguage = async (language: AppLanguage): Promise<void> => {
    if (currentLanguage === language) {
      return;
    }

    await changeLanguage(language);
  };

  const usClassName = currentLanguage === 'en-US' ? '' : 'img-gray';
  const brClassName = currentLanguage === 'pt-BR' ? '' : 'img-gray';

  return (
    <div className="d-flex gap-2">
      <button
        type="button"
        className={`btn p-0 border-0 bg-transparent ${usClassName}`}
        onClick={() => void handleChangeLanguage('en-US')}
      >
        🇺🇸
      </button>
      <button
        type="button"
        className={`btn p-0 border-0 bg-transparent ${brClassName}`}
        onClick={() => void handleChangeLanguage('pt-BR')}
      >
        🇧🇷
      </button>
    </div>
  );
}
