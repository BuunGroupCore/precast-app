# GitHub Actions Workflows

## Testimonial Collection System

The automated testimonial collection system allows users to submit testimonials through GitHub issues, which are then automatically added to the website.

### How it works:

1. **User submits testimonial**: Users click "JOIN THE HERO LEAGUE!" button which opens a pre-filled GitHub issue template
2. **Review process**: Maintainers review the testimonial and add the `testimonial-approved` label
3. **Automatic processing**: The GitHub Action triggers when the label is added
4. **Dynamic updates**: The testimonial is added to `packages/website/public/testimonials.json`
5. **Website updates**: The website automatically loads new testimonials without needing a rebuild

### Manual trigger:

You can also manually trigger the workflow from the Actions tab using the "workflow_dispatch" event.

### Configuration:

- Issue template: `.github/ISSUE_TEMPLATE/testimonial.yml`
- Workflow: `.github/workflows/collect-testimonials.yml`
- Dynamic testimonials: `packages/website/public/testimonials.json`

### Benefits:

- No code changes needed for new testimonials
- Community-driven content
- Automatic moderation through issue labels
- Real-time updates without deployment