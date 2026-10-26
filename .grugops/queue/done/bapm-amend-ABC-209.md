---
subtask: bapm-amend-ABC-209
role: ba-pm
ticket: plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
ref: .grugops/context/bapm-amend-ABC-209/
branch: new grugops/bapm-amend-ABC-209 from main, worktree ../wt-bapm-amend-ABC-209
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# ABC-209: place the Architect's page lines; DoR re-score

## Do
- Read Orchestrator `orch-2026-10-26u/…388d6d51` and Architect `arch-design-ABC-209/…2e73dcd9`. The page lines are in `.grugops/queue/done/arch-design-ABC-209.md`, under "BA/PM page lines".
- Place each line on the ABC-209 page as a dated amendment:
  - Scope 1: CLI `new` as a clear path.
  - Scope 2: the clear door is "no token".
  - Scope 3 and the `adr` front-matter.
  - Test note 2: answered.
  - A4: the shape of the 40-search row.
  - A3: pair selection.
- **No criterion's bar changes.** If a line would change one, stop and say so.
- Re-score DoR. Put the board card lines in your Result: In Design → Ready for Dev if 10/10. Don't edit the board.

## Fences
- Work only in your worktree. No `src/`, and no npm/vitest/timing.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `bapm-amend-ABC-209`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-26T13:02Z): **ABC-209 page amended from the design ruling: six dated lines, no criterion's bar changed. DoR 10 of 10 → In Design → Ready for Dev. The `ADR-0025` decision 4 amendment is PROPOSED: the build may proceed, and the ALONE reading and the merge wait on the owner.**

Records only. Branch `grugops/bapm-amend-ABC-209` in `../wt-bapm-amend-ABC-209`, cut from `main` `82f799ce`. One commit,
**`ce7fcb50`**, not merged and not pushed. No npm, vitest, build or timing. No `src/` edit. Scratch:
`<scratchpad>/bapm209amend/` (the note bodies and the seal script).

Notes are in `.grugops/context/bapm-amend-ABC-209/notes/`. They were sealed with grugops 2.1.0 `context-io.js`
`admitAndAppend` (context root: the worktree's `.grugops/context`, `at` from `date -u`), and `readContext` read back
2 of 2:
- `20261026T130154Z-ba-pm-decision-3750aaf6`: the call;
- `20261026T130154Z-ba-pm-observation-11efe975`: the re-reads at `82f799ce`, two named readings with their
  alternatives, and flags.

**The six lines** (each dated `2026-10-26 (BA/PM, bapm-amend-ABC-209)`):
1. **Scope 1:** a third clear path is the CLI's in-game `new` (`ABC-046`, `src/command-input.ts:123`). `A2`'s "CLI's
   new-game path" covers `new` as well as the process start. `search()` keeps its clear; always-replace, no ageing.
2. **Scope 2:** the clear door is `chooseMove` and its three doors called without a `game` token. No new export;
   `clearTable` stays exported.
3. **Scope 3 and the frontmatter `adr:`:** a PROPOSED amendment to `ADR-0025` decision 4 (§ Proposed amendment
   2026-10-26). Reading (b) (`…e496fc70`): the build may proceed; the ALONE reading and the merge wait on the owner.
4. **Test note 2:** answered. The blunder path does not share the table; its children carry no token.
5. **`A4`:** the row is 40 engine searches through one token under `--expose-gc`, read after `gc()` at search 1 and
   search 40. The bar stays `heapUsed` ≤ 1 MiB. `arrayBuffers` is read at the same points; over 1 MiB there is the
   existing `NFR-009` STOP, not a new bar.
6. **`A3`:** the Given is one instrumented pair. QE picks a pair whose reply is the stored hash move (19 of 21 roots
   stored in the probe). The bar stays ≥ 1.

**No bar changed, so no STOP.** Two lines are named readings, recorded with the rejected alternative in the
observation note:
- `A4` reads "move 1 / move 40" as engine search 1 / 40, and does not grade `arrayBuffers` as a second bar.
- `A3` reads the Given as QE's chosen pair, not "every pair". 2 of 21 roots were not stored, so "every pair" would
  fail by construction, and the page never said that.

The frontmatter `status` and `column` fields are left as they were (the `ABC-215` / `bapm-amend-ABC-208` precedent).

| # | DoR item | verdict at `82f799ce` |
|---|---|---|
| 1 | problem clear | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ re-scored: `new` is a third clear path; the door is "no token", no new export; the amendment's form is named |
| 3 | INVEST-shaped | ✅ unchanged (the probe found no split) |
| 4 | acceptance testable and measurable | ✅ re-scored: `A3`'s pair is chosen; `A4`'s row shape is named; no bar moved |
| 5 | dependencies known | ✅ unchanged |
| 6 | security/NFR triggers with a measurable target | ✅ unchanged: `NFR-009` ≤ 1 MiB over 40 moves; over = STOP |
| 7 | test notes present | ✅ re-scored: five; test note 2 is answered |
| 8 | size assigned | ✅ re-scored: `S`, confirmed by the probe (about 45–65 production lines in five files) |
| 9 | priority assigned | ✅ `P3` |
| 10 | no major unresolved blocker | ✅ re-scored: design ruled (`…2e73dcd9`); PROPOSED does not block the build under reading (b). `QE-205-c` and `QE-207-g` open, not blocking |

Files on the branch:
- `plans/tickets/ABC-209-…md` (+27/−1; the page is 285 lines, under the 300-line budget);
- 2 notes (+66, +71).

Not touched: `src/`, `memory-bank/` (`ADR-0025` included), `EPIC-008`, `plans/board.md`, `plans/traceability.md`, and
the config. In main's checkout, only this queue record and its claim moved, uncommitted, for the Orchestrator.

### Flags for the Orchestrator
- LOW: the page frontmatter `status: ready` / `column: Ready` is stale against the board (In Design). Sync it at the
  move if you want.
- `plans/traceability.md` on `main` holds 1 586 lines. The history loss flagged by `bapm-amend-ABC-208` is restored.
  Append the row below.

### Board card line (for the Orchestrator; ABC-209 In Design → Ready for Dev; no other column moves)

- **ABC-209, In Design → Ready for Dev**, appended to its card: `**2026-10-26: page amended, DoR 10/10 → Ready for Dev (bapm-amend-ABC-209, …3750aaf6): CLI new is a third clear path (A2 covers it); clear door = chooseMove without a game token, no new export; test note 2 answered (blunder path does not share); A4 row = 40 searches through one token, gc() reads at 1 and 40 (heapUsed ≤ 1 MiB; over = STOP); A3 pair = reply is the stored hash move (≥ 1); no bar changed. ADR-0025 D4 amendment PROPOSED: build may proceed; the ALONE reading and the merge wait on the owner (…e496fc70 b).**`

### Trace row (10 cells, header order)

| ABC-209 (bapm-amend-ABC-209) | page amended from the design ruling: CLI `new` a third clear path (A2 covers it); clear door = chooseMove without a game token, no new export; Scope 3 + adr: name the PROPOSED ADR-0025 D4 amendment; test note 2 answered (no sharing); A4 row shape (40 searches, one token, gc() at 1 and 40); A3 pair = reply is the stored hash move; no criterion's bar changed; DoR 10/10 | EPIC-008 | TT kept across the moves of one game behind a game token (not built); small expected gain (UNKNOWN - verify) | NFR-009: heapUsed ≤ 1 MiB over 40 searches (over = STOP), 4 MiB table, ≤ 16 MiB total; no bound moved; notes …3750aaf6, …11efe975 | grugops/bapm-amend-ABC-209 @ ce7fcb50 (records only)<br>ADR-0025 § Proposed amendment 2026-10-26 (PROPOSED) | — (records only) | — (UAT owed at delivery; QE signs) | owner accepts/declines the ADR-0025 amendment; Orchestrator merges records, board, trace, then Ready for Dev → In Development | In Design → Ready for Dev, 2026-10-26 (build may start; ALONE reading and merge wait on the amendment) |
