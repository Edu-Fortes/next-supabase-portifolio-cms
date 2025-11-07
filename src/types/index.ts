export type PortfolioProject = {
  id: number;
  title: string;
  description: string;
};

export type BlogPost = {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  body: string;
  is_draft: boolean;
};
