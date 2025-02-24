"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

const STYLE_OPTIONS = ["flat", "flat-square", "plastic", "for-the-badge", "social"];
const SIZE_OPTIONS = ["Small", "Medium", "Large"];
const SIZE_CLASS_MAP = {
  "Small": "w-16",
  "Medium": "w-24",
  "Large": "w-32"
};

const BADGE_TEMPLATES = {
  "GitHub Stats": {
    Forks: "https://img.shields.io/github/forks/{username}/{repo}?style=for-the-badge",
    Stars: "https://img.shields.io/github/stars/{username}/{repo}?style=for-the-badge",
    Issues: "https://img.shields.io/github/issues/{username}/{repo}?style=for-the-badge",
    "Last Commit": "https://img.shields.io/github/last-commit/{username}/{repo}?style=for-the-badge",
    Watchers: "https://img.shields.io/github/watchers/{username}/{repo}?style=for-the-badge"
  },
  "Build": {
    Travis: "https://img.shields.io/travis/{username}/{repo}?style=for-the-badge",
    AppVeyor: "https://img.shields.io/appveyor/ci/{username}/{repo}?style=for-the-badge",
    CircleCI: "https://img.shields.io/circleci/build/github/{username}/{repo}?style=for-the-badge",
    GitHubActions: "https://img.shields.io/github/actions/workflow/status/{username}/{repo}/build.yml?style=for-the-badge",
    "Build Status": "https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge"
  },
  "Coverage": {
    Coveralls: "https://img.shields.io/coveralls/github/{username}/{repo}?style=for-the-badge",
    Codecov: "https://img.shields.io/codecov/c/github/{username}/{repo}?style=for-the-badge"
  },
  "NPM": {
    Version: "https://img.shields.io/npm/v/{package}?style=for-the-badge",
    Downloads: "https://img.shields.io/npm/dw/{package}?style=for-the-badge",
    License: "https://img.shields.io/npm/l/{package}?style=for-the-badge"
  },
  "Tech Stack": {
    React: "https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB",
    Angular: "https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white",
    Vue: "https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white",
    NextJS: "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white",
    Gatsby: "https://img.shields.io/badge/Gatsby-663399?style=for-the-badge&logo=gatsby&logoColor=white",
    Svelte: "https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white",
    NodeJS: "https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white",
    JavaScript: "https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black",
    TypeScript: "https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white",
    Python: "https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white",
    Ruby: "https://img.shields.io/badge/Ruby-CC342D?style=for-the-badge&logo=ruby&logoColor=white",
    Rails: "https://img.shields.io/badge/Rails-CC0000?style=for-the-badge&logo=ruby-on-rails&logoColor=white",
    PHP: "https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white",
    Laravel: "https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white",
    CSharp: "https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white",
    DotNet: "https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=.net&logoColor=white",
    Java: "https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white",
    Go: "https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white",
    Rust: "https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white",
    Kotlin: "https://img.shields.io/badge/Kotlin-0095D5?style=for-the-badge&logo=kotlin&logoColor=white",
    Swift: "https://img.shields.io/badge/Swift-FA7343?style=for-the-badge&logo=swift&logoColor=white",
    Docker: "https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"
  },
  "Social": {
    Twitter: "https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white",
    LinkedIn: "https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white",
    GitHub: "https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white",
    Facebook: "https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white",
    Instagram: "https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white",
    YouTube: "https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white",
    Reddit: "https://img.shields.io/badge/Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white",
    Pinterest: "https://img.shields.io/badge/Pinterest-E60023?style=for-the-badge&logo=pinterest&logoColor=white",
    Medium: "https://img.shields.io/badge/Medium-00AB6C?style=for-the-badge&logo=medium&logoColor=white",
    Twitch: "https://img.shields.io/badge/Twitch-6441A5?style=for-the-badge&logo=twitch&logoColor=white",
    Snapchat: "https://img.shields.io/badge/Snapchat-FFFC00?style=for-the-badge&logo=snapchat&logoColor=black"
  },
  "Misc": {
    License: "https://img.shields.io/github/license/{username}/{repo}?style=for-the-badge",
    "Issues Closed": "https://img.shields.io/github/issues-closed/{username}/{repo}?style=for-the-badge",
    Contributors: "https://img.shields.io/github/contributors/{username}/{repo}?style=for-the-badge",
    "Repo Size": "https://img.shields.io/github/repo-size/{username}/{repo}?style=for-the-badge",
    "Last Release": "https://img.shields.io/github/v/release/{username}/{repo}?style=for-the-badge",
    "Open Issues": "https://img.shields.io/github/issues-raw/{username}/{repo}?style=for-the-badge"
  }
};

export function BadgeSelector({ badges, setBadges, username, repo }: {
  badges: string[];
  setBadges: (badges: string[]) => void;
  username: string;
  repo: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("for-the-badge");
  const [selectedSize, setSelectedSize] = useState<keyof typeof SIZE_CLASS_MAP>("Small");

  // Preview + URL
  const previewBadgeUrl = selectedBadge 
    ? selectedBadge
        .replaceAll("{username}", username)
        .replaceAll("{repo}", repo)
        .replace(/(style=)[^&]+/, `$1${selectedStyle}`)
    : "";

  const addBadge = () => {
    if (!selectedBadge) return;
    
    let badgeUrl = selectedBadge
      .replaceAll("{username}", username)
      .replaceAll("{repo}", repo)
      .replace(/(style=)[^&]+/, `$1${selectedStyle}`);
    
    const badgeName = Object.entries(BADGE_TEMPLATES[selectedCategory as keyof typeof BADGE_TEMPLATES])
      .find(([_, url]) => url === selectedBadge)?.[0] || "Badge";

    const badgeHtml = `<img alt="${badgeName}" src="${badgeUrl}" class="${SIZE_CLASS_MAP[selectedSize]} h-auto inline-block" />`;
    
    setBadges([...badges, badgeHtml]);
    setSelectedCategory("");
    setSelectedBadge("");
  };

  const removeBadge = (index: number) => {
    setBadges(badges.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-4 space-y-6 border-b-subtle">
      <div className="space-y-4">
        {/* Badge Selection Section */}
        <div>
          <Label className="mb-1 block">Badge Selection</Label> <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">Beta</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full border-b-subtle">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(BADGE_TEMPLATES).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={selectedBadge} 
              onValueChange={setSelectedBadge}
              disabled={!selectedCategory}
            >
              <SelectTrigger className="w-full border-b-subtle">
                <SelectValue placeholder="Select Badge" />
              </SelectTrigger>
              <SelectContent>
                {selectedCategory && Object.entries(
                  BADGE_TEMPLATES[selectedCategory as keyof typeof BADGE_TEMPLATES]
                ).map(([name, url]) => (
                  <SelectItem key={name} value={url}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Styling Section */}
        <div>
          <Label className="mb-1 block">Styling</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b-subtle">
            <Select 
            value={selectedStyle} 
            onValueChange={setSelectedStyle}
            disabled={!selectedBadge}>
              <SelectTrigger className="w-full border-b-subtle">
                <SelectValue placeholder="Select Style" />
              </SelectTrigger>
              <SelectContent>
                {STYLE_OPTIONS.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSize} onValueChange={(value)   => setSelectedSize(value as keyof typeof SIZE_CLASS_MAP) }>
              <SelectTrigger className="w-full border-b-subtle">
                <SelectValue placeholder="Select Size" />
              </SelectTrigger>
              <SelectContent>
                {SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addBadge} disabled={!selectedBadge} className="w-full">
              Add
            </Button>
          </div>
        </div>

        {(selectedCategory === "GitHub Stats" && (!username || !repo)) && (
          <p className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
            GitHub badges require username and repository name
          </p>
        )}

        {/* Preview Section */}
        {selectedBadge && (
          <div className="mt-4">
            <Label className="mb-1 block border-b-subtle">Preview:</Label>
            <div className="p-2 inline-block border-b-subtle">
              <img 
                alt="Preview Badge" 
                src={previewBadgeUrl} 
                className={`${SIZE_CLASS_MAP[selectedSize]} h-auto inline-block`} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Badges Display */}
      <div className="flex flex-wrap items-center gap-1">
        {badges.map((badge, index) => (
          <div key={index} className="relative group">
            <div className="flex-shrink-0" dangerouslySetInnerHTML={{ __html: badge }} />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => removeBadge(index)}
              className="absolute -right-2 -top-2 h-3 w-3 bg-destructive/50 hover:bg-destructive text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
