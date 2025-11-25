import PropoCraftEditor from '@/components/propocraft-editor';
import {notFound} from 'next/navigation';
import {PageProps} from "@/lib/types";
import {getProjectById} from "@/lib/database";

export default async function EditorPage({ params }: PageProps) {
  const projectData = await getProjectById(+((await params).projectId));
  if (!projectData) {
    notFound();
  }

  return (
    <main>
      <PropoCraftEditor
          projectData={projectData}
      />
    </main>
  );
}