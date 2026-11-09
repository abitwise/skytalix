---
id: 20261109T200804Z-software-engineer-observation-5432062f
kind: observation
by: software-engineer
at: 2026-11-09T20:08:04Z
verified_by: 
confidence: high for the README edits and the A2, A5-A8 re-checks (run on this host); the Windows route and the Arena and BanksiaGUI steps UNKNOWN - verify (not run)
refs:
  - se-ABC-309-fix
  - se-ABC-309
  - grugops/ABC-309
  - ABC-309
  - a0d041e2
  - README.md
  - src/levels.ts
  - orch-2026-10-30a/20261109T200516Z-orchestrator-decision-4b413e8c
supersedes: 
seal: sha256:e53a74de591c751e9bc304e2aefc9e1d84ce95b278399c932051bafb4da01d9e
---

# se-ABC-309-fix: the three rulings applied to README.md, and the re-checks

Software Engineer, task `se-ABC-309-fix`, on `grugops/ABC-309` from `a0d041e2`. Rulings: `orch-2026-10-30a` `…4b413e8c`. Docs only: `README.md` and ABC-309's Result block. Host commands ran under `flock <scratch>/<home>/<repo>/host-test.lock`.

## Changed
1. **Cute Chess:** step 2's shebang route is stated as for Linux and macOS (tested on Linux only, under `cutechess-cli` 1.5.1). A Windows route follows: a one-line `skytalix.cmd` in the clone, `@node "%~dp0dist\uci.js"`, set as **Command**. Basis: `EngineBuilder` calls `QProcess::start(cmd, arguments)` with no arguments from the GUI dialog, and on Windows a `.cmd` given as the program is run through `cmd.exe`. **Not run:** this host has no Windows and no Wine. The README marks it "untested". Step 1 says to skip `chmod` on Windows.
2. **Arena and BanksiaGUI:** no menu label remains. Each step names the action (open the engine manager, add a new UCI engine, program `node.exe`, parameter or argument `<clone>\dist\uci.js`; open the engine's options; start a new game against skytalix). Each subsection says its menu names were not checked against the GUI. Step 2 falls back to the `skytalix.cmd` route (untested) if the GUI has no argument field. Cute Chess's labels stay: they were verified against its 1.5.1 source.
3. **§ Levels:** every cell re-read against `LEVELS` (`src/levels.ts`; the CLI and `uci-session.ts` both read it): 100, 180, 330, 1000, 4000, 5000, 30000 ms. Level 5 fixed from 3 s to 4 s. 0.2 s and 0.3 s hold under "approximate". No other cell changed.

## Re-checks at the fix tip
- A2: `test -s` holds; line 1 is ` ```text `; `sed -n '2,/^```$/p' README.md | sed '$d' | cmp - assets/readme-art.txt` exits 0.
- A5: the live `uci` reply has 3 `option name` lines equal to the table; 22 s and 59.5 s equal `SIMPLE_TOURNAMENT_CEILING_MS` (22 000) and `CLOCK_MODE_CEILING_MS` − 500; `grep -c 'two options'` prints 0.
- A6: personal-path, IPv4 and e-mail scans count 0; the one absolute URL is the clone URL.
- A7: `AGENTS.md`, `LICENSE`, `NOTICE` are tracked; `npm run lint` exits 0 (148 files); `npm run build` exits 0.
- A8: `grep -c FIGlet` prints 0; § Licence differs from `efd2230b` by the credit line and its blank line only.

## Still unconfirmed
- No menu label is stated as fact any more. Still `UNKNOWN - verify`: the versions Arena 3.5.1 and BanksiaGUI 0.58, whether each has a separate argument field, and the Windows `.cmd` route (it was not run).
- `src/levels.ts` lines 42-43 still call level 5 "the shipped engine at NFR-004's 3 s", while the table says 4 000 ms. This is a stale comment outside a docs-only ticket and is left for the Orchestrator.

Not checked: the Windows route and the Arena and BanksiaGUI steps were not run on any GUI; the commands were not run on a fresh clone.
