import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Types } from '@db/schema';

import { listTypes } from '../services/types.service';

export function TypesPage() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Types[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    void listTypes()
      .then((types) => {
        if (!mounted) {
          return;
        }
        setRows(types);
      })
      .catch((err: unknown) => {
        if (!mounted) {
          return;
        }
        setError(err instanceof Error ? err.message : t('pages.types.errors.load'));
      });

    return () => {
      mounted = false;
    };
  }, [t]);

  return (
    <section className="page">
      <h2 className="page-title">{t('pages.types.title')}</h2>
      {error ? <p className="error">{error}</p> : null}
      <table className="data-table">
        <thead className="data-table-head">
          <tr>
            <th>{t('pages.types.headers.id')}</th>
            <th>{t('pages.types.headers.group')}</th>
            <th>{t('pages.types.headers.value')}</th>
          </tr>
        </thead>
        <tbody className="data-table-body">
          {rows.length === 0 ? (
            <tr>
              <td className="data-table-empty" colSpan={3}>
                {t('pages.types.empty')}
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.group}</td>
                <td>{item.value}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
