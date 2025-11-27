import PropoCraftEditor from '@/components/propocraft-editor';
import {PageProps} from "@/lib/types";

export default async function EditorPage({ params }: PageProps) {
debugger
  return (
    <main>
      <PropoCraftEditor
          projectData={{project_name: (await params).projectName}}
      />
    </main>
  );
}