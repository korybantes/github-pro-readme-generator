"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

const BADGE_TEMPLATES = {
  "GitHub Stats": {
    Forks: "https://img.shields.io/github/forks/{username}/{repo}?style=for-the-badge",
    Stars: "https://img.shields.io/github/stars/{username}/{repo}?style=for-the-badge",
    Issues: "https://img.shields.io/github/issues/{username}/{repo}?style=for-the-badge",
    "Last Commit": "https://img.shields.io/github/last-commit/{username}/{repo}?style=for-the-badge"
  },
  "Tech Stack": {
    React: "https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB",
    TypeScript: "https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white",
    NodeJS: "https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white",
    Python: "https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"
  },
  "Social": {
    Twitter: "https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white",
    LinkedIn: "https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white",
    Discord: "https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white"
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

  const addBadge = () => {
    if (!selectedBadge) return;
    
    const badgeUrl = selectedBadge
      .replaceAll("{username}", username)
      .replaceAll("{repo}", repo);
    
    const badgeName = Object.entries(BADGE_TEMPLATES[selectedCategory as keyof typeof BADGE_TEMPLATES])
      .find(([_, url]) => url === selectedBadge)?.[0] || "Badge";

    const badgeHtml = `<img alt="${badgeName}" src="${badgeUrl}" />`;
    
    setBadges([...badges, badgeHtml]);
    setSelectedCategory("");
    setSelectedBadge("");
  };

  const removeBadge = (index: number) => {
    setBadges(badges.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Badge Manager</Label>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category"
                           className="overflow-auto rounded border-subtle" />
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
            <SelectTrigger>
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

          <Button onClick={addBadge} disabled={!selectedBadge}>
            Add
          </Button>
        </div>

        {(selectedCategory === "GitHub Stats" && (!username || !repo)) && (
          <p className="text-sm text-muted-foreground">
            GitHub badges require username and repository name
          </p>
        )}
      </div>

      {/* Badges Display */}
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, index) => (
          <div key={index} className="relative group">
            <div 
              className="flex-shrink-0" 
              dangerouslySetInnerHTML={{ __html: badge }} 
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => removeBadge(index)}
              className="absolute -right-2 -top-2 h-6 w-6 flat-square bg-destructive/80 hover:bg-destructive text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}