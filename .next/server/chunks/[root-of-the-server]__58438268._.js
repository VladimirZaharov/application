module.exports = [
"[project]/.next-internal/server/app/api/projects/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/better-sqlite3 [external] (better-sqlite3, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("better-sqlite3", () => require("better-sqlite3"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/src/lib/database.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createProject",
    ()=>createProject,
    "getAllProjects",
    ()=>getAllProjects,
    "getProjectById",
    ()=>getProjectById,
    "saveProject",
    ()=>saveProject
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/url [external] (url, cjs)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("src/lib/database.ts")}`;
    }
};
;
;
;
const __filename = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__["fileURLToPath"])(__TURBOPACK__import$2e$meta__.url);
const __dirname = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(__filename);
const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(__dirname, 'application.db'));
console.log(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(__dirname, 'application.db'));
async function getAllProjects() {
    const stmt = db.prepare('SELECT id, project_name, updated_at FROM projects');
    return stmt.all();
}
async function getProjectById(id) {
    // Получаем основную информацию о проекте
    const projectStmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    const projectRow = projectStmt.get(id);
    if (!projectRow) return undefined;
    // Получаем проблемы проекта
    const problemsStmt = db.prepare('SELECT * FROM problem WHERE project_id = ?');
    const problemsRows = problemsStmt.all(id);
    const problems = {};
    problemsRows.forEach((problem)=>{
        problems[problem.name] = {
            id: problem.id,
            project_id: problem.project_id,
            content: problem.content,
            screenshot_html: problem.screenshot_html,
            is_selected: problem.is_selected
        };
    });
    const projectData = {
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
        problems: problems
    };
    return projectData;
}
async function saveProblemsToDB(projectId, problems) {
    const query = `
    INSERT INTO problem (project_id, name, content, screenshot_html, is_selected)
    VALUES (?, ?, ?, ?, ?)
  `;
    try {
        for (const [problemName, problemData] of Object.entries(problems)){
            const values = [
                projectId,
                problemName,
                problemData.content || '',
                problemData.screenshot_html || '',
                problemData.is_selected || null
            ];
            await db.query(query, values);
        }
    } catch (error) {
        console.error('Ошибка при сохранении проблем:', error);
        throw error;
    }
}
function getCreateQuery(formData) {
    const query = `
    INSERT INTO projects (
      company_name, client_name, project_name, audit_goal, 
      traffic_analysis, grow_points, logo_url, background_url, 
      color, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    const values = [
        formData.company_name || '',
        formData.client_name || '',
        formData.project_name || '',
        formData.audit_goal || '',
        formData.traffic_analysis || '',
        formData.grow_points || '',
        formData.logo_url || '',
        formData.background_url || '',
        formData.color || ''
    ];
    return {
        query,
        values
    };
}
async function createProject(formData) {
    const { query, values } = getCreateQuery(formData);
    try {
        const result = await db.query(query, values);
        const projectId = result.insertId;
        if (formData.problems && Object.keys(formData.problems).length > 0) {
            await saveProblemsToDB(projectId, formData.problems);
        }
        return projectId;
    } catch (error) {
        console.error('Ошибка при создании проекта:', error);
        throw error;
    }
}
async function saveProject(formData) {
    let { query, values } = getCreateQuery(formData);
    query += ` WHERE id = ${formData.id}`;
    try {
        const result = await db.query(query, values);
        const projectId = result.insertId;
        if (formData.problems && Object.keys(formData.problems).length > 0) {
            await saveProblemsToDB(projectId, formData.problems);
        }
        return result;
    } catch (error) {
        console.error('Ошибка при сохранении проекта:', error);
        throw error;
    }
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/projects/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET() {
    const projects = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllProjects"])();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(projects, {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
        }
    });
}
async function POST(request) {
    const body = await request.json();
    const projectId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createProject"])(body);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        id: projectId
    }, {
        status: 201
    });
}
async function PUT(request) {
    const body = await request.json();
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveProject"])(body);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        result: result
    }, {
        status: 201
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__58438268._.js.map