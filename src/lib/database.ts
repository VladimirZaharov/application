import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import {ProjectsList, ProjectData} from "@/lib/types"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'application.db'));
console.log(path.join(__dirname, 'application.db'))

export function getAllProjects(): Promise<ProjectsList[]> {
  const stmt = db.prepare('SELECT id, project_name, updated_at FROM projects');
  return stmt.all();
}

export function getProjectById(id: number): Promise<ProjectData | undefined> {
  const projectStmt = db.prepare('SELECT * FROM projects WHERE id = ?');
  const projectRow = projectStmt.get(id);

  if (!projectRow) return undefined;

  const problemsStmt = db.prepare('SELECT * FROM problem WHERE project_id = ?');
  const problemsRows = problemsStmt.all(id);

  const problems: { [name: string]: { id: number; project_id: number; content: string; screenshot_html: string, is_selected: boolean } } = {};

  problemsRows.forEach(problem => {
    problems[problem.name] = {
      id: problem.id,
      project_id: problem.project_id,
      content: problem.content,
      screenshot_html: problem.screenshot_html,
      is_selected: problem.is_selected
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
    problems: problems
  };
  return projectData;
}
async function deleteProjectProblems(projectId: number): Promise<void> {
  const stmt = db.prepare('DELETE FROM problem WHERE project_id = ?');
    const result = stmt.run(projectId);
    debugger

    console.log(`Удалены все проблемы проекта ${projectId}`);
}

function saveProblemsToDB(projectId: number, problems: ProjectData['problems']): Promise<void> {
  const query = `
    INSERT INTO problem (project_id, name, content, screenshot_html, is_selected)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    for (const [problemName, problemData] of Object.entries(problems)) {
      const values = [
        projectId,
        problemName,
        problemData.content || '',
        problemData.screenshot_html || '',
        problemData.is_selected || null
      ];
      const stmt = db.prepare(query);
      const result = stmt.run(values);
    }
  } catch (error) {
    console.error('Ошибка при сохранении проблем:', error);
    throw error;
  }
}

function getCreateQuery (formData: ProjectData) {
  const query =
   `
    INSERT INTO projects (
      company_name, client_name, project_name, audit_goal, 
      traffic_analysis, grow_points, logo_url, background_url, 
      color
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    formData.color || '',
  ];
  return {query, values};
}

export function createProject(formData: ProjectData): Promise<number> {
  const {query, values} = getCreateQuery(formData);

  try {
    const stmt = db.prepare(query);
    const result = stmt.run(values);
    const projectId = result.lastInsertRowid;
    if (formData.problems && Object.keys(formData.problems).length > 0) {
      saveProblemsToDB(projectId, formData.problems);
    }

    return projectId;
  } catch (error) {
    console.error('Ошибка при создании проекта:', error);
    throw error;
  }
}

export async function saveProject(formData: ProjectData): boolean {
  console.log(formData)
  const projectUpdates: string[] = [];
  const projectValues: any[] = [];
  const projectExcludedFields = ['id', 'problems'];
  let projectsQuery = 'UPDATE projects SET '
  for (const [key, value] of Object.entries(formData)) {
    if (projectExcludedFields.includes(key)) {
      continue;
    }
    projectUpdates.push(`${key} = ?`);
    projectValues.push(value);
  }
  try {
    projectsQuery += projectUpdates.join(', ') + ', updated_at = CURRENT_TIMESTAMP WHERE id = ?;'
    projectValues.push(formData.id);
    const projectStmt = db.prepare(projectsQuery);
    const projectResult = projectStmt.run(projectValues);
    const stmt = db.prepare('DELETE FROM problem WHERE project_id = ?');
    const result = stmt.run([formData.id]);
    if (Object.keys(formData.problems).length > 0) {
      await saveProblemsToDB(formData.id, formData.problems);
    }
  } catch (error) {
    console.error('Ошибка при сохранении проекта:', error);
    throw error;
  }
}
