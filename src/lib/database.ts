// lib/database.ts
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import {ProjectsList, ProjectData} from "@/lib/types"

// Инициализация базы данных
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'application.db'));

// Получение всех проектов (только основные поля)
export async function getAllProjects(): Promise<ProjectsList[]> {
  const stmt = db.prepare('SELECT id, project_name, updated_at FROM projects');
  return stmt.all();
}

export async function getProjectById(id: number): Promise<ProjectData | undefined> {
  // Получаем основную информацию о проекте
  const projectStmt = db.prepare('SELECT * FROM projects WHERE id = ?');
  const projectRow = projectStmt.get(id);

  if (!projectRow) return undefined;

  // Получаем проблемы проекта
  const problemsStmt = db.prepare('SELECT * FROM problem WHERE project_id = ?');
  const problemsRows = problemsStmt.all(id);

  // Преобразуем массив проблем в объект
  const problems: { [name: string]: { id: number; project_id: number; content: string; screenshot_html: string } } = {};

  problemsRows.forEach(problem => {
    problems[problem.name] = {
      id: problem.id,
      project_id: problem.project_id,
      content: problem.content,
      screenshot_html: problem.screenshot_html
    };
  });

  const projectData: ProjectData = {
    id: projectRow.id,
    company_name: projectRow.company_name,
    client_name: projectRow.client_name,
    project_name: projectRow.project_name,
    audit_goal: projectRow.audit_goal,
    traffic_analysis: projectRow.traffic_analysis,
    grow_points: projectRow.grow_points,
    logo_url: projectRow.logo_url,
    background_url: projectRow.background_url,
    color: projectRow.color,
    created_at: projectRow.created_at,
    updated_at: projectRow.updated_at,
    problems
  };

  return projectData;
}

export async function createProject(projectData: ProjectData): number {
  const transaction = db.transaction(() => {
    const technicalStmt = db.prepare(`
      INSERT INTO technical_optimization (
        slow_loading, redirect_chains, redirect_loops, response_3xx, 
        response_4xx, broken_links, no_https, http_https_mixed, html_errors
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const technicalResult = technicalStmt.run(
      projectData.technical_optimization?.slow_loading || null,
      projectData.technical_optimization?.redirect_chains || null,
      projectData.technical_optimization?.redirect_loops || null,
      projectData.technical_optimization?.response_3xx || null,
      projectData.technical_optimization?.response_4xx || null,
      projectData.technical_optimization?.broken_links || null,
      projectData.technical_optimization?.no_https || null,
      projectData.technical_optimization?.http_https_mixed || null,
      projectData.technical_optimization?.html_errors || null
    );

    const technicalOptimizationId = Number(technicalResult.lastInsertRowid);

    // 2. Создаем запись в search_optimization
    const searchStmt = db.prepare(`
      INSERT INTO search_optimization (
        low_social_engagement, title_tag_not_optimized, description_tag_not_optimized,
        weak_internal_linking, duplicate_meta_tags, no_html_sitemap, no_microdata,
        robots_txt_incorrect, sitemap_incomplete, hidden_headings, sitemap_missing,
        sitemap_no_lastmod, sitemap_rare_updates, no_breadcrumbs, product_filter_not_optimized,
        product_filter_simplified, no_prices_landing, no_product_description,
        missing_product_specs, empty_categories, important_pages_not_in_menu,
        no_category_structure, no_catalog_page, no_text_blocks, text_overoptimization,
        non_unique_text, missing_text_pages, duplicate_text, non_unique_content,
        product_names_not_optimized, image_alt_title_not_optimized, urls_not_optimized,
        h2_missing_or_bad, h1_missing, multiple_h1, heading_hierarchy_broken,
        h1_after_other_headings, h1_not_optimized
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const searchResult = searchStmt.run(
      projectData.search_optimization?.low_social_engagement || null,
      projectData.search_optimization?.title_tag_not_optimized || null,
      projectData.search_optimization?.description_tag_not_optimized || null,
      projectData.search_optimization?.weak_internal_linking || null,
      projectData.search_optimization?.duplicate_meta_tags || null,
      projectData.search_optimization?.no_html_sitemap || null,
      projectData.search_optimization?.no_microdata || null,
      projectData.search_optimization?.robots_txt_incorrect || null,
      projectData.search_optimization?.sitemap_incomplete || null,
      projectData.search_optimization?.hidden_headings || null,
      projectData.search_optimization?.sitemap_missing || null,
      projectData.search_optimization?.sitemap_no_lastmod || null,
      projectData.search_optimization?.sitemap_rare_updates || null,
      projectData.search_optimization?.no_breadcrumbs || null,
      projectData.search_optimization?.product_filter_not_optimized || null,
      projectData.search_optimization?.product_filter_simplified || null,
      projectData.search_optimization?.no_prices_landing || null,
      projectData.search_optimization?.no_product_description || null,
      projectData.search_optimization?.missing_product_specs || null,
      projectData.search_optimization?.empty_categories || null,
      projectData.search_optimization?.important_pages_not_in_menu || null,
      projectData.search_optimization?.no_category_structure || null,
      projectData.search_optimization?.no_catalog_page || null,
      projectData.search_optimization?.no_text_blocks || null,
      projectData.search_optimization?.text_overoptimization || null,
      projectData.search_optimization?.non_unique_text || null,
      projectData.search_optimization?.missing_text_pages || null,
      projectData.search_optimization?.duplicate_text || null,
      projectData.search_optimization?.non_unique_content || null,
      projectData.search_optimization?.product_names_not_optimized || null,
      projectData.search_optimization?.image_alt_title_not_optimized || null,
      projectData.search_optimization?.urls_not_optimized || null,
      projectData.search_optimization?.h2_missing_or_bad || null,
      projectData.search_optimization?.h1_missing || null,
      projectData.search_optimization?.multiple_h1 || null,
      projectData.search_optimization?.heading_hierarchy_broken || null,
      projectData.search_optimization?.h1_after_other_headings || null,
      projectData.search_optimization?.h1_not_optimized || null
    );

    const searchOptimizationId = Number(searchResult.lastInsertRowid);

    // 3. Создаем запись в usability_optimization
    const usabilityStmt = db.prepare(`
      INSERT INTO usability_optimization (
        responsive_errors, phone_not_clickable_mobile, not_mobile_adapted,
        cart_functionality_missing, cart_link_missing_header, cart_functionality_broken,
        buy_button_missing_catalog, no_add_to_cart_feedback, email_not_clickable_header,
        product_filter_missing, site_search_missing, site_search_errors,
        callback_function_missing, contact_form_missing, usability_elements_missing
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const usabilityResult = usabilityStmt.run(
      projectData.usability_optimization?.responsive_errors || null,
      projectData.usability_optimization?.phone_not_clickable_mobile || null,
      projectData.usability_optimization?.not_mobile_adapted || null,
      projectData.usability_optimization?.cart_functionality_missing || null,
      projectData.usability_optimization?.cart_link_missing_header || null,
      projectData.usability_optimization?.cart_functionality_broken || null,
      projectData.usability_optimization?.buy_button_missing_catalog || null,
      projectData.usability_optimization?.no_add_to_cart_feedback || null,
      projectData.usability_optimization?.email_not_clickable_header || null,
      projectData.usability_optimization?.product_filter_missing || null,
      projectData.usability_optimization?.site_search_missing || null,
      projectData.usability_optimization?.site_search_errors || null,
      projectData.usability_optimization?.callback_function_missing || null,
      projectData.usability_optimization?.contact_form_missing || null,
      projectData.usability_optimization?.usability_elements_missing || null
    );

    const usabilityOptimizationId = Number(usabilityResult.lastInsertRowid);

    // 4. Создаем запись в content
    const contentStmt = db.prepare(`
      INSERT INTO content (
        few_pages_for_seo, missing_blocks, insufficient_assortment,
        insufficient_landing_pages, duplicate_content_pages, incorrect_404_page,
        missing_product_photos, low_quality_photos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const contentResult = contentStmt.run(
      projectData.content?.few_pages_for_seo || null,
      projectData.content?.missing_blocks || null,
      projectData.content?.insufficient_assortment || null,
      projectData.content?.insufficient_landing_pages || null,
      projectData.content?.duplicate_content_pages || null,
      projectData.content?.incorrect_404_page || null,
      projectData.content?.missing_product_photos || null,
      projectData.content?.low_quality_photos || null
    );

    const contentId = Number(contentResult.lastInsertRowid);

    // 5. Создаем запись в regional_promotion
    const regionalStmt = db.prepare(`
      INSERT INTO regional_promotion (
        regional_subdomains_not_optimized, branch_subdomains_missing, region_mismatch
      ) VALUES (?, ?, ?)
    `);

    const regionalResult = regionalStmt.run(
      projectData.regional_promotion?.regional_subdomains_not_optimized || null,
      projectData.regional_promotion?.branch_subdomains_missing || null,
      projectData.regional_promotion?.region_mismatch || null
    );

    const regionalPromotionId = Number(regionalResult.lastInsertRowid);

    // 6. Создаем запись в chosed_problem
    const chosedProblemStmt = db.prepare(`
      INSERT INTO chosed_problem (content, screenshot) VALUES (?, ?)
    `);

    const chosedProblemResult = chosedProblemStmt.run(
      projectData.chosed_problem?.content || null,
      projectData.chosed_problem?.screenshot || null
    );

    const chosedProblemId = Number(chosedProblemResult.lastInsertRowid);

    // 7. Создаем основную запись в projects со всеми полученными ID
    const projectStmt = db.prepare(`
      INSERT INTO projects (
        company_name, 
        client_name, 
        project_name, 
        technical_optimization_id,
        search_optimization_id,
        usability_optimization_id,
        content_id,
        regional_promotion_id,
        chosed_problem_id,
        grow_points,
        style_and_tone,
        set_tone_ai
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const projectResult = projectStmt.run(
      projectData.company_name,
      projectData.client_name,
      projectData.project_name,
      technicalOptimizationId,
      searchOptimizationId,
      usabilityOptimizationId,
      contentId,
      regionalPromotionId,
      chosedProblemId,
      projectData.grow_points || null,
      projectData.style_and_tone || null,
      projectData.set_tone_ai || null
    );

    return Number(projectResult.lastInsertRowid);
  });

  // Выполняем транзакцию и возвращаем ID созданного проекта
  return transaction();
}

// Обновление проекта
export function updateProject(projectId: number, projectData: ProjectData): boolean {
  const transaction = db.transaction(() => {
    // 1. Получаем текущие ID связанных записей
    const currentProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId) as any;
    if (!currentProject) {
      throw new Error('Project not found');
    }

    // 2. Обновляем technical_optimization
    if (projectData.technical_optimization) {
      const technicalStmt = db.prepare(`
        UPDATE technical_optimization SET
          slow_loading = ?, redirect_chains = ?, redirect_loops = ?, response_3xx = ?, 
          response_4xx = ?, broken_links = ?, no_https = ?, http_https_mixed = ?, html_errors = ?
        WHERE id = ?
      `);

      technicalStmt.run(
        projectData.technical_optimization.slow_loading ?? null,
        projectData.technical_optimization.redirect_chains ?? null,
        projectData.technical_optimization.redirect_loops ?? null,
        projectData.technical_optimization.response_3xx ?? null,
        projectData.technical_optimization.response_4xx ?? null,
        projectData.technical_optimization.broken_links ?? null,
        projectData.technical_optimization.no_https ?? null,
        projectData.technical_optimization.http_https_mixed ?? null,
        projectData.technical_optimization.html_errors ?? null,
        currentProject.technical_optimization_id
      );
    }

    // 3. Обновляем search_optimization
    if (projectData.search_optimization) {
      const searchStmt = db.prepare(`
        UPDATE search_optimization SET
          low_social_engagement = ?, title_tag_not_optimized = ?, description_tag_not_optimized = ?,
          weak_internal_linking = ?, duplicate_meta_tags = ?, no_html_sitemap = ?, no_microdata = ?,
          robots_txt_incorrect = ?, sitemap_incomplete = ?, hidden_headings = ?, sitemap_missing = ?,
          sitemap_no_lastmod = ?, sitemap_rare_updates = ?, no_breadcrumbs = ?, product_filter_not_optimized = ?,
          product_filter_simplified = ?, no_prices_landing = ?, no_product_description = ?,
          missing_product_specs = ?, empty_categories = ?, important_pages_not_in_menu = ?,
          no_category_structure = ?, no_catalog_page = ?, no_text_blocks = ?, text_overoptimization = ?,
          non_unique_text = ?, missing_text_pages = ?, duplicate_text = ?, non_unique_content = ?,
          product_names_not_optimized = ?, image_alt_title_not_optimized = ?, urls_not_optimized = ?,
          h2_missing_or_bad = ?, h1_missing = ?, multiple_h1 = ?, heading_hierarchy_broken = ?,
          h1_after_other_headings = ?, h1_not_optimized = ?
        WHERE id = ?
      `);

      searchStmt.run(
        projectData.search_optimization.low_social_engagement ?? null,
        projectData.search_optimization.title_tag_not_optimized ?? null,
        projectData.search_optimization.description_tag_not_optimized ?? null,
        projectData.search_optimization.weak_internal_linking ?? null,
        projectData.search_optimization.duplicate_meta_tags ?? null,
        projectData.search_optimization.no_html_sitemap ?? null,
        projectData.search_optimization.no_microdata ?? null,
        projectData.search_optimization.robots_txt_incorrect ?? null,
        projectData.search_optimization.sitemap_incomplete ?? null,
        projectData.search_optimization.hidden_headings ?? null,
        projectData.search_optimization.sitemap_missing ?? null,
        projectData.search_optimization.sitemap_no_lastmod ?? null,
        projectData.search_optimization.sitemap_rare_updates ?? null,
        projectData.search_optimization.no_breadcrumbs ?? null,
        projectData.search_optimization.product_filter_not_optimized ?? null,
        projectData.search_optimization.product_filter_simplified ?? null,
        projectData.search_optimization.no_prices_landing ?? null,
        projectData.search_optimization.no_product_description ?? null,
        projectData.search_optimization.missing_product_specs ?? null,
        projectData.search_optimization.empty_categories ?? null,
        projectData.search_optimization.important_pages_not_in_menu ?? null,
        projectData.search_optimization.no_category_structure ?? null,
        projectData.search_optimization.no_catalog_page ?? null,
        projectData.search_optimization.no_text_blocks ?? null,
        projectData.search_optimization.text_overoptimization ?? null,
        projectData.search_optimization.non_unique_text ?? null,
        projectData.search_optimization.missing_text_pages ?? null,
        projectData.search_optimization.duplicate_text ?? null,
        projectData.search_optimization.non_unique_content ?? null,
        projectData.search_optimization.product_names_not_optimized ?? null,
        projectData.search_optimization.image_alt_title_not_optimized ?? null,
        projectData.search_optimization.urls_not_optimized ?? null,
        projectData.search_optimization.h2_missing_or_bad ?? null,
        projectData.search_optimization.h1_missing ?? null,
        projectData.search_optimization.multiple_h1 ?? null,
        projectData.search_optimization.heading_hierarchy_broken ?? null,
        projectData.search_optimization.h1_after_other_headings ?? null,
        projectData.search_optimization.h1_not_optimized ?? null,
        currentProject.search_optimization_id
      );
    }

    // 4. Обновляем usability_optimization
    if (projectData.usability_optimization) {
      const usabilityStmt = db.prepare(`
        UPDATE usability_optimization SET
          responsive_errors = ?, phone_not_clickable_mobile = ?, not_mobile_adapted = ?,
          cart_functionality_missing = ?, cart_link_missing_header = ?, cart_functionality_broken = ?,
          buy_button_missing_catalog = ?, no_add_to_cart_feedback = ?, email_not_clickable_header = ?,
          product_filter_missing = ?, site_search_missing = ?, site_search_errors = ?,
          callback_function_missing = ?, contact_form_missing = ?, usability_elements_missing = ?
        WHERE id = ?
      `);

      usabilityStmt.run(
        projectData.usability_optimization.responsive_errors ?? null,
        projectData.usability_optimization.phone_not_clickable_mobile ?? null,
        projectData.usability_optimization.not_mobile_adapted ?? null,
        projectData.usability_optimization.cart_functionality_missing ?? null,
        projectData.usability_optimization.cart_link_missing_header ?? null,
        projectData.usability_optimization.cart_functionality_broken ?? null,
        projectData.usability_optimization.buy_button_missing_catalog ?? null,
        projectData.usability_optimization.no_add_to_cart_feedback ?? null,
        projectData.usability_optimization.email_not_clickable_header ?? null,
        projectData.usability_optimization.product_filter_missing ?? null,
        projectData.usability_optimization.site_search_missing ?? null,
        projectData.usability_optimization.site_search_errors ?? null,
        projectData.usability_optimization.callback_function_missing ?? null,
        projectData.usability_optimization.contact_form_missing ?? null,
        projectData.usability_optimization.usability_elements_missing ?? null,
        currentProject.usability_optimization_id
      );
    }

    // 5. Обновляем content
    if (projectData.content) {
      const contentStmt = db.prepare(`
        UPDATE content SET
          few_pages_for_seo = ?, missing_blocks = ?, insufficient_assortment = ?,
          insufficient_landing_pages = ?, duplicate_content_pages = ?, incorrect_404_page = ?,
          missing_product_photos = ?, low_quality_photos = ?
        WHERE id = ?
      `);

      contentStmt.run(
        projectData.content.few_pages_for_seo ?? null,
        projectData.content.missing_blocks ?? null,
        projectData.content.insufficient_assortment ?? null,
        projectData.content.insufficient_landing_pages ?? null,
        projectData.content.duplicate_content_pages ?? null,
        projectData.content.incorrect_404_page ?? null,
        projectData.content.missing_product_photos ?? null,
        projectData.content.low_quality_photos ?? null,
        currentProject.content_id
      );
    }

    // 6. Обновляем regional_promotion
    if (projectData.regional_promotion) {
      const regionalStmt = db.prepare(`
        UPDATE regional_promotion SET
          regional_subdomains_not_optimized = ?, branch_subdomains_missing = ?, region_mismatch = ?
        WHERE id = ?
      `);

      regionalStmt.run(
        projectData.regional_promotion.regional_subdomains_not_optimized ?? null,
        projectData.regional_promotion.branch_subdomains_missing ?? null,
        projectData.regional_promotion.region_mismatch ?? null,
        currentProject.regional_promotion_id
      );
    }

    // 7. Обновляем chosed_problem
    if (projectData.chosed_problem) {
      const chosedProblemStmt = db.prepare(`
        UPDATE chosed_problem SET content = ?, screenshot = ? WHERE id = ?
      `);

      chosedProblemStmt.run(
        projectData.chosed_problem.content ?? null,
        projectData.chosed_problem.screenshot ?? null,
        currentProject.chosed_problem_id
      );
    }

    // 8. Обновляем основную запись projects
    const projectStmt = db.prepare(`
      UPDATE projects SET
        company_name = ?, 
        client_name = ?, 
        project_name = ?,
        grow_points = ?,
        style_and_tone = ?,
        set_tone_ai = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = projectStmt.run(
      projectData.company_name,
      projectData.client_name,
      projectData.project_name,
      projectData.grow_points ?? null,
      projectData.style_and_tone ?? null,
      projectData.set_tone_ai ?? null,
      projectId
    );

    return result.changes > 0;
  });

  return transaction();
}