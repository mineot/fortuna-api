import { type PaginatorProps, WINDOW_SIZE } from './_paginator.types';

export function usePaginator(props: PaginatorProps) {
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

  return {
    canGoNext,
    canGoPrev,
    changePage,
    pages,
    safePage,
    safeTotalPages,
  };
}
