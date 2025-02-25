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
    <header className="w-full bg-background border-b-subtle">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Side: Logo and Title */}
        <div className="flex items-center gap-3 border-b-subtle pb-1">
          <Image
            src={resolvedTheme === "dark" ? logoWhite : logo}
            alt="Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <h1 className="text-lg sm:text-xl font-semibold">
            read-me.pro - README.md Creator
          </h1>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {resolvedTheme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>

          {/* GitHub Buttons */}
          <div className="flex gap-2">
            {/* Mobile: Show "Star" only */}
            <Button variant="outline" className="sm:hidden" asChild>
              <a
                href="https://github.com/korybantes/read-me-pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Star size={16} />
                <span>Star</span>
              </a>
            </Button>

            {/* Desktop: Show Star + Follow Buttons */}
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/korybantes/github-pro-readme-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Star size={16} />
                  <span>Star</span>
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/korybantes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github size={16} />
                  <span>Follow Me</span>
                </a>
              </Button>
              <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-300 hover:text-indigo-900 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300">
            v0.1
          </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
