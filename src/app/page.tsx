"use client";
import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/ui/header';
import { EditorSection } from './editor-section';
import { PreviewSection } from './preview-section';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Download, Github, Moon, Sun, Star, Trash, Undo, Redo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
// Import marked for PDF conversion
import { marked } from 'marked';
//header


const licenses = {
  MIT: '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)',
  Apache:
    '[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)',
  GNU: '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)',
  ISC: '[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)',
};

interface Deployment {
  provider: string;
  url: string;
}

interface HomeState {
  title: string;
  username: string;
  repo: string;
  description: string;
  installation: string;
  usage: string;
  features: string[];
  contributing: string;
  tests: string;
  license: string;
  demoUrl: string;
  coverImage: string;
  badges: string[];
  tocEnabled: boolean;
  development: string;
  gifUrl: string;
  deployments: Deployment[];
  badgeStyle: string;
}

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();

  // Main editor states
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [repo, setRepo] = useState('');
  const [description, setDescription] = useState('');
  const [installation, setInstallation] = useState('');
  const [usage, setUsage] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [contributing, setContributing] = useState('');
  const [tests, setTests] = useState('');
  const [license, setLicense] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [badges, setBadges] = useState<string[]>([]);
  const [tocEnabled, setTocEnabled] = useState(true);
  const [development, setDevelopment] = useState('');
  const [readmeContent, setReadmeContent] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [badgeStyle, setBadgeStyle] = useState('flat');

  // New state for Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Version History states
  const initialVersion: HomeState = {
    title: '',
    username: '',
    repo: '',
    description: '',
    installation: '',
    usage: '',
    features: [''],
    contributing: '',
    tests: '',
    license: '',
    demoUrl: '',
    coverImage: '',
    badges: [],
    tocEnabled: true,
    development: '',
    gifUrl: '',
    deployments: [],
    badgeStyle: 'flat',
  };
  const [history, setHistory] = useState<HomeState[]>([initialVersion]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [skipHistory, setSkipHistory] = useState(false);

  // Section open states
  const [openSections, setOpenSections] = useState({
    project: true,
    badges: true,
    documentation: true,
    media: true,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('readmeGeneratorState');
    if (stored) {
      const state = JSON.parse(stored);
      setTitle(state.title || '');
      setUsername(state.username || '');
      setRepo(state.repo || '');
      setDescription(state.description || '');
      setInstallation(state.installation || '');
      setUsage(state.usage || '');
      setFeatures(state.features || ['']);
      setContributing(state.contributing || '');
      setTests(state.tests || '');
      setLicense(state.license || '');
      setDemoUrl(state.demoUrl || '');
      setCoverImage(state.coverImage || '');
      setBadges(state.badges || []);
      setTocEnabled(state.tocEnabled ?? true);
      setDevelopment(state.development || '');
      setGifUrl(state.gifUrl || '');
      setDeployments(state.deployments || []);
      setBadgeStyle(state.badgeStyle || 'flat');
    }
  }, []);

  // Auto-save state to localStorage
  useEffect(() => {
    const state = {
      title,
      username,
      repo,
      description,
      installation,
      usage,
      features,
      contributing,
      tests,
      license,
      demoUrl,
      coverImage,
      badges,
      tocEnabled,
      development,
      gifUrl,
      deployments,
      badgeStyle,
    };
    localStorage.setItem('readmeGeneratorState', JSON.stringify(state));
  }, [
    title,
    username,
    repo,
    description,
    installation,
    usage,
    features,
    contributing,
    tests,
    license,
    demoUrl,
    coverImage,
    badges,
    tocEnabled,
    development,
    gifUrl,
    deployments,
    badgeStyle,
  ]);

  // Version History: Save new version whenever key fields change
  useEffect(() => {
    if (skipHistory) return;
    const currentVersion: HomeState = {
      title,
      username,
      repo,
      description,
      installation,
      usage,
      features,
      contributing,
      tests,
      license,
      demoUrl,
      coverImage,
      badges,
      tocEnabled,
      development,
      gifUrl,
      deployments,
      badgeStyle,
    };
    // Only add if different from the last version
    const lastVersion = history[historyIndex];
    if (JSON.stringify(currentVersion) !== JSON.stringify(lastVersion)) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(currentVersion);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [
    title,
    username,
    repo,
    description,
    installation,
    usage,
    features,
    contributing,
    tests,
    license,
    demoUrl,
    coverImage,
    badges,
    tocEnabled,
    development,
    gifUrl,
    deployments,
    badgeStyle,
  ]);

  const applyVersion = (version: HomeState) => {
    // Set all states from a version object.
    setTitle(version.title);
    setUsername(version.username);
    setRepo(version.repo);
    setDescription(version.description);
    setInstallation(version.installation);
    setUsage(version.usage);
    setFeatures(version.features);
    setContributing(version.contributing);
    setTests(version.tests);
    setLicense(version.license);
    setDemoUrl(version.demoUrl);
    setCoverImage(version.coverImage);
    setBadges(version.badges);
    setTocEnabled(version.tocEnabled);
    setDevelopment(version.development);
    setGifUrl(version.gifUrl);
    setDeployments(version.deployments);
    setBadgeStyle(version.badgeStyle);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setSkipHistory(true);
      const newIndex = historyIndex - 1;
      applyVersion(history[newIndex]);
      setHistoryIndex(newIndex);
      setSkipHistory(false);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setSkipHistory(true);
      const newIndex = historyIndex + 1;
      applyVersion(history[newIndex]);
      setHistoryIndex(newIndex);
      setSkipHistory(false);
    }
  };

  const generateReadme = useCallback(() => {
    try {
      const sections = [];
      const tocItems = [];

      if (coverImage) sections.push(`![Cover](${coverImage})`);
      sections.push(`# ${title}\n${badges.join(' ')}\n${licenses[license as keyof typeof licenses] || ''}\n`);
      if (description) sections.push(`## Description\n${description}\n`);
      if (demoUrl)
        sections.push(`## Quick Start Demo\n${demoUrl.includes('http') ? `[Demo Preview](${demoUrl})` : demoUrl}\n`);
      if (gifUrl) sections.push(`## Demo GIF\n![Demo GIF](${gifUrl})\n`);

      if (tocEnabled) {
        tocItems.push(
          '- [Project Title](#project-title)',
          description && '- [Description](#description)',
          demoUrl && '- [Quick Start Demo](#quick-start-demo)',
          gifUrl && '- [Demo GIF](#demo-gif)',
          '- [Table of Contents](#table-of-contents)',
          installation && '- [Installation](#installation)',
          usage && '- [Usage](#usage)',
          features.some(f => f) && '- [Features](#features)',
          development && '- [Development](#development)',
          contributing && '- [Contribute](#contribute)',
          license && '- [License](#license)'
        );
        sections.push(`## Table of Contents\n${tocItems.filter(Boolean).join('\n')}\n`);
      }

      if (installation) sections.push(`## Installation\n\`\`\`bash\n${installation}\n\`\`\`\n`);
      if (usage) sections.push(`## Usage\n${usage}\n`);
      if (features.some(f => f)) sections.push(`## Features\n${features.filter(f => f).map(f => `- ${f}`).join('\n')}\n`);
      if (development) sections.push(`## Development\n\`\`\`bash\n${development}\n\`\`\`\n`);
      if (contributing) sections.push(`## Contribute\n${contributing}\n`);
      if (tests) sections.push(`## Tests\n\`\`\`bash\n${tests}\n\`\`\`\n`);
      if (license) sections.push(`## License\nThis project is licensed under the ${license} License.\n`);

      setReadmeContent(sections.filter(Boolean).join('\n'));
    } catch {
      toast.error('Error generating README content');
    }
  }, [title, badges, license, description, demoUrl, gifUrl, tocEnabled, installation, usage, features, development, contributing, tests, coverImage]);

  useEffect(() => {
    generateReadme();
  }, [generateReadme]);

  // Define the signature to be appended to every exported file.
  const signatureMarkdown =
    "\n\n[Made by Github Pro Readme Generator 🚀](https://read-me.pro)";

  const downloadMarkdown = () => {
    try {
      const blob = new Blob([readmeContent + signatureMarkdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download file');
    }
  };

  const downloadHTML = () => {
    try {
      // Convert markdown signature to an HTML anchor tag
      const signatureHTML = `<br><br><a href="https://read-me.pro">Made by Github Pro Readme Generator 🚀</a>`;
      const html = `
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>${title} - README</title>
          </head>
          <body>
            ${readmeContent.replace(/\n/g, '<br>')}
            ${signatureHTML}
          </body>
        </html>
      `;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download HTML');
    }
  };

  // For PDF export using html2pdf.js with dynamic import.
  const downloadPDF = async () => {
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      // Convert markdown to HTML for PDF export using marked.
      const signatureHTML = `<br><br><a href="https://read-me.pro">Made by Github Pro Readme Generator 🚀</a>`;
      const htmlContent = marked.parse(readmeContent) + signatureHTML;
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      html2pdf()
        .from(element)
        .set({
          margin: 1,
          filename: 'README.pdf',
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        })
        .save();
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  const handleExportSelect = (option: string) => {
    if (option === 'markdown') {
      downloadMarkdown();
    } else if (option === 'html') {
      downloadHTML();
    } else if (option === 'pdf') {
      downloadPDF();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(readmeContent);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy!');
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const clearAll = () => {
    setTitle('');
    setUsername('');
    setRepo('');
    setDescription('');
    setInstallation('');
    setUsage('');
    setFeatures(['']);
    setContributing('');
    setTests('');
    setLicense('');
    setDemoUrl('');
    setCoverImage('');
    setBadges([]);
    setTocEnabled(true);
    setDevelopment('');
    setGifUrl('');
    setDeployments([]);
    setBadgeStyle('flat');
    toast.success('All fields cleared!');
  };

  return (
    <main className="container mx-auto p-4 max-w-7xl">
      <Header />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GitHub Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-username"
                className="border-b-subtle border rounded"
              />
            </div>
            <div className="space-y-2">
              <Label>Repository Name</Label>
              <Input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="your-repo"
                className="border-b-subtle border rounded"
              />
            </div>
          </div>

          <EditorSection
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            installation={installation}
            setInstallation={setInstallation}
            usage={usage}
            setUsage={setUsage}
            features={features}
            setFeatures={setFeatures}
            contributing={contributing}
            updateFeature={(index, value) => {
              const newFeatures = [...features];
              newFeatures[index] = value;
              setFeatures(newFeatures);
            }}
            setContributing={setContributing}
            tests={tests}
            setTests={setTests}
            license={license}
            setLicense={setLicense}
            demoUrl={demoUrl}
            setDemoUrl={setDemoUrl}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            development={development}
            setDevelopment={setDevelopment}
            badges={badges}
            setBadges={setBadges}
            username={username}
            setUsername={setUsername}
            repo={repo}
            setRepo={setRepo}
            tocEnabled={tocEnabled}
            openSections={openSections}
            setOpenSections={setOpenSections}
            setTocEnabled={setTocEnabled}
            gifUrl={gifUrl}
            setGifUrl={setGifUrl}
            deployments={deployments}
            setDeployments={setDeployments}
            badgeStyle={badgeStyle}
            setBadgeStyle={setBadgeStyle}
          />

          <div className="flex gap-3 border-t-subtle pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex-1 gap-2">
                  <Download size={16} />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleExportSelect('markdown')}>
                  Export .md <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300">README.md</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleExportSelect('html')} disabled>
                  Export HTML <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">with v0.2</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleExportSelect('pdf')} disabled>
                  Export PDF <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">with v0.2</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={copyToClipboard} className="flex-1 gap-2">
              <Copy size={16} />
              Copy
            </Button>
            <Button variant="outline" onClick={clearAll} className="flex-1 gap-2">
              <Trash size={16} />
              Clear All
            </Button>
          </div>
        </div>

        <PreviewSection
          content={readmeContent}
          licenses={Object.values(licenses)}
          badgeStyle={badgeStyle}
          previewTheme={resolvedTheme || 'light'}
        />
      </div>
    </main>
  );
}
