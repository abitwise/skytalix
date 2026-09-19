---
id: 20260919T104000Z-software-engineer-artifact-ref-branch-commit-files-tests-commands-and-what-was-not-touched-5b1e8c47
kind: artifact-ref
by: software-engineer
at: 2026-09-19T10:40:00Z
verified_by:
confidence: high
refs:
  - ABC-034
  - EPIC-003
  - src/rejection.ts
  - src/rejection.test.ts
  - src/move-input.ts
  - src/move-input.test.ts
  - plans/traceability.md
  - plans/tickets/ABC-034-rejections-that-teach.md
supersedes:
---

# What this hop built, by reference

**This is not a stamp.** Hand-authored `artifact-ref`; not a UAT-spec reference, so it carries no
`sha` / `gate_run` / `content_hash` keys.

| artifact | what it is |
|---|---|
| branch `grugops/ABC-034-rejections-that-teach` | off `grugops/wave-2026-09-19` @ `4f0ef01`; worked in an isolated `git worktree`; **NOT merged, NOT deployed, NOT self-signed** |
| commit `6ee7cde` | the delivery: `src/rejection.ts` (+181), `src/rejection.test.ts` (+345), `src/move-input.ts` (+10/−11), `src/move-input.test.ts` (+24/−11), and the queue claim (`pending/` → `claimed/`) |
| the commit carrying these notes | notes, `plans/traceability.md` row append, ticket page `## Delivery` section, queue `claimed/` → `done/`; its sha is in the handback report |
| `src/rejection.ts` | `REJECTION_REASONS` (7, `as const`), `RejectionReason`, `Rejection` (discriminated union with referents), `classifyRejection(position, texts, legal?)`, `rejectionMessage(rejection)` |
| `src/rejection.test.ts` | 53 tests: fixture round-trips (10 FENs + the in-check assertion), `A1` (5), `A2` (2 property rows over the six perft positions), `A3` (8), `A4` (5), `A5` (9, through `assembleFrame` with the real renderers), `A6` (7), `A8` (3), texts-handoff (3) |
| `src/move-input.ts` | the rejected arm calls `classifyRejection` with the tried texts and places `rejectionMessage`'s sentence; `RejectReason` / `reasons` removed as unused; header sentence corrected |
| `src/move-input.test.ts` | `describe("ABC-033 A6 …")`: six rows keep their line and assert the classifier's code plus the dispatcher placing the classifier's rendering; the `e2e5` row's code is `piece-cannot-reach`; one row title re-worded to what it now asserts. Test count 50, unchanged |
| `raw.tsv`, `load.txt`, `summary.txt`, `harness.mjs.txt` (beside this note) | the `N8-LANE` / `NFR-008` interleaved measurement — see the sibling `observation` |
| `plans/traceability.md` `ABC-034` row | `Code`, `Tests`, `Status` cells appended to in place; no row added or removed |
| `plans/tickets/ABC-034-rejections-that-teach.md` `## Delivery` | the per-criterion disposition, appended at the end of the page |

**Commands run at `6ee7cde`** (the `npm run` wrappers were refused by this session's PreToolUse
hook as a "production-deploy pattern"; the underlying commands `AGENTS.md` records for each slot
were run instead): `npx tsc --noEmit` (typecheck AND build — the build slot is the same command);
`npx biome check .`; `npx vitest run --dir src`; `npx vitest run --dir src --reporter=json | jq`;
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
`PERFT_DEEP=1 npx vitest run src/perft.test.ts`. Numbers in the sibling `claim`.

**Not touched, and the fence it answers:** `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`
(fences); `src/turn-loop.ts`, `COMMAND_TABLE` (`ADR-0021`); `src/frame.ts`, the `(+N more)` marker
(`ADR-0022`); `src/legal.ts`, `src/moves.ts`, `src/san.ts`, `src/coordinate-move.ts` (`A7`, `A8`);
`package.json` (no dependency); `vitest.config.ts`; no test moved between lanes, none trimmed.
