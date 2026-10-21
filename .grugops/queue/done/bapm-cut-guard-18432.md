---
subtask: bapm-cut-guard-18432
role: ba-pm
ticket: (new) lower the AGENTS.md byte guard to 18,432
ref: .grugops/context/bapm-cut-guard-18432/
width: 3 (beside ticket-to-pr-ABC-185 and scribe-amend-90; records only)
---

# BA/PM: cut the XS ticket that lowers the `AGENTS.md` byte guard from 24,576 to 18,432 (owner decision `…cba9c8eb`)

The owner decided: the guard `AGENTS_MD_BUDGET_BYTES` in `src/cli.test.ts` (ABC-109 A5) drops from 24,576 to **18,432**. `AGENTS.md` is 15,606 B after ABC-164 (`1ce736af`), so 2,826 B (≈ 2.4 edits at 1,159 B/edit) of room remain under the new guard.

## Cut
- Next free id **ABC-187** (verify in `plans/tickets/`). Size XS; priority your call (the owner wants it done now). Builder: SE, then QE.
- Scope: the constant, and any test name, comment or message in `src/cli.test.ts` that states 24,576 or "24 KiB" for this guard; nothing else. Name every occurrence at `main`.
- Acceptance red at base, green at head: e.g. a scratch `AGENTS.md` of 18,433 B passes the base guard and fails the head guard; the real `AGENTS.md` (15,606 B) passes head; `npm test` counts equal base (59 / 1987), skips 0; 0 production lines (waiver form empty).
- Also: the stale comment at `src/cli.test.ts:2242` ("13 further closers"; 8 remain after ABC-164, QE-164-h). Fold it in only if it sits in the same file and costs one line; say which.
- Score DoR; at 10/10 place it in Ready.

## Fences
- Records only: the new ticket page, `plans/board.md` (one card, header counts, one `_Updated:` line prepended above the first existing one; re-read the board right before editing — the Orchestrator moves ABC-185 in parallel), notes. No `src/`, `AGENTS.md` or `plans/traceability.md` edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-cut-guard-18432`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-cut-guard-18432.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**:
  `| {ticket} ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**DONE.** Records only, uncommitted on `main` (base `bf6fc623`; `main` was at `80de5949` on finish). Notes are in
`.grugops/context/bapm-cut-guard-18432/notes/`. They were sealed with `admitAndAppend` (context root passed explicitly as the main
checkout's `.grugops/context`) and read back with `readContext` (4 notes):
- `20261021T133924Z-ba-pm-observation-669853d9`: the readings (every occurrence, closer count, boundary runs).
- `20261021T133924Z-ba-pm-decision-d74b218a`: the cut.
- `20261021T133924Z-ba-pm-observation-52428ef9`: `AGENTS.md:7` owed outside the fence.
- `20261021T133935Z-ba-pm-observation-4c681102`: page pointer. The writer refused it as an `artifact-ref` (it needs
  `sha`/`gate_run`/`content_hash` from a §14 run, and none exists for a records-only cut). Nothing persisted from that
  attempt; recorded honestly as an `observation`.

**Files touched:** `plans/tickets/ABC-187-the-agents-md-byte-guard-still-allows-24576-b-so-abc-164s-cut-can-grow-back-unflagged.md` (new);
`plans/board.md` (one `_Updated:` line prepended above the Orchestrator's first; the Ready card; header Ready 0/8 → 1/8).
Not touched: `src/`, `AGENTS.md`, `plans/traceability.md`.

### The cut

| Ticket | Column | Size | Priority | DoR |
|---|---|---|---|---|
| ABC-187 | Ready | XS | P2 | 10/10 |

Builder: Software Engineer, then QE. UAT waiver expected (0 production lines).

**Every occurrence at `main` `bf6fc623`** (`src/cli.test.ts`):
- `:2484` `const AGENTS_MD_BUDGET_BYTES = 24_576;`: the constant. **In scope.**
- `:2483`, the JSDoc "`ABC-109` `A1`'s target: a quarter under the inherited 32,768 B reader cap". It derives 24,576
  (32,768 × ¾) without writing the number, so it is false at 18,432. **In scope**: rewritten in one line to name ABC-187 / `…cba9c8eb`.
- `:2491`, the message, interpolates the constant. No edit (head reads "18432 B budget", measured).
- `:2482` (describe title) and `:2486` (test name) state no number. No "24 KiB" anywhere.
- Nothing else in `.ts`/`.js`/`.json`/`.mjs`/`.sh` outside `node_modules` and `.grugops` holds 24,576.

**Stale comment `:2242` (QE-164-h): folded in.** It is in the same file and costs one line: "13 further closers" → 8 (measured:
9 closers in total, 8 after the slot's own), or no number.

**Acceptance shape measured** on a scratch `git archive` export (node_modules symlinked), `vitest -t "ABC-109"`:
- base at 18,433 B: 1 passed;
- constant set to 18_432: at 18,433 B, 1 failed ("expected 18433 to be less than or equal to 18432"); at 18,432 B, 1 passed.

`src/` is byte-equal from `e82a3798` to `bf6fc623`, so the base counts are QE-164's **59 / 1987**, skips 0.

### Owed outside the fence (Orchestrator's routing call)

`AGENTS.md:7` says "**Byte budget: this file targets ≤ 24,576 B.**" This goes stale when ABC-187 merges.
- The fix is a byte-neutral Scribe line: 24,576 → 18,432, so `wc -c` stays 15,606.
- The page's `A6` carries a ready criterion if it is folded in as a Scribe hop on the same branch.
- BA/PM recommends that same-branch hop, so the limit and its stated number change together. A separate Scribe hop
  after merge also works. Until the line changes, a Scribe sees 8,970 B of room where 2,826 B remain.

### Racing

No file overlap with `ticket-to-pr-ABC-185` (`plans/traceability.md`) or `scribe-amend-90` (`memory-bank/90`).
- If ABC-187's trace row comes due inside ABC-185's short append freeze, it waits until ABC-185 merges.
- The board was re-read right before the edit. Nothing had moved since `bf6fc623`.

Next free id after this hop: **ABC-188**.

### Trace row for the Orchestrator to append (10 cells, checked with the escape-aware split)

| ABC-187 (BA/PM) | Cut on owner decision `…cba9c8eb`: `AGENTS_MD_BUDGET_BYTES` 24,576 → 18,432 in `src/cli.test.ts` (`:2484` constant, `:2483` JSDoc, `:2242` closer count 13 → 8 per QE-164-h); `AGENTS.md:7` owed to the Scribe, outside the fence | — | — | `NFR-008` not triggered (0 files, 0 tests, 0 spawns); ABC-109 `A5`; QE-164-h | `main` @ `bf6fc623` (uncommitted, records only)<br>`plans/tickets/ABC-187-…-grow-back-unflagged.md`, `plans/board.md` | — (records only; boundary measured on a scratch export: 18,433 B passes base, reds head; 18,432 B passes head) | — | — | → Ready (XS, P2, DoR 10/10) |
