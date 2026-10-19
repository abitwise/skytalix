---
task: uat-ABC-171
subtask: uat-ABC-171
role: qe-e2e
workflow: agent-factory/workflows/06-uat-pack.md
ticket: plans/tickets/ABC-171-the-uci-session-offers-ownbook-and-skill-level.md
ref: .grugops/context/uat-ABC-171/
branch: grugops/uat-ABC-171
base: grugops/ABC-171 @ 5dee231c
done_at: 2026-10-19T15:00:15Z
commit: cc49bf0e
tree_under_test: 5dee231c (unchanged; src/uci-session.ts md5 0d63103d… before and after)
result: UAT conducted — PASS_WITH_GAPS on the observable half; NOT accepted, owner's word owed
---

# Done: `uat-ABC-171`, QE-conducted UAT of ABC-171 (`OwnBook` + `Skill Level` over UCI)

QE/E2E conducted the UAT by the owner's delegation (`…2b7f4c88`: *"QE runs it, I sign (Recommended)"*).
- **This is not the owner's acceptance.** The owner's word in session signs.
- The UAT Planner and BA/PM hops were not run.
- **No timing reading was taken.** Every session ran on `virtualClock`, and N8-LANE stays OWED (R-171-1, accepted).
- No process I did not start was touched.

## Result

**PASS_WITH_GAPS on the observable half. Defects: 0.**
- **S0–S9 and X1:** 11 of 11 PASS, **4061 of 4061** checks. Each is a UCI dialogue through `createUciSession` /
  `handleLine`, with the real `createBookProbe` behind a counted `read` and a counted `random`, and a harness in the
  GUI's seat. RUN-1 and RUN-2 are byte-identical (sha256 `f704c86b…`).
- **S10:** ABC-167's 13 UAT scenarios, 13 of 13, **2876 of 2876**, twice and byte-identical (sha256 `a747c0c1…`).
  The output equals ABC-167's recorded RUN-1 except the 7 `uci` lines, S1's OBS line and S13's line count
  (648 → 666, the 18 option lines).

The gaps are what cannot be observed yet, not failures.

## Scenario → criterion

| scenario | criteria | result |
|---|---|---|
| S1 `uci` option lines | A1, D3 | PASS 17/17 |
| S2 setoption, valid / invalid, case-blind | A2, A13d, QE-171-f f1, f2, f4 | PASS 588/588 |
| S3 book on: from the book, read once, legal out of book | A3, A5, A8 / A13b, D10, f3 | PASS 425/425 |
| S4 book off: searches, 0 reads | A4 | PASS 247/247 |
| S5 bad / throwing book: one warning, legal play | A9, D10 | PASS 882/882 (9 books × 4 flows) |
| S6 Skill Level 1–5: budgets; blunder path; seed oracle; levels 1–2 ignore depth / nodes / mate in one line | A6, A7, A13a, A13c, D11, NFR-004 (virtual) | PASS 1317/1317 |
| S7 `go infinite` on a book hit holds until `stop` | A10 | PASS 49/49 |
| S8 `ucinewgame` draws no seeds | A8 | PASS 27/27 |
| S9 a full game at level 1 and one at level 3 vs a scripted opponent | A3, A6, A7 (M6, M7) | PASS 494/494 (47 plies, checkmate; 26 plies, checkmate; both replay) |
| S10 ABC-167's 13 UAT scenarios | A12; ABC-167 A1–A11 | PASS 2876/2876 |
| X1 every line | A11 (M4) | PASS 3/3 (1 793 lines; 677 `go` = 677 `bestmove`) |

- A11's text half: read at entry (`import type` only for `book.ts`; no `process` / `Date.now` / `Math.random`).
- A12: `55a1e223..5dee231c -- src` gives exactly the two files.
- NFR-004: PASS on the virtual clock (engine path, level 5 4 600 at step 100).
- NFR-008 N8-LANE: OWED.

## INFO items (not defects)

- **`UAT-171-a`: the blunder path's virtual `time` is a count of clock reads.** At level 1 it reads 810 at step 10
  and 8 100 at step 100, against a budget of 100. ADR-0032's children each pay fixed reads. The session equals
  `createLevel` exactly. On a real clock, `secnfr-ABC-087` read a maximum of 589 ms. What a real GUI sees is
  `ABC-168`'s.
- **`UAT-171-b`:** a `go` at level 1 on a mated position draws one seed and writes `bestmove 0000`. With no
  position, it draws 0.
- **`UAT-171-c`:** the `uci` line's `default 3` is a literal beside `DEFAULT_LEVEL`. They agree today. `ABC-174`'s
  QE should pin them together (control C12).
- **`UAT-171-d`:** the bad-book warning stays in `warn`. That is QE-171-e, routed to `ABC-168`.
- **RUN-0** failed 5 checks on two errors of mine, disclosed in `probe/harness-RUN-0-excerpt.txt`: a transposition
  fixture that ended on a double push, and an unpromised "blunder ≠ engine move" check. RUN-1 also adds the f3 block
  (10 checks).

## Not observable until ABC-168 / ABC-174 (`…3cd487f4`)

- **Until ABC-168:**
  - the `skytalix` binary and real stdin/stdout;
  - a real GUI setting the options;
  - the real book file (`readBookFile`, NFR-006, one read per process);
  - the bad-book warning reaching the GUI as `info string` (QE-171-e);
  - varied openings through `Math.random`;
  - real time at levels 1–2, and `isready` latency while the book loads;
  - N8-LANE (R-171-1, R-167-2).
- **Until ABC-174:**
  - ADR-0045's re-cut table (100/0.4, 180/0.2, 330/0.1, 1000/0.05, 3000/0);
  - `default 5`, read from `DEFAULT_LEVEL`;
  - "level 5 plays as today's 3".
  S0 pins today's table, so it FAILs there by design.

## Gates at `5dee231c` (`…be4d3860`)

- lint 0 (115 files), typecheck 0, build 0.
- `npm test` exit 0 on the first run: 59 files, **1962/1962**.
- `last-run.json`: `success: true`, total 1962, passed 1962, failed 0, pending 0, todo 0, `runState` exited,
  `exitCode` 0.
- Integrity at skip 0: `No findings.`
- `git merge-tree --write-tree main HEAD` against main `e4150359`: clean, tree `90db2b04`. The branch commit `cc49bf0e` against the current main
  `d5c033d5`: clean (tree `0d9ee07a`). The tip `5dee231c` against `d5c033d5`: clean (`aa03fb33`).
- `qe-hop-integrity.js --ticket ABC-171` on the branch: `covered (qe-e2e)`, exit 0.

## Harness controls

Thirteen controls ran on scratch copies of the tip, one edit each. 12 are caught (C1–C12) and 1 is missed by design.
- C1 names case-sensitive; C2 book only at rate 0 (S25); C3 `OwnBook` off still warms; C4 a seed every `go`; C5
  `ucinewgame` draws; C6 no level cap; C7 no dropped-limit line; C8 `infinite` on a hit does not hold; C9 an
  invalid `OwnBook` sets false (S12); C10 `2^16` seed (S33); C11 a range check, not an own key (S07, f4); C12
  `default 5` advertised while 3 plays.
- **C13** (`warm()` on every `isready`) is missed. It is an equivalent mutant from outside: the probe's memo holds
  `read` at 1.
- **Thin:** C5 and C7–C11 are each caught by one scenario, and C10 by 6 checks.
- See `probe/controls.txt`.

## The owner's one-word signoff checklist (from `…f340102a`)

1. Do S1–S10 describe what you want a UCI GUI to get from `OwnBook` and `Skill Level`?
2. Do you accept the readings ruled on the page and observed in S2–S6? They are: `OwnBook` values case-sensitive;
   `01` / `1.0` / `0x1` refused; bad-token `info string`s before `info string book`; levels 1–2 drop
   `depth` / `nodes` / `mate` with one line.
3. Do you accept that these are proven on ABC-168, not here: the binary, the real book file, a real GUI, real time,
   varied openings and the warning reaching the GUI? And that the re-cut levels and `default 5` are proven on ABC-174?
4. Do you accept the run's result? S0–S9 and X1 pass 4061/4061, S10 passes 2876/2876, and N8-LANE stays OWED under
   R-171-1.
5. **Overall: accept or reject ABC-171?**

## Notes

All are on the branch in `.grugops/context/uat-ABC-171/notes/`, hand-authored and unsealed:
- `…f340102a`: the pack (artifact-ref);
- `…e7b71b15`: the run;
- `…f59a723d`: S10;
- `…3cd487f4`: what is not observable;
- `…be4d3860`: gates, fences and controls;
- `…b2794b17`: the decision.

## Untouched

- `src/`, `AGENTS.md`, `package.json`, `vitest.config.ts`, `plans/board.md` and `plans/traceability.md`.
- `../wt-ABC-171` (clean at `5dee231c`) and `../wt-ABC-173`.
- Nothing was pushed or merged, nothing was self-signed, and no `uat/*.uat.spec.ts` was written.
- `pending/uat-ABC-171.md` and `claimed/uat-ABC-171/` are left for the Orchestrator's close.

## Trace row

| ABC-171 (UAT) | `OwnBook` + `Skill Level` over UCI. QE-conducted UAT by the owner's delegation (`…2b7f4c88`), subtask `uat-ABC-171`, at tip `5dee231c`. S0–S9 + X1 11/11 PASS, 4061/4061 checks, through `createUciSession`/`handleLine` on virtual clocks, with the real `createBookProbe` (counted `read`/`warn`) and a counted `random`, a harness in the GUI's seat (option lines; setoption good/bad/case-blind; book on/read-once/off/9 bad books; levels 1–5 budgets, D11 seed oracle 64/64 per blunder level, dropped limits; infinite on a book hit; no reseed; a level-1 and a level-3 game vs a scripted opponent). S10: ABC-167's 13 UAT scenarios 2876/2876, output identical to its recorded run except the `uci` lines. Two runs byte-identical each. Controls C1–C12 caught, C13 equivalent | EPIC-007 / ADR-0044 D3, D10, D11 | — | NFR-004 PASS (virtual, engine path); NFR-008 N8-LANE OWED (R-171-1); no timing reading | unchanged: `src/uci-session.ts` (production, +97/−15) | Harness under `.grugops/context/uat-ABC-171/probe/` (not a lane row). Lane 59 files / 1962 green; skip 0; integrity "No findings."; merge-tree clean vs main `e4150359` and `d5c033d5` | **UAT conducted — owner's word owed** (notes `…f340102a`, `…e7b71b15`, `…f59a723d`, `…3cd487f4`, `…be4d3860`, `…b2794b17`) | — | Branch `grugops/uat-ABC-171` @ `cc49bf0e`; not merged, not pushed; no board move. Binary/book file/GUI/real time/varied openings/warn → `info string` are ABC-168's; re-cut levels + `default 5` are ABC-174's. INFO `UAT-171-a` (blunder-path virtual time = clock reads), `-b` (mated position draws 1 seed), `-c` (`default 3` literal, pin with DEFAULT_LEVEL at ABC-174), `-d` (warn stays in `warn`, QE-171-e); RUN-0 errors disclosed |
