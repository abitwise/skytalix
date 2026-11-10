---
id: 20261110T103936Z-orchestrator-decision-ba685b6c
kind: decision
by: orchestrator
at: 2026-11-10T10:39:36Z
verified_by: 
confidence: high
refs:
  - README.md
  - ABC-311
  - ABC-309
  - src/levels.ts
supersedes: 
seal: sha256:a5b4db55f18f1313ba9386369167c72d8c80dbfbd25c6b1842b416d546ec2914
---

Owner, 2026-11-10: "yes, add the blunder row and fixes, also add scripts to attach uci in macos, linux and windows. I tested with en-croissant". This is cut as ABC-312 by this note (docs plus two launcher scripts; no src/). Acceptance:

- **A1, § Levels.** Add a "Blunder rate" row (40 %, 20 %, 10 %, 5 %, 0, 0, 0, per src/levels.ts) and one plain sentence on what a blunder is: at that share of moves the engine scores every move and deliberately picks a weaker one. Fix QE's G4: "Elo" after "+50 to +60"; no "§" in prose (say "the Strength section"); make "which was not measured" refer to the penalty; and "The times are approximate" must fit a table that now has strengths. Keep every row of the table readable. Do not change the projected ranges.
- **A2, the launchers.**
  - **bin/skytalix-uci** is a POSIX sh script, committed executable, for macOS and Linux. It resolves the clone from its own location, so it works from any working directory and through a symlink. It finds node even under a GUI's minimal PATH: first `command -v node`, then the common install places (Homebrew /opt/homebrew/bin and /usr/local/bin, nvm, Volta, fnm, asdf, /usr/bin). Its error, when node is missing, goes to stderr with a non-zero exit. It runs `exec node <clone>/dist/uci.js "$@"`. When dist/uci.js is missing, it prints "run npm run build" to stderr and exits non-zero.
  - **bin/skytalix-uci.cmd** is for Windows. It runs node on `%~dp0..\dist\uci.js` with node from PATH, falling back to `%ProgramFiles%\nodejs\node.exe`, with the same missing-build message. It is untested on Windows and marked so.
- **A3, the README GUI section.** Each GUI points at the launcher (bin/skytalix-uci, or bin\skytalix-uci.cmd on Windows) instead of node plus an argument or a hand-made skytalix.cmd. Remove the hand-made launcher instructions. Add En Croissant as a GUI: "tested by the owner" on 2026-11-10. Steps: on the Engines page, add a local engine and select the launcher. Arena, BanksiaGUI and Windows stay marked untested.
- **A4, checks.**
  - On Linux, `printf 'uci\nisready\nquit\n' | env -i PATH=/usr/bin:/bin bin/skytalix-uci` prints id, the three option lines, uciok and readyok, and exits 0. The same works from another directory and through a symlink.
  - The missing-node and missing-build paths give their messages and non-zero exits.
  - shellcheck passes, if it is available.
  - lint, build and the art cmp pass, with no src/ change.
  - No test is added to the default lane.
- **A5.** Executable bits are in git (mode 100755). Paths stay out of records.

QE checks it, and QE's verdict signs UAT.
