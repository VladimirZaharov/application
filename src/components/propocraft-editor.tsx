'use client';

import {useEffect, useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {handleToneAdjustment} from '@/app/actions';
import {useToast} from '@/hooks/use-toast';
import {problemLibrary} from '@/lib/data';
import type {Problem, ProjectData} from '@/lib/types';
import EditorSidebar from './editor-sidebar';
import PreviewPanel from './preview-panel';

const defaultProposalText = (
    formData: ProjectData,
) => {
    const problemStatements =
        formData.problems
            ? Object.entries(
                problemLibrary.reduce((acc, problem) => {
                    const {category} = problem;
                    if (!formData.problems[problem.id]?.is_selected) {
                        return acc
                    }
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(problem);
                    return acc;
                }, {} as Record<string, Problem[]>)
            )
                .map(([category, problems]) => {
                    const problemContent = problems
                        .map((p) => `### ${p.title}\n${formData.problems[p.id].content || p.content}`)
                        .join('\n\n');
                    return `## ${category}\n${problemContent}`;
                })
                .join('\n\n')
            : `## Выявленные проблемы
В этом разделе не было выявлено конкретных проблем. Мы рекомендуем провести ознакомительную сессию для определения ключевых задач и возможностей.`;

    return `## Цель аудита
${formData.audit_goal}

## Анализ трафика
${formData.traffic_analysis}

${problemStatements}

## Точки роста
${formData.grow_points}

## Следующие шаги
Мы рады возможности сотрудничества с вами. Чтобы двигаться дальше, мы предлагаем провести дополнительную встречу для детального обсуждения этого предложения и ответов на любые ваши вопросы.`;
};

export default function PropoCraftEditor({ projectData }: { projectData: ProjectData }) {
    const {toast} = useToast();
    const [isAdjustingTone, startTransition] = useTransition();

    const [formData, setFormData] = useState<ProjectData>({
        ...projectData
    });

    const [mainProposalText, setMainProposalText] = useState<string>("");

    useEffect(() => {
        setMainProposalText((prev) => (defaultProposalText(formData)));
    }, [formData]);

    const adjustTone = async (tone: string) => {
        if (!tone) return;

        startTransition(async () => {
            const result = await handleToneAdjustment(mainProposalText, tone);
            if (result.success && result.text) {
                setMainProposalText((prev) => (result.text!));
                toast({
                    title: 'Тон настроен',
                    description: `Тон предложения успешно изменен на "${tone}".`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: result.error || 'Не удалось настроить тон.',
                });
            }
        });
    };
    return (
        <div className="flex flex-col md:flex-row h-screen bg-background">
            <div className="md:w-1/2 flex-shrink-0">
                <PreviewPanel formData={formData} mainProposalText={mainProposalText}/>
            </div>
            <EditorSidebar
                formData={formData}
                setFormData={setFormData}
                adjustTone={adjustTone}
                isAdjustingTone={isAdjustingTone}
            />
        </div>
    );
}
