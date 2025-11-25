import type {Dispatch, SetStateAction} from "react";

export interface Problem {
  id: string;
  title: string;
  category: string;
  content: string;
}

export interface Branding {
  logoUrl: string;
  accentColor: string;
  companyName: string;
  backgroundUrl: string;
}

export interface Proposal {
  clientName: string;
  projectName: string;
  fullText: string;
}

export interface ProjectsList {
  id: number;
  project_name: string;
  updated_at: string;
}

export interface ProjectData {
  company_name: string;
  client_name: string;
  project_name: string;
  grow_points?: string;
  style_and_tone?: string;
  set_tone_ai?: string;

  technical_optimization?: {
    slow_loading?: Blob | null;
    redirect_chains?: Blob | null;
    redirect_loops?: Blob | null;
    response_3xx?: Blob | null;
    response_4xx?: Blob | null;
    broken_links?: Blob | null;
    no_https?: Blob | null;
    http_https_mixed?: Blob | null;
    html_errors?: Blob | null;
  };

  search_optimization?: {
    low_social_engagement?: Blob | null;
    title_tag_not_optimized?: Blob | null;
    description_tag_not_optimized?: Blob | null;
    weak_internal_linking?: Blob | null;
    duplicate_meta_tags?: Blob | null;
    no_html_sitemap?: Blob | null;
    no_microdata?: Blob | null;
    robots_txt_incorrect?: Blob | null;
    sitemap_incomplete?: Blob | null;
    hidden_headings?: Blob | null;
    sitemap_missing?: Blob | null;
    sitemap_no_lastmod?: Blob | null;
    sitemap_rare_updates?: Blob | null;
    no_breadcrumbs?: Blob | null;
    product_filter_not_optimized?: Blob | null;
    product_filter_simplified?: Blob | null;
    no_prices_landing?: Blob | null;
    no_product_description?: Blob | null;
    missing_product_specs?: Blob | null;
    empty_categories?: Blob | null;
    important_pages_not_in_menu?: Blob | null;
    no_category_structure?: Blob | null;
    no_catalog_page?: Blob | null;
    no_text_blocks?: Blob | null;
    text_overoptimization?: Blob | null;
    non_unique_text?: Blob | null;
    missing_text_pages?: Blob | null;
    duplicate_text?: Blob | null;
    non_unique_content?: Blob | null;
    product_names_not_optimized?: Blob | null;
    image_alt_title_not_optimized?: Blob | null;
    urls_not_optimized?: Blob | null;
    h2_missing_or_bad?: Blob | null;
    h1_missing?: Blob | null;
    multiple_h1?: Blob | null;
    heading_hierarchy_broken?: Blob | null;
    h1_after_other_headings?: Blob | null;
    h1_not_optimized?: Blob | null;
  };

  usability_optimization?: {
    responsive_errors?: Blob | null;
    phone_not_clickable_mobile?: Blob | null;
    not_mobile_adapted?: Blob | null;
    cart_functionality_missing?: Blob | null;
    cart_link_missing_header?: Blob | null;
    cart_functionality_broken?: Blob | null;
    buy_button_missing_catalog?: Blob | null;
    no_add_to_cart_feedback?: Blob | null;
    email_not_clickable_header?: Blob | null;
    product_filter_missing?: Blob | null;
    site_search_missing?: Blob | null;
    site_search_errors?: Blob | null;
    callback_function_missing?: Blob | null;
    contact_form_missing?: Blob | null;
    usability_elements_missing?: Blob | null;
  };

  content?: {
    few_pages_for_seo?: Blob | null;
    missing_blocks?: Blob | null;
    insufficient_assortment?: Blob | null;
    insufficient_landing_pages?: Blob | null;
    duplicate_content_pages?: Blob | null;
    incorrect_404_page?: Blob | null;
    missing_product_photos?: Blob | null;
    low_quality_photos?: Blob | null;
  };

  regional_promotion?: {
    regional_subdomains_not_optimized?: Blob | null;
    branch_subdomains_missing?: Blob | null;
    region_mismatch?: Blob | null;
  };

  chosed_problem?: {
    content?: string | null;
    screenshot?: string | null;
  };
}
export interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export interface EditorSidebarProps {
  projectData: ProjectData,
  proposal: Proposal;
  setProposal: Dispatch<SetStateAction<Proposal>>;
  branding: Branding;
  setBranding: Dispatch<SetStateAction<Branding>>;
  adjustTone: (tone: string) => Promise<void>;
  isAdjustingTone: boolean;
}
