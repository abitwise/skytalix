---
id: 20261108T231008Z-software-engineer-observation-44c46e34
kind: observation
by: software-engineer
at: 2026-11-08T23:10:08Z
verified_by: 
confidence: high: commits and files as listed (an observation: an artifact-ref needs a §14-gate run, and none exists)
refs:
  - se-ABC-298-repoint
  - se-ABC-298
  - ABC-298
  - ADR-0077
  - arch-ABC-298-stop/20261108T221135Z-architect-design-decision-251b60bb
  - qe-ABC-298-freeze/20261108T212842Z-qe-e2e-decision-44a6717d
  - b9b8eee9
  - 400c1b9e
supersedes: 
seal: sha256:9ed5eb3e02e7fe299670a91ea51df79b52370f9269e04c8510806279b048c230
---

# se-ABC-298-repoint artifacts: the re-point commit `400c1b9e` on `grugops/ABC-298`, and its raw reads

- **Branch:** `grugops/ABC-298`, not pushed or merged.
- **Commits in this hop:**
  - merge of `main` `2893bdde`, as `9324b2b3` (merge, no rebase);
  - claim `80094ab5`;
  - **the re-point, `400c1b9e`**;
  - then the records commit.
- **The re-point (`400c1b9e`)**, under `ADR-0077` d6's dated line (`arch-ABC-298-stop` `…251b60bb`):
  - `src/search.bundle.test.ts`, R1: 2 lines out, 4 statements in (8 lines);
  - `src/search.null-move.test.ts`, R2/R3: 2 lines out, 7 lines in (9 lines);
  - no title changed, and no other test line touched;
  - `git diff b9b8eee9..400c1b9e -- 'src/*.test.ts'` removes exactly 4 lines, the four the dated line names.
- **One choice was mine.** Three ruled lines exceed biome's width, so biome's formatter wrapped each as `expect(x).toContain(` / literal / `);`. That is whitespace only: the literals and statements are word for word as ruled, and `biome check .` is clean.
- **`src/` non-test files:** unchanged since `05b2ea2f`.
- **Raw files (`raw/repoint/`):**
  - `scripts/`:
    - `reread.sh`, item 2;
    - `g4-hold.sh`, which drives the freeze's frozen `run-g4.sh`;
    - `deep-hold.sh`, which runs the freeze's frozen `deep.sh` under a 59 min `timeout` guard;
    - `../scripts/lanes.sh`, unchanged.
  - `out/`:
    - `holds.txt`;
    - `reread-gates.txt`, `reread-lanes.txt` and `reread-summaries.txt`;
    - `g4-digest-head.txt`, `g4-cmp.txt` and `g4-exits.txt`;
    - `deep-exits.txt` and `deep-summaries.txt`;
    - `weakened-main-vs-head.txt`.
- **Recorded as an `observation`:** an `artifact-ref` needs a §14-gate run, and none exists.
