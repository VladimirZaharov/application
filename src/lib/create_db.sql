CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT,
      client_name TEXT,
      project_name TEXT,
      technical_optimization_id INTEGER,
      search_optimization_id INTEGER,
      usability_optimization_id INTEGER,
      content_id INTEGER,
      regional_promotion_id INTEGER,
      chosed_problem_id INTEGER,
      grow_points TEXT,
      style_and_tone TEXT,
      set_tone_ai TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS technical_optimization (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slow_loading BLOB,
    redirect_chains BLOB,
    redirect_loops BLOB,
    response_3xx BLOB,
    response_4xx BLOB,
    broken_links BLOB,
    no_https BLOB,
    http_https_mixed BLOB,
    html_errors BLOB
);

CREATE TABLE IF NOT EXISTS search_optimization (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    low_social_engagement BLOB,
    title_tag_not_optimized BLOB,
    description_tag_not_optimized BLOB,
    weak_internal_linking BLOB,
    duplicate_meta_tags BLOB,
    no_html_sitemap BLOB,
    no_microdata BLOB,
    robots_txt_incorrect BLOB,
    sitemap_incomplete BLOB,
    hidden_headings BLOB,
    sitemap_missing BLOB,
    sitemap_no_lastmod BLOB,
    sitemap_rare_updates BLOB,
    no_breadcrumbs BLOB,
    product_filter_not_optimized BLOB,
    product_filter_simplified BLOB,
    no_prices_landing BLOB,
    no_product_description BLOB,
    missing_product_specs BLOB,
    empty_categories BLOB,
    important_pages_not_in_menu BLOB,
    no_category_structure BLOB,
    no_catalog_page BLOB,
    no_text_blocks BLOB,
    text_overoptimization BLOB,
    non_unique_text BLOB,
    missing_text_pages BLOB,
    duplicate_text BLOB,
    non_unique_content BLOB,
    product_names_not_optimized BLOB,
    image_alt_title_not_optimized BLOB,
    urls_not_optimized BLOB,
    h2_missing_or_bad BLOB,
    h1_missing BLOB,
    multiple_h1 BLOB,
    heading_hierarchy_broken BLOB,
    h1_after_other_headings BLOB,
    h1_not_optimized BLOB
);

CREATE TABLE IF NOT EXISTS usability_optimization (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    responsive_errors BLOB,                    -- Адаптивная версия сайта функционирует с ошибками
    phone_not_clickable_mobile BLOB,           -- Номер телефона не кликабелен на мобильных устройствах
    not_mobile_adapted BLOB,                   -- Сайт не адаптирован под мобильные устройства
    cart_functionality_missing BLOB,           -- Функционал "Корзина" отсутствует на сайте
    cart_link_missing_header BLOB,             -- "Корзина" присутствует, но ссылка на нее отсутствует в шапке сайта
    cart_functionality_broken BLOB,            -- Функционал корзины работает некорректно
    buy_button_missing_catalog BLOB,           -- Кнопка «Купить» отсутствует в каталоге
    no_add_to_cart_feedback BLOB,              -- Отклик добавления товара в корзину отсутствует
    email_not_clickable_header BLOB,           -- Адрес электронной почты в шапке сайта не кликабельный
    product_filter_missing BLOB,               -- Фильтр подбора товаров по параметрам отсутствует
    site_search_missing BLOB,                  -- Отсутствует функционал поиска по сайту
    site_search_errors BLOB,                   -- Поиск по сайту функционирует с ошибками
    callback_function_missing BLOB,            -- Функция обратного звонка отсутствует
    contact_form_missing BLOB,                 -- Форма заявки на сайте отсутствует
    usability_elements_missing BLOB            -- В карточках товаров отсутствуют юзабилити-элементы
);

CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    few_pages_for_seo BLOB,                    -- На сайте мало страниц для продвижения
    missing_blocks BLOB,                       -- Присутствуют не все блоки
    insufficient_assortment BLOB,              -- На сайте недостаточно ассортимента (магазины)
    insufficient_landing_pages BLOB,           -- На сайте недостаточно посадочных страниц (услуги)
    duplicate_content_pages BLOB,              -- Страницы с идентичным содержанием
    incorrect_404_page BLOB,                   -- Страница 404 оформлена некорректно
    missing_product_photos BLOB,               -- В карточках товаров отсутствуют фотографии
    low_quality_photos BLOB                    -- Фото товаров низкого качества
);

CREATE TABLE IF NOT EXISTS regional_promotion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regional_subdomains_not_optimized BLOB,    -- Региональные поддомены не оптимизированы
    branch_subdomains_missing BLOB,            -- Отсутствуют поддомены для филиалов
    region_mismatch BLOB                       -- Регион присутствия отличается от желаемого региона продвижения
);

CREATE TABLE IF NOT EXISTS chosed_problem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    screenshot TEXT
);