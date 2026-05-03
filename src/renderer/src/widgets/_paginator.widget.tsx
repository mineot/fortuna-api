import { type PaginatorProps } from './_paginator.types';
import { useTranslation } from 'react-i18next';

function Paginator(props: PaginatorProps) {
  const { t } = useTranslation();
  const WINDOW_SIZE = 5;
  const safeTotalPages = Math.max(props.totalPages, 1);
  const safePage = Math.min(Math.max(props.page, 1), safeTotalPages);
  const visibleSize = Math.min(WINDOW_SIZE, safeTotalPages);
  const middleOffset = Math.floor(visibleSize / 2);
  const canGoPrev = safePage > 1;
  const canGoNext = safePage < safeTotalPages;

  let startPage = Math.max(1, safePage - middleOffset);
  const maxStart = Math.max(1, safeTotalPages - visibleSize + 1);
  startPage = Math.min(startPage, maxStart);
  const pages = Array.from({ length: visibleSize }, (_, index) => startPage + index);

  const changePage = (page: number): void => {
    const nextPage = Math.min(Math.max(page, 1), safeTotalPages);
    if (nextPage === safePage) return;
    props.onPageChange(nextPage);
  };

  return (
    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
      <ul className="pagination pagination-sm m-0">
        <li className={`page-item ${!canGoPrev ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => changePage(1)} disabled={!canGoPrev}>
            {'<<'}
          </button>
        </li>
        <li className={`page-item ${!canGoPrev ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => changePage(safePage - 1)} disabled={!canGoPrev}>
            {'<'}
          </button>
        </li>
        {pages.map((pageNumber) => (
          <li className={`page-item ${pageNumber === safePage ? 'active' : ''}`} key={pageNumber}>
            <button className="page-link" onClick={() => changePage(pageNumber)} disabled={pageNumber === safePage}>
              {pageNumber}
            </button>
          </li>
        ))}
        <li className={`page-item ${!canGoNext ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => changePage(safePage + 1)} disabled={!canGoNext}>
            {'>'}
          </button>
        </li>
        <li className={`page-item ${!canGoNext ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => changePage(safeTotalPages)} disabled={!canGoNext}>
            {'>>'}
          </button>
        </li>
      </ul>
      <div className="small text-muted d-flex align-items-center gap-3 flex-wrap">
        <span>
          {props.startItem}-{props.endItem} / {props.total}
        </span>
        <span>
          {safePage}/{safeTotalPages}
        </span>
        <span>{t('common.perPage', { count: props.pageSize, defaultValue: '{{count}} por página' })}</span>
      </div>
    </div>
  );
}

export { Paginator, type PaginatorProps };
