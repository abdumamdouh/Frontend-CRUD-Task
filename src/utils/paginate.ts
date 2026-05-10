export function paginate<TItem>(
  items: TItem[],
  currentPage: number,
  pageSize: number,
): TItem[] {
  const start = (currentPage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getPageCount(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}
