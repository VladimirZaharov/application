'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Branding, Proposal } from '@/lib/types';
import { PropoCraftIcon } from './icons';

interface PreviewPanelProps {
  proposal: Proposal;
  branding: Branding;
}

export default function PreviewPanel({ proposal, branding }: PreviewPanelProps) {
  const accentStyle = {
    color: branding.accentColor,
    borderColor: branding.accentColor,
  } as CSSProperties;

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-10 bg-muted/40 print-container">
      <Card className="w-full max-w-4xl mx-auto shadow-xl print-content" id="proposal-preview">
        <CardContent className="p-8 md:p-12">
          <header className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold font-headline" style={accentStyle}>
                {proposal.projectName || 'Project Proposal'}
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Prepared for: {proposal.clientName || 'Valued Client'}
              </p>
            </div>
            <div className="flex-shrink-0">
              {branding.logoUrl ? (
                <Image
                  src={branding.logoUrl}
                  alt="Company Logo"
                  width={140}
                  height={70}
                  className="object-contain"
                  data-ai-hint="company logo"
                />
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PropoCraftIcon className="w-6 h-6" />
                  <span className="font-semibold">{branding.companyName || 'Your Company'}</span>
                </div>
              )}
            </div>
          </header>

          <Separator className="my-10" style={{ backgroundColor: branding.accentColor, height: '2px' }} />

          <section>
            <div
              className="prose prose-lg max-w-none"
              style={{ '--tw-prose-headings': branding.accentColor } as CSSProperties}
            >
              {proposal.fullText ? (
                proposal.fullText.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="font-headline" style={{color: branding.accentColor}}>{paragraph.substring(4)}</h3>;
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="font-headline" style={{color: branding.accentColor}}>{paragraph.substring(3)}</h2>;
                  }
                   if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="font-headline" style={{color: branding.accentColor}}>{paragraph.substring(2)}</h1>;
                  }
                  return <p key={index}>{paragraph}</p>;
                })
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <p>Your proposal content will appear here.</p>
                  <p className="text-sm">Start by selecting problems from the library.</p>
                </div>
              )}
            </div>
          </section>

          <footer className="mt-16 pt-6 border-t text-center text-xs text-muted-foreground">
            <p>
              {branding.companyName || 'Your Company'} | Generated with PropoCraft
            </p>
            <p>{new Date().toLocaleDateString()}</p>
          </footer>
        </CardContent>
      </Card>
    </main>
  );
}
