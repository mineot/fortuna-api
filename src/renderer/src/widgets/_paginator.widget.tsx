import { type PaginatorProps } from './_paginator.types';

function Paginator(props: PaginatorProps) {
  const WINDOW_SIZE = 5;
  const safeTotalPages = Math.max(props.totalPages, 1);
  const safePage = Math.min(Math.max(props.page, 1), safeTotalPages);
  const visibleSize = Math.min(WINDOW_SIZE, safeTotalPages);
  const middleOffset = Math.floor(visibleSize / 2);

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
        <li className={`page-item ${!props.hasPrevPage ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => changePage(1)} disabled={!props.hasPrevPage}>
            {'<<'}
          </button>
        </li>
        <li className={`page-item ${!props.hasPrevPage ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => changePage(safePage - 1)} disabled={!props.hasPrevPage}>
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
        <li className={`page-item ${!props.hasNextPage ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => changePage(safePage + 1)} disabled={!props.hasNextPage}>
            {'>'}
          </button>
        </li>
        <li className={`page-item ${!props.hasNextPage ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => changePage(safeTotalPages)} disabled={!props.hasNextPage}>
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
        <span>{props.pageSize} por página</span>
      </div>
    </div>
  );
}

export { Paginator, type PaginatorProps };
