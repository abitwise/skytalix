---
id: 20261110T104426Z-software-engineer-observation-db9f8a2c
kind: observation
by: software-engineer
at: 2026-11-10T10:44:26Z
verified_by: 
confidence: high: every A4 check run by SE on this host after the last edit; shellcheck absent, NOT RUN; Windows .cmd and macOS sh UNKNOWN - verify
refs:
  - se-ABC-312
  - ABC-312
  - grugops/ABC-312
  - 69b58309
  - README.md
  - bin/skytalix-uci
  - bin/skytalix-uci.cmd
  - src/levels.ts
  - orch-2026-10-30a/20261110T103936Z-orchestrator-decision-ba685b6c
  - qe-ABC-311/20261109T224548Z-qe-e2e-observation-5540f546
  - qe-ABC-311/20261109T224621Z-qe-e2e-decision-cb74c9fc
supersedes: 
seal: sha256:2d0a81d22a5c342d36368b58f2b9873f49dba2774a0463828739b83ed8d69929
---

se-ABC-312 on branch grugops/ABC-312 from main 69b58309. Requirement: orch-2026-10-30a/20261110T103936Z-orchestrator-decision-ba685b6c (A1-A5); G4 from qe-ABC-311/20261109T224621Z-qe-e2e-decision-cb74c9fc, observation qe-ABC-311/20261109T224548Z-qe-e2e-observation-5540f546. Files: README.md, bin/skytalix-uci (new, 100755), bin/skytalix-uci.cmd (new, 100644, CRLF). No src/. No test added to any lane.

What changed:
- A1. Levels table gains "| Blunder rate | 40 % | 20 % | 10 % | 5 % | 0 | 0 | 0 |" (src/levels.ts blunderRate 0.4, 0.2, 0.1, 0.05, 0, 0, 0). Lead-in now "Each level has a time per move, a blunder rate and a projected strength:"; "The times are approximate." moved under the table, with the blunder sentence: "At the blunder rate's share of its moves, the engine scores every move and deliberately picks a weaker one." G4: "+50 to +60 Elo"; "the Strength section below" / "the Strength section's scale" / "the Levels section" replace every "§" (grep '§' README.md is empty); "and, for the levels that blunder, a penalty which was not measured". Projected-strength row unchanged byte for byte (git diff shows it only as context).
- A2. bin/skytalix-uci: POSIX sh. Follows symlinks with readlink (no -f) to its real path, clone = its dir/.. via cd -P. Missing dist/uci.js: stderr "... run npm install, then run npm run build", exit 1. node: command -v node, then /opt/homebrew/bin, /usr/local/bin, Volta, fnm (XDG, macOS, legacy), asdf shims, /usr/bin, then nvm (NVM_DIR or HOME/.nvm). If HOME is empty it is looked up with getent (Linux); env -i leaves HOME unset, so the A4 run needs this. Not found: stderr message, exit 127. Then exec node dist/uci.js "$@". Marked shortcut: nvm takes the last version dir in name order, not nvm's default alias.
- A2. bin/skytalix-uci.cmd: node from PATH (where node), else %ProgramFiles%\nodejs\node.exe; same missing-build message to stderr, exit 1; uses goto, not ( ) blocks, so a path with ")" cannot break it. Header says UNTESTED on Windows.
- A3. GUI intro names the launchers and marks the Windows launcher untested; one shared build step. Arena, Cute Chess, BanksiaGUI point at the launcher; every hand-made skytalix.cmd and node-plus-argument step removed. Cute Chess now says the direct dist/uci.js route was tested there and the launcher was not. New "En Croissant" section: "Tested by the owner on 2026-11-10"; steps: build, then on the Engines page add a local engine and select the launcher. Arena and BanksiaGUI keep "They have not been tried".

Checks, each under flock <scratch>/<home>/<repo>/host-test.lock, after the last edit; input file holds uci, isready, quit:
- env -i PATH=/usr/bin:/bin bin/skytalix-uci, from the worktree: id name skytalix, id author, 3 option lines (OwnBook, Skill Level, TimeMode), uciok, readyok; exit 0. Node is not in /usr/bin on this host, so it was found through the getent HOME and nvm.
- Same, run from <scratch>/<home>/<repo> by absolute path: same 7 lines, exit 0.
- Same through an absolute symlink and through a relative symlink chain (sub/rel-chain -> ../abs-link -> script): same 7 lines, exit 0 each.
- Normal PATH run: ends uciok, readyok; exit 0.
- Missing node: env -i PATH=/usr/bin:/bin HOME=<scratch>/<home>/<repo>/emptyhome; stdout 0 bytes; stderr "skytalix-uci: node not found; install Node.js 22.18 or later, or put node on the PATH"; exit 127. Real install untouched.
- Missing build: scratch copy nobuild/bin/skytalix-uci with no dist; stdout 0 bytes; stderr "skytalix-uci: <scratch>/<home>/<repo>/nobuild/dist/uci.js is missing; in <scratch>/<home>/<repo>/nobuild, run npm install, then run npm run build"; exit 1. Real dist untouched.
- shellcheck: not installed (command -v shellcheck exit 1); NOT RUN.
- npm run build: exit 0. npm run lint (biome check .): exit 0, 148 files, no fixes.
- Art cmp, sed -n '2,/^```$/p' README.md | sed '$d' vs assets/readme-art.txt (404 bytes): cmp exit 0.
- git ls-files -s bin: skytalix-uci 100755, skytalix-uci.cmd 100644.

Not checked: shellcheck (absent); the sh script under macOS /bin/sh and BSD readlink (Linux dash only); the .cmd on Windows (never run); any GUI with the launcher, En Croissant included (owner's test predates it); GitHub render of the 3-row table (line 55 is 127 chars, unchanged).
