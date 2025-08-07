---
"@precast/website": patch
---

Add PostHog analytics integration and Cloudflare Pages deployment

- Implemented PostHog React provider for analytics tracking alongside Google Analytics
- Added comprehensive GitHub Actions workflow for automated releases and Cloudflare Pages deployment
- Created Cloudflare Pages configuration files (_headers, _redirects) for optimal performance
- Fixed workspace dependency build order to resolve @precast/ui import issues
- Updated environment variable structure to use proper VITE_ prefixes for frontend builds