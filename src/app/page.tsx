"use client";
import { useState, useEffect, useCallback } from 'react';
import { EditorSection } from './editor-section';
import { PreviewSection } from './preview-section';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Download, Github, Moon, Sun, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash } from 'lucide-react';

const licenses = {
  MIT: '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)',
  Apache: '[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)',
  GNU: '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)',
  ISC: '[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)',
};

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
  
  // State definitions
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
  // For deployments, ensure you use the correct type
  interface Deployment { provider: string; url: string; }
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [badgeStyle, setBadgeStyle] = useState("flat");
  
  const [openSections, setOpenSections] = useState({
    project: true,
    badges: true,
    documentation: true,
    media: true,
  });

  // Persist state to localStorage on change and load on mount
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
      setBadgeStyle(state.badgeStyle || "flat");
    }
  }, []);

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
  }, [title, username, repo, description, installation, usage, features, contributing, tests, license, demoUrl, coverImage, badges, tocEnabled, development, gifUrl, deployments, badgeStyle]);

  const generateReadme = useCallback(() => {
    try {
      const sections = [];
      const tocItems = [];

      if (coverImage) sections.push(`![Cover](${coverImage})`);
      sections.push(`# ${title}\n${badges.join(' ')}\n${licenses[license as keyof typeof licenses] || ''}\n`);
      if (description) sections.push(`## Description\n${description}\n`);
      if (demoUrl) sections.push(`## Quick Start Demo\n${demoUrl.includes('http') ? `[Demo Preview](${demoUrl})` : demoUrl}\n`);
      
      // NEW: Include the Demo GIF if provided.
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

  const downloadMarkdown = () => {
    try {
      const blob = new Blob([readmeContent], { type: 'text/markdown' });
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

  //copy button
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

  // Clear button handler
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
    setBadgeStyle("flat");
    toast.success("All fields cleared!");
  };

  return (
    <main className="container mx-auto p-4 max-w-7xl">
      <header className="flex items-center justify-between mb-8 pb-4 border-b-subtle">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Github PRO Readme Generator</h1>
          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-300 hover:text-indigo-900 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300 ">
            v0.1
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {resolvedTheme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
          <Button variant="outline" asChild>
            <a
              href={`https://github.com/korybantes/github-pro-readme-generator`}
              target="_blank"
              className="flex items-center gap-2"
            >
              <Star size={16} />
              <span>Star on GitHub</span>
            </a>
          </Button>
          <div className="tooltip">
            <Button variant="outline" asChild>
              <a
                href="https://github.com/korybantes"
                target="_blank"
                className="flex items-center gap-2"
              >
                <Github size={16} />
                <span>korybantes</span>
              </a>
            </Button>
            <span className="tooltip-text">Follow me on GitHub</span>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GitHub Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-username"
                className="border-subtle"
              />
            </div>
            <div className="space-y-2">
              <Label>Repository Name</Label>
              <Input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="your-repo"
                className="border-subtle"
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
            repo={repo}
            tocEnabled={tocEnabled}
            openSections={openSections}
            setOpenSections={setOpenSections}
            setTocEnabled={setTocEnabled}
            gifUrl={gifUrl}
            setGifUrl={setGifUrl}
            deployments={deployments}
            setDeployments={setDeployments}
          />

          <div className="flex gap-3 border-t-subtle pt-4">
            <Button onClick={downloadMarkdown} className="flex-1 gap-2">
              <Download size={16} />
              Export .md
            </Button>
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

        <PreviewSection content={readmeContent} licenses={Object.values(licenses)} badgeStyle={badgeStyle} />
      </div>
    </main>
  );
}
