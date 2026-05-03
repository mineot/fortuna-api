import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';

import { usePaginator } from './_paginator.hook';
import { Paginator } from './_paginator.widget';

describe('usePaginator hook', () => {
  const baseProps = {
    page: 1,
    pageSize: 10,
    total: 100,
    totalPages: 10,
    hasNextPage: true,
    hasPrevPage: false,
    startItem: 1,
    endItem: 10,
    onPageChange: () => {},
  };

  it('clamps invalid page and totalPages values', () => {
    const model = usePaginator({ ...baseProps, page: -3, totalPages: 0 });

    assert.equal(model.safeTotalPages, 1);
    assert.equal(model.safePage, 1);
    assert.deepEqual(model.pages, [1]);
    assert.equal(model.canGoPrev, false);
    assert.equal(model.canGoNext, false);
  });

  it('creates centered page window when possible', () => {
    const model = usePaginator({ ...baseProps, page: 5, totalPages: 10 });

    assert.deepEqual(model.pages, [3, 4, 5, 6, 7]);
  });

  it('adjusts window to start when current page is near beginning', () => {
    const model = usePaginator({ ...baseProps, page: 1, totalPages: 10 });

    assert.deepEqual(model.pages, [1, 2, 3, 4, 5]);
  });

  it('adjusts window to end when current page is near ending', () => {
    const model = usePaginator({ ...baseProps, page: 10, totalPages: 10 });

    assert.deepEqual(model.pages, [6, 7, 8, 9, 10]);
  });

  it('calls onPageChange with clamped value when target page differs', () => {
    let nextPage = 0;
    const model = usePaginator({
      ...baseProps,
      page: 4,
      totalPages: 10,
      onPageChange: (page) => {
        nextPage = page;
      },
    });

    model.changePage(99);

    assert.equal(nextPage, 10);
  });

  it('does not call onPageChange when target page equals current page after clamp', () => {
    let calls = 0;
    const model = usePaginator({
      ...baseProps,
      page: 1,
      totalPages: 10,
      onPageChange: () => {
        calls += 1;
      },
    });

    model.changePage(0);

    assert.equal(calls, 0);
  });
});

describe('Paginator widget', () => {
  const makeProps = (overrides: Partial<React.ComponentProps<typeof Paginator>> = {}) => ({
    page: 1,
    pageSize: 10,
    total: 42,
    totalPages: 5,
    hasNextPage: true,
    hasPrevPage: false,
    startItem: 1,
    endItem: 10,
    onPageChange: () => {},
    ...overrides,
  });

  it('renders page controls and current range summary', () => {
    const html = renderToStaticMarkup(<Paginator {...makeProps()} />);

    assert.match(html, />&lt;&lt;</);
    assert.match(html, />&lt;</);
    assert.match(html, />&gt;</);
    assert.match(html, />&gt;&gt;</);
    assert.match(html, />1-10 \/ 42</);
    assert.match(html, />1\/5</);
  });

  it('marks current page item as active and its button as disabled', () => {
    const html = renderToStaticMarkup(<Paginator {...makeProps({ page: 3, totalPages: 7 })} />);

    assert.match(html, /page-item active/);
    assert.match(html, /<button[^>]*disabled=""/);
  });

  it('disables previous controls on first page', () => {
    const html = renderToStaticMarkup(<Paginator {...makeProps({ page: 1, totalPages: 7 })} />);

    assert.match(html, /page-item disabled/);
  });

  it('disables next controls on last page', () => {
    const html = renderToStaticMarkup(<Paginator {...makeProps({ page: 7, totalPages: 7 })} />);

    assert.match(html, /page-item disabled/);
    assert.match(html, />7\/7</);
  });
});
