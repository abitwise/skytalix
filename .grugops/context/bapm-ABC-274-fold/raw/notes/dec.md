# bapm-ABC-274-fold decisions: the `ABC-274` (E2-pre) page now follows `ADR-0067` F8 and d8's dated block. S2 is reported only. The coupling clause did not fire (C1 is an incremental phase, not the packed score), so the scope stays whole and the size stays S. A new row A9 (packed build: Σ mg / Σ eg inside int16) was added. A5's base is `ABC-269` + C1, read by PREREG `…e36ee7ca`'s shape as the mean of two sessions. DoR stays 9/10 (Backlog), and row 10 is ❌ only on `ABC-269`'s merge

BA/PM, task `bapm-ABC-274-fold`, records only, on `grugops/bapm-ABC-274-fold` from `main` `4ea4d474`. Nothing run. Page commit `cd1db457`.

## Folded (source → page)
1. **DoR row 10, F8** (`arch-fold-1103b` `…e16881f5`):
   - The falsifier half is met.
   - The row stays ❌ until `ABC-269` merges (it is not an ancestor of `main` at `4ea4d474`).
   - § Falsifiers now points to F8 (a) / (b) / (c). The old `UNKNOWN - verify` disposition is struck and replaced by F8's: one value-identical cut (the packed score if the build is not packed; the Architect names it if it is), one re-read under a sealed PREREG, and not merged on a second miss.
2. **S2 ruled** (`orch-2026-10-30a` `…690d3b30` item 1):
   - nps is reported only, never graded.
   - A5 `G2` ≤ 1.05 × and A6 `G6` "≥ base" are graded.
   - `Q-3K-4` (b) does not apply.
   - The "default until ruled" line is struck.
3. **The coupling clause is resolved** (d8 dated block, consequences 1–3):
   - C1 is an incremental phase, so the clause does not fire, the scope stays whole, and the size stays S.
   - Scope 2 says the packed score is E2-pre's own form and stays recommended, with the reason (about 7 % per extra per-piece walk operation on `ABC-269`; unpacked forecast to miss A5; packed cost `UNKNOWN - verify`).
   - **C1 must stay intact:** the phase stays an argument, no phase add returns to the walk, and P5 stays green. The king's Δ source is the Engineer's call within A1 / A2.
4. **A9, new** (d8's range row):
   - It applies to a packed build only.
   - One default-lane row bounds Σ mg and Σ eg (white minus black) inside int16 (−32 768 to 32 767). The bound is computed from `src/evaluate-params.ts`'s maxima.
   - Mobility stays outside the packed sum unless the Engineer shows it fits.
   - It moves no expectation (A7 now says "A1–A4, and A9 on a packed build").
   - *BA/PM's disposition:* a red A9 is a failing test, so the build is not merged as built and the bound is never widened.
5. **A5's base and method** (d8 dated block; PREREG `…e36ee7ca`):
   - **Base:** `main` with `ABC-269` + C1.
   - **Arms:** B is the pre-ticket head, C is a copy of it (the control), and H is the candidate. Each arm is the build's shipped tapered entry, called `ev(position, phase)` with the phase computed once per root.
   - **Instrument:** six roots, N = 200 000, 6 rounds (round 1 dropped), and two sessions, the second reversed. That is `ADR-0031` d3's near-bar rule, taken every time.
   - **Verdict:** R = the mean of the two session ratios, MET iff ≤ 1.0500 (unrounded, 4 dp). A session is void only when C / B is outside [0.970, 1.030]; one re-run is allowed, and a second void is a STOP.
   - **Reported only:** H against `58fa3eb4`, and C / B per session.
   - The struck "3 places" is superseded by the PREREG's 4 dp. The bar is unchanged.
   - *BA/PM's reading:* the reader is QE, not the Engineer.
6. **F8 is referenced** in the frontmatter `adr` field, the header fold block, § Falsifiers, § Dependencies and DoR rows 5 / 10.

## Not changed
- No bar moved.
- A1–A4, A6's rule, A7 and A8 are unchanged, apart from the dated pointers.
- `board.md`, the ADRs, `src/` and the other tickets are untouched.

## Open (not BA/PM's)
- `ABC-269`'s merge: C1 is being built, and QE's single `G2` re-read is pending.
- The owner's word on `ADR-0067` acceptance (merge only).
- When `ABC-269` merges, the Orchestrator re-checks DoR row 10, and the ticket is Ready at 10/10. The board move is the Orchestrator's.
