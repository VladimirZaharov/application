'use client';

import type {ChangeEvent, ClipboardEvent, Dispatch, SetStateAction} from 'react';
import {useState} from 'react';
import {
    BarChart,
    Save,
    Bot,
    Brush,
    Download,
    FileText,
    ImageIcon,
    Library,
    Loader2,
    Settings,
    TrendingUp,
    Home,
    ArrowLeft,
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {problemLibrary} from '@/lib/data';
import {ProjectData} from '@/lib/types';
import {PropoCraftIcon} from './icons';
import {Textarea} from './ui/textarea';
import {useRouter} from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface EditorSidebarProps {
    formData: ProjectData,
    setFormData: Dispatch<SetStateAction<ProjectData>>;
    adjustTone: (tone: string) => Promise<void>;
    isAdjustingTone: boolean;
}

export default function EditorSidebar({formData, setFormData, adjustTone, isAdjustingTone}: EditorSidebarProps) {
    const router = useRouter();

    const handleReturnToHome = () => {
        router.push('/');
    };
    const handleScreenshotUpload = (
        problemId: string,
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                const imageMarkdown = `\n\n<img src="${imageUrl}" alt="Скриншот" style="width: 100%; border-radius: 0.5rem; margin-top: 1rem;"/>\n\n`;
                setFormData(prev => ({
                    ...prev,
                    problems: {
                        ...prev.problems,
                        [problemId]: {
                            ...prev.problems?.[problemId],
                            screenshot_html: (prev.problems?.[problemId]?.screenshot_html || '') + imageMarkdown
                        }
                    }
                }));
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
                    };
                    reader.readAsDataURL(file);
                    e.preventDefault();
                }
            }
        }
    };

    const handleInputChange = (field: keyof ProjectData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleProblemCheckboxChange = (problemName: string) => (
        checked: boolean
    ) => {
        setFormData(prev => {
            const currentProblem = prev.problems?.[problemName];
            const baseProblem = {
                id: 0,
                project_id: prev.id || 0,
                content: problemLibrary.find((p) => p.id === problemName)?.content || "",
                screenshot_html: '',
                is_selected: checked ? 1 : 0
            };

            return {
                ...prev,
                problems: {
                    ...prev.problems,
                    [problemName]: currentProblem
                        ? {
                            ...currentProblem,
                            is_selected: checked ? 1 : 0
                        }
                        : baseProblem
                }
            };
        });
    };

    const handleProblemTextChange = (problemId: string, field: 'content' | 'screenshot_html') => (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            problems: {
                ...prev.problems,
                [problemId]: {
                    ...prev.problems[problemId],
                    [field]: e.target.value
                }
            }
        }));
    };

    const saveData = async (formData: ProjectData) => {
        if (formData.id) {
            const response = await fetch('/api/projects', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            },);
            if (!response.ok) {
                throw new Error('Ошибка при сохранении проекта');
            }
        } else {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            },);
            if (!response.ok) {
                throw new Error('Ошибка при сохранении проекта');
            }
            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                id: +data.id
            }));
        }
    }

    const handlePrint = async () => {
        const elementRef = document.getElementById("proposal-preview");
        if (!elementRef) {
            return
        }
        ;
        const element = elementRef.cloneNode(true)
        const watermarks = element.querySelectorAll(".watermark"); // ищем по классу
        watermarks.forEach(wm => wm.remove());

        try {
            // 1. Клонируем элемент и подготавливаем для рендеринга
            const clonedElement = element.cloneNode(true) as HTMLElement;

            // Убираем ненужные элементы
            const elementsToRemove = clonedElement.querySelectorAll(
                'button, [class*="button"], .no-print'
            );
            elementsToRemove.forEach(el => el.remove());

            // Устанавливаем стили для печати
            clonedElement.style.width = '794px'; // 210mm * 96dpi / 25.4 ≈ 794px
            clonedElement.style.minHeight = 'auto';
            clonedElement.style.padding = '40px';
            clonedElement.style.backgroundColor = 'white';
            clonedElement.style.color = 'black';
            clonedElement.style.fontSize = '14px';

            // Временно добавляем в DOM
            clonedElement.style.position = 'absolute';
            clonedElement.style.left = '-9999px';
            clonedElement.style.top = '0';
            document.body.appendChild(clonedElement);

            // 2. Генерируем ОДИН canvas всего контента
            const canvas = await html2canvas(clonedElement, {
                scale: 2, // Высокое качество
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: clonedElement.scrollWidth,
                windowHeight: clonedElement.scrollHeight,
            });

            // Удаляем временный элемент
            document.body.removeChild(clonedElement);

            // 3. Создаем PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Отступы по краям страницы
            const margin = 10; // 10mm с каждой стороны
            const contentWidth = pdfWidth - (margin * 2);

            // 4. Рассчитываем размеры изображения в PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.95);

            // Пропорции оригинала
            const originalWidth = canvas.width;
            const originalHeight = canvas.height;

            // Масштабируем ширину под ширину контента в PDF
            const scaleFactor = contentWidth / originalWidth;
            const scaledHeight = originalHeight * scaleFactor;

            // 5. Разбиваем на страницы
            const pageHeight = pdfHeight - (margin * 2); // Высота доступного пространства на странице
            let currentPosition = 0; // Текущая позиция по вертикали в масштабированных координатах
            let pageNumber = 0;

            // Функция для создания canvas фрагмента
            const createPageFragment = (startY: number, height: number) => {
                // Создаем временный canvas для фрагмента
                const fragmentCanvas = document.createElement('canvas');
                const ctx = fragmentCanvas.getContext('2d')!;

                // Рассчитываем координаты в оригинальном масштабе
                const originalStartY = startY / scaleFactor;
                const originalHeight = height / scaleFactor;

                // Устанавливаем размеры фрагмента
                fragmentCanvas.width = originalWidth;
                fragmentCanvas.height = Math.min(originalHeight, originalHeight);

                // Вырезаем часть из оригинального canvas
                ctx.drawImage(
                    canvas,
                    0, originalStartY, // Координаты в оригинальном canvas
                    originalWidth, originalHeight, // Размер вырезаемой области
                    0, 0, // Начало отрисовки в фрагменте
                    originalWidth, originalHeight // Размер фрагмента
                );

                return fragmentCanvas;
            };

            // 6. Генерируем страницы
            while (currentPosition < scaledHeight) {
                // Создаем новую страницу если это не первая
                if (pageNumber > 0) {
                    pdf.addPage();
                }

                // Вычисляем высоту фрагмента для текущей страницы
                const fragmentHeight = Math.min(pageHeight, scaledHeight - currentPosition);

                // Создаем фрагмент для текущей страницы
                const fragmentCanvas = createPageFragment(currentPosition, fragmentHeight);
                const fragmentData = fragmentCanvas.toDataURL('image/jpeg', 0.95);

                // Добавляем фрагмент на страницу
                pdf.addImage(
                    fragmentData,
                    'JPEG',
                    margin, // X позиция
                    margin, // Y позиция
                    contentWidth,
                    fragmentHeight,
                    undefined,
                    'MEDIUM'
                );

                // Переходим к следующей позиции
                currentPosition += fragmentHeight;
                pageNumber++;

                // Очищаем canvas фрагмента
                fragmentCanvas.width = 0;
                fragmentCanvas.height = 0;
            }

            // 7. Сохраняем PDF
            pdf.save(`${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error('Ошибка при генерации PDF:', error);
        }
    };

    const problemsByCategory = problemLibrary.reduce((acc, problem) => {
        const {category} = problem;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(problem);
        return acc;
    }, {} as Record<string, Problem[]>);
    return (
        <aside className="w-[600px] p-4 sm:p-6 md:p-10 bg-transparent print-container">
            <Card className="h-full max-h-screen flex flex-col rounded-lg border shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <PropoCraftIcon className="h-7 w-7 text-primary"/>
                        <CardTitle className="text-xl font-headline">Редактор PropoCraft</CardTitle>
                    </div>
                    <Button
                        onClick={handleReturnToHome}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Home className="h-4 w-4"/>
                        <span className="hidden sm:inline">На главную</span>
                    </Button>
                </CardHeader>
                <CardContent className="p-0 flex-grow overflow-y-auto">
                    <Accordion
                        type="multiple"
                        defaultValue={['settings', 'content', 'style', 'audit-goal', 'traffic-analysis']}
                        className="w-full"
                    >
                        <AccordionItem value="settings">
                            <AccordionTrigger className="px-4 text-base font-semibold">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-5 w-5"/>
                                    Детали предложения
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Название вашей компании</Label>
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        value={formData.company_name || ''}
                                        onChange={handleInputChange('company_name')}
                                        placeholder="например, Innovate Solutions"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientName">Имя клиента</Label>
                                    <Input
                                        id="clientName"
                                        name="clientName"
                                        value={formData.client_name || ''}
                                        onChange={handleInputChange('client_name')}
                                        placeholder="например, Globex Corporation"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="projectName">Название проекта</Label>
                                    <Input
                                        id="projectName"
                                        name="projectName"
                                        value={formData.project_name || ''}
                                        onChange={handleInputChange('project_name')}
                                        placeholder="например, Редизайн сайта"
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="audit-goal">
                            <AccordionTrigger className="px-4 text-base font-semibold">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5"/>
                                    Цель аудита
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="audit-goal-content">Содержание</Label>
                                    <Textarea
                                        id="audit-goal-content"
                                        value={formData.audit_goal || ''}
                                        onChange={handleInputChange('audit_goal')}
                                        rows={8}
                                        placeholder="Опишите здесь цель аудита..."
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="traffic-analysis">
                            <AccordionTrigger className="px-4 text-base font-semibold">
                                <div className="flex items-center gap-2">
                                    <BarChart className="h-5 w-5"/>
                                    Анализ трафика
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="traffic-analysis-content">Содержание</Label>
                                    <Textarea
                                        id="traffic-analysis-content"
                                        value={formData.traffic_analysis || ''}
                                        onChange={handleInputChange('traffic_analysis')}
                                        rows={12}
                                        placeholder="Опишите здесь анализ трафика..."
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="content">
                            <AccordionTrigger className="px-4 text-base font-semibold">
                                <div className="flex items-center gap-2">
                                    <Library className="h-5 w-5"/>
                                    Библиотека проблем
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    Выберите проблемы, которые будет решать это предложение.
                                </p>
                                {Object.entries(problemsByCategory).map(([category, problems]) => (
                                    <Accordion type="multiple" className="space-y-2" key={category}>
                                        <AccordionItem value={category} className="border-b-0">
                                            <AccordionTrigger
                                                className="p-2 text-sm font-semibold text-primary hover:bg-secondary rounded-md">
                                                {category}
                                            </AccordionTrigger>
                                            <AccordionContent className="p-2 space-y-2">
                                                {problems.map((problem) => {
                                                    return (
                                                        <Accordion type="multiple" key={problem.id}
                                                                   className="space-y-2">
                                                            <AccordionItem value={problem.id}
                                                                           className="border rounded-md">
                                                                <div
                                                                    className="flex items-start space-x-2 p-2 rounded-md transition-colors">
                                                                    <Checkbox
                                                                        id={`lib-${problem.id}`}
                                                                        checked={Boolean(formData.problems?.[problem.id]?.is_selected)}
                                                                        onCheckedChange={handleProblemCheckboxChange(problem.id)}
                                                                    />
                                                                    <AccordionTrigger
                                                                        className="p-0 flex-1 justify-start">
                                                                        <label
                                                                            htmlFor={`lib-${problem.id}`}
                                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                        >
                                                                            {problem.title || ''}
                                                                        </label>
                                                                    </AccordionTrigger>
                                                                </div>
                                                                {formData.problems?.[problem.id]?.is_selected && (
                                                                    <AccordionContent className="p-4 border-t">
                                                                        <div className="space-y-2">
                                                                            <Label
                                                                                htmlFor={`content-${problem.id}`}>Содержание</Label>
                                                                            <Textarea
                                                                                id={`content-${problem.id}`}
                                                                                value={formData.problems?.[problem.id]?.content || ''}
                                                                                onChange={handleProblemTextChange(problem.id, 'content')}
                                                                                rows={8}
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-2 mt-4">
                                                                            <Label
                                                                                htmlFor={`screenshot-upload-${problem.id}`}
                                                                                className="text-sm font-medium">Добавить
                                                                                скриншот в содержание</Label>
                                                                            <Input
                                                                                id={`screenshot-upload-${problem.id}`}
                                                                                type="file"
                                                                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                                                                accept="image/*"
                                                                                onChange={(e) => handleScreenshotUpload(problem.id, e)}/>
                                                                            {formData.problems?.[problem.id]?.screenshot_html && (
                                                                                <div className="mt-2">
                                                                                    <div
                                                                                        className="mt-2 p-2 border rounded-md"
                                                                                        dangerouslySetInnerHTML={{
                                                                                            __html: formData.problems[problem.id].screenshot_html
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </AccordionContent>
                                                                ) || ""}
                                                            </AccordionItem>
                                                        </Accordion>
                                                    );
                                                })}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="growth-points">
                            <AccordionTrigger className="px-4 text-base font-semibold">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5"/>
                                    Точки роста
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="growth-points-content">Содержание</Label>
                                    <Textarea
                                        id="growth-points-content"
                                        value={formData.grow_points || ''}
                                        onChange={handleInputChange('grow_points')}
                                        rows={8}
                                        placeholder="Опишите здесь предлагаемое решение и точки роста..."
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="style">
                            <AccordionTrigger className="px-4 text-base font-semibold">
                                <div className="flex items-center gap-2">
                                    <Brush className="h-5 w-5"/>
                                    Стиль и тон
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium flex items-center gap-2"><ImageIcon
                                        className="w-4 h-4"/> Брендинг и фон</h4>
                                    <div className="space-y-2">
                                        <Label htmlFor="logoUrl">URL логотипа</Label>
                                        <Input
                                            id="logoUrl"
                                            name="logoUrl"
                                            value={formData.logo_url || ''}
                                            onChange={handleInputChange('logo_url')}
                                            placeholder="https://your-logo.com/logo.png"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="backgroundUrl">URL фонового изображения</Label>
                                        <Input
                                            id="backgroundUrl"
                                            name="backgroundUrl"
                                            value={formData.background_url || ''}
                                            onChange={handleInputChange('background_url')}
                                            placeholder="https://image.com/background.png"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="accentColor">Акцентный цвет</Label>
                                        <div className="relative">
                                            <Input
                                                id="accentColor"
                                                name="accentColor"
                                                type="text"
                                                value={formData.color || ''}
                                                onChange={handleInputChange('color')}
                                                className="pr-12"
                                            />
                                            <input
                                                type="color"
                                                value={formData.color || ''}
                                                onChange={handleInputChange('color')}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-10 p-1 border rounded-md cursor-pointer bg-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Separator/>
                                <div className="space-y-4">
                                    <h4 className="font-medium flex items-center gap-2"><Bot
                                        className="w-4 h-4"/> Настройка тона с помощью ИИ</h4>
                                    <Select onValueChange={adjustTone} disabled={isAdjustingTone}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите тон..."/>
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
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            Настройка тона...
                                        </div>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
                <div className="p-4 border-t mt-auto flex items-center gap-2">
                    <Button onClick={() => saveData(formData)} className="w-full" size="lg">
                        <Save className="mr-2 h-5 w-5"/>
                        Сохранить
                    </Button>
                    <Button onClick={handlePrint} className="w-full" size="lg" variant="outline">
                        <Download className="mr-2 h-5 w-5"/>
                        Скачать как PDF
                    </Button>
                </div>
            </Card>
        </aside>
    );
}
