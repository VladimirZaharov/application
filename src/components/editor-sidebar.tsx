'use client';

import type { ChangeEvent, ClipboardEvent, Dispatch, SetStateAction } from 'react';
import {
  Bot,
  Brush,
  Download,
  Image as ImageIcon,
  Library,
  Loader2,
  TrendingUp,
  Settings,
  UploadCloud,
  X,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { problemLibrary } from '@/lib/data';
import type { Branding, Problem, Proposal } from '@/lib/types';
import { PropoCraftIcon } from './icons';
import { Textarea } from './ui/textarea';

interface EditorSidebarProps {
  proposal: Proposal;
  setProposal: Dispatch<SetStateAction<Proposal>>;
  branding: Branding;
  setBranding: Dispatch<SetStateAction<Branding>>;
  selectedProblems: Problem[];
  setSelectedProblems: Dispatch<SetStateAction<Problem[]>>;
  adjustTone: (tone: string) => Promise<void>;
  isAdjustingTone: boolean;
  growthPointsText: string;
  setGrowthPointsText: Dispatch<SetStateAction<string>>;
}

export default function EditorSidebar({
  proposal,
  setProposal,
  branding,
  setBranding,
  selectedProblems,
  setSelectedProblems,
  adjustTone,
  isAdjustingTone,
  growthPointsText,
  setGrowthPointsText,
}: EditorSidebarProps) {
  const handleProblemSelection = (problem: Problem, checked: boolean) => {
    setSelectedProblems((prev) =>
      checked ? [...prev, { ...problem }] : prev.filter((p) => p.id !== problem.id)
    );
  };

  const handleProblemUpdate = (
    id: string,
    field: keyof Problem,
    value: string
  ) => {
    setSelectedProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleScreenshotUpload = (
    id: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        const imageMarkdown = `\n\n<img src="${imageUrl}" alt="Скриншот" style="width: 100%; border-radius: 0.5rem; margin-top: 1rem;"/>\n\n`;
        setSelectedProblems((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, content: p.content + imageMarkdown } : p
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (id: string, e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const imageUrl = reader.result as string;
            const imageMarkdown = `\n<img src="${imageUrl}" alt="Вставленное изображение" style="width: 100%; border-radius: 0.5rem; margin-top: 1rem;"/>\n`;
            
            const textarea = e.target as HTMLTextAreaElement;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const currentContent = textarea.value;
            const newContent = currentContent.substring(0, start) + imageMarkdown + currentContent.substring(end);

            setSelectedProblems(prev =>
              prev.map(p =>
                p.id === id ? { ...p, content: newContent } : p
              )
            );
          };
          reader.readAsDataURL(file);
          e.preventDefault();
        }
      }
    }
  };

  const handleBrandingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBranding((prev) => ({ ...prev, [name]: value }));
  };

  const handleProposalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProposal((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const problemsByCategory = problemLibrary.reduce((acc, problem) => {
    const { category } = problem;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(problem);
    return acc;
  }, {} as Record<string, Problem[]>);

  return (
    <aside className="no-print w-full max-w-sm flex-shrink-0">
      <Card className="h-full max-h-screen flex flex-col rounded-none border-r border-l-0 border-t-0 border-b-0 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <PropoCraftIcon className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl font-headline">PropoCraft</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow overflow-y-auto">
          <Accordion
            type="multiple"
            defaultValue={['settings', 'content', 'style']}
            className="w-full"
          >
            <AccordionItem value="settings">
              <AccordionTrigger className="px-4 text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Детали предложения
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Название вашей компании</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={branding.companyName}
                    onChange={handleBrandingChange}
                    placeholder="например, Innovate Solutions"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Имя клиента</Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    value={proposal.clientName}
                    onChange={handleProposalChange}
                    placeholder="например, Globex Corporation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectName">Название проекта</Label>
                  <Input
                    id="projectName"
                    name="projectName"
                    value={proposal.projectName}
                    onChange={handleProposalChange}
                    placeholder="например, Редизайн сайта"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="content">
              <AccordionTrigger className="px-4 text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Library className="h-5 w-5" />
                  Библиотека проблем
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Выберите проблемы, которые будет решать это предложение.
                </p>
                {Object.entries(problemsByCategory).map(([category, problems]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-semibold text-sm text-primary">{category}</h4>
                    {problems.map((problem) => (
                      <div key={problem.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-secondary transition-colors">
                        <Checkbox
                          id={`lib-${problem.id}`}
                          checked={selectedProblems.some((p) => p.id === problem.id)}
                          onCheckedChange={(checked) =>
                            handleProblemSelection(problem, !!checked)
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`lib-${problem.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {problem.title}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                
                {selectedProblems.length > 0 && (
                  <>
                    <Separator className="my-4"/>
                    <h4 className="font-semibold">Выбранные проблемы</h4>
                    <Accordion type="multiple" className="space-y-2">
                      {selectedProblems.map((problem) => (
                        <AccordionItem value={problem.id} key={problem.id} className='border-b-0'>
                          <AccordionTrigger className="p-2 text-sm font-medium hover:bg-secondary rounded-md">
                            {problem.title}
                          </AccordionTrigger>
                          <AccordionContent className="p-4 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`content-${problem.id}`}>Содержание</Label>
                              <Textarea
                                id={`content-${problem.id}`}
                                value={problem.content}
                                onChange={(e) => handleProblemUpdate(problem.id, 'content', e.target.value)}
                                onPaste={(e) => handlePaste(problem.id, e)}
                                rows={8}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`screenshot-upload-${problem.id}`} className="text-sm font-medium">Добавить скриншот в содержание</Label>
                              <Input id={`screenshot-upload-${problem.id}`} type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" accept="image/*" onChange={(e) => handleScreenshotUpload(problem.id, e)} />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="growth-points">
              <AccordionTrigger className="px-4 text-base font-semibold">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Точки роста
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="growth-points-content">Содержание</Label>
                  <Textarea
                    id="growth-points-content"
                    value={growthPointsText}
                    onChange={(e) => setGrowthPointsText(e.target.value)}
                    rows={8}
                    placeholder="Опишите здесь предлагаемое решение и точки роста..."
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="style">
              <AccordionTrigger className="px-4 text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Brush className="h-5 w-5" />
                  Стиль и тон
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                <div className="space-y-4">
                   <h4 className="font-medium flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Брендинг компании</h4>
                   <div className="space-y-2">
                    <Label htmlFor="logoUrl">URL логотипа</Label>
                    <Input
                      id="logoUrl"
                      name="logoUrl"
                      value={branding.logoUrl}
                      onChange={handleBrandingChange}
                      placeholder="https://your-logo.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Акцентный цвет</Label>
                    <div className="relative">
                      <Input
                        id="accentColor"
                        name="accentColor"
                        type="text"
                        value={branding.accentColor}
                        onChange={handleBrandingChange}
                        className="pr-12"
                      />
                      <input
                        type="color"
                        value={branding.accentColor}
                        onChange={(e) => setBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-10 p-1 border rounded-md cursor-pointer bg-transparent"
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2"><Bot className="w-4 h-4" /> Настройка тона с помощью ИИ</h4>
                   <Select onValueChange={adjustTone} disabled={isAdjustingTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тон..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Формальный</SelectItem>
                      <SelectItem value="casual">Неформальный</SelectItem>
                      <SelectItem value="technical">Технический</SelectItem>
                      <SelectItem value="persuasive">Убедительный</SelectItem>
                    </SelectContent>
                  </Select>
                   {isAdjustingTone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Настройка тона...
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <div className="p-4 border-t mt-auto">
          <Button onClick={handlePrint} className="w-full" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Скачать как PDF
          </Button>
        </div>
      </Card>
    </aside>
  );
}
