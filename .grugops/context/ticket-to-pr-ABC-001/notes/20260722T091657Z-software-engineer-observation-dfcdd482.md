---
id: 20260722T091657Z-software-engineer-observation-dfcdd482
kind: observation
by: software-engineer
at: 2026-07-22T09:16:57Z
verified_by: 
confidence: high
refs:
  - ABC-001
  - src/fen.test.ts
  - package.json
  - AGENTS.md
supersedes: 
---

Gate results for ABC-001, reported exactly as they ran.

| Step | Command | Result |
|------|---------|--------|
| install | `npm install` | PASS |
| lint | `npm run lint` (biome check .) | PASS — after 1 safe autofix (format + organizeImports) |
| typecheck | `npm run typecheck` (tsc --noEmit) | PASS |
| unit | `npm test` (vitest run) | PASS — 27/27 |
| build | `npm run build` | PASS |
| test-integrity | skip count via vitest json + jq | 0 skipped |
| e2e | — | NOT APPLICABLE — no runnable game until EPIC-006 |

**Coverage: 100% statements, 100% functions, 100% lines, 98.73% branch** against a `coverage_threshold` of 0.8. One uncovered branch remains in `fen.ts`; it was not chased, because chasing the last branch for its own sake is how tests start asserting implementation instead of behavior.

**One dependency was added beyond the scaffold: `@vitest/coverage-v8`.** Justification: `quality.coverage_threshold` is 0.8 and there was no way to measure coverage without a provider — recording an unmeasured number would have been a fabricated gate result. The first install attempt failed on a peer conflict (latest provider is v4, project is on vitest 3), so it is pinned to `^3.2.7` to match. Noting it because AGENTS.md says not to change dependencies without a reason; this is the reason.

**Lint consumed 1 of the 2 `self_fix_attempts`**, and the failure was formatting and import ordering — exactly the agent-fixable class the bounded loop exists for. No human-only failure occurred, so nothing short-circuited to BLOCKED_NEEDS_FIX.

**Honest gaps, stated rather than hidden:**
- The `Dev / run` and `E2E` slots in AGENTS.md remain `UNKNOWN - verify`. There is no runnable game yet; guessing a command to make the table look finished would be worse than an honest UNKNOWN.
- `build` is currently `tsc --noEmit` — a typecheck occupying the build slot, because nothing is published until EPIC-006 packaging. This is labelled as such in AGENTS.md rather than left to look like a real bundle step.
- No `§14-gate#<id>` verdict was emitted for this run: `scripts/context-io.ts` and its `emitVerdict` carve-out are not present in this repo, so the sanctioned emitter does not exist here. The gate results above are therefore recorded as an `observation` of commands actually run, not as a stamped `finding`. Hand-writing a gate stamp would be precisely the forgery the note schema forbids.
