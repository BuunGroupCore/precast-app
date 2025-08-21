# CLI Test Report

> Last Updated: Aug 21, 2025, 15:19:22

## Summary

| Metric             | Value | Status |
| ------------------ | ----- | ------ |
| **Total Tests**    | 16    | -      |
| **Passed**         | 14    | ✅     |
| **Failed**         | 0     | ✅     |
| **Skipped**        | 2     | ⏭️     |
| **Success Rate**   | 87.5% | 🟡     |
| **Total Duration** | 7.4s  | -      |

## Cleanup Status

| Metric                       | Value | Status   |
| ---------------------------- | ----- | -------- |
| **Temp Directories Created** | 0     | -        |
| **Temp Directories Cleaned** | 0     | ✅       |
| **Leftover Directories**     | 0     | ✅ Clean |

## Test Suites

| Suite                                                                | Total | Passed | Failed | Skipped | Success Rate | Duration            |
| -------------------------------------------------------------------- | ----- | ------ | ------ | ------- | ------------ | ------------------- |
| **Edge Cases and Error Handling > Empty and Minimal Configurations** | 2     | 2 ✅   | 0      | 0       | 100.0% 🟢    | 1.3s                |
| **Edge Cases and Error Handling > Git Configuration**                | 2     | 1 ✅   | 0      | 1 ⏭️    | 50.0% 🔴     | 543.8829369999994ms |
| **Edge Cases and Error Handling > Invalid Combinations**             | 3     | 3 ✅   | 0      | 0       | 100.0% 🟢    | 715.249752ms        |
| **Edge Cases and Error Handling > Large Configurations**             | 1     | 1 ✅   | 0      | 0       | 100.0% 🟢    | 592.389615ms        |
| **Edge Cases and Error Handling > Package Manager Handling**         | 4     | 4 ✅   | 0      | 0       | 100.0% 🟢    | 1.5s                |
| **Edge Cases and Error Handling > Runtime Options**                  | 1     | 1 ✅   | 0      | 0       | 100.0% 🟢    | 648.7567389999995ms |
| **Edge Cases and Error Handling > Special Characters and Names**     | 3     | 2 ✅   | 0      | 1 ⏭️    | 66.7% 🟠     | 927.814351ms        |

## Detailed Results

<details>
<summary>Click to expand all test results</summary>

| Status | Test Name                                                | Suite                                                            | Duration             |
| ------ | -------------------------------------------------------- | ---------------------------------------------------------------- | -------------------- |
| ✅     | should reject incompatible database and ORM combinations | Edge Cases and Error Handling > Invalid Combinations             | 281.757924ms         |
| ✅     | should reject Convex backend with database options       | Edge Cases and Error Handling > Invalid Combinations             | 224.68092700000005ms |
| ✅     | should reject FastAPI with TypeScript flag               | Edge Cases and Error Handling > Invalid Combinations             | 208.81090099999994ms |
| ✅     | should handle project names with hyphens                 | Edge Cases and Error Handling > Special Characters and Names     | 639.479834ms         |
| ✅     | should reject project names with underscores             | Edge Cases and Error Handling > Special Characters and Names     | 288.334517ms         |
| ⏭️     | should reject invalid project names                      | Edge Cases and Error Handling > Special Characters and Names     | 0ms                  |
| ✅     | should handle minimal configuration (framework only)     | Edge Cases and Error Handling > Empty and Minimal Configurations | 525.7095750000003ms  |
| ✅     | should handle backend-only configuration                 | Edge Cases and Error Handling > Empty and Minimal Configurations | 734.2035019999998ms  |
| ✅     | should handle maximum features enabled                   | Edge Cases and Error Handling > Large Configurations             | 592.389615ms         |
| ✅     | should respect npm package manager choice                | Edge Cases and Error Handling > Package Manager Handling         | 419.43742299999985ms |
| ✅     | should respect yarn package manager choice               | Edge Cases and Error Handling > Package Manager Handling         | 314.86152200000015ms |
| ✅     | should respect pnpm package manager choice               | Edge Cases and Error Handling > Package Manager Handling         | 410.5359100000005ms  |
| ✅     | should respect bun package manager choice                | Edge Cases and Error Handling > Package Manager Handling         | 393.1413700000003ms  |
| ✅     | should handle Bun runtime                                | Edge Cases and Error Handling > Runtime Options                  | 648.7567389999995ms  |
| ✅     | should respect --no-git flag                             | Edge Cases and Error Handling > Git Configuration                | 543.8829369999994ms  |
| ⏭️     | should respect --no-gitignore flag                       | Edge Cases and Error Handling > Git Configuration                | 0ms                  |

</details>

## Test Trends

```
Success Rate Trend (last 5 runs):
Current: [████████░░] 87.5%
```

## Quick Commands

```bash
# Run all tests
pnpm test

# Run integration tests only
pnpm test:integration

# Run with quality checks
pnpm test:quality

# Run full test suite
pnpm test:full

# Check for leftover test directories
ls -la /tmp/ | grep precast-test- | wc -l
```

---

_Generated by CLI Test Reporter at Aug 21, 2025, 15:19:22_
