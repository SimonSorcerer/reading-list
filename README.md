# Reading List - "Bookmarking" Chrome Extension

A Chrome Extension (Manifest V3) with a Side Panel Content that saves web pages for later reading. The extension captures page metadata automatically and provides a simple interface to manage bookmarks.

## Features

- 📑 Save web pages with automatic metadata extraction
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

- **TypeScript** - Type safety and better DX
- **React** - UI for side panel
- **Webpack** - Module bundling
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Chrome APIs** - Extension functionality
