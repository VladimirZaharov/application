import { getAllProjects, createProject } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
}

export async function POST(request: Request) {
    const body = await request.json();
    const projectId = createProject(body);
    return NextResponse.json({ id: projectId }, { status: 201 });
}
