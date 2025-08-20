---
"create-precast-app": minor
---

Update Remix references to React Router v7 throughout the codebase

This update reflects the evolution of Remix to React Router v7 and ensures consistency across all user-facing text and internal framework references:

**Breaking Changes:**
- Framework ID changed from "remix" to "react-router" in configuration files
- Preferred stack renamed from "Remix Full-Stack" to "React Router v7 Full-Stack"

**Updated Components:**
- Stack configuration and compatibility arrays
- Preferred stacks dialog and UI components  
- Framework detection logic for `@remix-run/react` dependency
- Auth provider configurations and supported frameworks
- Powerup configurations (React Aria, React Helmet, Playwright)
- Template files and test specifications

**Compatibility:**
- Maintains backward compatibility for existing projects using `@remix-run/react`
- All functionality preserved with updated naming and references
- Template generation updated to use "react-router" framework ID

Users with existing Remix projects will continue to work normally, while new projects will be created with the updated React Router v7 references.