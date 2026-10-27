---
subtask: arch-repass-30-architecture
role: architect-design
ref: .grugops/context/arch-repass-30-architecture/
branch: new records branch grugops/arch-repass-30-architecture from main, worktree ../wt-arch-repass-30-architecture
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# EPIC-008 close, step 2: full as-built re-pass of memory-bank/30-architecture.md

## Do
- Read Orchestrator `orch-2026-10-27m/…64925a53`, BA/PM `bapm-s1-ABC-210/…ff16a93d` (the close path) and your own close item `arch-records-arch-snapshot/…cdc1fb61`.
- Re-pass `memory-bank/30-architecture.md` against `main`'s `src/` as built (read-only). Every module, boundary, count and data-flow line must match what is on main now: ABC-208's null move is in; ABC-207, ABC-209 and ABC-210 are not.
  - Settle the open count: is `virtual-clock.ts` a production module (42 or 43 of 46)? Rule it with the evidence.
  - Fold the existing dated corrections (apply.ts, zobrist.ts) into the body where they belong; keep a dated change line for each edit.
  - Cross-check the ADR pointers (ADR-0024 d4 stands; ADR-0025 D4, ADR-0051 accepted, not in force; ADR-0050 in force).
- Run `node tools/grugops/reference-check.js` on 30-architecture.md.
- Records only: `git diff --stat main...HEAD -- src tools package.json` must print nothing. Paste it.

## Fences
- Work only in your worktree. Don't touch the board, ticket or epic pages.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `arch-repass-30-architecture`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done, records only.** Branch `grugops/arch-repass-30-architecture` @ `bf183f52` (`4ab6f2f9` page + `bf183f52` notes), cut from `main` `c383f8f0` (worktree `../wt-arch-repass-30-architecture`). Not pushed, not merged.

- **Open count settled: 46 production modules; `virtual-clock.ts` is one of them, and no entry loads it. 42 of the 46 are loaded by an entry.**
  - `ADR-0011` clause 1 ("every `.ts` under `src/` that is not a `.test.ts`", no exclusions) is the one definition. Its expression is pinned whole in `src/history-pane.nfr.test.ts` (`productionModulesIn`). `ADR-0027` d4 also calls the clock "one small production module".
  - No other module imports the clock. Its one import (`Clock` from `engine.ts`) is type-only and erased at run time. Its importers are six test files.
  - The entry closures are chess 38, uci 18 and perft 7, union 42. No entry loads the three TEST-ONLY corpora or `virtual-clock.ts`. "42 or 43" mixed the two questions; neither answer is 43.
- **The page is re-passed as-built at `c383f8f0`** (+232/−144). The snapshot notice is retired, and every dated correction is folded into the body, `apply.ts` and `zobrist.ts` included. § Change log has 17 dated lines, one per edit.
  - The table is rebuilt from 17 rows to 46, with Level, Loaded-by and Fan-in columns. `zobrist.ts`'s `UNKNOWN - verify` depth is now measured: level 4.
  - The graph went from 17 / 49 / 12 type-only / depth 8 to 46 / 175 / 48 / depth 11 (127 run-time edges, depth 10), with 0 cycles. Test files: 61.
  - These lines were false at `c383f8f0` and are corrected:
    - `render.ts` has one run-time importer, `render-seam.ts`.
    - `history.ts` has two, `turn-loop.ts` and `cli.ts`, which equals `LICENSED_DRIVERS`.
    - "nothing imports a renderer" is now false: `render-seam.ts` is `ADR-0029`'s composition root.
    - "no clone function exists" is now false: `clonePosition` exists, in a TEST-ONLY corpus only.
  - New: the capability boundary (3 `node:` importers), a § Data flow per entry, and the search heuristics' state on `main`.
  - The deployment posture was re-verified (5 bullets). The `NFR-008` figures are replaced by a pointer to its catalog row.
- **The ADR pointers were checked against code on `main`:**
  - `ADR-0024` d4 stands (no checks in quiescence).
  - `ADR-0025` d4 stands as written (`clearTable()` per search; `ABC-209` not an ancestor).
  - `ADR-0050` is in force (`ABC-208` `2e9eb9a7` is an ancestor; the null move is in 4 modules).
  - `ADR-0051` is accepted, not in force (0 check-extension matches; `ABC-210` not an ancestor).
  - `ABC-207` is not an ancestor: `evaluate.ts` keeps one `MOBILITY_WEIGHT`.
  - All 32 ADRs the page cites resolve.
- **Method:** a scratch script parsed `src/` with the TypeScript parser (a library read; no `tsc`, npm or vitest). It was calibrated first on `9236f4e7`, where it reproduced the 2026-08-12 figures exactly. A cell-by-cell cross-check of the table found 0 mismatches over 46 rows.
- **Checks:**
  - `node tools/grugops/reference-check.js memory-bank/30-architecture.md` printed `No findings.` (rc 0).
  - `git diff --stat main...HEAD -- src tools package.json` printed nothing (rc 0). The pasted output is empty:
    ```
    ```
  - Class scan of the page and notes (personal paths, IPv4, URLs, host patterns): 0 hits. The one word match is the original sentence's "cluster".
  - No npm, vitest, build or timing was run.
- **Notes** (`.grugops/context/arch-repass-30-architecture/notes/`, 2): decision `20261027T195433Z-architect-design-decision-74d50337` and observation `20261027T195433Z-architect-design-observation-eb5e0afe`. Both were sealed by grugops 2.1.0 `admitAndAppend` (explicit `contextRoot`, 0 findings), with `at` 2026-10-27T19:54:33Z from `date -u`. Both seals verify `ok`, `readContext` reads back 2 notes, and the index is rendered.
- **INFO, no route needed (in `…eb5e0afe`):**
  1. `ADR-0027` d4 says the harnesses import the clock "outside any test file". As built, those harnesses are test files. The ADR is not edited.
  2. The corpora call themselves TEST-ONLY, while `ADR-0011` clause 1 counts them as production modules. That is consistent by `ADR-0011`'s own split.
- **Not done:** no edit to the board, ticket, epic, ADR, NFR catalog or `plans/traceability.md`; no push.
- **For the Orchestrator:** merge `grugops/arch-repass-30-architecture` when ready. Step 2 of the `EPIC-008` close path is then done, and step 3 (the closing `M1` R reading, ALONE) can be routed. This branch changes no `src/` or `data/`, so `main`'s code still equals `b5c67ab7`'s.

### Trace row (10 cells, header order)

| EPIC-008 close step 2 (arch-repass-30-architecture) | 30-architecture full as-built re-pass at main c383f8f0: 46 production modules (ADR-0011 clause 1), 42 loaded by an entry; virtual-clock.ts a production module loaded by no entry (…cdc1fb61 settled); table 46 rows; graph 46/175/48 type-only/depth 11; dated corrections folded, 17 change lines; § Data flow added | EPIC-008 | ABC-208 in (ADR-0050 in force); ABC-207/209/210 not (ADR-0025 d4 as written, ADR-0051 not in force, ADR-0024 d4 stands) | none moves (NFR-008 figures replaced by a pointer to its row; NFR-002 cited) | `grugops/arch-repass-30-architecture` @ `bf183f52` (4ab6f2f9 page + notes …74d50337, …eb5e0afe, on c383f8f0)<br>memory-bank/30-architecture.md | records only: `git diff --stat main...HEAD -- src tools package.json` empty; reference-check No findings; table cross-check 0/46 mismatches; parse calibrated on 9236f4e7; class scan 0; no npm/vitest/build/timing | n/a (records) | not released | records written; close step 3 (M1 R, ALONE) next after merge |
