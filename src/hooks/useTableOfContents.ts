// Responsible for parsing markdown content into a hierarchical heading tree for TOC rendering.
import { useMemo } from "react";
import { slugify } from "../utils/slugify";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
  children: TocHeading[];
}

// Strip trailing ATX closing sequence (e.g. "## title ##" → "title")
function stripAtxClose(text: string): string {
  return text.replace(/\s+#+\s*$/, "").trim();
}

interface FenceState {
  char: string;
  minLength: number;
}

// Per CommonMark spec: a closing fence must use the same character as the opening fence
// and must be at least as long, with 0–3 spaces of optional indentation.
function matchClosingFence(line: string, fence: FenceState): boolean {
  const stripped = line.replace(/^ {0,3}/, "");
  if (stripped.length < fence.minLength) return false;
  return (
    stripped
      .split("")
      .every((c) => c === fence.char || c === " " || c === "\t") &&
    stripped
      .trimEnd()
      .split("")
      .every((c) => c === fence.char) &&
    stripped.trimEnd().length >= fence.minLength
  );
}

function parseHeadings(markdown: string): TocHeading[] {
  const roots: TocHeading[] = [];
  const stack: { node: TocHeading; level: number }[] = [];
  // Fenced code block tracking: store the opening fence char+length to match the closing fence
  let fence: FenceState | null = null;

  for (const line of markdown.split("\n")) {
    // Skip indented code blocks (4 spaces or 1 tab)
    if (/^( {4}|\t)/.test(line)) continue;

    // Detect fenced code block open/close (``` or ~~~, 3+ chars, same char to close)
    const fenceMatch = line.match(/^( {0,3})(`{3,}|~{3,})/);
    if (fenceMatch) {
      if (fence === null) {
        // Opening fence: record the fence character and minimum required closing length
        fence = { char: fenceMatch[2][0], minLength: fenceMatch[2].length };
      } else if (matchClosingFence(line, fence)) {
        fence = null;
      }
      continue;
    }
    if (fence !== null) continue;

    // Match ATX headings: 1–6 # chars followed by a space (CommonMark)
    const headingMatch = line.match(/^(#{1,6}) (.+)/);
    if (!headingMatch) continue;

    const level = headingMatch[1].length;
    const text = stripAtxClose(headingMatch[2]);
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
