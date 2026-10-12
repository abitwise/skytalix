---
id: 20261012T140200Z-software-engineer-artifact-ref-branch-commits-files-commands-bd2ae8d8
kind: artifact-ref
by: software-engineer
task: wire-ABC-095
at: 2026-10-12T14:02:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-119
  - src/book-file.ts
  - src/cli.ts
  - src/cli.test.ts
  - src/cli.real-engine.test.ts
  - 20261012T135800Z-software-engineer-decision-wiring-built-to-r1-r3-s3-readings-taken-c2673608
  - 20261012T140000Z-software-engineer-observation-gates-cli-deep-plants-clause-b-s3-adc2b5bb
supersedes:
---

# Branch, commits, files and commands for the wiring hop

This note is hand-authored and unsealed.

- **Branch:** `grugops/ABC-095-book-before-engine`, worktree `../wt-ticket-to-pr-ABC-095`. Not merged, not pushed.
- **Commits on top of `1f205b00`:**
  - `75606020`, the merge of `main` `0974102f` (no rebase). Conflicts in the ABC-095 ticket page and
    `plans/traceability.md` were append against append; both sides were kept, in date order.
  - `09740ea4`, the code: the wiring.
  - The records commit follows: these notes, `probe/time.ts`, the trace row and § Delivery.
- **Delivered pair for the gates:** `git merge-base HEAD main` = `0974102f` .. tip. Everything under `src/` in the
  pair (`--numstat`):
  - `src/book-engine.ts` +20 (at `521a8513`, unchanged);
  - `src/book-engine.test.ts` +186 (at `521a8513`, unchanged);
  - `src/book-file.ts` +17, a new production module and capability holder;
  - `src/cli.ts` +13 −1;
  - `src/cli.test.ts` +47 −22;
  - `src/cli.real-engine.test.ts` +228 −19.
- **Production lines: yes** (`book-file.ts`, `cli.ts`, `book-engine.ts`). The zero-production-lines UAT waiver does
  not apply. UAT is the owner's word.
- **`probe/`:**
  - `time.ts` is the out-of-suite timing instrument (`node probe/time.ts <tree> cold-hit|warm-miss`), built with
    `readBookFile`, as R3 asks;
  - `window.sh` and `window.log` are the quiet-host gate and its end log;
  - `clause-b.out.txt` is the S3 item 1 self-check output, limbs 1–3.
- **Commands run** (results in `…adc2b5bb` and the timing note):
  - `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` (twice, the second time with `--reporter=verbose`);
  - `node .grugops/context/design-F-072-1/probe/clause-b.mjs 0974102f 09740ea4 {1,2,3}`;
  - the five plants, in copies under the session scratch directory, outside the repository.
- **Docs touched:** the ticket page § Delivery, and one row at the end of `plans/traceability.md`. `AGENTS.md`,
  `plans/board.md`, the ADRs, `src/book.ts` and `data/` were not touched.
- **Remaining, not mine:**
  - QE: `N8-LANE` (both `UNKNOWN - verify` costs), `ABC-119` `A6`'s mutant on the amended lane, `CLI_DEEP`, and
    the `A7` child-row discrimination point in `…adc2b5bb`;
  - Security/NFR: S3 at `In Security/NFR`;
  - the owner: UAT;
  - the Orchestrator: the board, and the page's stale `status:`/`column:` front matter.
