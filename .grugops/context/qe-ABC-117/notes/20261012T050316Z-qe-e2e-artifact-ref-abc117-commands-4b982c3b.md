---
id: 20261012T050316Z-qe-e2e-artifact-ref-abc117-commands-4b982c3b
kind: artifact-ref
by: qe-e2e
at: 2026-10-12T05:03:16Z
verified_by:
confidence: high
refs:
  - ABC-117
  - plans/tickets/ABC-117-that-exit-one-is-an-unhandled-exception-not-the-usage-code.md
  - plans/traceability.md
supersedes:
---

# QE `ABC-117`: what this hop ran and wrote

**Ran:**
- `node src/cli.ts 1</dev/null </dev/null`.
- The `…d2c79dc9` script with `1</dev/null </dev/null`.
- `node src/cli.ts --bogus </dev/null`.
- `--ascii </dev/null | head -c 1` x3 on `git archive badf6c3d src`.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` (tip and base).
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
- `node tools/grugops/host-protection.js`.
- The `git diff --numstat` / `--name-status` / `-U0` predicates, the `cmp` of the A2(iii) text, and
  the NFR 8-row `shasum`.

The probe script and the stderr captures are in the session scratchpad, outside the repository. No
plant was made, so there is nothing to revert. No timing was read.

**Wrote, on `grugops/qe-ABC-117` (off `d5afab3f`):**
- these four notes;
- `## QE` on the `ABC-117` page;
- one row appended at the END of `plans/traceability.md`.

**Not touched:** `src/`, `plans/board.md`, the `ABC-115` page, every existing note,
`.grugops/test-skips.md`, and the Engineer's branch ref.
