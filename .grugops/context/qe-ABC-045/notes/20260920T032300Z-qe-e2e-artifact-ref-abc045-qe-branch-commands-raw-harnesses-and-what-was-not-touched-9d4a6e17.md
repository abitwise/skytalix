---
id: 20260920T032300Z-qe-e2e-artifact-ref-abc045-qe-branch-commands-raw-harnesses-and-what-was-not-touched-9d4a6e17
kind: artifact-ref
by: qe-e2e
at: 2026-09-20T03:23:00Z
verified_by:
confidence: high
refs:
  - ABC-045
  - ABC-075
  - src/command-input.ts
  - src/command-input.test.ts
  - src/cli.test.ts
  - plans/tickets/ABC-045-resign.md
  - plans/traceability.md
  - .grugops/queue/done/qe-ABC-045.md
supersedes:
---

# `ABC-045` QE — the branch, the commands, the raw harnesses, and what was not touched

Branch **`grugops/qe-ABC-045`**, created from `grugops/wave-2026-09-19` @ `2a1d70a` (carries the build
`b8afa30` via merge `d13fb1f`, and `ABC-075`'s `40b77ac` via merge `e8b1fe6`) in an isolated worktree
with the main checkout's `node_modules` symlinked (untracked, ignored). **Unmerged; nothing pushed (no
remote); not deployed.** The one commit on this branch carries these notes, the trace row, the ticket
§ QE and the queue move, and **nothing under `src/`** — `git diff --numstat 2a1d70a..HEAD` is the
measurement, quoted in the hand-back.

## Commands run at the tip (numbers in the sibling `decision`)

Through a node script each (the PreToolUse hook refuses `npm run`, `$?`, heredocs, `$(...)`):

- `npx biome check .` · `npx tsc --noEmit` (twice: typecheck and the build slot) ·
  `npx vitest run --dir src` · the same with `--reporter=json` for the skip count ·
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` ·
  `npx vitest run src/command-input.test.ts` · `npx vitest run src/cli.test.ts` —
  `raw-gates-harness.mjs.txt` → `raw-gates-summary.json.txt` (the JSON reporter's payload omitted
  from the summary; its parsed counts are in the `skip` object).
- 13 mutants + `M5-isolated`, `npx vitest run <named files> --reporter=json` each (`-t "A5 — no
  confirmation"` for the isolated round), `git checkout -- src/command-input.ts src/turn-loop.ts`,
  sha256 of both files against the pre-round bytes and `git status --porcelain -- src` asserted
  empty after each — `raw-mutants-harness.mjs.txt` → `raw-mutants-summary.json.txt`.
- Edge cases (a)–(e) through the loop — `raw-edges-loop-harness.mjs.txt` →
  `raw-edges-loop-summary.json.txt` (20 / 20); through the real entry point plus `help` —
  `raw-edges-cli-harness.mjs.txt` → `raw-edges-cli-summary.json.txt` (11 / 11).
- `git log bd40d85..2a1d70a -- src/`, `git diff --stat bd40d85 2a1d70a -- src/` (the 1325
  explanation); `git diff bd40d85 b8afa30 -- src/command-input.ts` (the docblock audit); `grep -n`
  over `src/turn-loop.ts` for the cited arms (the stale-cite finding).

Not a UAT spec, so no `sha` / `gate_run` / `content_hash` triple is carried — the same shape as
every prior QE `artifact-ref` on this install.

## Not touched, by fence

`src/search.*`, `src/quiescence.*`, `src/engine.*` (`ABC-079` re-hop live), `src/zobrist.*` (QE
`ABC-075` live) — not opened. `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` — not opened.
`NFR-008` not ruled. Zero test rows added to the repository; the edge harnesses are scratch beside
this note. Every mutant reverted; `git status --porcelain -- src` empty at the commit.

**Remaining work, not this role's:** the `In Review` exit on `plans/board.md` (Orchestrator); the
owner's word at `In UAT` (production lines > 0, no waiver); `A2`'s last clause re-worded by BA/PM
(sibling `decision`, ruling 1); the four stale line cites in `src/command-input.ts` and the "Ten"
in `src/cli.test.ts:278` for whoever next holds the pen on those files; `ABC-046` / `ABC-102`
extend the same table after this merges.
