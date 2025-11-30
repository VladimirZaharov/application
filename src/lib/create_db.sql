CREATE TABLE IF NOT EXISTS projects
(
    id
    INTEGER
    PRIMARY
    KEY
    AUTOINCREMENT,
    company_name
    TEXT,
    client_name
    TEXT,
    project_name
    TEXT,
    audit_goal
    TEXT,
    traffic_analysis
    TEXT,
    grow_points
    TEXT,
    logo_url
    TEXT,
    background_url
    TEXT,
    color
    TEXT,
    created_at
    DATETIME
    DEFAULT
    CURRENT_TIMESTAMP,
    updated_at
    DATETIME
    DEFAULT
    CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS problem
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    name TEXT,
    content TEXT,
    screenshot_html TEXT,
    is_selected BOOLEAN
);