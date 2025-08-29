---
description: Review code changes against project standards and patterns
allowed-tools: Read, Grep, Glob, Task
---

Review the code changes to ensure they follow this react project's established patterns and standards.

## Research-Enhanced Review Process

### Phase 1: Pre-Review Context

BEFORE reviewing, read these essential files:

- @README.md - Project overview and guidelines
- @CLAUDE.md - AI collaboration standards
- Any existing similar files to understand patterns

### Phase 2: Research Current Standards

**Research latest best practices** using the web-research agent:

```
Use the Task tool to spawn the web-research agent:

Research current code review best practices and standards for: $ARGUMENTS

Focus research on:
- react code review checklists 2024
- Security vulnerability patterns to watch for
- Performance anti-patterns in react
- Modern TypeScript/JavaScript review criteria

- none query optimization review points

Provide evidence-based review criteria and red flags to identify.
```

### Phase 3: Multi-Agent Review Analysis

**Launch parallel review agents for comprehensive analysis:**

```
Use Task tool to spawn multiple agents simultaneously:

1. **web-research agent**:
   Research industry-standard review criteria for react and identify latest security/performance concerns

2. **code-reviewer agent**:
   Perform detailed code review against project standards: $ARGUMENTS

3. **standards-enforcer agent**:
   Validate code against linting rules and formatting standards

4. **architecture-guide agent**:
   Assess architectural consistency and design pattern adherence

Synthesize findings into comprehensive review feedback.
```

### Enhanced Review Process

The code-reviewer agent will perform research-informed analysis:

```
Review the recent changes with research-backed criteria:

**Core Review Areas:**
1. Consistency with existing code patterns
2. TypeScript type safety (no any types)
3. tailwind styling conventions
4. Component/function naming standards
5. Import organization
6. Error handling patterns

8. Database query efficiency

**Research-Enhanced Checks:**
- Latest security vulnerability patterns
- Modern performance best practices
- Current accessibility standards
- Framework-specific anti-patterns
- Industry code quality benchmarks

$ARGUMENTS
```

## Focus Areas

- **Architecture**: Does it follow the established patterns?
- **Performance**: Any potential performance issues?
- **Security**: Any security vulnerabilities?
- **Maintainability**: Is the code easy to understand and maintain?
- **Testing**: Are there adequate tests?

Provide actionable feedback with specific examples from the existing codebase.
