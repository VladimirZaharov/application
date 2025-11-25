'use client';

import {useEffect, useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {handleToneAdjustment} from '@/app/actions';
import {useToast} from '@/hooks/use-toast';
import {problemLibrary} from '@/lib/data';
import type {Branding, Problem, Proposal} from '@/lib/types';
import EditorSidebar from './editor-sidebar';
import PreviewPanel from './preview-panel';
import {ProjectData} from "@/lib/types"

const defaultProposalText = (
    auditGoalText: string,
    problems: Problem[],
    growthPointsText: string
) => {
    const problemStatements =
        problems.length > 0
            ? Object.entries(
                problems.reduce((acc, problem) => {
                    const {category} = problem;
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(problem);
                    return acc;
                }, {} as Record<string, Problem[]>)
            )
                .map(([category, problems]) => {
                    const problemContent = problems
                        .map((p) => `### ${p.title}\n${p.content}`)
                        .join('\n\n');
                    return `## ${category}\n${problemContent}`;
                })
                .join('\n\n')
            : `## Выявленные проблемы
В этом разделе не было выявлено конкретных проблем. Мы рекомендуем провести ознакомительную сессию для определения ключевых задач и возможностей.`;

    return `## Цель аудита
${auditGoalText}

${problemStatements}

## Точки роста
${growthPointsText}

## Следующие шаги
Мы рады возможности сотрудничества с вами. Чтобы двигаться дальше, мы предлагаем провести дополнительную встречу для детального обсуждения этого предложения и ответов на любые ваши вопросы.`;
};

export default function PropoCraftEditor(projectData: ProjectData) {
    const {toast} = useToast();
    const [isAdjustingTone, startTransition] = useTransition();

    const [proposal, setProposal] = useState<Proposal>({
        clientName: 'Globex Corporation',
        projectName: 'Стратегия продвижения в поиске сайта',
        fullText: '',
    });

    const [branding, setBranding] = useState<Branding>({
        logoUrl: 'https://searchindustrial.ru/img/Logo_dark_text.png',
        accentColor: '#FFC502',
        companyName: 'ПОИСКОВАЯ ИНДУСТРИЯ',
        backgroundUrl: '',
    });

    const [selectedProblems, setSelectedProblems] = useState<Problem[]>(() => [
        {...problemLibrary[0]},
        {...problemLibrary[2]},
    ]);

    const [auditGoalText, setAuditGoalText] = useState<string>(
        'В этом документе изложено предложение по нашему совместному проекту. Мы проанализировали вашу текущую ситуацию и определили ключевые области, в которых наш опыт может принести значительную пользу. Наша цель — предоставить надежное решение, которое решит ваши проблемы и поможет достичь поставленных целей.'
    );

    const [growthPointsText, setGrowthPointsText] = useState<string>(
        `Мы предлагаем комплексное решение, включающее многоэтапный подход к решению выявленных проблем. Наша команда экспертов будет тесно сотрудничать с вами, чтобы обеспечить беспрепятственное внедрение и успешный результат. Дальнейшие подробности о конкретных результатах и сроках будут предоставлены после принятия этого предложения.`
    );

    useEffect(() => {
        setProposal((prev) => ({
            ...prev,
            fullText: defaultProposalText(auditGoalText, selectedProblems, growthPointsText),
        }));
    }, [auditGoalText, selectedProblems, growthPointsText]);
    useEffect(() => {
        setProposal((prev) => ({
            ...prev,
            fullText: defaultProposalText(auditGoalText, selectedProblems, growthPointsText),
        }));
    }, []);

    const adjustTone = async (tone: string) => {
        if (!tone) return;

        startTransition(async () => {
            const result = await handleToneAdjustment(proposal.fullText, tone);
            if (result.success && result.text) {
                setProposal((prev) => ({...prev, fullText: result.text!}));
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
            <EditorSidebar
                projectData={projectData}
                proposal={proposal}
                setProposal={setProposal}
                branding={branding}
                setBranding={setBranding}
                adjustTone={adjustTone}
                isAdjustingTone={isAdjustingTone}
            />
            <PreviewPanel proposal={proposal} branding={branding}/>
        </div>
    );
}
