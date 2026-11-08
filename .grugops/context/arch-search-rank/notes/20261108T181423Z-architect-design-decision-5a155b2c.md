---
id: 20261108T181423Z-architect-design-decision-5a155b2c
kind: decision
by: architect-design
at: 2026-11-08T18:14:23Z
verified_by: 
confidence: high on each record quoted and on the src/ reads; the ranking's odds, every speed figure and every Elo figure are judgement, UNKNOWN - verify; today's share of time in move generation UNKNOWN - verify
refs:
  - arch-search-rank
  - ABC-298
  - ABC-257
  - ABC-285
  - ABC-297
  - ABC-296
  - ABC-287
  - ABC-258
  - ABC-237
  - ABC-284
  - ADR-0056
  - ADR-0056 D2
  - ADR-0056 D6
  - ADR-0051
  - ADR-0055
  - ADR-0050
  - ADR-0058
  - EPIC-011
  - NFR-008
  - NFR-005
  - e8ea9a46
  - bba42fb7
  - orch-2026-10-30a/20261108T180856Z-orchestrator-decision-0b4bc6ba
  - arch-ABC-292-closed/20261108T093747Z-architect-design-decision-569849c4
  - arch-ABC-284/20261108T171046Z-architect-design-decision-9ae6cff1
supersedes: 
seal: sha256:e24084d804a5d2bf23e26c2228284a802bab326053a4cc3fbef453b622ea37bb
---

# arch-search-rank decision: of the held search tickets, only V3 (`ABC-298`) is worth host time now, in one narrow form that does not change the engine's moves. Every other ticket either has a record against it on the safety checks, or would not show a gain at 100 ms

Architect/Design, task `arch-search-rank`, records only, on `grugops/arch-search-rank` from `main` `e8ea9a46` (`src/` tree `bba42fb7`, the same tree `arch-ABC-284` read). Nothing was run. Inputs: the owner's skip of P1 (`…0b4bc6ba`), which asks for step-by-step gains at 100 ms; my `…569849c4` and `…9ae6cff1`; `ADR-0056` D2 and D6 with their dated lines; each ticket page; `ADR-0051` § Alternatives; `ADR-0055` § Where a node's time goes; `src/search.ts` and `src/transposition.ts` as committed.

## The ranking
"Caught before" means the checks that stopped this kind of change on this engine: zugzwang 7 / 7, the two mate floors (no mate missed, and the same-depth floor at d5), the drift cap, `G1` ≥ 54 / 58, the node ratios, and `NFR-008`. By each page, every ticket adds unit tests only to the default lane, and `NFR-008` has 0.915 s headroom (`bce24018`), so it decides none of them. The odds are my judgement on the records. Every Elo figure is an estimate.

| # | ticket | what it is | caught before | a reason that is not a guess? | 100 ms sees it? | cost | odds |
|---|---|---|---|---|---|---|---|
| 1 | **V3 `ABC-298`** | search the hash move before building the move list. A cutoff then skips the generation | no play check applies if the search is node-identical; the exact node-count check (SG1) and the door checks (`G4`) stand in for them. `ABC-254`'s speed reads came back UNRESOLVED twice under `ADR-0055` D3's 5 % spread rule before a third read 1.11–1.12× | **yes for safety:** same moves in the same order, checked exactly. **No for size:** generation and legality were 45–50 % of time in the only profile, taken before three speed cuts, so today's share is `UNKNOWN - verify` | yes, as nodes per second. Games cannot see +3 to +15, and a node-identical change plays none | an ADR; a QE freeze; an M build; perft deep and S2 timing on a held host, about 30 min (estimate). **No 100 games** | identity holds: high. Speed bar met: about even or lower. +3 to +15 Elo |
| 2 | T3 `ABC-257` | keep the table across moves, with T1's deeper cutoffs | T1 alone missed its pay bar, 0.994× / 0.996× against ≤ 0.95×. T3 alone read +8.7 ± 18.3 over 800 games (NEUTRAL). The cross-move repetition re-check is owed | its own bar, A8′, has a recorded estimate of P ≈ 0.7. No safety check has been read on the combined code | barely. At depth 6, T1 adds nothing over T3 | paused by his word "P" (the Orchestrator may lift it); two re-checks; M build; A8′; 100 games NEUTRAL, about 1 h | gets through its checks: fair. A gain at 100 ms: small, unseen |
| 3 | P5 `ABC-285` | null-move R grows with depth and margin | clean on every safety check when measured alone on `f2388e40`. `ADR-0050`'s own probe found R = 3 better than an adaptive R at d8 | yes, measured clean, on an older tree (before E1, Q1 and both bundles) | no: +0.06 ply. NEUTRAL by its page | an `ADR-0050` amendment (his) with a deep bar; S build; 100 games, about 1 h | passes: likely. Gain at 100 ms: about 0 |
| 4 | X2 `ABC-297` | singular extension and IIR | extensions were caught by `G1`, drift and zugzwang (`ADR-0051`); reductions by the same-depth floor and `zugzwang.004` (P1). X2 itself was never measured | none. Its premise (enough usable table entries) is `UNKNOWN - verify` | no: it acts at depth 7 or more, and the median at 100 ms is 6 | premise probe; ADR (his); M build; deep bar; 100 games | below 1 in 5 that it reaches games |
| 5 | X1 `ABC-296` | check extension at every depth | **already probed as `ADR-0051`'s every-node form:** 1.69–1.75× nodes at d6 (over 1.5×), `G1` 53 / 58 (seed 1163 newly missed), `zugzwang.005` moved to d13, drift 87.17 % within 25 cp | none. That probe ran on an older tree, and nothing since points the other way. The horizon form read −4.8 ± 16.2 | it spends depth; `G6` is the check most at risk | ADR (his); probe; S build; 100 games GAIN | below 1 in 10 |
| 6 | P6 `ABC-287` | razoring | `zugzwang.004`, drift to 345 cp, 1.4–2.0 % flips, one missed mate | none | — | held until a tuned table is on `main`, which has not happened and may never happen | not takeable |
| 7 | T4 / T2 `ABC-258` / `ABC-237` | a larger table / prefer deeper entries | none. The gain is never seen: about 2 000 stores a search on 262 144 slots, T2 1.00× at 2^18 | — | no, by construction | parked by his word "B"; `Q-3K-6` open | not live |

## The pick: V3, in its narrowest form, or nothing
- **Why V3.** It is the only ticket where (a) the safety checks are passed by an exact check, not by a guess, (b) the gain is at 100 ms, because more nodes per second means more depth at every time control, and (c) no 100 games are needed. On today's `main`, `negamax` calls `legalMoves` and takes the hash move from that list (`entryMove(slot, moves)`). Every node whose hash move cuts off has built and sorted a list it did not need.
- **The form, fixed now:** the hash move is checked for legality without the list and searched first. If it cuts off, nothing is generated. If not, the list is built and ordered exactly as today, and the hash move is skipped. Captures before quiets is added only if SG1 stays exact. Identity has to cover the move-count tail (`moveCountFrom`, read from the sorted keys), the default best move (`moves[0]`), futility's move index, and both recursions.
- **Honest size:** small, +3 to +15 Elo by `ADR-0055`'s 50–100 per doubling, on a speed gain I estimate at 1.03–1.10×. A gain near 1.03× may read UNRESOLVED. If he does not want a few Elo for about 30 min of held host, **none** is a fair answer. All the other tickets are worse uses of the host.
- **Stop rule:** if identity cannot be kept, V3 does not become a move-changing ticket. It stops and comes back as "none".

## What the pick needs next
1. **An ADR, the Architect's, in its own hop (not written here).** I recommend a new ADR, not an `ADR-0003` or `ADR-0055` amendment, because it is a new search mechanism. It must contain: the form above; the hash-move legality check; the identity duty on both recursions; SG3's speed bar and its spread rule, fixed before any reading; timing only on a held host. The owner accepts it.
2. **BA/PM:** SG3's number on the page, so DoR 10/10.
3. **QE's freeze** of SG1's counts and perft pins on `main`, before the build (`git merge-base --is-ancestor`).
4. **Build (M)**, then QE: perft deep, SG1 exact, SG2, S2 on a held host with W asked. No games. UAT is owed unless the standing waiver applies.
5. **The Orchestrator's call:** d6's `kingExposure` cut (`…569849c4` § 3) is also node-identical and is read by the same timing session. It could share the held window.

## Confidence
High on each record quoted and on the `src/` reads. The odds and every speed and Elo figure are judgement, `UNKNOWN - verify`. Today's share of time spent on move generation is `UNKNOWN - verify`.
