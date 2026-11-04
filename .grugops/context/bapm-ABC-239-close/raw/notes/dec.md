# bapm-ABC-239-close decision: ABC-239's first pull closed NOT MET (records); ABC-280 cut and Ready; ABC-271 ordered before a second pull

BA/PM, task `bapm-ABC-239-close`, records only, on `grugops/bapm-ABC-239-close` from `main` `ac55ddf6`. Nothing was run. Pages: `efca527c`. No bar moved. Authoritative text: each page's own block. This note gives the decisions and the trace ids.

## 1. ABC-239: Done (closed, not shipped)
- Front matter `status: done`, `column: Done`, with a `closed:` line. A top block and a `## Close` section were added. Nothing older on the page was edited.
- **The basis.** § What happens on a miss makes F3 or F4 on the candidate NOT MET. The Architect ruled both as written (`arch-ABC-239-f3f4` `…69f22167`). The Orchestrator took path (iii) (`…4c76bf7a`). This page applies that disposition; BA/PM decides nothing new about the miss.
- **Recorded:**
  - step 6 on `26d06118`: B-T1, B-T2 0.9905 × and B-T3 MET; F3 pawns A2 53 > 50; F4 `zugzwang.001` e1e5 at depths 9–11;
  - `main` keeps E1's table, and nothing from `26d06118` merges;
  - K1 (c) form (A) for any later step 7;
  - the second pull is a new attempt under F6, after `ABC-271`, with the owner's word then on the d6 amendment;
  - B-T8's approval carries only if the owner confirms it then.
- **The status reading.** The brief asks for "Done (closed, not shipped), the S1-style close". `ABC-210`, the S1 precedent, uses `status: dropped`, `column: Done`. I followed the brief and wrote `status: done` with a `closed:` line that says "not shipped". The board line is the Orchestrator's, who may prefer `dropped`.
- **`954d44fb` (`QE-270-e`'s test-only fix) is not taken anywhere now.** It is owed by the second pull: it bites only once a fit frees a queen-on mg, so it is green and harmless on `main`.

## 2. ABC-280: the tuner lands alone. S, P3, DoR 10/10, Ready
- **The next free id.** `ABC-280`: no `ABC-28x` appeared in `plans/`, `memory-bank/` or `.grugops/queue` on `main`, `grugops/arch-ABC-271` or the six other most recent branches, nor in any commit subject.
- **Scope:** the four tool commits `625b75fe`, `5ce4f870`, `def26997` and `8c03b713` (the five `tools/tune/*.ts` files plus one line each in `tsconfig.json` and `biome.json`). `bounds.ts` keeps the closed pull's one row, as data and not a bar.
- **Out of scope:** any `src/` line, `26d06118`, `954d44fb`, any retirement or re-pin, any fit of record or game, and the d6 amendment.
- **Acceptance:**
  - A1: seven paths, and `tools/tune` byte-equal to `8c03b713`.
  - A2: the `src/` diff is empty, so UAT is waived.
  - A3: `npm test` reads N + 3 passed with an unchanged skip count; lint, typecheck and build are green; `dist/` holds no tool file.
  - A4: the `TUNE_DEEP` lane exits 0.
  - A5: B-T1 has 0 misses on `main`'s table over the full set.
  - A6: B-T3 gives two byte-identical emissions to scratch. Equality with `10581fb5…` is reported, not graded.
  - A7: the records-path check exits 0.
  - A8: the QE hop.
- **Misses:** a landing defect is fixed on the branch. A tool row or gate red on `main` is a STOP to Architect/Design (F1's class). The data-stage stops apply.
- **Why S and not XS:** A5–A6 take about 15 min of host time under the lock.
- **Why P3:** it changes no play. Landing it before any `src/evaluate*` merge avoids tracer drift.

## 3. ABC-271 and EPIC-011
- **`ABC-271`:** a header block and a § Dependencies line. Its free-path and king-distance terms are what F4 needs before a second pull. It goes next and is in design (`arch-ABC-271`). DoR stays 9/10, and the front matter is untouched (the board's column is the Orchestrator's).
- **`EPIC-011`:** a top block; § Phases rows E2 (first pull NOT MET; tool → `ABC-280`; second pull after E4a) and E4 (the order flipped); § Tickets rows 12 and 23, a new row 32 and the id line; § Dependencies: the order `ABC-271` → second pull. G3 is unchanged, because no merge happened.

## Not done here (outside the fence)
- `plans/board.md`, the Orchestrator's: ABC-239's Blocked card → Done (closed NOT MET); ABC-280 → Ready.
- `ADR-0056` row E2's status line: `arch-ABC-271` has it.
