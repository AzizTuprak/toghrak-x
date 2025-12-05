export interface ContentPage {
  slug: string;
  title: string;
  content: string;
  updatedAt?: string;
}

export interface UpsertContentPageRequest {
  slug: string;
  title: string;
  content: string;
}
