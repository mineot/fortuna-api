import { usePaginator } from './_paginator.hook';
import { type PaginatorProps } from './_paginator.types';
import { useTranslation } from 'react-i18next';

function Paginator(props: PaginatorProps) {
  const { t } = useTranslation();
  const { canGoNext, canGoPrev, changePage, pages, safePage, safeTotalPages } = usePaginator(props);

  const makeButton = (label: string, disabled: boolean, pageNumber: number, ariaLabel?: string) => {
    return (
      <button
        className="page-link"
        onClick={() => changePage(pageNumber)}
        disabled={disabled}
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        <span>{label}</span>
      </button>
    );
  };

  const makeItem = (disabled: boolean, children: React.ReactNode) => {
    return <li className={`page-item ${disabled ? 'disabled' : ''}`}>{children}</li>;
  };

  return (
    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
      <ul className="pagination pagination-sm m-0">
        {makeItem(!canGoPrev, makeButton('<<', !canGoPrev, 1, t('common.firstPage')))}
        {makeItem(!canGoPrev, makeButton('<', !canGoPrev, safePage - 1, t('common.previousPage')))}
        {pages.map((pageNumber) => (
          <li className={`page-item ${pageNumber === safePage ? 'active' : ''}`} key={pageNumber}>
            {makeButton(pageNumber.toString(), pageNumber === safePage, pageNumber, t('common.pageX', { page: pageNumber }))}
          </li>
        ))}
        {makeItem(!canGoNext, makeButton('>', !canGoNext, safePage + 1, t('common.nextPage')))}
        {makeItem(!canGoNext, makeButton('>>', !canGoNext, safeTotalPages, t('common.lastPage')))}
      </ul>
      <div className="small text-muted d-flex align-items-center gap-3 flex-wrap">
        <span>
          {props.startItem}-{props.endItem} / {props.total}
        </span>
        <span>
          {safePage}/{safeTotalPages}
        </span>
        <span>{t('common.perPage', { count: props.pageSize })}</span>
      </div>
    </div>
  );
}

export { Paginator, type PaginatorProps };
