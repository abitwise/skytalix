---
id: 20261012T051800Z-software-engineer-artifact-ref-abc117-fix-branch-files-and-gates-4ebb523f
kind: artifact-ref
by: software-engineer
task: fix-ABC-117
at: 2026-10-12T05:18:00Z
verified_by:
confidence: high
refs:
  - ABC-117
  - QE-117-a
  - QE-117-c
  - plans/traceability.md
  - plans/tickets/ABC-117-that-exit-one-is-an-unhandled-exception-not-the-usage-code.md
  - src/cli.test.ts
supersedes:
---

# `fix-ABC-117`: branch, files, commands, gates

**Branch:** `grugops/ABC-117-exit-one-correction`, worktree `../cli-chess-example-fix-ABC-117`. It
was fast-forwarded `d5afab3f` → `8e679aed` (`grugops/qe-ABC-117`). The corrections are in
`7bf4c61e`. The delivery commit follows it and holds the page § Delivery, the trace delivery row and
these notes. Not pushed, not merged.

**Files:** `plans/traceability.md` (2 rows appended at the END: S10 correction, delivery);
`plans/tickets/ABC-117-…md` (dated bullet in `## Out of scope`, new delivery section; 0 deletions);
`src/cli.test.ts` (3 comment lines re-worded, QE-117-c); four new notes here. Not touched:
`plans/board.md`, the `ABC-115` page, every existing note, `ADR-0016`, `nfr-catalog.md`,
`AGENTS.md` and `.grugops/test-skips.md`.

**Commands run:**
- `node src/cli.ts 1</dev/null </dev/null`.
- `…d2c79dc9`'s script with `1</dev/null` and with stdout writable.
- `node src/cli.ts --bogus </dev/null`.
- The two content-search passes (`…9016b077`).
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` (all exit 0 at `7bf4c61e`;
  56/1741/0, `last-run.json` `success: true`).
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` (`No findings.`).
- The fence predicates: numstat, the non-`//` count under `src/`, the NFR 8-row `shasum`, the
  `it(`/`expect(` count.

The scratch files (repro script, stderr captures) are in the session scratchpad, outside the
repository. Nothing was planted, so nothing was reverted. No timing was read.
