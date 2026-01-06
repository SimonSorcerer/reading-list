# Reading List - "Bookmarking" Chrome Extension

A Chrome Extension (Manifest V3) with a Side Panel Content that saves web pages for later reading. The extension captures page metadata automatically and provides a simple interface to manage bookmarks.

## Features

- 📑 Save web pages with automatic metadata extraction
- 🕐 Recently closed tabs list with real-time updates
- 🎨 Side panel UI for easy bookmark management
- 💾 Chrome Storage API for data persistence
- ⚡ Built with TypeScript, React, and Webpack
- 🎯 Manifest V3 compliant

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Development

Run the extension in development mode with hot reloading:

```bash
npm run dev
```

This will watch for changes and rebuild automatically.

### 3. Build for Production

Create an optimized production build:

```bash
npm run build
```

The built extension will be in the `dist/` folder.

### 4. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` folder

## Development Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Build in development mode with watch |
| `npm run build`        | Build for production                 |
| `npm run lint`         | Run ESLint                           |
| `npm run lint:fix`     | Fix ESLint errors automatically      |
| `npm run format`       | Format code with Prettier            |
| `npm run format:check` | Check code formatting                |
| `npm run type-check`   | Run TypeScript type checking         |
| `npm run clean`        | Clean dist folder                    |

## Technology Stack

### Core (Required)

- **TypeScript** - Type safety and better DX
- **React** - UI for side panel
- **Webpack** - Module bundling. I went with Webpack over newer alternatives like Vite or Bun primarily because I have more experience with Webpack and it's plugins. Vite probably offers faster build time, but I felt Webpack is still ok. The configuration is kept minimal though, so migrating to Vite later should be straightforward if needed.
- **Chrome APIs** - Extension functionality (Manifest V3)

### Additional Dependencies

- **Zustand** - Lightweight state management library. Chosen to avoid prop drilling across components while keeping the app reactive. Its minimal footprint (~1KB) makes it ideal for a browser extension where bundle size matters.
- **Tailwind CSS** - Utility-first CSS framework. Provides rapid styling with a familiar API and excellent developer experience. Keeps styles co-located with components without the overhead of CSS-in-JS solutions.
- **date-fns** - Modern date utility library for formatting bookmark timestamps.

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Unit testing with TypeScript support via ts-jest

## Testing

Run the test suite:

```bash
npm test
```

The project includes few unit tests just to demonstrate testing patterns for:

- Pure utility functions (`urlHelpers.test.ts`)
- Async functions with Chrome API mocking (`tabHelpers.test.ts`)
  Snapshot tests for components can be added if needed as well.

## Configuration

App configuration is centralized in [`src/sidepanel/store/config.ts`](src/sidepanel/store/config.ts):

| Option                 | Description                                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| `maxRecentTabs`        | Number of recently closed tabs to display (default: 3)                        |
| `maxDescriptionLength` | Max characters for page description (default: 100)                            |
| `useSmartSummary`      | `true` = smarter extraction (OG tags, paragraphs), `false` = simple body text |
| `SIMULATE_ERRORS`      | Set to `true` to test error handling UI                                       |

## Architecture Decisions

### On-Demand Script Injection vs Content Scripts

For extracting page metadata (descriptions, Open Graph data), I went with `chrome.scripting.executeScript` using an inline `func` instead of declaring persistent content scripts in the manifest.

The main reason is efficiency - the extraction script only runs when the user actually saves a bookmark, not on every single page load. Content scripts declared in `manifest.json` get injected into every matching page regardless of whether the user ever interacts with the extension, which felt wasteful for this use case.

It also keeps things simpler to maintain. The extraction logic lives right next to the code that calls it (in `summaryHelpers.ts`), so everything is in one place rather than split between manifest configuration and separate content script files.
