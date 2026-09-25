---
id: 20260925T155535Z-agents-md-scribe-observation-test-all-line-updated-47bb9081
kind: observation
by: agents-md-scribe
at: 2026-09-25T15:55:35Z
verified_by:
confidence: high
refs:
  - ABC-122
  - AGENTS.md
  - tools/grugops/run-bounded.js
  - tools/grugops/run-bounded.proof.js
  - .grugops/context/ticket-to-pr-ABC-122/
  - .grugops/context/secnfr-ABC-122/
supersedes:
---

# `AGENTS.md` § Commands § Test — the `Test (all)` line now matches `ABC-122`

No sanctioned writer (`scripts/context-io.ts`, `scripts/claim.js`, `mcp__grugops__propose_note`) is
present in this repository or the kit, and `context.human_admission` is `off` on this install — per
`AGENTS.md`'s own recorded fact, this note is hand-authored per
`agent-factory/contracts/context-note.md` rather than admitted through the absent writer.

## What changed

`package.json`'s `test` script is already `node tools/grugops/run-bounded.js 60000 vitest run`
(landed at `ABC-122`); `AGENTS.md`'s `Test (all)` line still described the old plain `vitest run`.
Replaced the line's inline comment so it is true again:

- names the real command the wrapper runs;
- records this hop's own `npm test` run: exit 0, 47 files, 1446 tests, 5.45 s;
- states the 60 s bound and that a hung lane exits 124 within it;
- states the owner-accepted stop signal is Ctrl-C/SIGTERM, never SIGKILL (R1: SIGKILL/SIGHUP can
  orphan a hung `vitest`);
- states the `*_DEEP` lanes run via `npx vitest run` directly and never through `npm test`
  (`ENGINE_DEEP` alone is ~99 s, over the 60 s bound) — this was already true of the existing
  `*_DEEP` lines below it, now cross-referenced rather than contradicted;
- points at the wrapper's own proof, `node tools/grugops/run-bounded.proof.js`, and records this
  hop's run of it: exit 0, all seven rows held (`darwin v24.12.0`).

## Readings taken this hop, in this worktree

- `npm test`: exit 0, 47 test files / 1446 tests passed, wall 5.45 s (well under the 60 s bound).
- `node tools/grugops/run-bounded.proof.js`: exit 0, all rows `PASS` (`A2` pass-through at exit
  0 and exit 3, `A1`/`A3` bounded-kill timing at 526.8 ms against a 500 ms bound + 250 ms overhead,
  the stderr line naming the bound and command, the armed-tree check, and the no-orphan check at
  250 ms grace) — `darwin v24.12.0: all rows held`.

## Size

`AGENTS.md`: **32,062 B before → 32,565 B after**, against the 32,768 B cap from `ABC-109` — **+503
B**, 203 B of headroom left. No neighbouring comment needed compression to stay under the cap.

## Fences held

Touched only `AGENTS.md` in this worktree, plus this note and the queue transition. No `src/`,
`tools/`, `plans/board.md`, ticket, or ADR file touched. No merge, no push.
