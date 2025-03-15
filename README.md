# A Bowl of Red 🌶️

A modern web application built with Astro, React, and TailwindCSS.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended package manager)

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd abowlofred-astro

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🛠️ Development

### Tech Stack

- **Framework:** [Astro](https://astro.build/) with [React](https://reactjs.org/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **UI Components:** Custom components with [Shadcn/ui](https://ui.shadcn.com/)
- **Testing:** [Vitest](https://vitest.dev/) with [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- **API Integration:** [Strapi SDK](https://docs.strapi.io/dev-docs/api/sdk)

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Testing
pnpm test         # Run tests in watch mode
pnpm test:ui      # Run tests with UI
pnpm test:coverage # Run tests with coverage
pnpm test:ci      # Run tests in CI mode

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting
```

## 🧪 Testing

The project uses Vitest for unit and integration testing. Tests are located in `src/__tests__/` directory following this structure:

```
src/
├── __tests__/
│   ├── components/    # Component tests
│   ├── pages/        # Page tests
│   └── lib/          # Utility tests
```

### Testing Conventions

- Test files use `.test.ts` or `.test.tsx` extensions
- Component tests use `@testing-library/react`

## 📝 Git Workflow

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

- \`feat:\` New features
- \`fix:\` Bug fixes
- \`docs:\` Documentation changes
- \`style:\` Code style changes (formatting, etc.)
- \`refactor:\` Code refactoring
- \`test:\` Adding or updating tests
- \`chore:\` Maintenance tasks

Example:
\`\`\`bash
feat: add user authentication
fix: resolve navigation bug
docs: update API documentation
\`\`\`

### Pre-commit Hooks

The project uses Husky and lint-staged for pre-commit hooks:

1. **Code Quality Checks:**

   - ESLint runs on staged JS/TS files
   - Prettier formats all staged files
   - Tests affected by changes are run

2. **Commit Message Validation:**
   - Enforces conventional commit format
   - Checks message length and structure

## 🏗️ Project Structure

```
abowlofred-astro/
├── src/
│   ├── components/   # Reusable components
│   ├── layouts/      # Page layouts
│   ├── pages/        # Astro pages
│   ├── lib/          # Utilities and helpers
│   └── styles/       # Global styles
├── public/          # Static assets
```

## 🔧 Configuration Files

- `astro.config.mjs` - Astro configuration
- `vitest.config.ts` - Vitest test configuration
- `eslint.config.js` - ESLint configuration
- `prettier.config.js` - Prettier configuration
- `commitlint.config.js` - Commit message linting rules

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request

## 📄 License

This project is proprietary and confidential. © 2024 OTICCC. All rights reserved.

This software and its documentation are protected by copyright law and international treaties. Unauthorized reproduction, distribution, or use of this software, in whole or in part, is strictly prohibited.

This software is intended for internal use within OTICCC, a registered non-profit organization, and its authorized partners only.

# viva-terlingua-astro
