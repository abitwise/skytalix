---
id: 20261110T105326Z-software-engineer-observation-f0f10fdc
kind: observation
by: software-engineer
at: 2026-11-10T10:53:26Z
verified_by: 
confidence: high: every check run by SE on this host after the last edit; G2 /usr/bin/node order by inspection only; shellcheck absent NOT RUN; macOS sh and Windows cmd UNKNOWN - verify
refs:
  - se-ABC-312-fix
  - ABC-312
  - grugops/ABC-312
  - d22c0524
  - README.md
  - bin/skytalix-uci
  - bin/skytalix-uci.cmd
  - qe-ABC-312/20261110T105110Z-qe-e2e-decision-e3e64b1a
  - qe-ABC-312/20261110T105104Z-qe-e2e-observation-940b5543
  - se-ABC-312/20261110T104426Z-software-engineer-observation-db9f8a2c
  - orch-2026-10-30a/20261110T103936Z-orchestrator-decision-ba685b6c
supersedes: 
seal: sha256:5d2dd989b2346d397c09fbe7fb09cf83c8b6532fef4527636bde905076c5eb96
---

se-ABC-312-fix on branch grugops/ABC-312 from d22c0524. Fixes QE gaps G1-G6 from qe-ABC-312/20261110T105110Z-qe-e2e-decision-e3e64b1a (evidence qe-ABC-312/20261110T105104Z-qe-e2e-observation-940b5543). G7 left as is, as ordered. Files: README.md, bin/skytalix-uci (still 100755 in git), bin/skytalix-uci.cmd (100644, CRLF kept). No src/, no test added to any lane.

What changed:
- G1 (blocking). README En Croissant line 151, "Tested by the owner on 2026-11-10. The Windows launcher is untested.", is replaced with exactly: "The owner ran skytalix in En Croissant on 2026-11-10 through a launcher he made himself, before `bin/skytalix-uci` existed. **These steps, with the launcher in `bin/`, have not been tried in En Croissant.** The Windows launcher is untested." grep "Tested by" README.md is empty.
- G3. nvm: the highest version by numeric order, with QE's command: ls of ${NVM_DIR:-$home/.nvm}/versions/node | sed -n 's/^v\([0-9]*\)\.\([0-9]*\)\.\([0-9]*\)$/\1 \2 \3 &/p' | sort -n -k1,1 -k2,2 -k3,3 | tail -n 1 | cut -d' ' -f4. POSIX. The name-order shortcut comment is gone.
- G4. clone=$(CDPATH='' cd -P -- "$(dirname -- "$self")/.." && pwd -P).
- G2. /usr/bin/node left the first loop; it is now checked after the nvm lookup.
- G5. .cmd: `if exist "%ProgramW6432%\nodejs\node.exe" set "NODE=%ProgramW6432%\nodejs\node.exe" & goto run` comes before the %ProgramFiles% line. The two echo lines now read `>&2 echo skytalix-uci: ...` with no trailing space. Every line still ends in CRLF (cat -A).
- G6. README GUI intro gains "It has been run on Linux only." after the sentence on finding node on macOS and Linux.

Evidence (each run by SE on this host after the last edit, under flock <scratch>/<home>/<repo>/host-test.lock; input uci, isready, quit; "7 lines" = the id, option, uciok and readyok lines, 0 bytes on stderr):
- Minimal PATH, env -i PATH=/usr/bin:/bin, HOME unset: exit 0, 7 lines (node found through the getent HOME and nvm).
- From another directory, by absolute path: exit 0, 7 lines.
- Absolute symlink: exit 0, 7 lines. Relative chain sub/rel-chain -> ../abs-link -> script: exit 0, 7 lines.
- Symlinked bin DIRECTORY, linkdir/skytalix-uci (QE c3e): exit 0, 7 lines; also under the minimal PATH: exit 0, 7 lines.
- Path with spaces, a copy under "dir with spaces/sky clone": exit 0, 7 lines. A symlinked bin dir named "link to bin" in the spaced dir: exit 0, 7 lines.
- Missing node, env -i PATH=/usr/bin:/bin HOME=<scratch>/<home>/<repo>/se312fix/run/emptyhome: exit 127, 0 stdout lines, stderr "skytalix-uci: node not found; install Node.js 22.18 or later, or put node on the PATH".
- Missing build, a copy of bin/ with no dist: exit 1, 0 stdout lines, stderr "skytalix-uci: <scratch>/<home>/<repo>/se312fix/run/nobuild/dist/uci.js is missing; in <scratch>/<home>/<repo>/se312fix/run/nobuild, run npm install, then run npm run build".
- nvm order, scratch HOME with fake nodes v9.11.2, v22.9.0, v22.18.0, v22.2.0, one argument "x y": printed "fake v22.18.0 args=2" (the engine path plus "x y" as one argument).
- dash and bash, each under the minimal PATH: exit 0, 7 lines.
- npm run lint (biome check .): exit 0, "Checked 148 files ... No fixes applied." npm run build: exit 0. Art cmp (README lines 2 to the closing fence against assets/readme-art.txt): exit 0.
- git ls-files -s bin: skytalix-uci 100755, skytalix-uci.cmd 100644.

Not checked: the /usr/bin/node fallback order (G2) was not run, since this host has no /usr/bin/node and none was created; it is read by inspection. shellcheck is absent, NOT RUN. macOS sh and the Windows .cmd (G5 included) remain UNKNOWN - verify; the README now says Linux only.
