# ⚡ CLI USAGE GUIDE

<div align="center">
  <h2 style="color: #FF6B6B; text-shadow: 2px 2px 0px #000;">MASTER THE PRECAST CLI</h2>
</div>

---

## 🚀 INSTALLATION

You don't need to install anything! Just use **npx** to run the latest version:

<div style="background: #4ECDC4; border: 3px solid #000; padding: 20px; margin: 20px 0; box-shadow: 5px 5px 0px #000;">
  
  ```bash
  npx create-precast-app@latest
  ```
  
</div>

## 📋 COMMAND STRUCTURE

The basic command structure is:

```bash
npx create-precast-app@latest [project-name] [options]
```

## 🎯 QUICK EXAMPLES

<div style="background: #FFE66D; border: 3px solid #000; padding: 20px; margin: 20px 0; box-shadow: 5px 5px 0px #000;">

### 💨 Fastest Way (Interactive Mode)
```bash
npx create-precast-app@latest
```

### 🎯 With Project Name
```bash
npx create-precast-app@latest my-awesome-app
```

### ⚡ Full Command (Skip All Prompts)
```bash
npx create-precast-app@latest my-app --framework=react --backend=node --database=postgres --orm=prisma --styling=tailwind --runtime=bun --install --yes
```

</div>

## 🛠️ ALL CLI OPTIONS

<div style="background: #F8F9FA; border: 3px solid #000; padding: 20px; margin: 20px 0; box-shadow: 5px 5px 0px #000;">

### 🎨 Framework Options
| Option | Values | Description |
|--------|--------|-------------|
| `-f, --framework` | `react`, `next`, `vue`, `nuxt`, `svelte`, `solid`, `angular`, `remix`, `astro`, `vite`, `vanilla` | Frontend framework |

### 🖥️ Backend Options
| Option | Values | Description |
|--------|--------|-------------|
| `-b, --backend` | `node`, `none` | Backend framework |

### 🗄️ Database Options
| Option | Values | Description |
|--------|--------|-------------|
| `-d, --database` | `postgres`, `mysql`, `sqlite`, `mongodb`, `none` | Database choice |

### 🔧 ORM Options
| Option | Values | Description |
|--------|--------|-------------|
| `-o, --orm` | `prisma`, `drizzle`, `mongoose`, `none` | ORM/ODM choice |

### 🎨 Styling Options
| Option | Values | Description |
|--------|--------|-------------|
| `-s, --styling` | `tailwind`, `css`, `scss` | Styling solution |

### 🏃 Runtime Options
| Option | Values | Description |
|--------|--------|-------------|
| `-r, --runtime` | `node`, `bun` | Runtime environment |

### 🧩 UI Library Options
| Option | Values | Description |
|--------|--------|-------------|
| `-u, --ui-library` | `shadcn`, `daisyui`, `mui`, `chakra`, `antd`, `mantine`, `brutalist` | UI component library |

### 🔐 Authentication Options
| Option | Values | Description |
|--------|--------|-------------|
| `-a, --auth` | `better-auth`, `auth.js`, `clerk`, `lucia`, `passport` | Authentication provider |

### 📦 Package Manager
| Option | Values | Description |
|--------|--------|-------------|
| `--pm` | `npm`, `yarn`, `pnpm`, `bun` | Package manager to use |

### 🚩 Boolean Flags
| Flag | Description |
|------|-------------|
| `--no-typescript` | Use JavaScript instead of TypeScript |
| `--no-git` | Skip git initialization |
| `--docker` | Include Docker configuration |
| `--install` | Install dependencies automatically |
| `-y, --yes` | Skip all prompts and use defaults |

</div>

## 💥 EXAMPLE COMMANDS

<div style="background: #95E1D3; border: 3px solid #000; padding: 20px; margin: 20px 0; box-shadow: 5px 5px 0px #000;">

### 🚀 Next.js + Prisma + PostgreSQL
```bash
npx create-precast-app@latest my-nextjs-app \
  --framework=next \
  --backend=node \
  --database=postgres \
  --orm=prisma \
  --styling=tailwind \
  --ui-library=shadcn \
  --auth=better-auth \
  --install \
  --yes
```

### 🟩 Vue + Drizzle + MySQL
```bash
npx create-precast-app@latest my-vue-app \
  --framework=vue \
  --backend=node \
  --database=mysql \
  --orm=drizzle \
  --styling=tailwind \
  --ui-library=daisyui \
  --install \
  --yes
```

### 🧡 SvelteKit + MongoDB
```bash
npx create-precast-app@latest my-svelte-app \
  --framework=svelte \
  --backend=node \
  --database=mongodb \
  --orm=mongoose \
  --styling=scss \
  --runtime=bun \
  --install \
  --yes
```

### ⚡ Minimal React App
```bash
npx create-precast-app@latest my-react-app \
  --framework=react \
  --backend=none \
  --database=none \
  --orm=none \
  --styling=css \
  --no-typescript \
  --install \
  --yes
```

### 🐳 With Docker Support
```bash
npx create-precast-app@latest my-docker-app \
  --framework=next \
  --backend=node \
  --database=postgres \
  --orm=prisma \
  --styling=tailwind \
  --docker \
  --install \
  --yes
```

</div>

## 🎮 PACKAGE MANAGER EXAMPLES

<div style="background: #C7CEEA; border: 3px solid #000; padding: 20px; margin: 20px 0; box-shadow: 5px 5px 0px #000;">

### 📦 Using npm (default)
```bash
npx create-precast-app@latest my-app
```

### 🧶 Using Yarn
```bash
yarn create precast-app my-app
```

### 📦 Using pnpm
```bash
pnpm create precast-app my-app
```

### 🍞 Using Bun
```bash
bun create precast-app my-app
```

### 🎯 Specify Package Manager
```bash
npx create-precast-app@latest my-app --pm=pnpm
```

</div>

## 🛠️ ADDITIONAL COMMANDS

<div style="background: #FF6B6B; border: 3px solid #000; padding: 20px; margin: 20px 0; box-shadow: 5px 5px 0px #000;">

### 🎨 Create Custom Banner
```bash
npx create-precast-app@latest banner
```
Creates a `precast-banner.txt` file that you can customize with ASCII art!

### 🔧 Add Features (Coming Soon)
```bash
npx create-precast-app@latest add-features
```
Add features to existing Precast projects.

</div>

## 💡 PRO TIPS

<div style="background: #FFE66D; border: 3px solid #000; padding: 20px; margin: 20px 0; box-shadow: 5px 5px 0px #000;">

1. **🚀 Use `--yes` flag** to skip all prompts and use sensible defaults
2. **💾 Save your favorite command** - Create an alias for your most-used stack
3. **🎯 Use the builder** - Visit [precast.dev/builder](https://precast.dev/builder) to visually create your command
4. **📦 Package manager fallback** - The CLI automatically falls back to npm if your chosen package manager has issues
5. **🔧 Claude Code integration** - Every project includes `.claude` folder with AI-optimized configuration

</div>

## ❓ TROUBLESHOOTING

<div style="background: #F8F9FA; border: 3px solid #000; padding: 20px; margin: 20px 0; box-shadow: 5px 5px 0px #000;">

### 🚨 Common Issues

**"Command not found"**
- Make sure you have Node.js 18+ installed
- Try using `npx` with the full package name: `npx create-precast-app@latest`

**"Permission denied"**
- On macOS/Linux, you might need to use `sudo`
- Better: Fix your npm permissions

**"Package manager not found"**
- The CLI will automatically fall back to npm
- Install your preferred package manager globally first

**"Port already in use"**
- The generated project uses standard ports (3000, 5173, etc.)
- Change the port in your project config after generation

</div>

---

<div align="center" style="margin: 40px 0;">
  <h3 style="color: #FF6B6B;">🎯 READY TO BUILD?</h3>
  
  ```bash
  npx create-precast-app@latest
  ```
  
  <p style="margin-top: 20px;">
    <a href="../README.md" style="color: #4ECDC4;">← Back to Main Docs</a> | 
    <a href="../frameworks/overview.md" style="color: #4ECDC4;">Frameworks Guide →</a>
  </p>
</div>