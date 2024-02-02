interface PageItem {
  items_per_page: number;
  current_page: number;
  total_pages: number;
  total_items: string;
}

interface FormOption {
  target_id: string;
  value: string;
  type: string;
  access: string;
  is_content?: boolean;
}

interface LastRelease {
  target_id: string;
  value: string;
}

interface Row {
  nid: number;
  group_target_id: number;
  title_news: string;
  title_release: number;
  flagged: number;
  field_special_news: number;
  field_news_positive: number;
  creator_logo_img: string;
  creator_external_link: string;
  source_logo_img: string;
  source_external_link: string;
  source_external_link_override: string;
  field_news_content: string;
  release_date_range: string;
  field_publication_date: string;
  delta: number;
  field_multimedia_slider: string;
  youtube_video: string;
  vote: {
    user_vote: boolean;
    user_stars: null | number;
    vote_count: string;
    vote_average: number;
  };
}

export interface FetchResult {
  pager: PageItem;
  form_options: {
    groups: FormOption[];
    last_releases: LastRelease[];
  };
  rows: Row[];
}
