---
done_at: 2026-10-19T12:12:00Z
branch: grugops/ABC-171 (worktree ../wt-ABC-171, untouched)
tip: 9ae31679 (code b6afd021, base 7df64755; unchanged, QE committed nothing to the branch)
result: PASS_WITH_GAPS
---

This was a lean QE pass on ABC-171 (`OwnBook` + `Skill Level`).
- **Where it ran:** the scratch worktree `../wt-qe-ABC-171`, detached at `9ae31679`, now removed. The mutants and
  probes ran on scratchpad copies whose `src/` was `diff -r`-identical to the tip, and those copies are deleted.
- **What I did not touch:** `src/`, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-171`,
  `../wt-arch-levels-recut`, `../wt-fix-ABC-167-a4a2-step`, and any process I did not start.
- No defect was fixed. Nothing was pushed or merged. Nothing was self-signed.

The notes are in `.grugops/context/qe-ABC-171/` in main's working tree. They are hand-authored, unsealed and
uncommitted:
- the criteria, gates, NFR-004 and R-167-1: `…5b2e9d17`;
- N8-LANE: `…71c3e0a4`;
- the mutants: `…c48a1f60`;
- **the decision, `…9d61b7e3`, PASS_WITH_GAPS**, authored by `qe-e2e`;
- the scripts and logs: `probe/`.

## Criteria (against the page)
A1–A12 are all **MET**.
- **A2:** the invalid values each write one `info string` and keep the old value. `Hash` is ignored.
- **A6:** G 3500, step 100: level 1 → 200, level 3 → 3 100, level 5 → 3 600, against budgets 100, 3 000 and 3 500.
- **A9:** the real probe warns exactly once, and every `go` writes a legal `bestmove`.
- **A12:** the diff is two files. Only ABC-167 A1 changed.

## The six SE choices (`…a171d001`)
| # | choice | grade |
|---|---|---|
| 1 | `random` and `book` are required; the helper passes an empty valid book | **decided** (Scope 1, D2). No ABC-167 row was weakened (37 kills) |
| 2 | `OwnBook` values are case-sensitive | **decided** by the literal "`true` or `false`". Unpinned → QE-171-f |
| 3 | value = the tokens after `value`, joined; no `value` = invalid | no value = invalid is **decided** (D3). **The join is a harmless gap** → QE-171-f |
| 4 | book hit still writes `parseGo`'s bad-token lines | **not decided** by the page. Consistent with D12 → QE-171-f |
| 5 | the dropped-limit line's wording | **decided** in substance (D11, A7). Only `depth` is pinned → QE-171-c |
| 6 | `warm()` at `isready` and `go` | **decided** (D10, Scope 4). The warmed position is immaterial (equivalent mutants) |

## Mutants: 94 run, 73 killed, 21 survived
- **ABC-167 regressions: 44 run, 37 killed.**
  - The brief's 17 are all killed: M02–M06, M11, M12, M15, M23, M29, M43, M44, M47–M51.
  - `qe2-ABC-167`'s six survivors are now killed: N06, N07, N09, N13, N14, N15.
  - 7 survive, all as ruled before: M09/M10 equivalent; M38/M41 caught by lint; M40/M42 under R-167-1;
    N08 equivalent.
- **ABC-171: 50 run, 36 killed.**
  - **Killed:**
    - setoption: name case, name running to the end;
    - Skill Level bounds: `0`, `6`, `2.5` floored, `constructor` via `in` or `!== undefined`, reset to default;
    - `min(G, level)`: all five mutants;
    - warm: none at `isready`, warm at `uci`, warm ignoring `OwnBook`;
    - book off: probe while off (0 `read`s);
    - book hit: ignoring `infinite`, also searching, probing the start position;
    - failing book: miss → `0000`;
    - seeds: a draw at every level, no draw, two draws, a `ucinewgame` reseed;
    - option lines and defaults.
  - **Survived, 14:**
    - S32 and S33: the seed derivation (QE-171-a);
    - S25 and S31: a book hit at a blunder level (QE-171-b);
    - S38 and S39: the dropped-limit line (QE-171-c);
    - S12: invalid `OwnBook` forced to `false` (QE-171-d);
    - S02, S03 and S07: choices 2 and 3, and `hasOwn` versus an integer range (QE-171-f);
    - S29, S45 and S47: equivalent (the probe's memo);
    - S46: not observable.

## NFR-004
**Confirmed on the virtual clock.**
- The rule is `budgetMs = min(G, LEVELS[skill].budgetMs)`, and the engine clamp at 5 000 is unchanged.
- Levels 1–5 × five unbounded `go`s (bare, `movetime 100000`, `wtime 600000`, `depth 99`, `infinite`): the maximum
  was 4 600 virtual ms, the 4 500 budget plus one step, under `HARD_CEILING_MS`.
- Clause A: the UCI default stays level 3 = 3 000, so `AR-NFR004-A` stands.
- Clause B: the highest budget rises from 3 000 to 4 500 and stays under 5 000. Level 5 was already reachable through
  `level-seam.ts` (the ABC-101 re-read).
- I did not read the real clock.

## Gates at `9ae31679`
- lint 0, typecheck 0, build 0.
- `npm test` exit 0 on the first run: 59 files, 1945/1945.
- `last-run.json`: `success: true`, 1945 total, 1945 passed, 0 failed, 0 pending.
- `test-skip-integrity .grugops/test-skips.md --skip-count 0`: `No findings.`
- **A12:** the `src` diff is the two files.
- **R-167-1:** the grep prints only the test's A2 literal, and nothing on `src/uci-session.ts`. The one new bracket
  access, `LEVELS[skill]`, sits behind `Object.hasOwn`.
- `merge-tree`: clean against main `398603fa`, against main `94b4cfd8`, and against `grugops/fix-ABC-167-a4a2-step`
  `a259a926`.
- **Regression risk, noted:** main's lane went red on ABC-167 A4-a2 timing out under load (94b4cfd8). This branch
  carries that row unchanged at step 10. It passed here, but it can time out under load until the
  `fix-ABC-167-a4a2-step` re-step lands. The two branches merge cleanly.

## N8-LANE: **OWED**
- **The window check:** on Mac.lan, from 2026-10-19T11:24:16Z for 180 s, in the foreground, with 181 polls.
  - A foreign `Projects/public/grugops` vitest and `oeselg-labs/platform` processes were in 181/181 polls.
  - load1 was 8.74–12.37.
- Not quiet, so nothing was timed or estimated.

## Gaps
- **QE-171-a LOW:** the per-`go` seed `floor(random() · 2^32)` is not pinned (S32, S33). The tip matches the oracle
  for k = 1…8. Fix: one oracle row.
- **QE-171-b LOW:** no row has a book hit at a blunder level (S25). On a book hit the tip draws 0 seeds, against A8's
  literal "each `go` at a blunder level" (S31). BA/PM should word A8. Fix: one row.
- **QE-171-c LOW:** the dropped-limit line is pinned for `depth` only (S38, S39). The tip names `nodes` and `mate` too,
  in one line. Fix: one row.
- **QE-171-d LOW:** `OwnBook` "keep the old value" is pinned only from `false` (S12). Fix: one row from the default
  `true`.
- **QE-171-e INFO → ABC-168:** the probe's warning reaches the GUI only through the `warn` binding in `uci.ts`. The
  session writes nothing for it. ABC-168's page should pin `info string opening book … playing on without it`.
- **QE-171-f INFO:** choices 2, 3 and 4, and `Skill Level` `01` / `1.0` refused (not own keys). Accept, or add rows.

## Next column
- **Recommended:** `In Security/NFR`, for the N8-LANE reading, or an owner word like R-167-2's. That hop can also
  decide whether level 5 needs a real-clock NFR-004 reading.
- **QE-171-a..d:** add the rows or accept the gaps, before or at the gate.
- **QE-171-e:** goes onto ABC-168's page.
- **Then the owner's UAT:** production `src/uci-session.ts` is in the diff.
- The Orchestrator decides.

## Trace row (for the Orchestrator to append; QE did not edit `plans/traceability.md`)
| ABC-171 | EPIC-007 / ADR-0044 D2, D3, D10, D11; NFR-004 | `grugops/ABC-171` @ `9ae31679` (code `b6afd021`) | `src/uci-session.ts`, `src/uci-session.test.ts` | QE `qe-ABC-171`: A1–A12 MET; 94 mutants 73 killed / 21 survived (ABC-167 set 37/44 incl. the brief's 17; ABC-171 36/50); 1945/1945, success true; skips 0 No findings; NFR-004 max 4 600 virtual ms < 5 000; N8-LANE OWED (no quiet window) | PASS_WITH_GAPS: QE-171-a..d LOW (seed oracle, book at blunder level, nodes/mate dropped line, OwnBook keep-true), -e INFO → ABC-168 (warn → info string), -f INFO (open readings); → In Security/NFR, then owner's UAT |
