---
"create-precast-app": patch
---

Fix Docker deployment tests to match CLI implementation

- Updated test expectations to match actual Docker file structure (files in `docker/{database}/` directory)
- Fixed auto-deploy script tests to handle platform-specific generation (.sh on Unix, .bat on Windows)
- Corrected Next.js MySQL test fixture to use `backend: "next-api"` (databases require backends per CLI validation)
- Removed invalid Redis database test (Redis is not a database option)
- Added debug logging to Docker setup for better troubleshooting
- All 10 Docker deployment tests now passing with proper validation