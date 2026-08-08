---
id: 20260808T184500Z-software-engineer-artifact-ref-7c2e04b9
kind: artifact-ref
by: software-engineer
at: 2026-08-08T18:45:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - ABC-018
  - EPIC-002
  - EPIC-006
  - RISK-005
  - NFR-007
  - src/glyph-mode.ts
  - src/glyph-mode.test.ts
  - src/glyph-mode.nfr.test.ts
  - plans/tickets/ABC-015-glyph-mode-selection.md
  - plans/board.md
  - plans/traceability.md
  - .grugops/queue/done/ticket-to-pr-ABC-015-dev/claim.md
  - 20260808T184100Z-software-engineer-decision-3f0c71a2
supersedes: 
---

# Artifacts this subtask produced, by reference

Branch `grugops/ticket-to-pr-ABC-015`. **Never `main`.**

| Artifact | What changed |
|---|---|
| `src/glyph-mode.ts` | **NEW.** 122 lines, **32 of them code**. `selectGlyphMode(signals: GlyphSignals): GlyphMode` — the five-row table evaluated IN ORDER, reading only its argument. `beginGlyphModeSession(flags: GlyphFlags): GlyphModeSession` — reads `process.stdout.isTTY` and `process.env` ONCE and closes over the answer; `GlyphModeSession` is `() => GlyphMode`. Imports one TYPE (`GlyphMode` from `render.ts`) and nothing else |
| `src/glyph-mode.test.ts` | **NEW.** 15 tests: the **eleven acceptance criteria one test each** (nine tuples — seven as an `it.each` table, the both-flags-true tuple which also asserts nothing thrown and nothing printed, and the `win32` guard which STUBS `process.platform`; then the two session criteria) **plus four** pinning what the criteria do not reach — each ambient signal travelling to the rule, the flags travelling, and two on the empty-locale reading |
| `src/glyph-mode.nfr.test.ts` | **NEW.** 3 tests. `NFR-007`'s zero-filesystem / zero-process bar, spied on `node:fs` and `node:child_process`, plus a control so the two cannot pass vacuously. Its own file for the reason `gameend.nfr.test.ts` gives: a hoisted `vi.mock` would re-route the acceptance file's whole module graph |
| `plans/tickets/ABC-015-glyph-mode-selection.md` | Frontmatter `in-development`/`In Development` → `in-review`/`In Review`; one new `## Implementation` section. **The `## Acceptance` criteria, the `CORRECTED IN PLACE 2026-08-08` block, `## Scope`, `## Out of scope`, `## Dependencies`, `## Test notes`, size `S` and priority `P1` are all untouched** |
| `plans/board.md` | `ABC-015` moved `In Development` → `In Review`; headings `In Development (WIP 1/3)` → `(WIP 0/3)` and `In Review (WIP 0/3)` → `(WIP 1/3)`; an exit comment on `In Development` and an entry comment on `In Review`; one entry prepended to the `_Updated:` header. **The `In Review` column's prior QE record for `ABC-014` is left standing beneath the new one, not replaced** |
| `plans/traceability.md` | **One row (`ABC-015`), three cells** — `Code (PR/files)`, `Tests`, `Status` (prepended with a `Was:` chain). One entry prepended to the `_Updated:` header. **No other row touched; `ABC-014`'s row byte-identical** |
| `.grugops/context/ticket-to-pr-ABC-015/notes/` | Five notes hand-written in the schema's exact shape: this one, two `decision`s (the closure ruling; the empty-locale assumption) and two `observation`s (the acceptance-criteria blind spot found by mutation; the gate results and the NFR bar). **No `finding`, no derived `index.md` / `index.jsonl`** — the renderer does not exist here and nothing was hand-faked |
| `.grugops/queue/…/ticket-to-pr-ABC-015-dev/` | Moved `pending/` → `claimed/…/` → `done/…/` **by hand**, with a `claim.md` registry record naming the method and the absent substrate |

## Verification of the diff's shape, done rather than asserted

- `git diff --numstat main -- src/` lists **only the three new files**. Every pre-existing file under
  `src/` — `render.ts` included — is byte-identical to merged `main` at `f1743a3`.
- `src/glyph-mode.ts` was compared with `cmp` against a pre-mutation-campaign copy after the campaign
  and is **byte-identical**; no mutant survives in the tree.
- The tracked `coverage/` directory was rewritten by a `--coverage` run and **restored** with
  `git checkout -- coverage/`; `git status` is clean of it.

## What was deliberately NOT produced

- **No argv parsing and no `--help` text.** `EPIC-006` owns argv; this module takes two booleans.
- **No caller.** `ABC-018` is the first, and it is unstarted and in `Backlog`. `src/glyph-mode.ts`
  has **zero runtime importers** today, exactly as `src/render.ts` did when `ABC-014` landed.
- **No throw and no message on `--ascii --unicode`.** Row order, `ascii`, silent — BA/PM's ruling.
  The conflict message stays `EPIC-006`'s obligation.
- **No edit to `src/render.ts`, `ABC-018`, `EPIC-006`, `EPIC-002`, any ADR, `plans/nfr-catalog.md`
  or `plans/metrics.md`.** No dependency added or changed; `package.json` untouched.
- **No wall-clock assertion anywhere.** The ticket has no perf bar and says why.
- **No PR.** This repo has no git remote and none was invented — `autonomy: "pr"` has always meant
  "branch + gate" here, as `AGENTS.md` records.
- **Nothing merged and nothing deployed.** No gate has adjudicated this ticket yet; the owner's
  standing merge authority is approval to merge work that PASSED one.
