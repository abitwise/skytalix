---
id: 20261103T150937Z-software-engineer-observation-0bad1e32
kind: observation
by: software-engineer
at: 2026-11-03T15:09:37Z
verified_by: 
confidence: high (every row run under the host lock and read as printed)
refs:
  - ABC-277
  - EPIC-011
  - se-ABC-277
  - grugops/ABC-277
  - 861de9c5
  - ADR-0049
  - sec-host-paths/20261103T144802Z-security-nfr-decision-72b4070b
  - SEC-HP-1
  - SEC-HP-2
  - SEC-HP-3
  - SEC-177-1
  - QE-274-d
  - NFR-008
  - tools/grugops/records-path-check.js
  - tools/grugops/records-path-check.proof.js
  - memory-bank/70-runbook.md
  - memory-bank/40-contributing.md
  - memory-bank/45-standing-rulings.md
  - .gitignore
supersedes: 
seal: sha256:a2d0de427b70dda848a0616b2f80c5fdd47aede528f993cc3ccb389a118752dd
---

# SE acceptance as run for ABC-277 (code commit 861de9c5, base main b62e8049): A1–A6 MET, A7 skipped (no owner answer)

All runs were under the host lock (`flock <scratch>/host-test.lock`).

## Proof
- **Command:** `node --test tools/grugops/records-path-check.proof.js`.
- **Result:** 18 tests, 18 pass, 0 fail, 0 skipped, about 0.3 s.

## Acceptance rows
- **A1 MET.**
  - The `hits` branch exits 1 and prints exactly 16 `line N:` hits: 5 classes × 3 paths, plus the `.gz`. It also prints the slug-named folder as `(file path)`, with the slug shown as `<home-slug>`.
  - None of the 6 planted value strings appears in stdout or stderr.
  - The CLI, spawned with no seam, exits 1 on the same branch and leaks none of the values.
- **A2 MET.** All five cases exit 0, each printing `records-path-check: clean`:
  1. `same`: no change from main.
  2. `legacy-touch`: a clean line added to a file whose base already holds a planted line.
  3. `rename`: a pure rename of a planted text file and of a planted `.gz`.
  4. `outside`: planted lines under `tools/` and `src/` only.
  5. `placeholders`: placeholder lines only.
- **A3 MET.**
  - On `grugops/ABC-277` at `861de9c5`, the real check exits 0 (clean).
  - `--head main` on main as it is today exits 0.
  - An orphan branch (no merge base) exits 2 with one stderr line.
  - A directory outside any repository (`GIT_CEILING_DIRECTORIES`) exits 2 with one stderr line.
  - A bad argument exits 2.
- **A4 MET.** `memory-bank/70-runbook.md` § Before a merge into main and `memory-bank/40-contributing.md` § Conventions each name:
  - the command;
  - exits 0, 1 and 2;
  - that the Orchestrator runs it before each merge into `main`;
  - that a finding blocks the merge until a placeholder replaces the value.
- **A5 MET.** `memory-bank/45-standing-rulings.md` gets one dated entry under a new `## Dated entries (2026-11-03)` section:
  - the five classes and the eight placeholders;
  - `$HOME` and environment variables for scripts;
  - foreign processes logged as count and class (`SEC-177-1`);
  - the hostname exemption, in words;
  - its sources, cited: `ADR-0049` D4 and `…72b4070b`.
- **A6 MET.**
  - `npm run lint`: clean (138 files).
  - `npm run typecheck` and `npm run build`: clean.
  - `npm test`: 66 files, 2566/2566 passed.
  - `node tools/grugops/lane-inventory.js`: 66 collected = 66 tracked, no findings.
  - `git diff --name-only b62e8049 861de9c5 -- src/ data/ vitest.config.ts`: 0 lines.
- **A7 SKIPPED.** The owner has not answered SEC-HP-2.

## Positive controls on real history (only classes and counts were read; no value was printed)
- `--base 14912a02~1 --head 14912a02`: the SEC-HP-2 file `se-ABC-262/raw/gates/summary.txt` line 5 hits `home-path` and `foreign-argv`.
- `--base HEAD~40` (281 record files): exit 1, 62 findings (26 home-path, 18 home-slug, 18 scratch-path). A grep of the output for the home, slug and scratch strings gives 0 hits.

## NFR readings
- **Speed:** 155 ms over 281 changed record files, against the ≤ 10 s bar at ≤ 200 files.
- **`NFR-008`:** 0 lane rows. The lane is 66 files before and after, because the `.proof.js` is not collected.
