---
id: 20261010T095834Z-software-engineer-artifact-ref-abc119r2-branch-diff-agents-line-2409b286
kind: artifact-ref
by: software-engineer
at: 2026-10-10T09:58:34Z
verified_by:
confidence: high
refs:
  - ABC-119
  - G-06
  - A5
  - src/cli.real-engine.test.ts
  - AGENTS.md
supersedes:
---

# `ABC-119` r2: branch, diff, fence and the owed `AGENTS.md` line

Hand-authored, no seal. `sha`, `gate_run` and `content_hash` are absent: no `§14` gate runs on this install.

- **Branch** `grugops/ABC-119-r2` from `grugops/wave-2026-09-25` @ `242b624`. **Code commit `d45ca68`.** Not merged, not pushed.
- **Files.** One new test file, `src/cli.real-engine.test.ts` (+244/−0), plus these notes, the ticket's `## Delivery` and one trace
  row. **0 production lines.**
- **`A5`, run on the branch** against `<wave>` = `grugops/wave-2026-09-25`:
  - `git diff --numstat <wave>...HEAD -- 'src/' ':!src/*.test.ts'` printed nothing;
  - `git diff --numstat <wave>...HEAD -- src/cli.test.ts AGENTS.md plans/nfr-catalog.md vitest.config.ts` printed nothing;
  - `git diff --numstat <wave>...HEAD -- src/` printed `244	0	src/cli.real-engine.test.ts`. That is exactly one file.
- **Lane command:** `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`.
- **Owed to the `AGENTS.md` Scribe** (this hop writes 0 bytes there). The drafted `### Test` line:

```
- Real-engine CLI lane (opt-in, ABC-119): `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`
  <!-- RUN 2026-10-10: exit 0, 7 passed (1 default), 6.2-6.4 s at load1 3.5-11.6 — two real
  children of `node src/cli.ts --colour black --ascii`, ~3.1 s each. Unset: NOT DEFINED, not
  skipped. Run at QE and after any src/cli.ts or src/engine.ts change. -->
```

- **Also owed, and not mine:** `NFR-008`'s variable list now misses six names, with `CLI_DEEP` added (Architect/Design's,
  non-blocking).
