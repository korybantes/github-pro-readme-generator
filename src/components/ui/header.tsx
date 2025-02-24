"use client";

import { Moon, Sun, Star, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import Image from "next/image";
import logo from "@/lib/logo.png";
import logoWhite from "@/lib/logo-white.png";

export const Header = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex items-center justify-between mb-8 pb-4 border-b-subtle">
      <div className="flex items-center gap-3">
        {/* Logo with theme support */}
        <Image
          src={resolvedTheme === "dark" ? logoWhite : logo}
          alt="Logo"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <h1 className="text-2xl font-semibold">read-me.pro - README.md Creator</h1>
        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-300 hover:text-indigo-900 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300">
          v0.1
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {resolvedTheme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
        </Button>

        {/* Star on GitHub Button */}
        <Button variant="outline" asChild>
          <a
            href="https://github.com/korybantes/github-pro-readme-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Star size={16} />
            <span>Star on GitHub</span>
          </a>
        </Button>

        {/* Follow Me on GitHub Button with Tooltip */}
        <div className="tooltip">
          <Button variant="outline" asChild>
            <a
              href="https://github.com/korybantes"
              target="_blank"
              rel="noopener noreferrer"
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
  );
};