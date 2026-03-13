export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  created_at: number;
  updated_at: number | null;
  author: string;
  disclosure: string;
  draft: boolean;
  column_id: number | null;
}

export interface ArticleDetail extends Article {
  content: string;
}

export interface ArticleSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  created_at: number;
  author: string;
}

export interface Column {
  id: number;
  name: string;
  description: string | null;
  cover_image: string | null;
  article_ids: string;
  articles: ArticleSummary[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  tags: string[];
  link: string;
  link_demo: string | null;
}

export interface SocialLink {
  id: number;
  name: string;
  description: string;
  avatar: string;
  link: string;
}
