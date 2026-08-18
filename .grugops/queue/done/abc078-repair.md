---
task: repair-ABC-078-2026-08-18
subtask: abc078-repair
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md
ref: .grugops/context/repair-ABC-078-2026-08-18/
parent_ref: .grugops/context/security-nfr-ABC-078-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T21:00:00Z
branch: grugops/abc078-repair
base: grugops/security-nfr-ABC-078 @ bda909d
---

# Subtask: `ABC-078` repair round 1 of 2 — one required production fix, and three guards that do not guard

Branch off `grugops/security-nfr-ABC-078` @ `bda909d`. That tip carries **everything**: your
delivery, QE's six notes, and Security/NFR's five plus its `plans/nfr-catalog.md` rulings. Read
`parent_ref:` and `.grugops/context/quality-gate-ABC-078-qe-2026-08-18/notes/` first.

**The gate verdict is `PASS_WITH_RISKS`, not a fail.** No production defect was found in behaviour;
what follows is one breached bar and three guards that let a wrong build through.

## 1. `RF-1` — the ONLY production change. Security/NFR specified it exactly; do not improvise

`NFR-004` clause B — the **5 s hard ceiling** — is breached by construction: 5000 in → **5002 ms**,
6000 → 6004, and `chooseMove` contains no reference to 5000 at all. Security/NFR **ruled the clamp
is owed HERE, not by `EPIC-006`**, and the reasoning is on the ticket's own page: `## Scope` line 46
claims the ceiling, `## Out of scope` defers only *difficulty selection* and says in the same breath
*"It owns the mechanism"*. `EPIC-006` cannot honour a constraint nothing records.

In `src/engine.ts` **only**:
1. `export const HARD_CEILING_MS = 5_000;` beside `DEFAULT_BUDGET_MS`.
2. In `chooseMove`'s budget initialiser:
   `deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS),`
   **`Math.min`, NOT an `if`** — it preserves every degenerate input already measured safe
   (`NaN`→`NaN`→depth 1; `0` / `-1` / `-1e9` unchanged) and turns `Infinity` into 5000, which closes
   QE's `G6` Infinity half for free.
3. Two comment lines: `budgetMs`'s valid range, and that `Clock` must be real-time and
   non-decreasing.
4. **One assertion, on the INJECTED clock and not the wall**: `budgetMs: 10_000` must stop at
   `start + 5_000`. Machine-independent, lane-cheap, and it honours the no-wall-clock-in-the-suite
   rule.

**Do NOT add a safety margin.** Your refusal to add one was right, QE recorded it as right, and
Security/NFR refused to require one. The ~1.03% overshoot on clause A is **accepted risk
`AR-NFR004-A`**, owned by Security/NFR at `EPIC-006`'s difficulty hop. The residual is stated and
stays stated: with the clamp, a 10 s budget still returns ~5003 ms.

## 2. `G2` (QE, HIGH) — `RISK-002`'s only guard is bypassable in two lines

`if (iteration > 4) break;` — a hard depth-4 cap — **passes every criterion on your page**, because
all four `A4` checks are textual and `A5` never observes depth beyond 4. And the capped build's
`A1` looks **better** (5/30 over 3 s, not 29/30), so a future engineer optimising against the
numbers is *rewarded* for breaking the epic's non-negotiable inherited constraint.

**Make a depth cap red.** The guard must be behavioural, not textual — a grep for `depth` is what
`A4` already does and it is what this mutant walks past.

## 3. `G1` (QE, HIGH) — `A2` does not catch the bug it was written for

`A2` is **byte-identically insensitive** to the between-iterations build: same depth, same 360
nodes, same 4 clock reads either way. `A3` is what actually kills that mutant. Your inline comment's
numbers are false, and the **"3 120" quoted as `A2`'s evidence is `A3`'s 3 118**.

Fix the guard so `A2` earns its own description, and fix the false numbers in the comment.

## 4. `G4` + the coupling — a score assertion with BREADTH

`src/engine.ts` carries ~55 lines duplicating `src/search.ts`, and QE ruled that duplication **the
right call** under `ABC-077`'s merged guards — that is settled, do not revisit it. What is not
settled is the coupling: `A3` is one position, one depth, **move-only**.

QE proved it insufficient: `mate-distance-lost` gives **39 score mismatches and 0 move mismatches**
at depth 2, and **`stalemate-as-loss` — the exact bug `ABC-077`'s `A5` exists to catch — survives
everything**, because it guards only the copy a game does not use.

**Add a score-and-move assertion with breadth including mate- and stalemate-adjacent endgames.**
QE measured ~1.1 s at depths 1–2, so put the bulk behind `ENGINE_DEEP` with a few cheap endgames in
the default lane. Delivered build already matches `search()` **604/604** on move and score over 260
positions — you are pinning a property that holds, not chasing a defect.

## Fences

- **`src/turn-loop.ts` byte-identical.** `A6`. Unchanged and non-negotiable.
- **`src/engine.ts` and `src/engine.test.ts` ONLY.** Do not touch `src/search.ts` or its tests —
  `ABC-077`'s merged `A6` guards are a contract and QE explicitly declined to weaken them.
- **Do not relax `NFR-005`'s depth-6 floor.** It is `ADR-0003` clause 2 as amended by the owner.
  Security/NFR recorded it as a **waypoint, not a failure**, and did not edit one byte of it.
- Do not merge, do not deploy, do not move a board column.

## Lane cost — read this before you add files

Security/NFR re-measured `N8-LANE` cleanly and this ticket is at **~840 ms net against 650 ms**
(accepted as `AR-N8LANE-078`, LOW). **Cleaner conditions read it HIGHER than your ~700 ms, so
contamination was not what put it over.** Your repair will cost more lane time; that is expected and
accepted, but keep the default lane cheap and put breadth behind `ENGINE_DEEP`.

## Gate

Full blocking gate in a contained lane. An isolated agent worktree has no `.claude/worktrees/`, so
the recorded `npm test` / `npm run lint` work correctly inside one. Baseline at your tip: **36 files
/ 1016 tests**, skip 0, `ENGINE_DEEP=1` 23, `PERFT_DEEP=1` 32/32, `SEARCH_DEEP=1` 41/41. Re-run
QE's `G2` and `G1` mutants and show they now red; record the mutant **diffs**.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/abc078-repair`. **Commit incrementally.**

Commit on `grugops/abc078-repair`, never on `main`.
