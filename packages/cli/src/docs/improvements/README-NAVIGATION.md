# Back Navigation Feature for CLI

The Precast CLI now supports **back navigation** during the interactive project setup! This allows users to go back and change their previous selections without starting over.

## How It Works

### Enabling Navigation Mode

The navigation mode is enabled by default in interactive mode. You can control it with:

```bash
# Enable navigation mode explicitly
PRECAST_NAV=true bunx create-precast-app@latest

# Disable navigation mode (use old linear flow)
PRECAST_NAV=false bunx create-precast-app@latest

# Navigation is automatically disabled with --yes flag
bunx create-precast-app@latest --yes
```

### Using Back Navigation

You have two ways to go back during setup:

1. **Press ESC key** - Instantly go back to the previous question
2. **Select "← Go Back"** - Available at the bottom of selection lists

When prompted for any selection, you'll see:

```
? Choose your frontend framework:
  React        A JavaScript library for building user interfaces
  Vue          The Progressive JavaScript Framework
  Angular      Platform for building mobile and desktop web applications
  Next.js      The React Framework for Production
  ...
> ← Go Back    Return to previous selection (or press ESC)
```

For yes/no questions, you'll see:

```
? Use TypeScript? [Press ESC to go back] (Y/n)
```

### Features

1. **State Preservation**: Your selections are preserved when going back
2. **Visual Indicators**: Previously selected options show a ✓ mark
3. **Smart Flow**: Skips irrelevant questions (e.g., ORM selection when no database)
4. **Cancel Support**: Press Ctrl+C at any time to cancel

### Example Flow

```
1. Project name: my-app
2. Framework: React ✓
3. Backend: Express ✓
4. Database: PostgreSQL ✓
   ← User selects "Go Back"
3. Database: [Changes to MySQL]
4. ORM: [Now shows MySQL-compatible ORMs]
```

### Benefits

- **User-Friendly**: No need to restart if you make a mistake
- **Exploratory**: Try different combinations to see available options
- **Time-Saving**: Quick corrections without restarting
- **Context-Aware**: Shows only relevant options based on your stack

### Technical Implementation

The navigation system uses:

- **State Management**: Maintains prompt state across navigation
- **Step Tracking**: Manages current position in the prompt flow
- **Symbol-based Navigation**: Uses JavaScript Symbols for type-safe back navigation
- **Graceful Fallback**: Falls back to linear mode if issues occur

### For Developers

To use the navigation-enabled prompts in your own code:

```typescript
import { gatherProjectConfigWithNavigation } from "./prompts/config-prompts-with-navigation.js";

const config = await gatherProjectConfigWithNavigation(projectName, options);
```

The function signature is identical to the original `gatherProjectConfig`, making it a drop-in replacement.

### Compatibility

- Works with all existing CLI flags
- Compatible with all frameworks and configurations
- Gracefully handles edge cases and errors
- No breaking changes to existing workflows
