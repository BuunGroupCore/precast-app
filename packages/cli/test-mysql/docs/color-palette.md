# Color Palette Documentation

## Minimal Pro

> Clean, modern design system

### Color Reference

> **Note**: Color swatches use placeholder images. If they don't load, refer to the hex codes.

| Color                                                                                                    | Name               | Hex Code  | Usage                            |
| -------------------------------------------------------------------------------------------------------- | ------------------ | --------- | -------------------------------- |
| <img src="https://via.placeholder.com/15/0F172A/0F172A.png" alt="Primary" width="15" height="15">        | **Primary**        | `#0F172A` | Main brand color                 |
| <img src="https://via.placeholder.com/15/020617/020617.png" alt="Primary Dark" width="15" height="15">   | **Primary Dark**   | `#020617` | Darker variant for hover states  |
| <img src="https://via.placeholder.com/15/F1F5F9/F1F5F9.png" alt="Secondary" width="15" height="15">      | **Secondary**      | `#F1F5F9` | Supporting brand color           |
| <img src="https://via.placeholder.com/15/E2E8F0/E2E8F0.png" alt="Secondary Dark" width="15" height="15"> | **Secondary Dark** | `#E2E8F0` | Darker secondary variant         |
| <img src="https://via.placeholder.com/15/0F172A/0F172A.png" alt="Accent" width="15" height="15">         | **Accent**         | `#0F172A` | Call-to-action elements          |
| <img src="https://via.placeholder.com/15/020617/020617.png" alt="Accent Dark" width="15" height="15">    | **Accent Dark**    | `#020617` | Darker accent variant            |
| <img src="https://via.placeholder.com/15/FFFFFF/FFFFFF.png" alt="Background" width="15" height="15">     | **Background**     | `#FFFFFF` | Main background color            |
| <img src="https://via.placeholder.com/15/F8FAFC/F8FAFC.png" alt="Surface" width="15" height="15">        | **Surface**        | `#F8FAFC` | Card/panel backgrounds           |
| <img src="https://via.placeholder.com/15/020617/020617.png" alt="Text" width="15" height="15">           | **Text**           | `#020617` | Primary text color               |
| <img src="https://via.placeholder.com/15/64748B/64748B.png" alt="Text Secondary" width="15" height="15"> | **Text Secondary** | `#64748B` | Muted/secondary text             |
| <img src="https://via.placeholder.com/15/EF4444/EF4444.png" alt="Error" width="15" height="15">          | **Error**          | `#EF4444` | Error states and messages        |
| <img src="https://via.placeholder.com/15/F59E0B/F59E0B.png" alt="Warning" width="15" height="15">        | **Warning**        | `#F59E0B` | Warning states and alerts        |
| <img src="https://via.placeholder.com/15/10B981/10B981.png" alt="Success" width="15" height="15">        | **Success**        | `#10B981` | Success states and confirmations |
| <img src="https://via.placeholder.com/15/3B82F6/3B82F6.png" alt="Info" width="15" height="15">           | **Info**           | `#3B82F6` | Informational elements           |

### Usage in CSS

```css
/* CSS Variables */
:root {
  --color-primary: #0f172a;
  --color-primary-dark: #020617;
  --color-secondary: #f1f5f9;
  --color-secondary-dark: #e2e8f0;
  --color-accent: #0f172a;
  --color-accent-dark: #020617;
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text: #020617;
  --color-text-secondary: #64748b;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-success: #10b981;
  --color-info: #3b82f6;
}

/* Example usage */
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-background);
}

.button-primary:hover {
  background-color: var(--color-primary-dark);
}
```

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
  primary: "#0F172A",
  primaryDark: "#020617",
  secondary: "#F1F5F9",
  secondaryDark: "#E2E8F0",
  accent: "#0F172A",
  accentDark: "#020617",
  background: "#FFFFFF",
  surface: "#F8FAFC",
  text: "#020617",
  textSecondary: "#64748B",
  error: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
  info: "#3B82F6",
};
```

---

_Generated by [Precast](https://precast.dev) • Color Palette: Minimal Pro_
