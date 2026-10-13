---
task: wave-2026-09-25
subtask: bapm-amend2-ABC-101
role: ba-pm
ticket: plans/tickets/ABC-101-difficulty-selection.md
ref: .grugops/context/bapm-amend2-ABC-101/
enqueued_by: orchestrator
enqueued_at: 2026-10-13T00:00:00Z
branch: grugops/bapm-amend2-ABC-101
base: main (after the board commit that enqueues this)
---

# Subtask: fold the piece-polarity fix into ABC-101's criteria. You are the ONLY hop running (width 1).

Owner words (notes under `.grugops/context/wave-2026-09-25/notes/`): `…owner-word-abc101-uat-glyph-fix-in-scope-*` ("Fix it in ABC-101") and `…owner-word-abc101-swap-permanent-no-flag-*` ("we can make this swap permanent and no additional flag is needed" → option A). The contract is Frontend/UI's, merged on main: `.grugops/context/design-ABC-101-glyphs/notes/…1c687529` (artifact-ref, the contract with `A11a`–`A11g`) and `…81cf192b` (options and readings).

As dated, append-only amendments:
1. **ABC-101:** add `A11a`–`A11g` from the contract (paste, do not paraphrase the byte-level frames; check each frame string against `src/render.ts`'s layout yourself). Widen `A9` by `src/render.ts`, `src/render.test.ts` and its `.snap` (the 8 named re-pins only: `:316-323` literal, the six snapshot tests' Unicode entries, the QE oracle table `:411-422` — re-locate at your base). State that `A11` lands as its own commit on the ABC-101 branch. Re-score DoR; size stays `M` unless you find otherwise (say why).
2. **ABC-014** § Scope: a dated note recording the new pairing (criteria unchanged unless one literally pins the old pairing — then amend it openly, never loosen).
3. **EPIC-002 `2c`:** one dated line that the light-terminal case is covered by `--ascii`, by owner word. Find the epic page; if `2c` is not where the contract says, report what you found.
4. Confirm `[A4]`, `2a`, `2b`, ABC-015 and the frame ADRs are untouched by A11, as the contract claims.
5. Say what the SE hop must do (on the existing branch `grugops/ABC-101-difficulty-selection`, tip `98ea0a84`, after merging main) and what QE must re-read (A11 + a re-run of the full gate; UAT waiver will stay non-empty).

## Fences
Own worktree: `git worktree add ../wt-bapm-amend2-ABC-101 -b grugops/bapm-amend2-ABC-101 main`. Edit only ticket/epic pages `ABC-101`, `ABC-014`, `EPIC-002` (dated, append-only), your notes under `ref:`, and one trace row at the END of `plans/traceability.md`. Do not touch `src/`, `tools/`, tests, `plans/board.md`, `AGENTS.md` (24,576 B, at budget), ADRs. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`, rebase. Never merge or push. No timing readings. If you change any committed file other than notes, run the gates before your last commit (`npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`). End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/bapm-amend2-ABC-101` in the main checkout, then FLAT `.grugops/queue/done/bapm-amend2-ABC-101.md` and `.claim.md`, uncommitted; `rmdir` the claim dir.

Report: branch tip; the A11 text as landed; A9 widening; ABC-014 / EPIC-002 notes; DoR and size; the SE hop's steps; anything owed by others.
