---
id: 20260809T090500Z-software-engineer-artifact-ref-f0614850
kind: artifact-ref
by: software-engineer
at: 2026-08-09T09:05:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-014
  - ABC-015
  - RISK-005
  - src/frame.ts
  - src/frame.test.ts
  - src/render.ts
  - src/glyph-mode.ts
  - plans/tickets/ABC-018-frame-output-and-redraw.md
  - plans/board.md
  - plans/traceability.md
  - 20260809T083704Z-orchestrator-decision-215adfeb
supersedes: 
---

# What was built, what it touched, and every gate command with its exit code

Two new files on `grugops/ticket-to-pr-ABC-018`, cut from `9f89393`. **Nothing merged, nothing
deployed.**

## The files

- **`src/frame.ts`** — 222 lines, **94 of them code**. Three exports carry the ticket:
  - `assembleFrame(parts: FrameParts, mode: GlyphMode): string[]` — the VALUE. Composes board,
    status, history, the 2-row message region and the reserved prompt row into one frame. Writes
    nothing, reads nothing ambient.
  - `beginFrameSession(sink: FrameSink, height: number): FrameWriter` — the SESSION. Reads the
    sink's `isTTY` and `rows` ONCE, picks in-place or append, and closes over the answer.
  - `frameHeight({board, status, history}): number` — the one place the `+ MESSAGE_ROWS +
    PROMPT_ROWS` arithmetic lives, so `H` is never hardcoded and a caller cannot get the `+3`
    wrong. `MESSAGE_ROWS` and `PROMPT_ROWS` are exported beside it.
- **`src/frame.test.ts`** — 639 lines, **20 tests**: the twelve acceptance criteria one test each in
  the ticket's order, eight further pins, plus the in-memory screen model the `## Test notes`
  require (it scrolls, defers the right-margin wrap, and THROWS on an escape sequence it does not
  model — an ignored sequence is how a screen model quietly certifies a writer that emits something
  the terminal would have obeyed).

## The diff shape — two new files, no existing file touched

`git diff --numstat main -- src/` is **EMPTY**. `git status --short -- src/` reports exactly two
entries, both untracked and both new. `src/render.ts` and `src/glyph-mode.ts` in particular are
byte-identical to merged `main` at `7e0923c`. Outside `src/`: the ticket gained an
`## Implementation` section and its frontmatter moved `Ready` → `In Review`; `plans/board.md` took
the column move; `plans/traceability.md`'s `ABC-018` row gained four cells. No dependency changed and
`package-lock.json` is untouched.

## `RISK-005`'s build obligation — discharged, and checked mechanically rather than asserted

The obligation the Orchestrator and BA/PM both recorded as what survives the discharged merge-order
constraint: *the writer takes the glyph mode as an argument from `ABC-015`'s selection function, and
must not default it, hardcode it, or re-derive it from the environment.*

- The mode is a **required parameter** of `assembleFrame` — no default value anywhere in the file.
- `src/frame.ts` imports **exactly one thing**: `import type { GlyphMode } from "./render.ts"` — a
  type-only import, erased at runtime, so the module's runtime import closure is empty.
- `grep` for `process.` finds it **only in prose**. The only `isTTY` / `rows` reads in the file are
  of the **injected sink**.
- The only mode literal in the file is the `mode === "ascii"` comparison inside the sanitizer, which
  is a test of the supplied value, not a source of one.

## The gates, exactly as they ran (Workflow 05 step 3 order)

| Step | Command | Exit |
|---|---|---|
| install | `npm install` | **0** — no dependency change, `package-lock.json` untouched |
| lint | `npm run lint` | **1**, then **0** after ONE safe autofix pass |
| typecheck | `npm run typecheck` | **0** |
| unit | `npm test` | **0** — **297 passed / 297 on 14 files** |
| build | `npm run build` | **0** (`tsc --noEmit` — AGENTS.md's honest naming) |
| e2e | — | **`UNKNOWN - verify`** — the `AGENTS.md` slot is unknown; no UI surface and no runnable game until `EPIC-006` |
| test-integrity | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0 skips** |
| test-integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **2** — "cannot read the registry file" |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | **`UNKNOWN - verify`** — the script does not exist in this install |

**The lint failure and its fix are reported as they happened, not smoothed.** `biome check .` exited
**1** on two errors in `src/frame.test.ts` — an import-name ORDER assist and a formatter difference,
**no rule violation**. `quality.lint.autofix` is `true`, so the safe autofix ran on that one file
(`npx biome check --write src/frame.test.ts`, the `AGENTS.md` single-file command) and the recheck
exited **0**. That is **self-fix attempt 1 of 2**; the second was not needed. The two remaining
**infos** are pre-existing `biome.json` schema-version and `recommended`-deprecation notices, present
before this ticket, unrelated to it, and deliberately not touched.

**The test-integrity checker's exit 2 is recorded as an error and NOT as a pass.** `.grugops/
test-skips.md` does not exist (confirmed with `ls`). Exit 2 is "the checker could not run"; it is not
the exit-1 human-only short-circuit and it is not green. **No registry file was created** — an agent
may not self-author a justification to clear its own gate — and the suite's skip count is **0**, so
nothing is owed a justification. This is the fourth ticket on this board to record the same.

## Test counts, measured rather than subtracted

**297/297 on 14 files** after, **277/277 on 13 files** before — the "before" was measured by running
the suite with this ticket's file excluded (`npx vitest run $(ls src/*.test.ts | grep -v frame)`),
not by subtracting 20 from 297. Skip count **0**. `src/frame.ts` is at **100% statements / branches /
functions / lines** (`coverage_threshold` is 0.8); the coverage run rewrites the tracked `coverage/`
directory, a known hazard on this board, and it was restored with `git checkout -- coverage/` and
verified clean.

## Substrate

No `scripts/` in this install or in the kit, so this note is hand-written in the exact shape of
`agent-factory/contracts/context-note.md` and no `index.md` / `index.jsonl` was hand-faked. **No
`finding` is admissible on this task** — there is no §14 gate here to issue a `§14-gate#<id>` stamp
and `context.human_admission` is `off`. Nothing is self-stamped.
