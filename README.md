# Unfold - Deep Reflection Cards

A beautiful, interactive card-based application for deep conversations and self-reflection. Explore thought-provoking questions across multiple themed decks, create custom decks, and journey through meaningful dialogue.

## Features

- **Journey Mode**: Progress through all decks in a structured experience
- **Freeplay Mode**: Explore individual decks at your own pace
- **Shuffle Mode**: Draw random cards from all decks combined
- **Custom Decks**: Create and save your own question sets
- **Favorites**: Save meaningful questions for later reflection
- **History Tracking**: Review previously drawn cards and session statistics
- **Local Storage**: All data persists in your browser - no backend required

## GitHub Pages Deployment

This version is configured for GitHub Pages deployment.

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**
   
   The `dist` folder contains the production build ready for deployment.

### Deployment Methods

#### Option 1: Manual Deployment

1. Create a new repository named "Unfold" on GitHub
2. Copy all files from this folder to your new repository
3. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/Unfold.git
   git push -u origin main
   ```
4. Go to repository Settings → Pages
5. Set Source to "GitHub Actions" or deploy the `dist` folder manually

#### Option 2: Using gh-pages Branch

```bash
npm install -g gh-pages
npm run build
gh-pages -d dist
```

Then enable GitHub Pages in your repository settings, selecting the `gh-pages` branch.

### Configuration

The app is configured with `base: '/Unfold/'` in `vite.config.ts`. This ensures all assets load correctly when hosted at `https://YOUR-USERNAME.github.io/Unfold/`.

**Important:** If you rename your repository, update the `base` path in `vite.config.ts`:

```typescript
export default defineConfig(({ mode }) => ({
  base: '/YOUR-REPO-NAME/',
  // ... rest of config
}));
```

### Client-Side Routing

This app uses React Router with BrowserRouter. The included `404.html` ensures that client-side routes work correctly on GitHub Pages by redirecting all 404s back to the main app.

## Development

Run the development server locally:

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Hooks + Local Storage

## Local Storage

All user data is stored in browser localStorage:
- Custom decks
- Favorites
- Game history
- Session statistics
- Deck progress

No server or database required!

## Browser Support

Modern browsers with localStorage support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

See LICENSE file for details.
