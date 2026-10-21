---
id: 20261021T182104Z-qe-e2e-observation-dfb6a6c3
kind: observation
by: qe-e2e
at: 2026-10-21T18:21:04Z
verified_by: 
confidence: high (own runs at f33eb318 and 0222d54d, private env, scratch clones)
refs:
  - ABC-193
  - grugops/ABC-193
  - grugops/qe-ABC-193
  - 3d734fa1
  - 63eadabe
  - e6f91f1d
  - 6b83874c
  - 47a3c9a1
  - f33eb318
  - 0222d54d
  - AR-191-GITENV
  - AR-191-QUOTEPATH
  - ADR-0036
  - ADR-0036 S1
  - plans/tickets/ABC-193-git-config-or-environment-can-blind-clause-bs-one-diff-call-and-a-non-ascii-production-file-goes-unseen.md
  - V1.2.5
  - NFR-008
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - 341da4c1
  - 11245e3d
supersedes: 
seal: sha256:ad2739d71086d9cc8e4705682fea694c1a78fed6e5b5a5289e7032750cafb5ac
---

# ABC-193 QE criteria A1–A9, read by my own runs before opening the Architect's notes: all met

Scope and risks: the page's `## Scope` and `## Security / NFR triggers` are authoritative. This note restates neither.

**Where I ran.**
- Worktree `../wt-qe-ABC-193`, branch `grugops/qe-ABC-193`, from the tip `3d734fa1`.
- First merge: `main` `a4561a26` at `f33eb318`, with no conflict.
- `main` then moved to `c4bce2b1` (`ABC-192` merged at `7a2ec8bc`). Second merge at `0222d54d`. Every criterion below holds at both merges.
- The environment: a private `HOME`, `TMPDIR` and `GIT_CONFIG_GLOBAL` (an empty file), `GIT_CONFIG_NOSYSTEM=1`, and `GIT_EXTERNAL_DIFF`, `GIT_CONFIG_COUNT`, `GIT_CONFIG_PARAMETERS` and `GIT_DIFF_OPTS` unset. Scratch: `…/scratchpad/qe193/`.
- Base instrument: `git show 47a3c9a1:<instrument path>`, sha-256 `d3abb8478f9e372e…`. That equals `05f764cb`, `837e8b22` and `11245e3d`. Head is `2c0c1985e6607110…`. A `node_modules/typescript` link sits beside every copy.

**A1 met.**
- `git diff --name-only main...HEAD` lists the four Scope files plus the two Architect notes, and nothing else.
- The owner's waiver form (`git -c core.quotePath=false diff --name-only … | grep -v '\.test\.ts$' | grep '^src/'`) prints nothing, rc 1, in each of these places:
  - over `47a3c9a1..3d734fa1`;
  - for each of `e6f91f1d`, `63eadabe`, `6b83874c` and `3d734fa1`;
  - for each merge, against its first parent and against `main`.

**A2 met** (run first). `bash r2-mutants.sh <wt> <tip> <scratch> <base copy>` gives:
- rc 1;
- `limb 1 MISMATCH: G-COLOR G-EXT G-ENV G-DRV G-PFX QU QE2`;
- DIFFER on exactly those 7 rows × `limb2`/`limb3` (14 limbs);
- `ok` and `identical` on the 12 old rows and `ADD`;
- `(b1) capability: 0` and `holder files with changed lines (+ or -): 0` on each route row and on `QU` and `QE2`.

**A3 met.** Copies of head's instrument, each with one part removed (each diff checked to be that one edit):

| copy | rc | limb 1 MISMATCH | DIFFER |
|---|---|---|---|
| no `-c core.quotePath=false` | 1 | `QU QE2` | their 4 limbs |
| no four flags | 1 | `G-COLOR G-EXT G-ENV G-DRV G-PFX` | their 10 limbs |
| no `--no-color` | 1 | `G-COLOR` | its 2 limbs |
| no `--no-ext-diff` | 1 | `G-EXT G-ENV G-DRV` | their 6 limbs |
| no both prefixes | 1 | `G-PFX` | its 2 limbs |
| no `--dst-prefix=b/` | 1 | none | `G-PFX:limb2 G-PFX:limb3` |
| no `--src-prefix=a/` | 0 | none | none |
| no (c), the quoted rule (mine) | 0 | none | none (no harness row is C-quoted) |

**A4 met.**
- rc 0, `20 of 20`. Every verdict and every Ruling 2 list matches the page's table, and limbs 2/3 are `identical` to the named reference on every row.
- The 12 old rows are byte-identical to base's run on the same tip: 83 lines, header aside.
- Afterwards the clone holds only `core.*`, `remote.*`, `branch.*` and `user.*` keys, and `.git/info/` holds only `exclude`.
- `git status --porcelain` is empty, and `HEAD` is unchanged. The only ref that moved during my run was `grugops/qe-ABC-192`, which is the other QE hop's own commit, not the harness.
- My run equals the committed `r2-mutants.out.txt` once 8-hex ids are masked.
- A mutated harness copy whose route-off step leaves `color.*` in place exits **2**, with the leftover-route message. So the guard bites.

**A5 met.**
- `ADD` and each route row print `(b1) capability: 1` and `src/fen.ts  (fired by Ruling 2: 2 + lines, 0 - lines; holds limb 1 at <head>)`.
- `QU` and `QE2` print the same with `src/qé.ts` unquoted.
- Limb 3 FIRES on `ADD`, the five route rows and `QE2`, and does not fire on `QU`.

**A6 met** (by hand, in my own scratch clones).

`PFX-X1`, with clone-local `diff.srcPrefix=x/`/`dstPrefix=y/`, on limb 1:

| copy | Ruling 2 line | other output | limb 1 |
|---|---|---|---|
| head | `src/book-file.ts  (fired by Ruling 2: 1 + line, 3 - lines; holds limb 1 at <base>)` | — | FIRES |
| base | none | `production files changed: 0` | does not fire |
| no `--src-prefix=a/` | `1 + line, 0 - lines` | — | FIRES |
| no `--dst-prefix=b/` | `0 + lines, 3 - lines` | `production files changed: 0` | FIRES |

The C-quoted plants, on limbs 1 and 3:

| plant | head | base | no-(c) copy |
|---|---|---|---|
| `CQ1` | `FIRES (disputed: unresolved, the fail-safe)`, dispute line `"src/q\"t.ts" (C-quoted by git; not read)` | does not fire | does not fire |
| `CQT` | the same, `"src/q\tt.ts"` | does not fire | does not fire |
| `CQ2` | the same, `"src/q\"t.ts"` | does not fire | does not fire |
| `CQS` | does not fire, and no line names `q"t` | does not fire | does not fire |

**A7 met.** With a logging git shim on `ADD`, limb 1:
- Head: 87 calls, and all 87 begin `-c core.quotePath=false`. Exactly one `diff`, with argv `-c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <head> -- src`.
- Base: 87 calls, 0 with the `-c`, and one `diff`.
- The call is still `execFileSync("git", [array], {encoding, maxBuffer})`, with no `shell` option (`V1.2.5`).

**A8 met.**
- `git diff -U0 main...HEAD -- ADR-0036-…` has one hunk, `@@ -518,0 +519,34 @@`: 34 `+` lines and 0 `−`.
- The block is headed `#### Git config, environment and quoted names no longer steer clause (b) — 2026-10-21 (ABC-193)`, after the `ABC-191` block. It states (i)–(v) and a rollback sentence.
- It is consistent with the code:
  - `63eadabe` is the instrument commit;
  - `11245e3d`'s instrument is base's;
  - the dispute line it quotes is the one head prints.
- The GITENV stand-in it retires checks five things. Head covers each of them: the harness rows, plus my `color.ui`, `GIT_CONFIG_COUNT`/`PARAMETERS` and global-attributes routes (see the routes note). So the retirement claims no more than the instrument covers.
- Two text points are INFO, not against A8: `QE-193-c` and `QE-193-d` in the verdict note.

**A9 met.**
- At `f33eb318`, `npm test` gives 59/1992, the base count at that merge.
- At `0222d54d`: 59/1994, which is `ABC-192`'s merge count. `src/` and `biome.json` equal `main`'s.
- Details in the gates note.
