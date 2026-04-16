import { useTranslation } from 'react-i18next';
import { Page } from '../components/Page';
import { Table } from '../components/Table';
import { Formatter } from '../helpers/formatter.helper';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <Page title={t('pages.home.title')} description={t('pages.home.description')}>
      <Table
        headers={[
          {
            key: 'text-col',
            label: 'Texto',
          },
          {
            key: 'int-col',
            label: 'Inteiro',
          },
          {
            key: 'dec-col',
            label: 'Decimal',
          },
          {
            key: 'cur-col',
            label: 'Dinheiro',
          },
          {
            key: 'tm-col',
            label: 'Tempo',
          },
          {
            key: 'dt-col',
            label: 'Data',
          },

          {
            key: 'dtm-col',
            label: 'Data e Hora',
          },

          {
            key: 'bl-col',
            label: 'Booleano',
          },
        ]}
        rows={[
          [
            {
              key: 'text-col',
              value: 'Texto Simples',
              formater: (value) => Formatter.text(String(value), { suffix: '!', prefix: '@' }),
            },
            {
              key: 'int-col',
              value: 1234,
              formater: (value) => Formatter.int(Number(value)),
            },
            {
              key: 'dec-col',
              value: 1234.56,
              formater: (value) => Formatter.decimal(Number(value)),
            },
            {
              key: 'cur-col',
              value: 890.56,
              formater: (value) => Formatter.currency(Number(value)),
            },
            {
              key: 'tm-col',
              value: new Date(),
              formater: (value) => Formatter.time(value as Date),
            },
            {
              key: 'dt-col',
              value: new Date(),
              formater: (value) => Formatter.date(value as Date),
            },

            {
              key: 'dtm-col',
              value: new Date(),
              formater: (value) => Formatter.datetime(value as Date),
            },

            {
              key: 'bl-col',
              value: false,
              formater: (value) => Formatter.bool(value as boolean),
            },
          ],
        ]}
      />
    </Page>
  );
}
