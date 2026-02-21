# Agent Guide for resetpower-moe

This repository hosts a Cloudflare Workers application with a React frontend (Vite + Tailwind CSS).
This document serves as the **Supreme Law** for all code modifications. Agents must strictly adhere to these architectural and engineering constraints.

## 1. Core Architecture: Headless & Atomic Design

### Logical & Visual Separation
- **Foundation:** Use **@base-ui/react** (MUI Base) as the cornerstone for interaction logic.
- **Pattern:** `Base UI Logic` + `Tailwind CSS Styling`.
- **Constraint:** Never reinvent complex UI logic (accessibility, focus management, keyboard navigation). Use Base UI primitives and apply Tailwind classes for visuals.

### Atomic Component Extraction
- **`src/components/`**: Pure, generic, reusable atoms (Buttons, Inputs, Modals). These must be decoupled from business logic.
- **`src/features/`**: Business-specific components and logic.
- **Rule:** If a UI element is used in **2 or more places**, it MUST be extracted to `/components`.

## 2. Engineering Constraints (DRY & Single Responsibility)

### Strict Separation of Concerns
- **UI Components:** Responsible *only* for rendering.
- **Logic Extraction:** All API calls, `useEffect` side effects, and complex state management MUST be extracted to:
  - **`src/hooks/`**: Custom hooks for component logic.
  - **`src/services/`**: API fetchers and domain services.
- **File Length Cap:**
  - **Single Function:** Max **20 lines** of logic. Split complex functions into sub-functions.
  - **Single File:** Max **200 lines**. If exceeded, split into sub-components or extract hooks.

### Declarative Programming
- Prefer **declarative** code over imperative.
- **Complex Logic:** Replace complex `if-else` or `switch` chains with Strategy Patterns or Configuration Objects (Maps).

## 3. Code Readability & Naming Contracts

### React Component Definition
- **Props Typing:** Use inline typing for props within the function signature. Avoid defining separate `Props` interfaces unless the structure is complex or reused.
  ```tsx
  // Preferred
  export function Button({ label, onClick }: { label: string; onClick: () => void }) { ... }
  ```

### Tailwind CSS Conventions
- **Size Presets:** Use Tailwind's default size presets instead of arbitrary values whenever possible.
  - `rounded-xl` instead of `rounded-[12px]`
  - `w-64` instead of `w-[256px]`
- **Modern Class Names:** Use the shorter, modern Tailwind class names.
  - `shrink-0` instead of `flex-shrink-0`
  - `grow` instead of `flex-grow`

### File Headers
- **Mandatory:** Every new file must start with a top-level comment describing its single responsibility.
  ```tsx
  // Responsible for rendering the user profile card and handling edit mode toggling.
  export function UserProfile() { ... }
  ```

### Naming Conventions
- **Variables ("What"):** `userList`, `isValid`, `maxRetryCount`.
- **Functions ("Do What"):** Verb-Noun naming. `fetchUserProfile`, `calculateTotal`, `submitForm`.
- **Forbidden:** Generic names like `data`, `info`, `item`, `handleCheck`, `doIt`. Be specific.

## 4. Robustness & Type System

### TypeScript Strict Mode
- **No `any`:** The usage of `any` is strictly prohibited. Define clear Interfaces or Types for all structures.
- **Prop Types:** All component props must be typed explicitly (inline or interface).

### Async Interaction
- **Feedback Loop:** All asynchronous interactions (data fetching, form submission) MUST handle and display:
  1. **Loading State:** Skeletons or spinners.
  2. **Error State:** User-friendly error messages (no raw stack traces).

## 5. Build & Quality Commands

- **Build:** `npm run build` (tsc + vite)
- **Dev:** `npm run dev`
- **Lint:** `npm run lint` (Biome - run this before finishing any task)
- **Type Check:** `npx tsc -b` (Strict Type Checking)
- **Full Check:** `npm run lint && npx tsc -b` (Recommended before commit)
- **Deploy:** `npm run deploy`

### Environment Recovery
- **Missing Node/NPM:** If `node` or `npm` are not found in the PATH, check `$HOME/.nvm` and try to source `nvm.sh` to resolve the environment.

## 6. Agent Self-Review Protocol

Before outputting ANY code, you (the Agent) must perform this internal audit:

1.  [ ] **Architecture Check:** Did I mix business logic into the UI? -> *Extract to Hook.*
2.  [ ] **Complexity Check:** Is this function > 20 lines? -> *Split it.*
3.  [ ] **Naming Check:** Are variables self-explanatory? -> *Rename generic ones.*
4.  [ ] **Safety Check:** Did I use `any`? -> *Define the type.*
5.  [ ] **UI Logic:** Am I rebuilding a standard interaction? -> *Use @base-ui/react.*
6.  [ ] **Feedback:** Did I handle Loading/Error states?
7.  [ ] **Quality Check:** Did I run `npm run lint && npx tsc -b`?

**Refactoring Priority:** If the user asks for a feature but the current code violates these principles, **propose a refactor first**. Do not build technical debt on top of shaky foundations.
