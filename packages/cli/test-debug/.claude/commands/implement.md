---
description: Implement a new feature following project conventions
allowed-tools: Read, Write, Edit, Glob, Grep, Task
---

Implement a new feature for this react project following established patterns and modern best practices.

## Research-Driven Implementation Process

### Phase 1: Context and Pattern Analysis

Before implementing, ensure you:

1. Read @README.md for project structure
2. Read @CLAUDE.md for coding guidelines
3. Study similar existing features for patterns
4. Check types in src/types

### Phase 2: Research Best Practices

**Research modern implementation patterns** using the web-research agent:

```
Use the Task tool to spawn the web-research agent:

Research modern implementation patterns and best practices for: $ARGUMENTS

Focus research on:
- react implementation patterns 2024
- Component/feature architecture best practices
- Performance optimization for react features
- Accessibility implementation standards
- Testing strategies for new features

- none data layer best practices

Provide evidence-based implementation examples and patterns.
```

### Phase 3: Multi-Agent Planning

**Launch parallel agents for comprehensive planning:**

```
Use Task tool to spawn multiple agents simultaneously:

1. **web-research agent**:
   Research latest react implementation patterns and modern development practices

2. **architecture-guide agent**:
   Plan architectural integration and ensure consistency with project structure for: $ARGUMENTS

3. **standards-enforcer agent**:
   Define code quality requirements and linting standards for implementation

Synthesize findings into unified implementation strategy.
```

### Implementation Steps

#### 1. Understand Context (Research-Enhanced)

```
Examine existing patterns and research findings:
- Similar components/features (existing + researched patterns)
- Current file organization (validated against modern standards)
- Styling approach (tailwind + latest best practices)
- State management patterns (current + modern approaches)

- Data fetching patterns (current + performance optimizations)
```

#### 2. Plan Implementation (Research-Informed)

Use architecture-guide agent with research backing:

```
Based on project architecture and researched best practices, plan the implementation of: $ARGUMENTS

Consider:
- Modern architectural patterns from research
- Performance implications and optimizations
- Security considerations and latest practices
- Accessibility requirements and standards
- Testing strategy and coverage requirements
```

### 3. Create Feature

Following the exact patterns found in existing code:

- Use the same file naming convention
- Follow the same component structure
- Apply consistent styling approach
- Maintain type safety with TypeScript

### 4. Integrate Feature

- Update routing if needed
- Add to relevant parent components
- Connect to state management if required
- Create API endpoints if needed

### 5. Test Implementation

- Verify functionality works as expected
- Check for console errors
- Ensure consistent UX with rest of app
- Run type checking

## Standards to Follow

- **Components**: Functional with hooks
- **Styling**: Tailwind utilities
- **State**: useState/useContext

- **Data**: none

Remember: Consistency with existing code is paramount. When in doubt, follow the patterns already established in the codebase.
