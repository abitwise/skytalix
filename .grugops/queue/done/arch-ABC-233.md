---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T21:01:36Z
subtask: arch-ABC-233
role: architect-design
ref: .grugops/context/arch-ABC-233/
branch: new grugops/arch-ABC-233 from main (at dispatch) — worktree .claude/worktrees/arch-ABC-233
width: records; probes ≤ 5 min each wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`, node counts only, no timing.
---
# (1) S′ step to E1810; (2) design ABC-233 (history heuristic, O1h)
Read Orchestrator ruling …8ce2fd23, arch-post-268 notes (…9a7f24af, …1bc554fb), ADR-0056 (S′ re-pin, D2 ordering O1h), plans/tickets/ABC-233*.md, ADR-0060 (P1 parked; history term deferred to O1h) and ADR-0061.
1. ADR-0056: dated amendment — the upward step aims at the trigger band's centre, so the S′ opponent is **E1810**, not E1980; command `r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`; pool starts empty at 1810. Keep the rule symmetric for future steps.
2. ABC-233: write its ADR (PROPOSED): history table shape/indexing, update rule (bonus/malus, depth², aging/clear per search), where it orders (after killers), interaction with LMR (ADR-0060's deferred history term — say whether this ticket only orders, and what a later P1 re-measure would add), off-door pair per ADR-0026, pre-registered bars (node A4, reach at 47 000, drift, mate floor, zugzwang, G1, cut audit as info), intent GAIN or NEUTRAL named, falsifiers. Measure on today's main (futility in force).
3. Name what BA/PM needs for ABC-233 DoR 10/10.
Fences: memory-bank/50-decisions and your records only; no src/tests/plans/board. No push, force, amend, rebase, merge into main. Delete scratch; leave nothing running.
Publish: sealed notes (task arch-ABC-233, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-ABC-233` from `main` `60b76b52` (`src/` tree `58fa3eb4` = `e72487e1`'s). Records only. Probes ran on a scratch `git archive` outside the repository: four batches, each `flock <host-test.lock> timeout 300` (33 s, 21 s, 127 s, 58 s), 66 jobs, every exit 0, node counts only. Scratch deleted; nothing left running. Raw under `.grugops/context/arch-ABC-233/raw/`.
- **1. S′ amended to E 1 810 (`ADR-0056`, dated amendment in § Status; pointers at S′'s E bullet and the re-pin bullet).**
  - The rule, symmetric: E′ = E + X − 168.4, where X = −400 log₁₀(1/p − 1) and 168.4 is the Elo at 72.5 %, the band's centre. E′ is rounded to 10 and clamped to 1 320–3 190. Upward it applies with no ask up to 2 600; a downward E′ is the owner's question.
  - This step: 1 650 + 325.2 − 168.4 = 1 806.8 → **1 810**. Pick depth 4.
  - **Command:** `node tools/rating/rating.ts r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`. The dry-run at `e72487e1` printed `UCI_Elo=1810`.
  - The pool starts empty at 1 810. The 1 980 pool never opened.
  - Expected score about 72 %. S-4 would stop an unchanged build about 0.1 % of the time.
- **2. `ADR-0063` PROPOSED, premise not met on `main`.** The PREREG `…4d5a0fe3` was committed (`ec2ed472`) before any run.
  - The door is exact: 888 786 / 1 262 046 / 1 306 981 / 391 451, reach 5.837.
  - Five forms; every one passes the safety gate (drift, mate, zugzwang 7 / 7, `G1`).
  - **Every one misses the pay gate (≤ 0.95× at d8 on all four readings).** The design of record, H1 (side×from×to, d² bonus and malus, gravity 16 384, cleared per search, after the killers), reads 1.0011 / 0.7970 / 0.9751 / 0.9832, with reach +0.089.
  - Intent NEUTRAL by the rule, but its deep bar is missed. So F4 fired: no build, no read, and "accept" is not put to the owner.
  - Audit: 0.20 % flips, max 40 cp, 0 of 100 cp or more.
  - Why: the killers hold 90 % of quiet cutoffs, and 82 % of cutoffs fall on the first move.
  - Diagnostic, not pre-registered: P1 decision 1 over H1 meets `A4` (a), reach and the 27 cp cap, but reads zugzwang 5 / 7. Depth 10 does not rescue the pay gate.
  - Dated lines in `ADR-0056` D2 (row O1h) and `ADR-0060` § Status.
- **3. BA/PM, for `ABC-233` DoR:** DoR 10 cannot turn ✅ on `ADR-0063`, so the ticket stays at 9/10 in Backlog. The list of records owed now, and the page deltas for a re-open, is in decision `…f3a4dac0` § 3.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` from the UTC clock; 3 of 3 read back):
  - decision `20261102T210820Z-architect-design-decision-4d5a0fe3` (PREREG);
  - observation `20261102T212011Z-architect-design-observation-9f0b5da7` (results);
  - decision `20261102T212011Z-architect-design-decision-f3a4dac0` (S′, ADR-0063, BA/PM inputs, questions).
- **Commits:** claim `55a1a2c3`; PREREG `ec2ed472`; ADRs + notes + raw `4ca1cd2e`; this Result, the trace row and the move to done/ in the closing commit. Not pushed, not merged.
- **Open:**
  - Owner: none (two items to tell him).
  - Orchestrator: (1) park `ABC-233` (recommended) or re-cut it as an enabler; (2) the next pull: (a) a joint O1h + `ADR-0060` d11 history-term probe with zugzwang as the hard gate (recommended), (b) P5 NEUTRAL, or (c) O3s / T1.

### Trace row (10 cells, header order)

| arch-ABC-233 | S′ amended to E 1810 (band-centre step E′ = E + X − 168.4, symmetric; `r <c> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`; pool empty at 1810); ABC-233 designed as ADR-0063 (history side×from×to, d² bonus/malus, gravity, cleared per search, after killers, off-door pair); prereg sealed + committed first; on main with futility every form safe but misses the pay gate (H1 d8 1.0011/0.7970/0.9751/0.9832, reach +0.089) -> premise not met, intent NEUTRAL, no build; diagnostic: P1 over history meets A4a/cap/reach, zugzwang 5/7 | EPIC-011 | ADR-0063 (PROPOSED, premise not met), ADR-0056 (S′ amendment E 1810; D2 O1h dated line), ADR-0060 (dated line: P1 over history) | NFR-009 (32 KiB if built), NFR-005; no NFR file | `grugops/arch-ABC-233` (records only; claim `55a1a2c3`, prereg `ec2ed472`, ADRs + notes `4ca1cd2e`) | scratch measurements only (deleted; raw kept); door reproduces ADR-0061 d9 counts to the node | — (records) | — | Records done (Architect); Orchestrator: ABC-233 park vs joint probe, next pull; BA/PM: ABC-233 dated block (DoR 9/10), EPIC-011 S′ row and C10 at E 1810, S′ lines `--elo 1810` |
