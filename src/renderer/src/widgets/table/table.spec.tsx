import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';

import { useTable } from './table.hook';
import { Table } from './table.widget';

describe('useTable hook', () => {
  const props: React.ComponentProps<typeof Table> = {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'amount', label: 'Amount', align: 'end', formatting: (value) => `R$ ${value}` },
    ],
    rows: [],
  };

  it('returns default alignment when align is undefined', () => {
    const model = useTable(props);
    assert.equal(model.getAlign(), 'text-start');
  });

  it('returns alignment by column key', () => {
    const model = useTable(props);
    assert.equal(model.findAlignByKey('amount'), 'text-end');
    assert.equal(model.findAlignByKey('unknown'), 'text-start');
  });

  it('returns custom formatting by key and default formatting for unknown key', () => {
    const model = useTable(props);
    assert.equal(model.findFormattingByKey('amount')(10), 'R$ 10');
    assert.equal(model.findFormattingByKey('unknown')(12), '12');
  });

  it('converts row data to details object', () => {
    const model = useTable(props);
    const details = model.rowToDetails([
      { key: 'name', value: 'Alice' },
      { key: 'amount', value: 99 },
    ]);

    assert.deepEqual(details, { name: 'Alice', amount: 99 });
  });
});

describe('Table widget', () => {
  const makeProps = (overrides: Partial<React.ComponentProps<typeof Table>> = {}) => ({
    id: 'transactions',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'amount', label: 'Amount', align: 'end', formatting: (value: string | number | Date) => `R$ ${value}` },
    ],
    rows: [
      {
        rowId: 'r1',
        data: [
          { key: 'name', value: 'Coffee' },
          { key: 'amount', value: 12 },
        ],
      },
    ],
    ...overrides,
  });

  it('renders table id, headers and formatted cells', () => {
    const html = renderToStaticMarkup(<Table {...makeProps()} />);

    assert.match(html, /<table[^>]*id="transactions"/);
    assert.match(html, />Name</);
    assert.match(html, />Amount</);
    assert.match(html, /class="text-end"/);
    assert.match(html, />R\$ 12</);
  });

  it('renders no records row when rows are empty', () => {
    const html = renderToStaticMarkup(<Table {...makeProps({ rows: [] })} />);

    assert.match(html, /common\.noRecords|No records found|Nenhum registro encontrado/);
  });

  it('renders actions column and action button when actions are provided', () => {
    const html = renderToStaticMarkup(
      <Table
        {...makeProps({
          actions: [
            {
              key: 'edit',
              variant: 'secondary',
              icon: 'pencil',
              onClick: () => {},
            },
          ],
        })}
      />,
    );

    assert.match(html, /bi bi-pencil/);
    assert.match(html, /btn-secondary/);
  });

  it('renders paginator when paginate is provided', () => {
    const html = renderToStaticMarkup(
      <Table
        {...makeProps({
          paginate: {
            page: 1,
            pageSize: 10,
            total: 20,
            totalPages: 2,
            hasNextPage: true,
            hasPrevPage: false,
            startItem: 1,
            endItem: 10,
            onPageChange: () => {},
          },
        })}
      />,
    );

    assert.match(html, /pagination pagination-sm/);
    assert.match(html, />1-10 \/ 20</);
  });
});
