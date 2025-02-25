"use client";
import { Card } from '@/components/ui/card';
import type { MarkedOptions } from 'marked';
import { marked } from 'marked';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/atom-one-dark.css';
import { Button } from '@/components/ui/button';
import { Redo, Undo } from 'lucide-react';

interface CustomMarkedOptions extends MarkedOptions {
  highlight?: (code: string, lang: string) => string;
}

marked.setOptions({
  breaks: true,
  gfm: true,
  silent: true,
  highlight: (code, lang) => {
    const hljs = require('highlight.js');
    const validLang = hljs.getLanguage(lang) ? lang : 'plaintext';
    try {
      return hljs.highlight(code, { language: validLang }).value;
    } catch (error) {
      return hljs.highlightAuto(code).value;
    }
  },
} as CustomMarkedOptions);

interface PreviewSectionProps {
  content: string;
  licenses: string[];
  badgeStyle: string;
  previewTheme: string; // new prop
}

export function PreviewSection({ content, licenses, badgeStyle, previewTheme }: PreviewSectionProps) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    try {
      const parsed = marked.parse(content) as string;
      setHtmlContent(parsed);
      const hljs = require('highlight.js');
      hljs.highlightAll();
      const markdownBlocks = document.querySelectorAll('code.language-markdown');
      markdownBlocks.forEach((block) => {
        if (!block.innerHTML) {
          block.innerHTML = hljs.highlightAuto(block.textContent || '', ['markdown']).value;
        }
      });
    } catch {
      setHtmlContent('<p>Error rendering preview</p>');
    }
  }, [content]);

  useEffect(() => {
    if (badgeStyle) {
      const container = document.querySelector('.prose');
      if (container) {
        const images = container.querySelectorAll('img');
        images.forEach((img) => {
          const src = img.getAttribute('src');
          if (src && src.includes('?style=')) {
            const newSrc = src.replace(/(style=)[^&]+/, `$1${badgeStyle}`);
            img.setAttribute('src', newSrc);
          }
        });
      }
    }
  }, [badgeStyle, htmlContent]);

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  useEffect(() => {
    setHistory([content]);
    setHistoryIndex(0);
  }, [content]);

  function handleUndo(): void {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setHtmlContent(marked.parse(history[historyIndex - 1]) as string);
    }
  }

  function handleRedo(): void {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setHtmlContent(marked.parse(history[historyIndex + 1]) as string);
    }
  }

  useEffect(() => {
    if (history[historyIndex] !== content) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(content);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [content]);
  return (
    <div className={`space-y-6 ${previewTheme === 'dark' ? 'dark' : ''}`}>
      <Card className="p-6 border-b-subtle">
        <div className="flex items-center justify-between mb-4 border-b-subtle">
          <div className="flex items-center gap-2 border-b-subtle">
            <h3 className="text-lg font-semibold">Rendered Preview</h3>
            <Badge variant="outline">v0.1</Badge>
          </div>
            {/* Undo/Redo buttons */}
            <div className="flex gap-2">
            <Button onClick={() => handleUndo()} className="gap-1" disabled={historyIndex === 0} variant="secondary">
              <Undo size={16} />
              Undo
            </Button>
            <Button onClick={() => handleRedo()} className="gap-1" disabled={historyIndex === history.length - 1} variant="secondary">
              <Redo size={16} />
              Redo
            </Button>
            </div>
          <Badge variant="secondary">Live</Badge>
        </div>
        <div className="h-[70vh] overflow-auto rounded-md border-subtle p-4">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            ref={(node) => {
              if (node) {
                const hljs = require('highlight.js');
                node.querySelectorAll('pre code').forEach((block) => {
                  if (!block.classList.contains('hljs')) {
                    hljs.highlightElement(block);
                  }
                });
              }
            }}
          />
        </div>
      </Card>

      <Card className="p-6 border-b-subtle">
        <div className="flex items-center justify-between mb-4 border-b-subtle">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Raw Markdown</h3>
            <Badge variant="secondary">GitHub Flavored</Badge>
          </div>
          <Badge variant="outline">Read-only</Badge>
        </div>
        <div className="h-[40vh] overflow-auto rounded-md border-subtle p-4">
          <pre className="text-sm font-mono leading-relaxed">
            <code 
              className="language-xl block whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: require('highlight.js').highlight(content, { language: 'xl' }).value
              }}
            />
          </pre>
        </div>
      </Card>
    </div>
  );
}