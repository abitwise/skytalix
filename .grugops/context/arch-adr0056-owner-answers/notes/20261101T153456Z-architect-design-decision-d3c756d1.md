---
id: 20261101T153456Z-architect-design-decision-d3c756d1
kind: decision
by: architect-design
at: 2026-11-01T15:34:56Z
verified_by: 
confidence: high (owner word verbatim; ADR text committed fe50a11f)
refs:
  - ADR-0056
  - memory-bank/50-decisions/ADR-0056
  - EPIC-010
  - EPIC-011
  - ABC-255
  - ABC-256
  - arch-adr0056-owner-answers
  - grugops/arch-adr0056-owner-answers
  - fe50a11f
  - orch-2026-10-30a/20261101T152518Z-orchestrator-decision-43098cef
  - arch-adr0056-100ms-fold/20261101T151909Z-architect-design-decision-db40f09a
  - qe-tc-depth-probe/20261101T150824Z-qe-e2e-observation-07357280
  - qe-tc-depth-probe/20261101T150824Z-qe-e2e-observation-9fd1fdce
supersedes: 
seal: sha256:3e0d4ba582931d0b822f087ee4259bd3bc5c422aa869b56e041f597047c8b4f4
---

# Decision: ADR-0056 third fold, the owner's three answers (word ...43098cef)

Owner verbatim: "1. b ; 2. ok ; 3. quick check can be with 0.5s difficulty. Make sure engine is not changed internally and it works on different difficulty settings."

- **C3'' (supersedes C3'), per epic:** 400 games HEAD TO HEAD, head = main at the epic's close, base = the epic's starting SHA. Both 100 ms (st=0.1), timemargin 50 ms both sides, level 5 (no Skill Level), OwnBook on, restart=on, -maxmoves 200, width 1. Openings 1-100 of tools/rating/openings.epd, both colours; the sequential file wraps, so each opening twice per colour (d's default 200 rounds, the ABC-207 400-game D shape). Command: `d <head> <base> <out> --budget-ms 100 --rounds 200 --concurrency 1` (ABC-255 item 1 only). Wall ~1.55 h + builds (pre-approved).
  - Validity: 400/400 complete, 0 faults, 0 time losses at 50 ms by either build; else UNRESOLVED, re-run once.
  - MET: head >= 200.0 of 400 (point estimate >= 0). NOT MET: next epic's strength tickets wait for BA/PM suspects + Orchestrator keep/revert/re-read; no auto revert; no re-play for luck.
  - Resolution ~+-24 Elo (95 %, draws 0.50; +-28-29 at 0.30); repeated openings make it slightly flattering. P(MET): +20 0.95, +10 0.79, 0 0.50, -10 0.21, -20 0.05.
  - Blind spot stated: both reads self-play; non-transfer unseen between 40/15 readings. Recommendation: pool S' scores in the smoke ledger (EPIC-010 trend rule shape).
  - Architect's reading: an epic with no engine-core change owes no C3''.
- **Bars:** C2' GAIN >= 50.0/100 and NEUTRAL >= 43.0/100 owner-accepted ("2. ok").
- **S' (replaces the 4 s R smoke):** 10 games, candidate vs Stockfish 19 at 0.5 s. skytalix st=0.5, level 5, timemargin 50 ms. Stockfish per C1 at this control: UCI_LimitStrength, Threads 1, Hash 16, restart=on, timemargin 2000, st=0.5 (C1's 4xp95 rule with its 0.5 s floor; r's existing pin), ABC-204 depth guard; above E 2 600 probe first. E = 1 650 (estimate: skytalix 0.5 s ~1 775-1 925, expected 67-83 %, near S-4's 72 % design point; at 1 910 an unchanged build would expect 31-52 % and S-4 would misfire). Re-pin when pooled S' leaves 60-85 % over >= 30 games. Bars S-1, S-2, S-4. Command `r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`. Owed per strength ticket beside C2' and per epic beside C3''; ~10 min.
- **R-TC, the test-control rule:** (1) controls set only by cutechess/harness/shipped UCI options; (2) no engine path keyed on the control, a budget value, a test/bench flag or the environment; budget enters the core only as the deadline; continuous time-left rules (W1) allowed; (3) every read plays the SHA's built dist/uci.js, ADR-0026 doors never used; (4) harness tickets change tools/ only, 0 src/ lines, dry runs byte-equal. Part 2 (difficulty settings): see the observation note of this task.
- **ABC-255 re-pointed:** item 1 stays (carries C2' and C3''); item 2 becomes `r --budget-ms 500` (rpair at 100 ms dropped); acceptance adds the C3'' and S' dry-run rows and one ungraded S' on main (score, max overshoot). Size stays S. **ABC-256: recommend drop.** C4/C1 re-pointed: A0/A1 take their own 200-game 100 ms outside reading (C3' SF settings); the claim is spent when such a reading on the latest head plus the offset reaches 3 000.
- No NFR added or moved. Owner calls still open: Q-3K-4, 6, 7, 8.
