---
id: 20261020T135600Z-security-nfr-decision-8254dfa3
kind: decision
by: security-nfr
at: 2026-10-20T13:56:00Z
verified_by: 
confidence: high
refs:
  - ABC-174
  - NFR-008
  - R-174-1
  - R-173-1
  - SEC-174-1
  - plans/nfr-catalog.md
  - .grugops/queue/pending/secnfr-catalog-abc174.md
  - R-173-2
  - RISK-ABC144-FCAP
  - QE-174-b
  - SEC-174-2
  - ADR-0035
  - ADR-0045
  - AR-NFR004-A
  - arch-lane-under-10s
  - 8522609d
  - be6a5599
  - .grugops/context/secnfr-ABC-174/notes/20261019T203000Z-security-nfr-decision-abc174-gate-pass-with-risks-6b1e94d2.md
  - .grugops/context/qe-ABC-174/notes/20261019T202000Z-qe-e2e-observation-abc174-n8-lane-met-nfr008-total-not-met-5d9a0f63.md
  - .grugops/context/wave-2026-09-25/notes/20261020T000000Z-orchestrator-decision-bdff4d33.md
  - .grugops/context/wave-2026-09-25/notes/20261020T130500Z-orchestrator-decision-ecff6698.md
supersedes: 
seal: sha256:7870cef5bf064e8e775818778566e031f83452701532a439062af0b946fdc071
---

# `secnfr-catalog-abc174`: the catalog now carries `NFR-008`'s first R-1 verdict (**NOT MET**), `R-174-1` as owner-accepted, and `SEC-174-1`. Records only

Admitted through `scripts/context-io.js` `admitAndAppend`, in-process. This is a `decision`, not a `finding`: no
`§14-gate#` or `human:` stamp exists here. Nothing was run or timed. `plans/nfr-catalog.md` is left uncommitted on
`main`'s working tree. Nothing was pushed or merged.

## Decisions
1. **`NFR-008`'s first verdict on the R-1 clause is written into the catalog as NOT MET.** It is transcribed from
   `secnfr-ABC-174` `…6b1e94d2` § 2 and not re-ruled. That ruling rests on QE's `QE-174-b` (`qe-ABC-174` `…5d9a0f63`):
   `npm test` median wall 10.010 s against 10 s, twin wall R 0.28 s, admissible, CPU 27.73 s reported, load1 3.10–6.01,
   on the combined tree `be6a5599`.
   - **Where:** one dated insertion in the row's `Target` cell, straight after "… the clause's first verdict belongs
     to the next Security/NFR gate that reads the lane. CPU, reported: 24.86 / 26.04 s on the same runs.", plus a
     closing section "`ABC-174` MERGED (`8522609d`)".
   - **It reads `main`'s lane.** `git diff` from `be6a5599` to `8522609d`, and to `b6f2a48a`, is empty over `src/`,
     `tools/`, `package.json`, `package-lock.json`, `vitest.config.ts` and `tsconfig.json`. That is a read, not a
     reading.
2. **`R-174-1` is recorded as ACCEPTED.** It is MEDIUM and non-blocking (`security.block_on` is `high`). **Owner:
   Olger Oeselg**, on his word *"accepr R-174-1"* (`…bdff4d33`), option (a).
   - **Discharge:** the first admissible full-lane reading ≤ 10 s on the declared capped stack, or his own re-level of
     W (`ADR-0035` D6).
   - Every later gate that reads the lane inherits NOT MET until it is discharged.
3. **Architect/Design owes the remedy.** That is subtask `arch-lane-under-10s`, which ran in parallel. Its notes were
   not read, and its result is not recorded in the catalog.
4. **Unchanged, as ruled at `…6b1e94d2` § 3–4 and repeated in the owner's word:**
   - `R-173-1` stays open, LOW and owed. `QE-174-b` has the wrong arms and the wrong taker.
   - `R-173-2` is unchanged.
   - The full-lane `F` stays 1.72 s CPU / 3.25 s wall, labelled pre-cap.
   - `RISK-ABC144-FCAP` stays open.
5. **`SEC-174-1` is discharged.** `THE LEVEL LAYER`'s "At default difficulty means `LEVELS[3]`" bullet gets one dated
   insertion.
   - What it says: from `8522609d` the default is `LEVELS[5]` = `{ 3 000, 0 }` (`DEFAULT_LEVEL` 5), the same call.
   - Facts read from `src/levels.ts` and `src/engine.ts` on `main`. `LEVELS[3]` is now `{ 330, 0.1 }`.
   - The optional `:1364` edit was not taken. It is a dated record that is true as history.

**Result:** DONE, records only. `ABC-174`'s gate result, PASS_WITH_RISKS (`…6b1e94d2`), is not changed by this hop.

## For the router
- **Owner question: none.** `R-174-1` already carries his word, and nothing here needs a new one.
- **Owed to Architect/Design, not resolved here:**
  - the heap clause's "outright" against `R-173-1`'s "on MET" for replacing `F`;
  - whether the stack declaration names power (`SEC-174-2`: every scored run was on battery);
  - recording `ABC-174`'s narrow-set per-set `F`.
- **Trace row:** proposed in the done file. `plans/traceability.md` is fenced from this hop.
