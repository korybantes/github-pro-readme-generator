"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { BadgeSelector } from "@/components/badge-selector";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { useState } from "react";

const SortableItem = ({
  id,
  children,
  onRemove,
}: {
  id: string;
  children: React.ReactNode;
  onRemove: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 group">
      <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
        <GripVertical size={16} />
      </button>
      <div className="flex-1">{children}</div>
      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={onRemove}>
        <Trash size={16} />
      </Button>
    </div>
  );
};

interface EditorSectionProps {
  title: string;
  setTitle: (title: string) => void;
  coverImage: string;
  setCoverImage: (url: string) => void;
  description: string;
  setDescription: (description: string) => void;
  demoUrl: string;
  setDemoUrl: (url: string) => void;
  license: string;
  setLicense: (license: string) => void;
  installation: string;
  setInstallation: (installation: string) => void;
  usage: string;
  setUsage: (usage: string) => void;
  features: string[];
  setFeatures: (features: string[]) => void;
  updateFeature: (index: number, feature: string) => void;
  development: string;
  setDevelopment: (development: string) => void;
  contributing: string;
  setContributing: (contributing: string) => void;
  tests: string;
  setTests: (tests: string) => void;
  badges: string[];
  setBadges: (badges: string[]) => void;
  username: string;
  repo: string;
  tocEnabled: boolean;
  setTocEnabled: (value: boolean) => void;
  openSections: {
    project: boolean;
    badges: boolean;
    documentation: boolean;
  };
  setOpenSections: React.Dispatch<
    React.SetStateAction<{
      project: boolean;
      badges: boolean;
      documentation: boolean;
    }>
  >;
}

export function EditorSection({ ...props }: EditorSectionProps) {
  const addFeature = () => props.setFeatures([...props.features, ""]);
  const removeFeature = (index: number) =>
    props.setFeatures(props.features.filter((_, i) => i !== index));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = props.features.findIndex((f) => f === active.id);
      const newIndex = props.features.findIndex((f) => f === over.id);
      const newFeatures = arrayMove(props.features, oldIndex, newIndex);
      props.setFeatures(newFeatures);
    }
  };

  const toggleSection = (section: keyof typeof props.openSections) => {
    props.setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-6">
      {/* Project Metadata Section */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Header with switch always visible */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="bg-primary w-2 h-2 rounded-full" />
              Project Setup
            </h3>
            <Switch
              checked={props.openSections.project}
              onCheckedChange={() => toggleSection("project")}
            />
          </div>

          {/* Content conditionally rendered */}
          {props.openSections.project && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Project Title
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={props.title}
                    onChange={(e) => props.setTitle(e.target.value)}
                    placeholder="My Awesome Project"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cover Image URL</Label>
                  <Input
                    value={props.coverImage}
                    onChange={(e) => props.setCoverImage(e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                    type="url"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={props.description}
                  onChange={(e) => props.setDescription(e.target.value)}
                  placeholder="Project description..."
                  className="min-h-[100px] w-full"
                  maxLength={500}
                />
                <div className="text-sm text-muted-foreground">
                  {props.description.length}/500 characters
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Demo URL</Label>
                  <Input
                    value={props.demoUrl}
                    onChange={(e) => props.setDemoUrl(e.target.value)}
                    placeholder="https://example.com/demo"
                    type="url"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>License</Label>
                  <Select value={props.license} onValueChange={props.setLicense}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select license" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MIT">MIT License</SelectItem>
                      <SelectItem value="Apache">Apache 2.0</SelectItem>
                      <SelectItem value="GNU">GNU GPLv3</SelectItem>
                      <SelectItem value="ISC">ISC License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Badge Selector Section */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Header with switch always visible */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="bg-primary w-2 h-2 rounded-full" />
              Badges & Metadata
            </h3>
            <Switch
              checked={props.openSections.badges}
              onCheckedChange={() => toggleSection("badges")}
            />
          </div>

          {/* Content conditionally rendered */}
          {props.openSections.badges && (
            <div className="pt-4">
              <BadgeSelector
                badges={props.badges}
                setBadges={props.setBadges}
                username={props.username}
                repo={props.repo}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Documentation Sections */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Header with switches always visible */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="bg-primary w-2 h-2 rounded-full" />
              Documentation
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>TOC</Label>
                <Switch
                  checked={props.tocEnabled}
                  onCheckedChange={props.setTocEnabled}
                />
              </div>
              <Switch
                checked={props.openSections.documentation}
                onCheckedChange={() => toggleSection("documentation")}
              />
            </div>
          </div>

          {/* Content conditionally rendered */}
          {props.openSections.documentation && (
            <div className="space-y-6 pt-4">
              <SectionBlock title="Installation" value={props.installation} setValue={props.setInstallation} />
              <SectionBlock title="Usage" value={props.usage} setValue={props.setUsage} />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Features</Label>
                  <Button variant="outline" onClick={addFeature} className="gap-2">
                    <Plus size={16} />
                    Add Feature
                  </Button>
                </div>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <div className="space-y-2">
                    {props.features.map((feature, index) => (
                      <SortableItem key={index} id={feature} onRemove={() => removeFeature(index)}>
                        <Input
                          value={feature}
                          onChange={(e) => props.updateFeature(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                          className="w-full"
                        />
                      </SortableItem>
                    ))}
                  </div>
                </DndContext>
              </div>

              <SectionBlock title="Development" value={props.development} setValue={props.setDevelopment} />
              <SectionBlock title="Contributing" value={props.contributing} setValue={props.setContributing} />
              <SectionBlock title="Tests" value={props.tests} setValue={props.setTests} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

const SectionBlock = ({
  title,
  value,
  setValue,
}: {
  title: string;
  value: string;
  setValue: (v: string) => void;
}) => (
  <div className="space-y-2">
    <Label className="text-lg font-medium">{title}</Label>
    <Textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={`Enter ${title.toLowerCase()}...`}
      className="min-h-[120px] w-full"
    />
  </div>
);

function arrayMove<T>(array: T[], oldIndex: number, newIndex: number): T[] {
  const newArray = [...array];
  const [removed] = newArray.splice(oldIndex, 1);
  newArray.splice(newIndex, 0, removed);
  return newArray;
}
