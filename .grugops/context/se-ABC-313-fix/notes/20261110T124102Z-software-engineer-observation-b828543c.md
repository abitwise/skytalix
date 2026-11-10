---
id: 20261110T124102Z-software-engineer-observation-b828543c
kind: observation
by: software-engineer
at: 2026-11-10T12:41:02Z
verified_by: 
confidence: high: lint, art cmp and records check run by SE after the last edit; Arena Linux build and GUI render not run, UNKNOWN - verify
refs:
  - se-ABC-313-fix
  - ABC-313
  - grugops/ABC-313
  - c71ee1ae
  - 1c49d030
  - README.md
  - assets/readme-art.txt
  - qe-ABC-313/20261110T123920Z-qe-e2e-decision-280e26cc
  - qe-ABC-313/20261110T123846Z-qe-e2e-observation-eee52bf3
  - se-ABC-313/20261110T123447Z-software-engineer-observation-6d73c1c6
  - orch-2026-10-30a/20261110T123246Z-orchestrator-decision-fd9fcbd5
supersedes: 
seal: sha256:8695f8d492365f0ed538d226079646b13739ff174f4249534e7938a676dd3cdd
---

# se-ABC-313-fix observation: QE G1 and G2 applied to README.md

Branch grugops/ABC-313. Merged grugops/qe-ABC-313 (558aaa74, QE records only) with --no-ff as 7bc63d17. README commit 1c49d030 on top. Input: qe-ABC-313/20261110T123920Z-qe-e2e-decision-280e26cc (FAIL, G1 blocking). The orchestrator corrected the spec: Arena runs on Linux and Windows; fd9fcbd5's "Arena — Windows" was wrong.

What changed, README.md only:
- G1. Table row: `| Arena | no | yes | yes | Not tried | [playwitharena.de](http://www.playwitharena.de/) |`. Heading: `### Arena — Linux, Windows`. Lead-in kept word for word ("These steps are written for Arena 3.5.1 on Windows. **They have not been tried in Arena.**"), followed by the new line "Arena for Linux is a separate download, 3.10beta." Step 2 now names the engine `skytalix`, then lists the launcher per OS: Linux `<clone>/bin/skytalix-uci`, Windows `<clone>\bin\skytalix-uci.cmd`.
- G2. Cute Chess macOS cell: `yes, built from source`.
- G3: no fix asked; none made.
- No link anywhere in README.md points at an Arena heading anchor (grep), so the renamed heading breaks no link.

Checks, after the last edit:
- npm run lint (biome check .) under flock on the host test lock: exit 0, 148 files, no fixes.
- Art cmp, README lines 2-7 vs assets/readme-art.txt: cmp exit 0.
- node tools/grugops/records-path-check.js --base main --head grugops/ABC-313: clean, exit 0.
- Build and tests: not run; README.md only, no src change.

Not checked: Arena on Linux (3.10beta) with the launcher, and GitHub's render of the table; UNKNOWN - verify.
