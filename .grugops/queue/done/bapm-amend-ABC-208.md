---
subtask: bapm-amend-ABC-208
role: ba-pm
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/bapm-amend-ABC-208/
branch: new grugops/bapm-amend-ABC-208 from main, worktree ../wt-bapm-amend-ABC-208
width: 1 of 3 (records only — no npm, vitest or timing)
---

# ABC-208: page lines from the design ruling (before Ready for Dev)

## Do
- Per Architect `arch-design-ABC-208/…012b1053` and Orchestrator `orch-2026-10-26e`: add dated amendment lines to the ABC-208 page. No criterion's bar changes.
  1. Scope 2's fourth guard: "fewer than three non-pawn pieces".
  2. A2 is read at a per-row depth, with the 7 rows named in the ruling.
  3. A3's mate clause is read at the same depth, 5.
  4. A1 is a cross-build check that QE runs out of tree.
  5. Scope 1 adds `src/apply.ts` and `src/zobrist.ts`.
- Re-score the DoR. If 10/10, say Ready for Dev. Note in the page that ADR-0050 is PROPOSED: the build may proceed, but the real-clock reading and the merge wait on the owner's acceptance.
- Give the board card line in your Result; don't edit the board.

## Fences
- Only your worktree and `<scratchpad>/bapm208amend/`. No `src/`. Do NOT run npm/vitest/timing. Never push, force, amend or rebase; never merge into main. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task bapm-amend-ABC-208). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result (ba-pm, 2026-10-26T02:40Z): **ABC-208 page amended from the design ruling: five dated lines, no criterion's bar changed. DoR 10 of 10 → In Design → Ready for Dev. `ADR-0050` is PROPOSED: the build may proceed, and the real-clock reading and the merge wait on the owner.**

Records only. Branch `grugops/bapm-amend-ABC-208` in `../wt-bapm-amend-ABC-208`, cut from `main` `5a7866f0`. One commit,
**`07e48904`**, not merged and not pushed. No npm, vitest or timing. No `src/` edit. Scratch: `<scratchpad>/bapm208amend/`
(the note bodies and the seal script).
- **Commit message defect (not fixed; amending is forbidden):** the blank line between the subject and the body is
  missing, so git reads the whole message as the subject. The content is right. The Orchestrator's merge message can
  carry a clean summary.

Notes are in `.grugops/context/bapm-amend-ABC-208/notes/`. They were sealed with grugops 2.1.0 `context-io.js`
`admitAndAppend` (context root: the worktree's `.grugops/context`), and `readContext` read back 2 of 2:
- `20261026T023835Z-ba-pm-decision-e8505f19`: the call;
- `20261026T023835Z-ba-pm-observation-eefeac14`: three named readings with their alternatives, re-reads, and flags.

**The five lines** (each dated `2026-10-26 (BA/PM, bapm-amend-ABC-208)`):
1. **Scope 2:** the fourth guard reads "fewer than three non-pawn pieces" (`ADR-0050` d6). It implies the floor, so `A2`'s
   second bullet stands as written.
2. **`A2`:** "a fixed depth ≥ 8" is read per row (8–12), with `ADR-0050` d9's seven rows named. "Proven … with its source"
   is read through Test note 1 (sourced, not hand-labelled). `.005` is the suite's best move, and the other six still
   meet "≥ 6". All 7 must be played.
3. **`A3`:** the mate clause is read at the same depth, 5, as `ADR-0050` d8's floor on the 287. Flips on the 190 are a
   report (the `ADR-0026` d9 shape that Scope 4 names).
4. **`A1`:** both sentences are cross-build. QE runs `A1` out of tree, on the `ABC-078` `A3` corpus at that sweep's
   budgets, as the probe's 222 cells did.
5. **Scope 1:** adds `src/apply.ts` and `src/zobrist.ts` (`ADR-0050` d7). `G1` stays class B.

Also on the page:
- a dated Dependencies line: `ADR-0050` is PROPOSED; the build may proceed; the ALONE `G6` + D reading and the merge
  wait on the owner (`…d25ab770` b);
- the frontmatter `adr:` field names `ADR-0050` (PROPOSED). The `status` and `column` fields are left as they were (the
  `ABC-215` precedent).

| # | DoR item | verdict at `5a7866f0` |
|---|---|---|
| 1 | problem clear | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ re-scored: guard < 3 non-pawn pieces; Scope 1 + `apply.ts`, `zobrist.ts`; R = 3 at null-window nodes, no verification |
| 3 | INVEST-shaped | ✅ re-scored: no split (one `M` build; a split ships an empty door and needs a second D) |
| 4 | acceptance testable and measurable | ✅ re-scored: `A1` out of tree; `A2` 7 named rows at per-row depth 8–12; `A3` at d5 with `ADR-0050` d8's bounds; `G7` not owed |
| 5 | dependencies known | ✅ unchanged (plus the `ADR-0050` owner gate, dated in § Dependencies) |
| 6 | security/NFR triggers with a measurable target | ✅ unchanged |
| 7 | test notes present | ✅ unchanged (five) |
| 8 | size assigned | ✅ re-scored: `M`, confirmed by the probe |
| 9 | priority assigned | ✅ `P2` |
| 10 | no major unresolved blocker | ✅ re-scored: design ruled (`…012b1053`); reading (b) routed; PROPOSED does not block the build. `QE-205-c` and `QE-207-g` open, not blocking |

Files on the branch:
- `plans/tickets/ABC-208-…md` (+39/−1; the page is 297 lines, under the 300-line budget);
- 2 notes (+76, +78).

Not touched: `src/`, `memory-bank/` (`ADR-0050` included), `EPIC-008`, `plans/board.md`, `plans/traceability.md`, and the
config. In main's checkout, only this queue record and its claim moved, uncommitted, for the Orchestrator.

### Flags for the Orchestrator
- **`plans/traceability.md` has lost its history (records; yours).** `a5d46a90` (orch, 2026-10-25, "security-nfr-lic-pub-1
  recorded") changed it +1/−1551. Since then, every Orchestrator commit has replaced the file instead of appending to it:
  `main` now holds 2 lines, the `arch-design-ABC-208` row twice. The last full version is `ad8d0f88` (1 552 lines).
  Restoring it, and the rows written since, is your call. Append the row below; do not overwrite.
- LOW: the page frontmatter `status: ready` / `column: Ready` is stale against the board (In Design). Sync it at the move
  if you want.
- LOW: `A2` under a strict "tablebase-proven" reading would have 4 rows, not 6. The page reads "proven" through Test
  note 1, so the count is met. This is for your `Ready for Dev` exit re-read; nothing is asked for.

### Board card line (for the Orchestrator; ABC-208 In Design → Ready for Dev; no other column moves)

- **ABC-208, In Design → Ready for Dev**, appended to its card: `**2026-10-26: page amended, DoR 10/10 → Ready for Dev (bapm-amend-ABC-208, …e8505f19): guard < 3 non-pawn pieces; Scope 1 + src/apply.ts, src/zobrist.ts; A1 cross-build, out of tree (QE); A2 7 rows at per-row depth d8–12; A3 mate clause at d5 on the 287; no bar changed. ADR-0050 PROPOSED: build may proceed; the ALONE reading and the merge wait on the owner (…d25ab770 b).**`

### Trace row (10 cells, the order of the row on main)

| ABC-208 (bapm-amend-ABC-208) | page amended from the design ruling: guard < 3 non-pawn pieces; Scope 1 + src/apply.ts, src/zobrist.ts; A1 cross-build out of tree; A2 7 rows at per-row depth d8–12; A3 mate clause at d5 on the 287; no criterion's bar changed; DoR 10/10 | EPIC-008 | +1 ply expected at 3 s (position-6); the depth-limited 8.e5 / 10.Ne4 errors | NFR-005 via G6 (predicted MET, UNKNOWN - verify); NFR-004 unchanged; G7 not owed; no bound moved; notes …e8505f19, …eefeac14 | grugops/bapm-amend-ABC-208 @ 07e48904 (records only)<br>ADR-0050 (PROPOSED) | — (records only) | — (UAT owed at delivery; QE signs) | owner accepts/declines ADR-0050; Orchestrator merges records, board, trace (restore history first), then Ready for Dev → In Development (ticket-to-pr-ABC-208) | In Design → Ready for Dev, 2026-10-26 (build may start; ALONE reading and merge wait on ADR-0050) |
