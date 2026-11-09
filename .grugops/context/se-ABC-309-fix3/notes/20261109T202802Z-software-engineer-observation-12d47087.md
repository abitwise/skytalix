---
id: 20261109T202802Z-software-engineer-observation-12d47087
kind: observation
by: software-engineer
at: 2026-11-09T20:28:02Z
verified_by: 
confidence: high for the README edits and the A1, A2, A4, A6-A8 re-checks (run on this host); the Arena, BanksiaGUI and Windows routes UNKNOWN - verify (not run)
refs:
  - se-ABC-309-fix3
  - se-ABC-309
  - grugops/ABC-309
  - ABC-309
  - 467a454f
  - README.md
  - qe-ABC-309/20261109T202511Z-qe-e2e-decision-f0e46abe
  - qe-ABC-309/20261109T202506Z-qe-e2e-observation-6552f96c
  - qe-ABC-295/20261109T160639Z-qe-e2e-decision-e11c410e
  - se-ABC-309-fix2/20261109T201957Z-software-engineer-observation-c4a5290e
supersedes: 
seal: sha256:2228a3eb6cead78dc93cb7be5af4902ac763f7ff6c56fba8d5daa538dfc75cc5
---

# se-ABC-309-fix3: A4's sentence and QE's three low gaps, README.md only; the re-checks

Software Engineer, task `se-ABC-309-fix3`, on `grugops/ABC-309` from `467a454f`. Source: QE's verdict `qe-ABC-309` `…f0e46abe` (FAIL on A4 only) and its observation `…6552f96c`. The failing sentence came from the Orchestrator's fix-2 brief. Changed: `README.md`, ABC-309's Result block and this note. Nothing under `src/`. Host commands ran under `flock <scratch>/<home>/<repo>/host-test.lock`.

## Changed
1. **A4:** in § Strength, "That 100 ms a move is much shorter than level 5's normal 4 s, so in normal play the default level should be at least that strong, but that was not measured." becomes exactly "Level 5 normally has 4 s a move, not 100 ms. Its strength at 4 s was not measured." This withdraws fix 2's item 3.
2. **Time margin:** the overshoot advice leaves the `simple-tournament` bullet. One sentence after the options list now covers every `TimeMode`: "In every `TimeMode` a move can run a few milliseconds over its time, so give the engine a small time margin in the GUI."
3. **Intro:** Cute Chess "is set to run the script itself, or on Windows a `skytalix.cmd` file that runs it".
4. **`where node`:** the Arena and BanksiaGUI step 2 each add "(use the first line it prints)" after "which `where node` prints in a Command Prompt".
Lines were reflowed to stay at 96 columns or fewer. No other text changed.

## Re-checks at the fix-3 working tree
- A1: `git diff --name-only efd2230b | grep -c '^src/'` prints 0.
- A2: `test -s assets/readme-art.txt` holds. Line 1 is ` ```text `. `sed -n '2,/^```$/p' README.md | sed '$d' | cmp - assets/readme-art.txt` exits 0.
- A4: the numbers in § Strength are 1902.5, 49.1, Stockfish 19, `UCI_Elo` 1810, level 5, 100 ms, 200 games, 100 openings, 63.0 % and 92.5. Each is in `qe-ABC-295` `…e11c410e`. The 100 openings appear there as "100 openings × 2 games", and "one at a time" as `--concurrency 1`. The only other numbers are 40/15, in the disclaimer, and 4 s, which is level 5's time as given in § Levels. No other Elo figure appears, and no strength claim at 4 s.
- A6: the personal-path, IPv4 and e-mail scans each count 0. The one absolute URL is the clone URL.
- A7: `AGENTS.md`, `LICENSE` and `NOTICE` pass `git ls-files --error-unmatch`. `npm run lint` exits 0 (148 files), and `npm run build` exits 0.
- A8: `FIGlet` counts 0. § Licence differs from `efd2230b` only by the credit line and its blank line.

Not checked: A3 and A5 were not re-run. The options table and the steps are unchanged apart from the words above. No GUI window was opened, and no Windows or macOS host was used. The Arena, BanksiaGUI and Windows routes remain `UNKNOWN - verify`. Commands ran in this worktree, not on a fresh clone.
