export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  created_at: number;
  author: string;
  disclosure: string;
}

export interface ArticleDetail extends Article {
  content: string;
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
