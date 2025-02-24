"use client";
import { Card } from '@/components/ui/card';
import type { MarkedOptions } from 'marked';
import { marked } from 'marked';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/atom-one-dark.css';

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

export function PreviewSection({ content, licenses }: { content: string, licenses: string[] }) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    try {
      const parsed = marked.parse(content) as string;
      setHtmlContent(parsed);
      
      // Highlight both sections
      const hljs = require('highlight.js');
      hljs.highlightAll();
      
      // Manually highlight raw markdown
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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Rendered Preview</h3>
            <Badge variant="outline">v0.1</Badge>
          </div>
          <Badge variant="secondary">Live</Badge>
        </div>
        <div className="h-[70vh] overflow-auto rounded-md border-subtle p-4">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: htmlContent,
            }}
            ref={(node) => {
              if (node) {
                // Highlight codes
                const hljs = require('highlight.js');
                node.querySelectorAll('pre code').forEach((block) => {
                  // Only highlight if not already processed
                  if (!block.classList.contains('hljs')) {
                    hljs.highlightElement(block);
                  }
                });
              }
            }}
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
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
                __html: require('highlight.js').highlight(content, { 
                  language: 'xl' 
                }).value
              }}
            />
          </pre>
        </div>
      </Card>
    </div>
  );
}