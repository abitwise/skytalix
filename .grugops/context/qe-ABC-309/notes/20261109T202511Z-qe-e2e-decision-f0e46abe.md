---
id: 20261109T202511Z-qe-e2e-decision-f0e46abe
kind: decision
by: qe-e2e
at: 2026-11-09T20:25:11Z
verified_by: 
confidence: high: FAIL on A4 by the ticket's scale-only clause and out-of-scope 'no 4 s figure'; A1-A3, A5-A8 met, each checked by QE on this host; the Arena, BanksiaGUI and Windows routes UNKNOWN - verify (not run, now marked untested)
refs:
  - qe-ABC-309
  - grugops/qe-ABC-309
  - grugops/ABC-309
  - ABC-309
  - 467a454f
  - 1064eb4e
  - 8fe2fc34
  - efd2230b
  - 218cbf65
  - README.md
  - src/uci-session.ts
  - src/levels.ts
  - AR-NFR004-A
  - ADR-0056
  - ABC-273
  - ABC-295
  - orch-2026-10-30a/20261109T200516Z-orchestrator-decision-4b413e8c
  - se-ABC-309-fix2/20261109T201957Z-software-engineer-observation-c4a5290e
  - qe-ABC-309/20261109T201711Z-qe-e2e-observation-7f94de2f
  - qe-ABC-309/20261109T201720Z-qe-e2e-decision-858d4098
  - qe-ABC-309/20261109T202506Z-qe-e2e-observation-6552f96c
supersedes: 20261109T201720Z-qe-e2e-decision-858d4098
seal: sha256:bdcc9e1ec32b57801c10603da5b8548ee0f9fc62a8aa3453d26442057aedf1d0
---

# qe-ABC-309 recheck verdict: **FAIL, on A4 only.** Fix 2 closes A3. Its new § Strength sentence sets a floor under the 4 s level that nothing measured. BLOCKED_NEEDS_FIX, back to the Software Engineer: one sentence

QE/E2E, task `qe-ABC-309` (recheck), at `grugops/ABC-309` `467a454f`, merged into `grugops/qe-ABC-309` as `8fe2fc34` (base `main` `efd2230b`; `main` is now `218cbf65`). This note supersedes `…858d4098`. QE checked every row itself. Commands, outputs and sources are in this task's observation note, sealed just before this one, and the first round's evidence is in `…7f94de2f`. Grading follows the Orchestrator's rulings `orch-2026-10-30a` `…4b413e8c` and the ticket.

## Per row
- **A1, met.** The diff against `main` holds `README.md`, the ABC-309 page and 11 files under `.grugops/context/`. Nothing is under `src/`, and `assets/readme-art.txt` is not in it. UAT stays waived by measurement.
- **A2, met.** `test -s` holds (404 bytes, final newline, no line that is exactly ` ``` `). Line 1 is ` ```text `. The `cmp` command exits 0.
- **A3, met (was NOT MET).**
  - Arena, line 93, and BanksiaGUI, lines 138–139, now open with "**They have not been tried in Arena.**" and "**... in BanksiaGUI.**", in bold, before step 1. Cute Chess's Windows route keeps "**This Windows route is untested.**" (lines 129–130).
  - Every step is still complete. Each step 2 names `node.exe` by full path and `<clone>\dist\uci.js` as its parameter or argument. The `skytalix.cmd` fallback is self-contained and correct: `%~dp0dist\uci.js` resolves to `<clone>\dist\uci.js`.
  - The shape is 12 of 12 (table below). No GUI other than the three is named.
- **A4, NOT MET (new in fix 2).** All the figures still stand: 1902.5 ± 49.1; Stockfish 19, `UCI_LimitStrength`, `UCI_Elo` 1810; level 5 at 100 ms a move each side; 200 games from 100 openings; 63.0 %, +92.5 ± 49.1; X = 1810 + 92.5. "Not a 40/15 rating and not a rating-list figure" stays.
  - **The failing case:** lines 60–62 now add "That 100 ms a move is much shorter than level 5's normal 4 s, so in normal play the default level should be at least that strong, but that was not measured."
  - That is a strength claim for level 5 at 4 s: at least 1902.5, in "normal play", off R2's scale.
    - It contradicts A4's "the figure is a reading on that scale only", and the README's own sentence before it, "The figure holds on that scale only".
    - It runs into the ticket's out of scope: "no 4 s figure".
  - The records give it no ground. R2's scale is both sides at 100 ms. The project keeps each R reading on its own scale, "never compared with the 4 s ≈ 2 074" (`ABC-273`, `ABC-295`). Giving skytalix 4 s changes the reading's setup. What the opponent gets in "normal play" is not stated, so even the direction of the change is not measured.
  - "But that was not measured" admits the gap and still states the floor.
  - **The fix, README only:** replace those words with a sentence that names the gap and gives no bound. For example: "Level 5 normally has 4 s a move, not 100 ms. Its strength at 4 s was not measured."
- **A5, met.** On a fresh clone of `8fe2fc34`, the live `uci` reply equals the table, 3 of 3. `npm install`, `npm run build`, `chmod +x dist/uci.js` and `node --version` each exit 0.
  - "`level` plays at most the `Skill Level`'s time per move" equals `Math.min(request.budgetMs, level.budgetMs)`.
  - `simple-tournament`'s 22 s equals `SIMPLE_TOURNAMENT_BUDGET_MS`, and "aims to stay within the clock" fits `min(movetime, cap)` and `min(cap, safeClockShare)`. "Can run over by a few milliseconds" fits the 202 ms measured on `movetime 200` (`AR-NFR004-A`).
  - 59.5 s is unchanged. `two options` counts 0.
- **A6, met.** Personal paths, IPv4 and e-mail count 0; a plant turns the path count to 1. The one absolute URL is the clone URL. The new text adds no drive letter and no URL.
- **A7, met.** `AGENTS.md`, `LICENSE` and `NOTICE` are tracked. On the fresh clone, `npm run lint` (148 files) and `npm run build` exit 0.
- **A8, met.** `FIGlet` counts 0. § Licence differs from `efd2230b` by the credit line and its blank line only.
- **Scope, met.** Against `main`, only `README.md` plus records. `467a454f` touches `README.md`, the ticket's Result block and `se-ABC-309-fix2/`.

## A3, the 12 cells (README line numbers at `467a454f`)
| GUI | 1 build | 2 add the engine | 3 three options + pointer | 4 start a game | version, OS, untested |
|---|---|---|---|---|---|
| Arena | 96–97 | 98–102 (`node.exe` by `where node`, parameter `<clone>\dist\uci.js`; `.cmd` fallback in place) | 103–104 | 105 | 93: 3.5.1, Windows, "not been tried" |
| Cute Chess | 112–113 | 114–130 (Command = the script, through the shebang, ruling 1; macOS menu note; Windows `.cmd`, untested) | 131–132 | 133–134 | 109–110: 1.5.1, Linux, tested on Linux |
| BanksiaGUI | 142–143 | 144–148 (`node.exe` by `where node`, argument `<clone>\dist\uci.js`; `.cmd` fallback in place) | 149–150 | 151 | 138–140: 0.58, Windows, "not been tried" |

## The first round's low gaps, re-read
1. **Cute Chess on macOS: closed in part.** Line 114 now says Settings moves to the application menu. On macOS, Qt labels a `PreferencesRole` item with its own text, not "Settings"; from memory it is "Preferences…" in Qt 5. That label is `UNKNOWN - verify`. Low.
2. **§ Strength against § Levels: overcorrected.** The gap is now named, but with a floor. This is A4's blocking case above.
3. **`simple-tournament` overshoot: closed.** The margin advice is there. Low, open: the same few-ms overshoot applies to a `movetime` under `level` and under `uci-clock-mode` (no reserve on either path), and the advice is given for `simple-tournament` only.
4. **`level` "at most": closed.**
5. **Readability: closed in part.**
   - The intro now matches Cute Chess, but says Cute Chess "is set to run the script itself", and on Windows it runs `skytalix.cmd`. Low.
   - The forward pointer to Cute Chess is gone: closed.
   - "`where node`" names how to find `node.exe`: closed. It can print more than one line, and the step does not say which. Low.
- **Records.**
  - The rulings note `…4b413e8c` is now committed on `main` (`218cbf65`): closed.
  - `se-ABC-309-fix/` still has no `index.md` or `index.jsonl`. Low.

## Gaps, by severity
- **Blocking (A4):** README lines 60–62 put an unmeasured floor under the 4 s level (above).
- **Low:**
  - The macOS label: `UNKNOWN - verify`, likely "Preferences…".
  - The margin advice is given for one mode of three.
  - The intro's "runs the script itself" leaves out Windows.
  - `where node` can print more than one line.
  - `se-ABC-309-fix/` has no index.
- **Outside this ticket, unchanged:**
  - The `src/levels.ts` comment still says level 5 is "3 s".
  - A fresh `npm install` reports audit findings.

## Not covered
- No GUI window was opened, and no Windows or macOS host or Wine was available. The Arena, BanksiaGUI and Windows `.cmd` routes are checked against docs and source only. The README now says so, and they stay `UNKNOWN - verify` until someone runs them.
- BanksiaGUI 0.58's own manual was not found; only the 0.59 help was (`…7f94de2f`).
