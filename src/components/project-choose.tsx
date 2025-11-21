'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  projectName: z.string().min(1, { message: "Название проекта обязательно" }).max(100, { message: "Название проекта должно быть не более 100 символов" }),
});

export default function ProjectChoose() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
    },
  });

  const handleCreateNewProject = (values: z.infer<typeof formSchema>) => {
    if (values.projectName.trim()) {
      // In a real app, you would save the project to a database
      // For now, we'll just navigate to the editor with a query parameter
      router.push(`/editor?projectName=${encodeURIComponent(values.projectName.trim())}`);
    }
  };

  const handleSelectProject = (projectId: string) => {
    // In a real app, you would load the project from database
    router.push(`/editor?projectId=${projectId}`);
  };

  // Mock projects for demonstration
  const mockProjects = [
    { id: '1', name: 'Проект по оптимизации сайта', lastModified: '2023-11-15' },
    { id: '2', name: 'Стратегия продвижения в поиске', lastModified: '2023-11-10' },
    { id: '3', name: 'Анализ конкурентов', lastModified: '2023-11-05' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF5FF] to-[#E6EEF7] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="shadow-lg rounded-xl overflow-hidden border border-[#D0D8E6]">
            <CardHeader className="text-center bg-gradient-to-r from-[#2D4777] to-[#2C3E50] text-white">
              <CardTitle className="text-3xl font-bold">Добро пожаловать в PropoCraft</CardTitle>
              <CardDescription className="text-blue-100">
                Выберите существующий проект или создайте новый
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create New Project Section */}
                <div className="border rounded-lg p-6 bg-white shadow-sm border-[#D0D8E6]">
                  <h2 className="text-xl font-semibold mb-4 text-[#2D4777] border-b pb-2 border-[#D0D8E6]">Создать новый проект</h2>
                  <p className="text-[#2D4777] mb-6 text-sm">Начните новый проект с нуля</p>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateNewProject)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Название проекта *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Введите название проекта"
                                {...field}
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit"
                        disabled={!form.formState.isValid}
                        className="w-full bg-[#2D4777] hover:bg-[#2C3E50] text-white h-11 font-medium"
                      >
                        Создать проект
                      </Button>
                    </form>
                  </Form>
                </div>
                
                {/* Select Existing Project Section */}
                <div className="border rounded-lg p-6 bg-white shadow-sm border-[#D0D8E6]">
                  <h2 className="text-xl font-semibold mb-4 text-[#2D4777] border-b pb-2 border-[#D0D8E6]">Выбрать существующий проект</h2>
                  <p className="text-[#2D4777] mb-6 text-sm">Открыть один из ваших проектов</p>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {mockProjects.length > 0 ? (
                      mockProjects.map((project) => (
                        <div 
                          key={project.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors border-[#D0D8E6]"
                          onClick={() => handleSelectProject(project.id)}
                        >
                          <div className="font-medium text-[#2D4777]">{project.name}</div>
                          <div className="text-sm text-gray-500 mt-1">Последнее изменение: {new Date(project.lastModified).toLocaleDateString('ru-RU')}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        Нет доступных проектов
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>Ваше решение для создания профессиональных коммерческих предложений</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <footer className="py-6 text-center text-xs text-muted-foreground border-t bg-white">
        <p>PropoCraft &copy; {new Date().getFullYear()} | ОТДЕЛ СТРАТЕГИЧЕСКОГО ПЛАНИРОВАНИЯ</p>
      </footer>
    </div>
  );
}