'use client';

import { useEffect, useState, useTransition } from 'react';
import { handleToneAdjustment } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { problemLibrary } from '@/lib/data';
import type { Branding, Problem, Proposal } from '@/lib/types';
import EditorSidebar from './editor-sidebar';
import PreviewPanel from './preview-panel';

const defaultProposalText = (
  auditGoalText: string,
  trafficAnalysisText: string,
  problems: Problem[],
  growthPointsText: string
) => {
  const problemStatements =
    problems.length > 0
      ? Object.entries(
          problems.reduce((acc, problem) => {
            const { category } = problem;
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

## Анализ трафика
${trafficAnalysisText}

${problemStatements}

## Точки роста
${growthPointsText}

## Следующие шаги
Мы рады возможности сотрудничества с вами. Чтобы двигаться дальше, мы предлагаем провести дополнительную встречу для детального обсуждения этого предложения и ответов на любые ваши вопросы.`;
};

export default function PropoCraftEditor() {
  const { toast } = useToast();
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
    { ...problemLibrary[0] },
    { ...problemLibrary[2] },
  ]);

  const [auditGoalText, setAuditGoalText] = useState<string>(
    'В этом документе изложено предложение по нашему совместному проекту. Мы проанализировали вашу текущую ситуацию и определили ключевые области, в которых наш опыт может принести значительную пользу. Наша цель — предоставить надежное решение, которое решит ваши проблемы и поможет достичь поставленных целей.'
  );

  const [trafficAnalysisText, setTrafficAnalysisText] = useState<string>(
    `По данным Яндекс Метрики, за последний месяц трафик из поисковых систем (с SEO) на сайт составил {указать количество} визитов в день.
Среднесуточный трафик из поисковой системы Google составляет {указать количество} визитов в сутки. 
Среднесуточный трафик из поисковой системы Яндекс составляет {указать количество} визитов в сутки. 

{Место для скриншота}

Трафик из поисковых систем крайне низкий для данной тематики, что говорит нам о том, что у сайта крайне незначительная видимость в них, и необходимо сделать акцент на продвижении сайта в поисковых системах.

Трафик на сайт за последний месяц с мобильных устройств составляет {указать количество}% от общего трафика, а трафик с ПК равен {указать количество}%, показатель отказов со смартфонов составляет {указать количество}%, с ПК - {указать количество}%.

Глубина просмотра с мобильных устройств ниже ({указать количество} страницы), чем с десктопной версии ({указать количество} страницы).

Время проведения с мобильных устройств также ниже ({указать количество} минуты), чем с десктоп версии ({указать количество} минуты).

Показатели лояльности трафика крайне низкие. Рекомендуется особую роль уделить юзабилити оптимизации сайта мобильных устройств и скорости загрузки страниц.

В будущем мы прогнозируем рост доли мобильного трафика. Крайне важно, чтобы сайт был удобен для этого сегмента аудитории.

Как показывают данные Яндекс Метрики, за последний месяц {указать количество}% пользователей просматривают лишь одну страницу сайта.

Если говорить о длительности сессии, то по данным Яндекс Метрики почти {указать количество}% пользователей покидают сайт в первые 30 секунд.`
  );

  const [growthPointsText, setGrowthPointsText] = useState<string>(
    `Мы предлагаем комплексное решение, включающее многоэтапный подход к решению выявленных проблем. Наша команда экспертов будет тесно сотрудничать с вами, чтобы обеспечить беспрепятственное внедрение и успешный результат. Дальнейшие подробности о конкретных результатах и сроках будут предоставлены после принятия этого предложения.`
  );

  useEffect(() => {
    setProposal((prev) => ({
      ...prev,
      fullText: defaultProposalText(auditGoalText, trafficAnalysisText, selectedProblems, growthPointsText),
    }));
  }, [auditGoalText, trafficAnalysisText, selectedProblems, growthPointsText]);

  const adjustTone = async (tone: string) => {
    if (!tone) return;
    
    startTransition(async () => {
      const result = await handleToneAdjustment(proposal.fullText, tone);
      if (result.success && result.text) {
        setProposal((prev) => ({ ...prev, fullText: result.text! }));
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
      <div className="md:w-[500px] flex-shrink-0">
        <PreviewPanel proposal={proposal} branding={branding} />
      </div>
      <EditorSidebar
        proposal={proposal}
        setProposal={setProposal}
        branding={branding}
        setBranding={setBranding}
        selectedProblems={selectedProblems}
        setSelectedProblems={setSelectedProblems}
        adjustTone={adjustTone}
        isAdjustingTone={isAdjustingTone}
        auditGoalText={auditGoalText}
        setAuditGoalText={setAuditGoalText}
        trafficAnalysisText={trafficAnalysisText}
        setTrafficAnalysisText={setTrafficAnalysisText}
        growthPointsText={growthPointsText}
        setGrowthPointsText={setGrowthPointsText}
      />
    </div>
  );
}
