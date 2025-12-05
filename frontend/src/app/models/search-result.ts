export interface SearchResult {
  type: 'POST' | 'PAGE' | 'SOCIAL';
  title: string;
  url: string;
  snippet?: string;
}
