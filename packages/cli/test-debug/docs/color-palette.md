# Color Palette Documentation

## Minimal Pro

> Clean, modern design system

### Color Reference

> **Note**: Color swatches use placeholder images. If they don't load, refer to the hex codes.

| Color                                                                                                    | Name               | Hex Code  | Usage                            |
| -------------------------------------------------------------------------------------------------------- | ------------------ | --------- | -------------------------------- |
| <img src="https://via.placeholder.com/15/0F172A/0F172A.png" alt="Primary" width="15" height="15">        | **Primary**        | `#0F172A` | Main brand color                 |
| <img src="https://via.placeholder.com/15/020617/020617.png" alt="Primary Dark" width="15" height="15">   | **Primary Dark**   | `#020617` | Darker variant for hover states  |
| <img src="https://via.placeholder.com/15/64748B/64748B.png" alt="Secondary" width="15" height="15">      | **Secondary**      | `#64748B` | Supporting brand color           |
| <img src="https://via.placeholder.com/15/475569/475569.png" alt="Secondary Dark" width="15" height="15"> | **Secondary Dark** | `#475569` | Darker secondary variant         |
| <img src="https://via.placeholder.com/15/3B82F6/3B82F6.png" alt="Accent" width="15" height="15">         | **Accent**         | `#3B82F6` | Call-to-action elements          |
| <img src="https://via.placeholder.com/15/2563EB/2563EB.png" alt="Accent Dark" width="15" height="15">    | **Accent Dark**    | `#2563EB` | Darker accent variant            |
| <img src="https://via.placeholder.com/15/FFFFFF/FFFFFF.png" alt="Background" width="15" height="15">     | **Background**     | `#FFFFFF` | Main background color            |
| <img src="https://via.placeholder.com/15/F8FAFC/F8FAFC.png" alt="Surface" width="15" height="15">        | **Surface**        | `#F8FAFC` | Card/panel backgrounds           |
| <img src="https://via.placeholder.com/15/020617/020617.png" alt="Text" width="15" height="15">           | **Text**           | `#020617` | Primary text color               |
| <img src="https://via.placeholder.com/15/64748B/64748B.png" alt="Text Secondary" width="15" height="15"> | **Text Secondary** | `#64748B` | Muted/secondary text             |
| <img src="https://via.placeholder.com/15/EF4444/EF4444.png" alt="Error" width="15" height="15">          | **Error**          | `#EF4444` | Error states and messages        |
| <img src="https://via.placeholder.com/15/F59E0B/F59E0B.png" alt="Warning" width="15" height="15">        | **Warning**        | `#F59E0B` | Warning states and alerts        |
| <img src="https://via.placeholder.com/15/10B981/10B981.png" alt="Success" width="15" height="15">        | **Success**        | `#10B981` | Success states and confirmations |
| <img src="https://via.placeholder.com/15/3B82F6/3B82F6.png" alt="Info" width="15" height="15">           | **Info**           | `#3B82F6` | Informational elements           |

### Usage in Tailwind CSS

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F172A',
          dark: '#020617',
        },
        secondary: {
          DEFAULT: '#64748B',
          dark: '#475569',
        },
        accent: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        background: '#FFFFFF',
        surface: '#F8FAFC',
        text: {
          DEFAULT: '#020617',
          secondary: '#64748B',
        },
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
        info: '#3B82F6',
      },
    },
  },
};
```

#### Tailwind Classes

- `bg-primary` / `bg-primary-dark` - Primary background colors
- `bg-secondary` / `bg-secondary-dark` - Secondary background colors
- `bg-accent` / `bg-accent-dark` - Accent background colors
- `bg-background` - Main background
- `bg-surface` - Surface/card background
- `text-primary` - Primary text color
- `text-secondary` - Secondary text color
- `text-error` / `text-warning` / `text-success` / `text-info` - Status text colors
- `border-primary` / `border-secondary` / `border-accent` - Border colors

### Component Examples

#### Button Component

```tsx
// Primary Button
<button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded">
  Click Me
</button>

// Secondary Button
<button className="bg-secondary hover:bg-secondary-dark text-text px-4 py-2 rounded">
  Learn More
</button>

// Accent Button
<button className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded">
  Get Started
</button>
```

#### Alert Components

```tsx
// Error Alert
<div className="bg-error/10 border border-error text-error p-4 rounded">
  Something went wrong!
</div>

// Success Alert
<div className="bg-success/10 border border-success text-success p-4 rounded">
  Operation completed successfully!
</div>

// Warning Alert
<div className="bg-warning/10 border border-warning text-warning p-4 rounded">
  Please review before continuing.
</div>

// Info Alert
<div className="bg-info/10 border border-info text-info p-4 rounded">
  Here's some helpful information.
</div>
```

### Accessibility Notes

- Ensure sufficient color contrast between text and background colors
- Primary text (`#020617`) on background (`#FFFFFF`) should meet WCAG AA standards
- Don't rely solely on color to convey information
- Test your color combinations with accessibility tools

### Quick Reference

```javascript
const colors = {
  primary: '#0F172A',
  primaryDark: '#020617',
  secondary: '#64748B',
  secondaryDark: '#475569',
  accent: '#3B82F6',
  accentDark: '#2563EB',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#020617',
  textSecondary: '#64748B',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
};
```

---

_Generated by [Precast](https://precast.dev) • Color Palette: Minimal Pro_
