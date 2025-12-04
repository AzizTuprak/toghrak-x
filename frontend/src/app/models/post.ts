export interface PostResponse {
  id: number;
  title: string;
  content: string;
  coverImage?: string | null;
  categoryName: string;
  authorUsername: string;
  createdAt: string;
  updatedAt?: string | null;
  imageUrls: string[];
}

// request payloads expected by backend DTOs
export interface CreatePostRequest {
  title: string;
  content: string;
  categoryId: number;
  coverImage?: string | null;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  categoryId?: number;
}
