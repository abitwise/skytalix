---
id: 20261110T132058Z-software-engineer-observation-6c266484
kind: observation
by: software-engineer
at: 2026-11-10T13:20:58Z
verified_by: 
confidence: high: lint and art cmp run by SE after the last edit; the macOS run is the owner's report, not re-run
refs:
  - se-ABC-314
  - ABC-314
  - grugops/ABC-314
  - 860aaa47
  - README.md
  - assets/readme-art.txt
  - bin/skytalix-uci
  - orch-2026-10-30a/20261110T132002Z-orchestrator-decision-08335f5f
supersedes: 
seal: sha256:ae3f477558ea94c9dd2c854c53facb5ccbf1de716633d84963755ed858fb6abb
---

# se-ABC-314 observation: README.md records the owner's En Croissant run on macOS

Branch grugops/ABC-314 from main 860aaa47. Spec: orch-2026-10-30a/20261110T132002Z-orchestrator-decision-08335f5f (A1, A2). README.md only, the four places the note names:
- En Croissant table row, "Run with skytalix" cell: "On macOS, the owner played one game through `bin/skytalix-uci` (2026-11-10). Not tried on Linux or Windows".
- "It has been run on Linux only." became "It has been run on Linux and macOS."
- Per-OS line: "**macOS:** `<clone>/bin/skytalix-uci`. Run on macOS, in En Croissant."
- En Croissant lead: "On 2026-11-10 the owner followed these steps on macOS with `bin/skytalix-uci` and played one game. **They have not been tried in En Croissant on Linux or Windows.** The Windows launcher is untested." The old sentence about his hand-made launcher was dropped (A1 allows it), so the lead names one run on one date.

Kept: "The Windows launcher is untested.", the Windows per-OS "Untested.", Arena, BanksiaGUI and Cute Chess not-tried statements. No claim about En Croissant on Linux or Windows, or other GUIs on macOS.

Checks, after the last edit:
- npm run lint (biome check .) under flock on the host test lock: exit 0, 148 files, no fixes.
- Art cmp, README lines 2-7 vs assets/readme-art.txt: cmp exit 0.
- node tools/grugops/records-path-check.js --base main --head grugops/ABC-314: see the commit; run after this note was committed.
- Build and tests: not run; README.md only, no src change.

Not checked: GitHub's render of the table; the owner's macOS run itself is taken from his message, not re-run; UNKNOWN - verify.
