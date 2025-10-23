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
    borderColor: branding.accentColor,
    color: '#2D4777',
  } as CSSProperties;

  const createMarkup = (htmlString: string) => {
    return { __html: htmlString };
  };

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements = [];
    let currentParagraphs: string[] = [];
  
    const flushParagraphs = () => {
      if (currentParagraphs.length > 0) {
        elements.push(<p key={`p-${elements.length}`} dangerouslySetInnerHTML={createMarkup(currentParagraphs.join('<br />'))}></p>);
        currentParagraphs = [];
      }
    };
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('### ')) {
        flushParagraphs();
        elements.push(<h3 key={`h3-${i}`} className="text-xl font-semibold font-headline mt-6 mb-2">{line.substring(4)}</h3>);
      } else if (line.startsWith('## ')) {
        flushParagraphs();
        elements.push(<h2 key={`h2-${i}`} className="text-2xl font-bold font-headline mt-8 mb-4 pb-2 border-b" style={{ color: '#2D4777', borderColor: '#FFC502' }}>{line.substring(3)}</h2>);
      } else if (line.startsWith('# ')) {
        flushParagraphs();
        elements.push(<h1 key={`h1-${i}`} className="text-3xl font-bold font-headline">{line.substring(2)}</h1>);
      } else if (line.startsWith('<img')) {
        flushParagraphs();
        elements.push(<div key={`img-div-${i}`} dangerouslySetInnerHTML={createMarkup(line)} />);
      }
      else {
        // Allow empty lines to create paragraph breaks
        if(line.trim() === '') {
            flushParagraphs();
        } else {
            currentParagraphs.push(line);
        }
      }
    }
    flushParagraphs();
    return elements;
  };
  
  const cardStyle = {
    backgroundImage: branding.backgroundUrl ? `url(${branding.backgroundUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };


  return (
    <main className="flex-1 p-4 sm:p-6 md:p-10 bg-transparent print-container relative">
      <Card className="w-full max-w-4xl mx-auto shadow-xl print-content overflow-hidden" id="proposal-preview">
         <div className="absolute inset-0" style={cardStyle}></div>
         <CardContent className="p-8 md:p-12 relative bg-card/95">
          <div className="absolute top-0 -right-8 bottom-0 flex flex-col justify-around h-full py-4 pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <Image
                    src="https://searchindustrial.ru/img/Logo_dark_text.png"
                    alt="Watermark"
                    width={100}
                    height={20}
                    className="object-contain opacity-45 -rotate-90"
                  />
                </div>
              ))}
            </div>
          <header className="mb-12">
             <div className="mb-8 h-[80px] flex items-center justify-center">
              {branding.logoUrl ? (
                <Image
                  src={branding.logoUrl}
                  alt="Логотип компании"
                  width={640}
                  height={160}
                  className="object-contain mx-auto"
                  data-ai-hint="company logo"
                />
              ) : (
                <div className="flex items-center justify-center gap-2 text-muted-foreground h-[80px]">
                  <PropoCraftIcon className="w-6 h-6" />
                  <span className="font-semibold">{branding.companyName || 'Ваша компания'}</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold font-headline" style={{ color: '#2D4777' }}>
                {proposal.projectName || 'Предложение по проекту'}
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Подготовлено для: {proposal.clientName || 'Уважаемый клиент'}
              </p>
            </div>
          </header>

          <Separator className="my-10" style={{ backgroundColor: '#FFC502', height: '2px' }} />

          <section>
            <div
              className="prose prose-lg max-w-none"
              style={{ '--tw-prose-headings': '#2D4777', color: '#2D4777' } as CSSProperties}
            >
              {proposal.fullText ? (
                renderContent(proposal.fullText)
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <p>Содержание вашего предложения появится здесь.</p>
                  <p className="text-sm">Начните с выбора проблем из библиотеки.</p>
                </div>
              )}
            </div>
          </section>

          <footer className="mt-16 pt-6 border-t text-center text-xs text-muted-foreground">
            <p>
              {branding.companyName || 'Ваша компания'} | ОТДЕЛ СТРАТЕГИЧЕСКОГО ПЛАНИРОВАНИЯ
            </p>
            <p>{new Date().toLocaleDateString()}</p>
          </footer>
        </CardContent>
      </Card>
    </main>
  );
}
