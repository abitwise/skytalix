---
id: 20261110T123447Z-software-engineer-observation-6d73c1c6
kind: observation
by: software-engineer
at: 2026-11-10T12:34:47Z
verified_by: 
confidence: high: lint, build, art cmp and link grep run by SE on this host after the last edit; GUI render and non-Linux paths UNKNOWN - verify
refs:
  - se-ABC-313
  - ABC-313
  - grugops/ABC-313
  - 411b2243
  - 42de2ac5
  - README.md
  - assets/readme-art.txt
  - orch-2026-10-30a/20261110T123246Z-orchestrator-decision-fd9fcbd5
supersedes: 
seal: sha256:d1fd768a563ae4afee895a34f529f1fdac6358cdb961f7149313de58e6ed7212
---

se-ABC-313 on branch grugops/ABC-313 from main 411b2243; README commit 42de2ac5. Requirement: orch-2026-10-30a/20261110T123246Z-orchestrator-decision-fd9fcbd5 (A1-A5). Files: README.md only. No src/, no bin/, no test added.

What changed:
- A1. Requirements: "[Node.js](https://nodejs.org/) 22.18 or later." Version text unchanged.
- A2. Top of "Use with a chess GUI": one table, header row "GUI | macOS | Linux | Windows | Run with skytalix | Link". Arena no/no/yes; Cute Chess, BanksiaGUI, En Croissant yes/yes/yes. Links as in the ticket. "Run with skytalix" restates only what the README already said: Arena and BanksiaGUI "Not tried"; Cute Chess "dist/uci.js run directly, on Linux. The launcher has not been tried"; En Croissant "Run by the owner through his own launcher. The launcher in bin/ has not been tried".
- A3. After the intro (kept word for word, including "It has been run on Linux only." and "The Windows launcher is untested."), a list "The launcher to give the GUI, per OS": macOS <clone>/bin/skytalix-uci, "Not run on macOS."; Linux same path, "Run on Linux."; Windows <clone>\bin\skytalix-uci.cmd, "Untested." (bold).
- A4. Headings: "### Arena — Windows", "### Cute Chess — macOS, Linux, Windows", "### BanksiaGUI — macOS, Linux, Windows", "### En Croissant — macOS, Linux, Windows". First line under each: "Site: [<GUI>](<link>)". Every "not tried"/"untested" sentence and the En Croissant owner-launcher sentence kept unchanged. Paths in steps: Cute Chess, BanksiaGUI and En Croissant step 2 now end with a sub-list "macOS and Linux: <clone>/bin/skytalix-uci" / "Windows: <clone>\bin\skytalix-uci.cmd"; Arena step 2 says "the Windows launcher, <clone>\bin\skytalix-uci.cmd".
- Deviation, recorded: BanksiaGUI step 2 had only the Windows path; it now also gives the labelled macOS and Linux path, because its heading names those platforms. The "written for BanksiaGUI 0.58 on Windows ... have not been tried" lead-in is unchanged. Cute Chess step 2 reorders Name/Protocol before Command so the path list ends the step; same fields and values.

Checks, after the last edit, each under flock <scratch>/<home>/<repo>/host-test.lock, one at a time:
- npm run lint (biome check .): exit 0, 148 files, no fixes.
- npm run build (tsc -p tsconfig.build.json): exit 0.
- Art cmp, README lines from 2 up to the closing fence vs assets/readme-art.txt: cmp exit 0.
- Internal links: README has [AGENTS.md], [LICENSE], [NOTICE] only, unchanged; no link anywhere in the repo points at a GUI heading anchor (grep), so the renamed headings break no link.
- Tests: none run; no src change, and no test reads README.md (grep of src for README empty).

Not checked: GitHub render of the new tables (6 columns, long cells); the GUI sites' platform lists today (taken from the ticket); every path on macOS and Windows (not run, as before).
