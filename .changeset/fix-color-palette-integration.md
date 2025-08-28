---
"create-precast-app": patch
---

Fix color palette integration and UI improvements

### Color Palette Fixes
- Convert HEX colors to RGB format in Tailwind config for proper opacity support
- Fix color contrast issues - "Precast.dev" now uses purple instead of same color as background
- Ensure color palettes properly affect generated project appearance

### UI Improvements
- Fix footer positioning to stick to bottom of viewport using flexbox layout
- Fix UI library icons not showing by correcting variable name (ui → uiLibrary)
- Remove duplicate footer (was in both Hero and App components)
- Add proper color palette awareness to Hero and App components

### Technical Changes
- Add hexToRgb helper function in shared/color-palettes.ts
- Update generateTailwindConfig to output RGB values
- Apply flex layout with flex-grow and mt-auto for sticky footer
- Use conditional styling based on colorPalette selection