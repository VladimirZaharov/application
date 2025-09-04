'use client';

import { useEffect, useState, useTransition } from 'react';
import { handleToneAdjustment } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { problemLibrary } from '@/lib/data';
import type { Branding, Problem, Proposal } from '@/lib/types';
import EditorSidebar from './editor-sidebar';
import PreviewPanel from './preview-panel';

const defaultProposalText = (problems: Problem[]) => {
  const problemStatements =
    problems.length > 0
      ? problems
          .map(
            (p) =>
              `### ${p.title}\n${p.description}${p.screenshotUrl ? `\n\n<img src="${p.screenshotUrl}" alt="${p.title}" data-ai-hint="problem illustration" style="width: 100%; border-radius: 0.5rem; margin-top: 1rem;"/>` : ''}`
          )
          .join('\n\n')
      : 'No specific problems have been identified in this section. We recommend a discovery session to outline key challenges and opportunities.';

  return `## Introduction
This document outlines a proposal for our collaborative project. We have analyzed your current situation and identified key areas where our expertise can provide significant value. Our goal is to deliver a robust solution that addresses your challenges and helps you achieve your objectives.

## Identified Problems
Based on our preliminary analysis, we have identified the following challenges that need to be addressed:

${problemStatements}

## Proposed Solution
We propose a comprehensive solution that involves a multi-phased approach to tackle the identified problems. Our team of experts will work closely with you to ensure a seamless implementation and successful outcome. Further details on the specific deliverables and timeline will be provided upon acceptance of this proposal.

## Next Steps
We are excited about the possibility of partnering with you. To move forward, we suggest a follow-up meeting to discuss this proposal in detail and answer any questions you may have.`;
};

export default function PropoCraftEditor() {
  const { toast } = useToast();
  const [isAdjustingTone, startTransition] = useTransition();

  const [proposal, setProposal] = useState<Proposal>({
    clientName: 'Globex Corporation',
    projectName: 'Digital Transformation Initiative',
    fullText: '',
  });

  const [branding, setBranding] = useState<Branding>({
    logoUrl: 'https://picsum.photos/seed/logo/200/100',
    accentColor: '#8E44AD',
    companyName: 'Innovatech',
  });

  const [selectedProblems, setSelectedProblems] = useState<Problem[]>(() => [
    { ...problemLibrary[0] },
    { ...problemLibrary[2] },
  ]);

  useEffect(() => {
    setProposal((prev) => ({
      ...prev,
      fullText: defaultProposalText(selectedProblems),
    }));
  }, [selectedProblems]);

  const adjustTone = async (tone: string) => {
    if (!tone) return;
    
    startTransition(async () => {
      const result = await handleToneAdjustment(proposal.fullText, tone);
      if (result.success && result.text) {
        setProposal((prev) => ({ ...prev, fullText: result.text! }));
        toast({
          title: 'Tone Adjusted',
          description: `The proposal tone has been successfully set to "${tone}".`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Could not adjust the tone.',
        });
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <EditorSidebar
        proposal={proposal}
        setProposal={setProposal}
        branding={branding}
        setBranding={setBranding}
        selectedProblems={selectedProblems}
        setSelectedProblems={setSelectedProblems}
        adjustTone={adjustTone}
        isAdjustingTone={isAdjustingTone}
      />
      <PreviewPanel proposal={proposal} branding={branding} />
    </div>
  );
}
