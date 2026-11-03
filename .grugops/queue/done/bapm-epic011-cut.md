---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T09:25:07Z
subtask: bapm-epic011-cut
role: ba-pm
ref: .grugops/context/bapm-epic011-cut/
branch: grugops/bapm-epic011-cut — worktree .claude/worktrees/bapm-epic011-cut (from main 149bc2ef)
width: records only; no engine runs needed (if you run anything, wrap it in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`).
---
# Analyse EPIC-011 and cut the next tickets
Owner 2026-11-03: "Analyze and create tickets under EPIC-011".
Read plans/epics/EPIC-011*.md, ADR-0056 (phases 0–5, D2), ADR-0057 (§D8 incl. D8.7 lazy eval), ADR-0064 (E1), the arch-next-pull notes (eval probe: 65 % of ≥ 50 cp errors survive two node doublings → evaluation is the bigger lever), and every EPIC-011 ticket page (open: ABC-233/234/236/237/239/257/258/266/269).
1. **Gap analysis** (sealed note): for each phase/milestone of EPIC-011, what is done, dropped, parked, in flight, and what has NO ticket yet. Rank the uncut items by evidence-backed expected gain per host hour (evaluation items after E1 first, unless the evidence says otherwise). Flag items whose premise is already disproven.
2. **Cut tickets** ABC-270 onward for the top items (as many as the evidence supports, typically 3–6): each with DoR, size, priority, pre-registered bars per ADR-0056 (per-change 100 games at 100 ms, GAIN 50.0 / NEUTRAL 43.0, S′ smoke at --elo 1810, Levels), falsifiers, dependencies, and "waits ADR" where design is owed. Do not duplicate ABC-234/236/239/269 or the parked tickets; do not re-open parked items.
3. **Fold the owner's 2026-11-02 answers** into EPIC-011 and the ABC-269 page: ADR-0064 ACCEPTED; Q-3K-4 = (b) (evaluation tickets judged on play with NFR-005's depth-6 floor; G6 "≥ base" reported, not graded). The Architect is ruling QE-269-a in parallel; leave a marked placeholder for its page effect.
4. Also fix ABC-263's page front matter (status still backlog; it is Done since 2026-11-01).
Fences: plans/epics, plans/tickets, plans/traceability.md + your records. Do NOT edit plans/board.md (the Orchestrator places tickets), ADRs, or the ABC-234/236/239 pages (Architect is designing). No push, force, amend, rebase, merge into main.
Publish: sealed notes (task bapm-epic011-cut, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result; brief + claim to done/.

## Result

_by ba-pm (claude-opus-5-5, bapm-epic011-cut), 2026-11-03T09:46Z, records only, at `main` `17725732`; no engine run (one records-only re-classification of committed probe outputs under the host lock)._

- **Gap analysis** (sealed decision `20261103T094553Z-ba-pm-decision-08584853`): per phase, done / dropped / parked / in flight / uncut. Uncut ranked by evidence-backed gain per host hour (each strength read ≈ 0.8 h host): **1 E3a king safety by phase + queen scale → `ABC-270`; 2 E4a passer rules → `ABC-271`; 3 E7a mop-up + drawish scaling (premise-gated) → `ABC-272`;** 4 Q2 (re-measure first, not cut); 5 E3b / E5 / E6 (tuner weights, after E2); 6 O1-e, lazy eval (recorded). Ahead of all: `ABC-269` (E1) and `ABC-239` (E2), not duplicated. Apart: **R1 reading → `ABC-273`.**
- **Re-classification** (sealed observation `…0fd882f7`; `raw/classify.py` + `.out`): 22 of 145 probe positions are duplicates; on 123 unique, 25 / 38 errors persist (65.8 %, headline holds); 60 plies 8 / 10 (not 11 / 13); **E1-L fixes 1 of the 25**; 22 / 25 at phase ≥ 7, 14 queens on, 8 with a passer, 3 at phase ≤ 6.
- **Premises flagged:** `ADR-0064` d9's error-location rationale (not supported); E3's `Q-3K-4` wait (dissolved); X2 "after T1" (void); W1 "after threads" (moot); P4 (no live route). Nothing re-opened.
- **Cuts** (sealed decision `…68225039`), each DoR 9/10, Backlog:
  - `ABC-270` E3a: king safety by phase (exposure endgame halves; `ADR-0031` addendum queen scale × 3 and shelter gate re-read over E1) — M, P2, GAIN; waits `ABC-269` merged + ADR + `QE-269-a` ruling.
  - `ABC-271` E4a: passers read the kings and the path (king distance, free path, rule of the square) — M, P3, GAIN (NEUTRAL only if named before Ready); waits `ABC-269` + ADR.
  - `ABC-272` E7a: mop-up (KQK / KRK / KBNK) + drawish scaling, premise-gated (≤ 10 / 12 mates; ≥ 100 cp on ≥ 5 / 10 draws; both fail → dropped) — M, P3; waits `ABC-269` + probe + ADR.
  - `ABC-273` R1: 200 games at 100 ms vs Stockfish 19 at band-rule E after E1, before the next eval merge — S, P3; waits `ABC-269` + control ruling.
- **Folds:** `EPIC-011` (top block; phases R1 / E3 / E4 / E6 / E7 / X2 / W1; lazy-eval + Q2 "not cut" lines; per-change `G6` → `Q-3K-4` (b) for evaluation tickets; tickets 15 / 21 / 22–25; owner rows answered; dependencies; `RISK-EPIC011-10/11`; `NFR-005`). `ABC-269` (ADR-0064 ACCEPTED; B7 on the floor; B8 / merge free of the owner; F3's `G6` half void; **marked `QE-269-a` placeholder** with both page effects). `ABC-263` front matter Done.
- **Notes:** decisions `20261103T094553Z-ba-pm-decision-08584853`, `20261103T094553Z-ba-pm-decision-68225039`; observations `20261103T094553Z-ba-pm-observation-0fd882f7`, `20261103T094603Z-ba-pm-observation-29705a3f` (the pointer list; the artifact-ref kind was refused for want of §14-gate provenance and is recorded honestly as an observation). 4 / 4 read back.
- **Commits:** claim `de934815`; pages `53c286cc`; this Result, notes, trace row and the move to done/ in the closing commit. Not pushed, not merged.
- **Proposed Backlog lines** (the Orchestrator places them): see decision `…68225039` § Proposed board lines.
- **Open:** Architect — `QE-269-a`; the d9 rationale finding; `Q-3K-4` (b)'s scope beyond evaluation tickets; `ABC-239` A5's `G6` line (BA/PM after its design). Orchestrator — place the cards; R1's control; `ABC-270`'s design slot.
