---
id: 20261108T092710Z-architect-design-decision-9e29be9d
kind: decision
by: architect-design
at: 2026-11-08T09:27:10Z
verified_by: 
confidence: high on the form (fixed before the check runs); the check's outcome is UNKNOWN - verify until batch K reads
refs:
  - arch-ABC-292-probe
  - ABC-292
  - ADR-0076
  - ADR-0076 d13
  - ADR-0076 K3
  - G1
  - arch-ABC-292-probe/20261108T092441Z-architect-design-decision-e158a4a0
supersedes: 
seal: sha256:c62a9ed1341e83c02b612e05b36202c67276efb8a963e57bd63974ea711b9135
---

# arch-ABC-292-probe addendum 1: rule 2's defect check on PR7's NEWLY-MISSED line, its form sealed before it runs. It moves no bar, no depth and no budget, and reads no single term

Architect/Design, task `arch-ABC-292-probe`, under the PREREG `20261108T092441Z-architect-design-decision-e158a4a0` (commit `e9e23d8f`). Stage A, after batch C.

**What fired.** PR7 (`raw/out/C-PR7-g1.out`): ON solves 53 of 58 and OFF 54. One NEWLY-MISSED line: "win material, seed 1700: black R+B+N+2P against 2B+2N+P" (`8/7B/6r1/1P2b1p1/1k6/3p2N1/2nK4/N5B1 b - - 0 1`, accept g6g7 or g6h6). ON misses it and OFF solves it, and the baseline lists it as solved. PR5 (0 violations at 4 → 5 and at 5 → 5) and PR6 (7 / 7) hold. Rule 2 reads: "a defect check first. If the miss is real, the premise is **NOT MET**."

**What a defect is here.** The prototype does not compute `ADR-0076` d2, d3, d4 and d5 as written, or the instrument does not read `G1` as the suite does. A search that plays a different move on an exact prototype is not a defect (`ADR-0075`'s F3 reading, taken by `ADR-0076` K3: "never a re-pin, a moved depth or a new value").

**The check, fixed now. One batch, `batchK.sh`, under the lock.**
1. **The instrument, by reading (done before this note):** the probe's `g1` mode scores as `src/puzzle-suite.test.ts`'s `runSuite` does. `chooseMove(parseFen(fen), { budgetMs: 25, now: virtualClock(1) })`, solved iff the move is in `accept`. Same budget and step as the baseline.
2. **Determinism:** the seed-1700 row alone, ON and OFF, in a fresh process. It prints the chosen move, depth and nodes. The miss stands only if it reproduces.
3. **The source:** in `cand`'s `src/search.ts`, `src/engine.ts` and `src/quiescence.ts`, every evaluation call reached with `pieceTerms` on is `evaluateAtPhase`. Read by `grep` of every `evaluate…(` call site, printed.
4. **The arithmetic on this puzzle:** every position of the full-width tree from the puzzle's root to depth 3 (all legal moves, no pruning). On each one, `pieceTermsForTest` equals the labeller, as one whole object per side, and `evaluate` minus the off evaluation equals the labeller's signed net. It prints only the counts of positions and of mismatches. No per-term figure and no search under one term alone is read ("no singles on any safety row", d13).

**The reading, fixed now.**
- **Any of 2, 3 or 4 fails:** a defect. Rule 1's one fix applies under a further sealed addendum, and every stage A row is re-read.
- **All hold:** the miss is real. **PR7 misses, and the premise is NOT MET under rule 2.**
  - By the PREREG, the probe ends at once. No further batch runs, timed or untimed (E, F, G; D and H), and stage B is not asked for.
  - `ABC-292` is not built, and it goes back to BA/PM.
  - It is a miss in d14 (c)'s list ("the probe's rule 2"). By the owner's ruling (`…23d30c72`) that is the stop for the hand-valued path. That is his and the Orchestrator's to carry. This note only names it.

**Not done, and fenced:** no other budget, step, depth or corpus. No re-run of PR7 as a reading. No per-term search. No margin on any row. The miss is not re-played.

**Scripts, sha256** (copies in `raw/scripts/`, as they will run): `defect.ts` `cc3768c1ee0bcda361ca982f40b15e84d111282202a1961b0630864686f992a8`, `batchK.sh` `e0770652d6ab9759b1d649f64e6ce17a099a8522b713f72e75f64ecb998ed1bf`. `defect.ts` type-checks against `cand` (exit 0). The outputs of batches A, B and C are committed with this note, before batch K runs.
