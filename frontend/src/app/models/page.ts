export interface Page<T> {
  content: T[];
  number: number; // current page index (0-based)
  size: number; // size requested
  totalElements: number; // total items across all pages
  totalPages: number; // total pages
  last: boolean;
  first: boolean;
}
