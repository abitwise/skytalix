---
task: abc016-qe-gaps-2026-08-11
subtask: refinement-ABC-016-qe-gaps
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-016-qe-gaps/
parent_ref: .grugops/context/abc016-qe-gaps-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T17:30:00Z
branch: grugops/ABC-016-status-panel
worktree: ../cli-chess-ABC-016
---

# Subtask: rule on `ABC-016`'s seven QE criterion gaps

QE returned **PASS_WITH_RISKS: zero code defects, seven criterion gaps.** Every one routes to you and
none asks for a production line. The ticket is **held in `In Review`**, not moved backward — QE's own
argument, which the Orchestrator accepted: the two prior backward moves were for *unwritten tests*,
and here `A1`–`A14` are all met. The criteria are **incomplete, not unmet**.

Read `parent_ref:` first, then QE's five notes in
`.grugops/context/quality-gate-ABC-016-qe/notes/` — **including its `failed-attempt` note, which is
the most useful thing in the hop** — then `plans/tickets/ABC-016-status-panel.md`, then
`memory-bank/50-decisions/ADR-0010-frame-width-stability-ownership.md` (accepted; do not re-open).

**Why this matters more than a normal refinement: `ABC-016` merges FIRST of four. These criteria
become the net the other three are built on.**

## The seven, as QE reported them — verify before you accept any

1. **`G1`** — `thinking` is crossed with nothing. `CHECK` can vanish while the engine thinks
   (378/400 games diverge); so can non-ASCII. `A12` iterates `CASES` and no entry is both thinking
   *and* in check.
2. **`G2`** — **`A7`'s width clause cannot fail on the build `D7` wrote it for.** Row 3 is 11 chars,
   the widest row is 21 and is row 2, so dropping the reservation entirely leaves `widestOf` at 21.
   **`ADR-0010` cl. 5 landed mid-hop and narrowed `A7` to "row-3 content does not jump horizontally"
   — exactly the quantity `A7` does not measure.** `ADR-0010` cl. 5 **refuses a constant-width
   criterion and QE did not ask for one. Neither should you.** Do not re-open the ADR.
3. **`G3`** — five piece values stated, only pawn and queen pinned. `KNIGHT=4` is invisible even to
   the snapshots; 325/400 diverge.
4. **`G4`** — `A13`'s counting clauses are measured at **0 and 1 ply only**, so a second derive from
   ply 2 passes everything — on the clause `## Security / NFR triggers` itself calls *"the part that
   actually binds"*. **You ruled `A13` last hop; this is the depth dimension that ruling did not
   reach.**
5. **`G5`** — check never crossed with a claimable draw. QE constructed a reachable case.
6. **`G6`** — **`A9` cannot fail on an inferring panel**, because `src/gameend.ts:170` derives
   `claimable.by` from the same `position.blackToMove`. This is `D17`'s class again. QE built the
   closing case (hand the panel a status whose `by` disagrees).
7. **`G7`** — the last-move cell's whole vocabulary is four strings, so `toSan` with an empty legal
   list kills every disambiguator (`last: Nexd4` → `last: Nxd4`); 218/400 diverge.

QE's own estimate of the repair: ~3 `CASES` entries, 1 `A6` row, 1 ply depth, 1 changed quantity in
`A7`, 1 narrowing on `A9`. **Zero production lines.**

## Two flags that came back with opposite verdicts — read both, they are instructive

- **The stale comment flag is CONFIRMED, empirically.** `src/status-panel.nfr.test.ts:134-139` still
  calls `A13` unsatisfiable after you ruled it. QE reports it *misled it*: *"you don't probe the depth
  of a clause you've been told is a workaround"* — and the two probes that found `G4` are exactly what
  that comment argues against writing. **A stale comment measurably suppressed a real gap.** Rule on
  the fix.
- **The `1 - 0` flag went the OTHER way.** The premise is real (`withSan=2, sanAlone=1`) but the
  **discrimination gap is not**: SAN's call enters both terms with the same coefficient and cancels,
  so `1 - 0` gives *identical* verdicts on the delivered panel. QE recommends taking
  `toBeGreaterThan(0)` anyway for **provenance**, and putting it in the **test, not the criterion** —
  and rates a second ply depth (`G4`) as higher value at that site. **Judge that recommendation.**

## Scope

- Re-derive size (`M`) and priority (`P1`); say if either moves. `XL` is `SPLIT_REQUIRED`.
- Say explicitly whether the repairs need a **dev hop** (they look like test additions, which would
  move the ticket back to `In Development` — legitimate) or land as criteria text alone.
- Do NOT edit `src/`. Do NOT edit `ABC-019` or `ABC-017` — other agents are live on both.
- Do NOT write `plans/board.md` — the Orchestrator's.

## Working rules

- Work in `../cli-chess-ABC-016` on branch `grugops/ABC-016-status-panel`, rebased onto current `main`
  and re-gated green by the Orchestrator (**708/708 on 24 files**) — verify that yourself.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`.** Claim per
Workflow 17 (atomic `mkdir` of `.grugops/queue/claimed/refinement-ABC-016-qe-gaps/`, by hand).
