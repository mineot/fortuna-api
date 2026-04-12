import { useTranslation } from 'react-i18next';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <section className="page">
      <h2 className="page-title">{t('pages.home.title')}</h2>
      <p className="page-description">{t('pages.home.description')}</p>
    </section>
  );
}
