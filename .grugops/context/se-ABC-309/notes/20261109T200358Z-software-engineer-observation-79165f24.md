---
id: 20261109T200358Z-software-engineer-observation-79165f24
kind: observation
by: software-engineer
at: 2026-11-09T20:03:58Z
verified_by: 
confidence: high for A1, A2, A4-A8 and the Cute Chess labels (run or read on this host); Arena and BanksiaGUI labels UNKNOWN - verify
refs:
  - se-ABC-309
  - grugops/ABC-309
  - ABC-309
  - ABC-216
  - efd2230b
  - README.md
  - src/uci-session.ts
  - src/levels.ts
  - qe-ABC-295/20261109T160639Z-qe-e2e-decision-e11c410e
supersedes: 
seal: sha256:bfc5d782f3ae5ce1da9729785d48628a0754f621620ceaf14a6931f52aef232b
---

# se-ABC-309: evidence per acceptance row, unverified menu labels, and what is left

Software Engineer, task `se-ABC-309`, at the build tip of `grugops/ABC-309` (base `main` `efd2230b`). Commands that build or play ran under `flock <scratch>/<home>/<repo>/host-test.lock`. No test suite was run; none is owed (docs only).

## Evidence
- **A1:** the diff against `efd2230b` lists `README.md`, `plans/tickets/ABC-309-…md` (the Result block) and `.grugops/context/se-ABC-309/` only. Nothing under `src/`, and `assets/readme-art.txt` is not touched.
- **A2:** `test -s assets/readme-art.txt` holds (404 bytes). The file has a final newline and no line that is exactly ` ``` `. Line 1 of README is ` ```text `. `sed -n '2,/^```$/p' README.md | sed '$d' | cmp - assets/readme-art.txt` exits 0. The art has trailing spaces on lines 3 to 5. They were spliced in by a script, never retyped.
- **A3:** there are three `###` subsections, Arena, Cute Chess and BanksiaGUI, with 4 numbered steps each, 12 of 12. Each names a version and an OS: Arena 3.5.1 on Windows, Cute Chess 1.5.1 on Linux, BanksiaGUI 0.58 on Windows. Each step 3 names `Skill Level`, `OwnBook` and `TimeMode` and points to the one table. No other GUI is named. Cute Chess step 2 deviates (decision note, item 1).
- **A4:** § Strength gives every figure from `…e11c410e`: 1902.5 ± 49.1; Stockfish 19 with `UCI_LimitStrength` and `UCI_Elo` 1810; level 5; 100 ms a move; 200 games; 100 openings with both colours, one at a time; 63.0 %; +92.5 ± 49.1; X = 1810 + 92.5. It says the figure is "not a 40/15 rating and not a rating-list figure". There is no 1806.5, no 2074 and no other Elo figure.
- **A5:** `printf 'uci\nquit\n' | node dist/uci.js` prints `OwnBook type check default true`, `Skill Level type spin default 5 min 1 max 7` and `TimeMode type combo default level var level var simple-tournament var uci-clock-mode`. The README table equals these 3 of 3. 22 s is `SIMPLE_TOURNAMENT_BUDGET_MS` (22 000). 59.5 s is `CLOCK_MODE_MAX_BUDGET_MS` (`CLOCK_MODE_CEILING_MS` − 500 = 59 500). "Skill Level is read only while TimeMode is level" matches `leveled = timeMode === "level"` in the `go` handler. `grep -c 'two options'` prints 0.
- **A6:** `ABC-216` A8's scans count 0 for personal paths, 0 for IPv4 and 0 for e-mail. The only absolute URL is the existing clone URL.
- **A7:** the relative links are `AGENTS.md`, `LICENSE` and `NOTICE`, and `git ls-files` lists all three. `npm run lint` exits 0 (148 files). `npm run build` exits 0.
- **A8:** `grep -c 'FIGlet'` prints 0. The § Licence diff removes the credit line and the blank line before it, and nothing else.

## Menu labels: what is verified and what is `UNKNOWN - verify`
- **Cute Chess 1.5.1: verified against its source** (`v1.5.1-5-g5e84232b`, built on this host). The menus are Tools > Settings and Game > New... (`mainwindow.cpp`). The Engines tab and the Add button come from `settingsdlg.ui` and `enginemanagementwidget.ui`. The fields Name, Command, Protocol (`uci`), the Advanced tab, Detect and Time Control come from `engineconfigdlg.ui`, `gamesettingswidget.ui` and `enginefactory.cpp`. The Human and CPU radios come from `newgamedlg.ui`. The GUI binary was not opened; this was a source read plus a `cutechess-cli` run.
- **Arena 3.5.1 on Windows: every label is `UNKNOWN - verify`.** No copy or manual is on this host. The unverified labels are Engines > Install New Engine..., the engine-type prompt (UCI), Engines > Manage..., the Details tab, the "Command Line Parameters" field, Engines > Load Engine..., Engines > Configure and File > New. The version 3.5.1 and the claim that skytalix answers after the human's move are `UNKNOWN - verify` too.
- **BanksiaGUI 0.58 on Windows: every label is `UNKNOWN - verify`.** The unverified labels are Engines > Engine Manager, Add, an "Arguments" field, the protocol choice, where the engine's options open, and File > New Game. Whether BanksiaGUI takes a separate argument at all is `UNKNOWN - verify`; if it does not, step 2 needs the same treatment as Cute Chess. The version number is `UNKNOWN - verify`.
- QE checks each against the named version's own manual, per the page's test note 2. The owner pushes only after that.

## Outside scope, for the Orchestrator
- **The README's § Levels table gives level 5 as "3 s", but `src/levels.ts` has `budgetMs: 4_000`.** QE's `…e11c410e` also reads "level 5 at 4 000 ms". The other levels round as stated: 0.18→0.2, 0.33→0.3. That section is out of this ticket's scope, so it is left as it is.

Not checked: Arena and BanksiaGUI were not run and their manuals were not read; none of the three GUIs' graphical windows was opened. The commands added (`npm install`, `npm run build`, `chmod +x dist/uci.js`, `node --version`) ran in this worktree, not on a fresh clone.
