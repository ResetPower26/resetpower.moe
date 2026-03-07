// Responsible for parsing markdown content into a hierarchical heading tree for TOC rendering.
import { useMemo } from "react";
import { slugify } from "../utils/slugify";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
  children: TocHeading[];
}

function parseHeadings(markdown: string): TocHeading[] {
  const roots: TocHeading[] = [];
  // stack holds [node, level] pairs for the current ancestor chain
  const stack: { node: TocHeading; level: number }[] = [];

  for (const line of markdown.split("\n")) {
    const match = line.match(/^(#{1,6})\s+(.+)/);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2].trim();
    const node: TocHeading = { id: slugify(text), text, level, children: [] };

    // Pop ancestors that are at the same or deeper level
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].node.children.push(node);
    }

    stack.push({ node, level });
  }

  return roots;
}

export function useTableOfContents(markdown: string): TocHeading[] {
  return useMemo(() => parseHeadings(markdown), [markdown]);
}
