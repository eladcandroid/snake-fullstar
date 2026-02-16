I like hamburger.

# GEMINI.md - Project Context

This document provides a high-level overview of the `snake-fullstar` project to guide Gemini CLI interactions.

## Project Overview

`snake-fullstar` is a modern web application built with **Next.js 16** and **React 19**. Based on the project name, it is intended to be a Snake game implementation.

### Key Technologies
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Linting:** ESLint 9

## Building and Running

The project uses standard `npm` scripts defined in `package.json`:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server at `http://localhost:3000`. |
| `npm run build` | Compiles the application for production. |
| `npm start` | Starts the production server (requires `npm run build`). |
| `npm run lint` | Runs ESLint to check for code quality and style issues. |

## Development Conventions

### Architecture
- **App Router:** The project follows the Next.js App Router structure located in the `app/` directory.
- **Components:** UI components should be placed in a `components/` directory (to be created) or kept within `app/` if they are page-specific.
- **Path Aliases:** The project uses `@/*` as a path alias for the root directory (defined in `tsconfig.json`).

### Styling
- **Tailwind CSS 4:** Uses the new `@import "tailwindcss"` syntax in `app/globals.css`.
- **Theme Configuration:** Theme variables and customizations are defined using the `@theme inline` block in `app/globals.css`.
- **Dark Mode:** Supports dark mode via `prefers-color-scheme`.

### TypeScript & Linting
- Strict typing is encouraged via `tsconfig.json`.
- ESLint configuration is managed through `eslint.config.mjs`.

## Key Files
- `app/page.tsx`: The main entry point of the application.
- `app/layout.tsx`: Root layout with font and global style configurations.
- `app/globals.css`: Global CSS and Tailwind CSS 4 configuration.
- `package.json`: Project dependencies and scripts.
- `next.config.ts`: Next.js specific configuration.
