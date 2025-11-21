'use client';

import PropoCraftEditor from '@/components/propocraft-editor';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const projectNameParam = searchParams.get('projectName');
  const projectIdParam = searchParams.get('projectId');

  // In a real application, you would fetch project data based on projectId
  // For now, we'll just show the editor with default content
  const [projectInfo, setProjectInfo] = useState({
    projectName: projectNameParam || 'Новый проект',
    projectId: projectIdParam || null
  });

  useEffect(() => {
    if (projectIdParam) {
      // Here you would fetch the project data from your database/API
      console.log('Loading project with ID:', projectIdParam);
    } else if (projectNameParam) {
      // Here you would create a new project in your database
      console.log('Creating new project:', projectNameParam);
    }
  }, [projectIdParam, projectNameParam]);

  return (
    <main>
      <PropoCraftEditor />
    </main>
  );
}