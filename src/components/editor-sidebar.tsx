'use client';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import {
  Bot,
  Brush,
  Download,
  Image as ImageIcon,
  Library,
  Loader2,
  Settings,
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

interface EditorSidebarProps {
  proposal: Proposal;
  setProposal: Dispatch<SetStateAction<Proposal>>;
  branding: Branding;
  setBranding: Dispatch<SetStateAction<Branding>>;
  selectedProblems: Problem[];
  setSelectedProblems: Dispatch<SetStateAction<Problem[]>>;
  adjustTone: (tone: string) => Promise<void>;
  isAdjustingTone: boolean;
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
}: EditorSidebarProps) {
  const handleProblemSelection = (problem: Problem, checked: boolean) => {
    setSelectedProblems((prev) =>
      checked ? [...prev, problem] : prev.filter((p) => p.id !== problem.id)
    );
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
                  Proposal Details
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Your Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={branding.companyName}
                    onChange={handleBrandingChange}
                    placeholder="e.g., Innovate Solutions"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    value={proposal.clientName}
                    onChange={handleProposalChange}
                    placeholder="e.g., Globex Corporation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    name="projectName"
                    value={proposal.projectName}
                    onChange={handleProposalChange}
                    placeholder="e.g., Website Redesign"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="content">
              <AccordionTrigger className="px-4 text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Library className="h-5 w-5" />
                  Problem Library
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Select the problems this proposal will address.
                </p>
                {problemLibrary.map((problem) => (
                  <div key={problem.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-secondary transition-colors">
                    <Checkbox
                      id={problem.id}
                      checked={selectedProblems.some((p) => p.id === problem.id)}
                      onCheckedChange={(checked) =>
                        handleProblemSelection(problem, !!checked)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={problem.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {problem.title}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {problem.category}
                      </p>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="style">
              <AccordionTrigger className="px-4 text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Brush className="h-5 w-5" />
                  Styling &amp; Tone
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-6">
                <div className="space-y-4">
                   <h4 className="font-medium flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Company Branding</h4>
                   <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      name="logoUrl"
                      value={branding.logoUrl}
                      onChange={handleBrandingChange}
                      placeholder="https://your-logo.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
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
                  <h4 className="font-medium flex items-center gap-2"><Bot className="w-4 h-4" /> AI Tone Adjustment</h4>
                   <Select onValueChange={adjustTone} disabled={isAdjustingTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tone..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                    </SelectContent>
                  </Select>
                   {isAdjustingTone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adjusting tone...
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
            Download as PDF
          </Button>
        </div>
      </Card>
    </aside>
  );
}
