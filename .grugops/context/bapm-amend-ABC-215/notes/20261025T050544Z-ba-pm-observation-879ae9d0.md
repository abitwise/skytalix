---
id: 20261025T050544Z-ba-pm-observation-879ae9d0
kind: observation
by: ba-pm
at: 2026-10-25T05:05:44Z
verified_by: 
confidence: high (git reads at da480b78; counts are grep/wc outputs on a scratch copy)
refs:
  - ABC-215
  - ABC-216
  - ABC-214
  - EPIC-008
  - ADR-0048
  - QE-205-c
  - G6
  - plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
  - plans/tickets/ABC-216-a-short-readme-tells-a-first-time-visitor-what-skytalix-is-and-how-to-play-it.md
  - README.md
  - arch-design-ABC-215/20261025T045829Z-architect-design-decision-e04234f4
  - arch-design-ABC-215/20261025T045829Z-architect-design-observation-cbbb9a63
  - bapm-close-ABC-205/20261025T043809Z-ba-pm-decision-84a05b3a
  - grugops/bapm-amend-ABC-215
  - da480b78
supersedes: 
seal: sha256:557b424a7cba15e54cc9de065e42215c0dfe56bec227ae71bb8506c47d418c82
---

# BA/PM re-reads at main da480b78 for the ABC-215 README scope line. Records only

Task `bapm-amend-ABC-215`. Branch `grugops/bapm-amend-ABC-215` from `main` `da480b78`. No npm, no vitest. No
`src/` or `README.md` edit on the branch. Scratch: `<scratchpad>/bapm215/` (the README simulation and the seal script).

- `README.md` at `da480b78` has 88 lines and 8 `## ` headings. Lines 84–86 are the licence sentence that names
  "the evaluation values in `src/evaluate.ts` (CC BY-SA 3.0)".
- Tree-wide `git grep -i -E 'michniewski|by-sa'` outside `.grugops/`, `plans/` and `memory-bank/` hits 3 files:
  `NOTICE` (4 lines), `src/evaluate.ts` (3 lines) and `README.md` (1 line, :86). This matches Architect `…e04234f4`.
  A second grep for `evaluation values|carve-out|carved out` adds no other file.
- No file under `src/` or `tools/` reads the root `README.md`. The `README` hits in `tools/grugops/host-protection.js`
  name the kit's `install/README.md`. So no test pin moves with the sentence.
- Scratch simulation of the amended sentence (a scratch copy, not the branch): `git diff --no-index -U0` gives 1 hunk,
  `@@ -85,2 +85 @@`, because line 84 is unchanged. The result has 87 lines and 8 headings. It has 0
  `michniewski|by-sa|chessprogramming` hits, 1 `four grugops kit files (MIT)` hit, Apache-2.0 named, and the
  `LICENSE` and `NOTICE` links kept. `ABC-216` `A2`, `A7` and `A9` hold.
