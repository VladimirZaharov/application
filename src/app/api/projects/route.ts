import { getAllProjects, createProject, saveProject  } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
    const projects = await getAllProjects();
    return NextResponse.json(projects, {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
        }
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    const projectId = await createProject(body);
    return NextResponse.json({ id: projectId }, { status: 201 });
}


export async function PUT(request: Request) {
    const body = await request.json();
    const result = saveProject(body);
    return NextResponse.json({ result: result }, { status: 201 });
}
