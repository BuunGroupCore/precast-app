# Precast App - Clean Code Cartoon Website

A modern monorepo featuring a cartoon-style website with clean code principles, reusable components, and a CLI tool.

## 🎨 Features

- **Cartoon-Style Design**: Playful, engaging UI with smooth animations
- **Clean Code Architecture**: Modern patterns with TypeScript and React
- **Monorepo Structure**: Organized packages for better code sharing
- **CLI Tool**: Generate components and scaffold projects quickly
- **Reusable Components**: Atomic design system with customizable components
- **Custom Hooks**: Powerful React hooks for animations and utilities

## 📦 Packages

- **`@precast/website`**: Main website application built with Vite and React
- **`@precast/ui`**: Shared UI components library with atomic design
- **`@precast/hooks`**: Custom React hooks for common functionalities
- **`@precast/utils`**: Shared utility functions
- **`@precast/cli`**: Command-line tool for project scaffolding

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Bun or pnpm package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/precast-app.git
cd precast-app

# Install dependencies
bun install
# or
pnpm install
```

### Development

```bash
# Run the website in development mode
bun dev
# or
pnpm dev

# Build all packages
bun build
# or
pnpm build
```

## 🎨 Design System

### Colors

- **Primary**: Vibrant blues (#3B82F6)
- **Secondary**: Playful purples (#A855F7)
- **Accent**: Energetic oranges (#F97316)
- **Cartoon Colors**: Yellow, Pink, Mint, Sky, Coral, Lavender

### Typography

- **Display**: Fredoka (Goofy sans-serif for headers)
- **Body**: Inter (Clean sans-serif)
- **Code**: JetBrains Mono

### Animations

- Bounce, Wiggle, Float, Wave, Blob animations
- Smooth transitions and hover effects
- Scroll-triggered animations

## 🏗️ Architecture

### Component Structure (Atomic Design)

- **Atoms**: Button, Badge, Icon
- **Molecules**: Card, Hero
- **Organisms**: Header, Footer
- **Templates**: Page layouts
- **Pages**: Complete views

### Custom Hooks

- `useCartoonAnimation`: Animate elements with cartoon effects
- `useTheme`: Dark/light theme management
- `useResponsive`: Responsive breakpoint detection
- `useScrollAnimation`: Intersection observer for scroll effects

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Animation**: Framer Motion
- **State Management**: React hooks
- **Build Tool**: Vite
- **Package Management**: Bun/pnpm workspaces
- **Code Quality**: ESLint, Prettier

## 📝 Scripts

- `dev`: Start development server
- `build`: Build all packages
- `lint`: Run ESLint
- `format`: Format code with Prettier
- `test`: Run tests
- `typecheck`: Check TypeScript types

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.