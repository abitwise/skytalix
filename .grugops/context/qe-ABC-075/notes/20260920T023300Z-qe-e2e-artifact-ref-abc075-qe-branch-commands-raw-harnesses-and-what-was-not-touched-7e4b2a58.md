---
id: 20260920T023300Z-qe-e2e-artifact-ref-abc075-qe-branch-commands-raw-harnesses-and-what-was-not-touched-7e4b2a58
kind: artifact-ref
by: qe-e2e
at: 2026-09-20T02:33:00Z
verified_by:
confidence: high
refs:
  - ABC-075
  - ADR-0020
  - src/zobrist.ts
  - src/zobrist.test.ts
  - src/zobrist.nfr.test.ts
  - plans/tickets/ABC-075-incremental-zobrist-key-seam.md
  - plans/traceability.md
  - .grugops/queue/done/qe-ABC-075/qe-ABC-075.md
supersedes:
---

# `ABC-075` QE — where the work is, what was run, and what this hop refused to touch

**Not a UAT-spec pointer**, so `sha` / `gate_run` / `content_hash` are absent by the contract's own
rule. The commit SHA is in the trace row and the hand-back, not here (this note is committed in it).

## Branch

`grugops/qe-ABC-075`, created from `grugops/wave-2026-09-19` @ `8dda2ae` (carries the build
`40b77ac` via `e8b1fe6`), in the isolated worktree `.claude/worktrees/agent-a807dbf036c47213f` with
`node_modules` symlinked from the main checkout. **Not merged. Not deployed. Zero files under
`src/` in the diff.**

## Files beside this note

| file | what |
| --- | --- |
| `raw-gates-harness.mjs.txt` / `raw-gates-summary.json.txt` / `raw-gate-unit-lane.txt` | the four gates + JSON skip count + integrity, one fresh process each, load sampled per command |
| `raw-deep-harness.mjs.txt` / `raw-zobrist-deep-walk.txt` | `ZOBRIST_DEEP=1` under `/usr/bin/time -p`; load before/after |
| `raw-mutants-harness.mjs.txt` / `raw-mutants-summary.json.txt` | the twelve mutants: patch, numstat, every red row with its first message, revert-clean flag |
| `raw-a5-bench-harness.mjs.txt` / `raw-a5-bench-tip.txt` / `raw-a5-bench-mutant-f.txt` | the Engineer's bench (`ticket-to-pr-ABC-075/notes/raw-a5-bench.ts.txt`, unchanged) copied into `src/` as a temp file, run, deleted; tip and mutant (f) |

## Commands, as run (every one through a node script; the hook refuses `npm run`, `$?`, heredocs)

- `npx biome check .` · `npx tsc --noEmit` (x2, typecheck and build) · `npx vitest run --dir src` ·
  `npx vitest run --dir src --reporter=json --outputFile=…` · `node
  tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` · `npx vitest run
  src/zobrist.test.ts src/zobrist.nfr.test.ts`
- `/usr/bin/time -p npx vitest run src/zobrist.test.ts` with `env: { ...process.env, ZOBRIST_DEEP: "1" }`
- per mutant: patch → `npx vitest run src/zobrist.test.ts src/zobrist.nfr.test.ts --reporter=json`
  → (if 0 red) `npx vitest run --dir src --reporter=json` → `git checkout -- src/zobrist.ts` →
  `git status --porcelain -- src` asserted empty
- `node src/zobrist-bench-qe075.tmp.ts` (tip, then under (f)); file deleted, `src/` asserted clean
- `git diff --name-only 40b77ac~1 40b77ac` (production lines: `src/zobrist.ts`) · `git diff
  --numstat b65f5f1 40b77ac -- src/` · `git diff --numstat b65f5f1 HEAD -- src/legal.ts src/apply.ts
  src/position.ts src/moves.ts src/search.ts` (empty) · `grep -c zobrist src/apply.ts src/moves.ts
  src/position.ts` (0/0/0) · `grep -rn hasLegalEnPassant src --include=*.ts | grep -v test.ts`

## Written outside `src/`

- `.grugops/context/qe-ABC-075/notes/` — this note, one `decision`, two `observation`s, ten `raw-*`.
- `plans/traceability.md` — ONE row appended (`ABC-075 (qe)`), one `_Updated:` line after the title;
  nothing touched in place.
- `plans/tickets/ABC-075-incremental-zobrist-key-seam.md` — § QE appended below § Delivery; nothing
  above it touched (page stays under the 300-line budget).
- `.grugops/queue/` — `pending/qe-ABC-075.md` → `claimed/qe-ABC-075/` (bare `mkdir`, hand-written
  `claim.md`) → `done/qe-ABC-075/qe-ABC-075.md`.

## Refused / not touched

- `src/**` — zero bytes in the diff; every mutant and the bench temp file reverted and asserted.
- `plans/board.md`, `AGENTS.md` (the `ZOBRIST_DEEP` line is the Scribe's), `plans/nfr-catalog.md`
  (`NFR-008` not ruled), `vitest.config.ts`, `ADR-0020`, `ADR-0005`, `ADR-0006`.
- `src/search.*`, `src/quiescence.*`, `src/engine.*`, `src/command-input.*` — not opened.
- The five stale/false comment sentences — named, not corrected (`ABC-114 A7`).
- Merge, deploy — neither. A `finding` — none (`human_admission` `off`).
