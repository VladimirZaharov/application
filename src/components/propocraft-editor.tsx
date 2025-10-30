'use client';

import { useEffect, useState, useTransition } from 'react';
import { handleToneAdjustment } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { problemLibrary } from '@/lib/data';
import type { Branding, Problem, Proposal } from '@/lib/types';
import EditorSidebar from './editor-sidebar';
import PreviewPanel from './preview-panel';
import { useFirebase } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { saveProject } from '@/lib/firebase/firestore';
import { v4 as uuidv4 } from 'uuid';


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

// Helper function to get initial state from localStorage
const getInitialState = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    try {
      return JSON.parse(storedValue);
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return defaultValue;
    }
  }
  return defaultValue;
};


export default function PropoCraftEditor() {
  const { toast } = useToast();
  const [isAdjustingTone, startTransition] = useTransition();
  const { auth, user, isUserLoading } = useFirebase();
  const [isSaving, setIsSaving] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  const [proposal, setProposal] = useState<Proposal>(() => getInitialState('propocraft_proposal', {
    clientName: 'Globex Corporation',
    projectName: 'Стратегия продвижения в поиске сайта',
    fullText: '',
  }));

  const [branding, setBranding] = useState<Branding>(() => getInitialState('propocraft_branding', {
    logoUrl: 'https://searchindustrial.ru/img/logo_dark_part.png',
    accentColor: '#FFC502',
    companyName: 'ПОИСКОВАЯ ИНДУСТРИЯ',
    backgroundUrl: '',
  }));

  const [selectedProblems, setSelectedProblems] = useState<Problem[]>(() => getInitialState('propocraft_selectedProblems', [
    { ...problemLibrary[0] },
    { ...problemLibrary[2] },
  ]));

  const [auditGoalText, setAuditGoalText] = useState<string>(() => getInitialState('propocraft_auditGoalText', 
    'В этом документе изложено предложение по нашему совместному проекту. Мы проанализировали вашу текущую ситуацию и определили ключевые области, в которых наш опыт может принести значительную пользу. Наша цель — предоставить надежное решение, которое решит ваши проблемы и поможет достичь поставленных целей.'
  ));

  const [trafficAnalysisText, setTrafficAnalysisText] = useState<string>(() => getInitialState('propocraft_trafficAnalysisText',
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
  ));

  const [growthPointsText, setGrowthPointsText] = useState<string>(() => getInitialState('propocraft_growthPointsText',
    `Мы предлагаем комплексное решение, включающее многоэтапный подход к решению выявленных проблем. Наша команда экспертов будет тесно сотрудничать с вами, чтобы обеспечить беспрепятственное внедрение и успешный результат. Дальнейшие подробности о конкретных результатах и сроках будут предоставлены после принятия этого предложения.`
  ));

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, isUserLoading]);

  useEffect(() => {
    setProposal((prev) => ({
      ...prev,
      fullText: defaultProposalText(auditGoalText, trafficAnalysisText, selectedProblems, growthPointsText),
    }));
  }, [auditGoalText, trafficAnalysisText, selectedProblems, growthPointsText]);
  
    useEffect(() => {
    localStorage.setItem('propocraft_proposal', JSON.stringify(proposal));
    localStorage.setItem('propocraft_branding', JSON.stringify(branding));
    localStorage.setItem('propocraft_selectedProblems', JSON.stringify(selectedProblems));
    localStorage.setItem('propocraft_auditGoalText', JSON.stringify(auditGoalText));
    localStorage.setItem('propocraft_trafficAnalysisText', JSON.stringify(trafficAnalysisText));
    localStorage.setItem('propocraft_growthPointsText', JSON.stringify(growthPointsText));
  }, [proposal, branding, selectedProblems, auditGoalText, trafficAnalysisText, growthPointsText]);

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

  const handleSave = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Вы должны быть авторизованы, чтобы сохранять проекты.',
      });
      return;
    }

    setIsSaving(true);
    const currentProjectId = projectId || uuidv4();
    if (!projectId) {
      setProjectId(currentProjectId);
    }

    const projectData = {
      id: currentProjectId,
      name: proposal.projectName || 'Новый проект',
      proposal: JSON.stringify(proposal),
      branding: JSON.stringify(branding),
      selectedProblems: JSON.stringify(selectedProblems),
      auditGoalText,
      trafficAnalysisText,
      growthPointsText,
      lastModified: new Date().toISOString(),
    };

    try {
      await saveProject(user.uid, projectData);
      toast({
        title: 'Проект сохранен',
        description: `Проект "${projectData.name}" успешно сохранен.`,
      });
    } catch (error) {
      console.error('Failed to save project:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка сохранения',
        description: 'Не удалось сохранить проект. Пожалуйста, попробуйте еще раз.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <div className="md:w-1/2 flex-shrink-0">
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
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
