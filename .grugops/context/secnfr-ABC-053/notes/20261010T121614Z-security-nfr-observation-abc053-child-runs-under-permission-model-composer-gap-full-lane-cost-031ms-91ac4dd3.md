---
id: 20261010T121614Z-security-nfr-observation-abc053-child-runs-under-permission-model-composer-gap-full-lane-cost-031ms-91ac4dd3
kind: observation
by: security-nfr
at: 2026-10-10T12:16:14Z
verified_by:
confidence: high
refs:
  - ABC-053
  - ABC-041
  - ABC-043
  - ABC-054
  - ADR-0029
  - ADR-0030
  - ADR-0035
  - NFR-002
  - N8-LANE
  - N8-SPAWN
  - V1.2.5
  - V1.3.2
  - V5.3.2
  - src/history-pane.nfr.test.ts
  - src/render-seam.test.ts
  - src/cli.ts
  - .grugops/context/secnfr-ABC-053/probe/perm-plant.mjs
  - .grugops/context/secnfr-ABC-053/probe/perm-run.sh
  - .grugops/context/secnfr-ABC-053/probe/perm-run.out.txt
  - .grugops/context/secnfr-ABC-053/probe/perm-denials.out.txt
  - .grugops/context/secnfr-ABC-053/probe/composer-plant.py
  - .grugops/context/secnfr-ABC-053/probe/composer-run.out.txt
  - .grugops/context/secnfr-ABC-053/probe/composer-reds.out.txt
  - .grugops/context/secnfr-ABC-053/probe/cost.sh
  - .grugops/context/secnfr-ABC-053/probe/cost.tsv
  - .grugops/context/secnfr-ABC-053/probe/cost.score.txt
  - .grugops/context/secnfr-ABC-053/probe/cost-twin.txt
  - .grugops/context/secnfr-ABC-053/probe/rescore.mjs
  - .grugops/context/secnfr-ABC-053/probe/rescore-engineer-set2.out.txt
  - 20261010T120534Z-qe-e2e-observation-abc053-clause-d-for-security-nfr-7f43accf
  - 20261010T120534Z-qe-e2e-observation-abc053-gap-register-a4b293d2
  - 20261010T120534Z-qe-e2e-observation-abc053-ledger-rebuilt-and-qe-mutants-594c5d57
  - 20261010T115422Z-software-engineer-observation-abc053-gates-ledger-controls-cost-3a8f5aa3
supersedes:
---

# `ABC-053` Security/NFR readings: the probe child passes under Node's permission model with no write, net, child or worker grant; QE-053-a ships green on the FULL default lane; the entry point's wiring is pinned; the narrow-set cost is +0.031 s CPU (R 0.035 s)

This note is hand-authored and unsealed. It holds readings. The rulings are in the decision note
`…8deff3d6`.
- Under review: `e15eb31d..218677eb` on `grugops/ABC-053-frame-path-per-frame`. The code commit is
  `c9509031`.
- Every build ran in a fresh `git archive` copy in this hop's scratchpad. No byte of the worktree
  was planted.
- Machine: Apple M3, Darwin 25.5.0, Node v26.11.0.
- QE (`ABC-087`, deep lane) and Security/NFR (catalog) ran in parallel, so load1 is in every row.

## R1. Clauses (a), (b), (d): read from git at `218677eb`

- `git diff --name-status e15eb31d..218677eb -- src/`: `M src/history-pane.nfr.test.ts`,
  `M src/render-seam.test.ts`. Numstat is +124/−52 and +6/−6.
- (a): `package.json` / `package-lock.json` numstat is empty. `jq 'has("dependencies")'` is `false`.
- (b): 0 non-`.test.ts` paths under `src/`.
- (d): the second path is `src/render-seam.test.ts`. That file's three hunks are a header sentence,
  a test title, and one assertion. The assertion was re-pointed from a membership check on
  `FRAME_PRODUCERS` to an exact-line match on `COMPOSITION_ROOT`. The `LICENSED_DRIVERS` assertion
  and the `declaredList` helper are unchanged.
- The two files' Node imports are byte-identical at base and head:
  - `spawnSync` from `node:child_process`;
  - `readdirSync` and `readFileSync` from `node:fs`;
  - and, inside the child string, `registerHooks` from `node:module` and `writeSync` from `node:fs`.
- A grep for spawn, exec, fork, fetch, `node:net`/`http`/`dgram`, `writeFile`, `appendFile`,
  `createWriteStream`, `mkdir`, `rmSync`, `unlink` and `Worker(` gives **2 at base and 2 at head**.
  Both are the `spawnSync` import and its one call.

## R2. Clause (c), measured rather than read: the child runs under Node's permission model (`perm-run.out.txt`)

- **The plant:** `perm-plant.mjs` adds `--permission --allow-fs-read=<tree>/src/*` to the probe
  child's argv and grants nothing else. It grants no `--allow-fs-write`, `--allow-net`,
  `--allow-child-process`, `--allow-worker`, `--allow-addons`, `--allow-wasi` or
  `--allow-inspector`.
- Each control adds one capability use to the child just before `const perFrame = seen();`.
- Run: `node node_modules/vitest/vitest.mjs run src/history-pane.nfr.test.ts -t "NOWHERE ON THE FRAME PATH"`.

| tree | exit | load1 | result |
|---|---|---|---|
| base `e15eb31d`, permission model | 0 | 3.37 | 1 passed |
| **head `218677eb`, permission model** | **0** | 3.50 | **1 passed: both phases, the frames, and the arming** |
| head + `writeFileSync` in the child | 1 | 3.50 | `ERR_ACCESS_DENIED`, `permission: 'FileSystemWrite'` |
| head + `fetch("http://127.0.0.1:65530/")` | 1 | 3.55 | `ERR_ACCESS_DENIED … Use --allow-net`, `permission: 'Net'` |
| head + `spawnSync("/usr/bin/true")` | 1 | 3.50 | `ERR_ACCESS_DENIED`, `permission: 'ChildProcess'` |
| head + `readFileSync("/etc/hosts")` | 1 | 3.50 | `ERR_ACCESS_DENIED`, `permission: 'FileSystemRead'` |

- **My first network control was invalid, and it is recorded.** It fetched port 9, and the child
  failed with undici's `bad port`, not with a permission denial. The `net2` row above uses port
  65530.
- Without `--permission`, the same fetch fails `ECONNREFUSED`. With it, the fetch fails
  `ERR_ACCESS_DENIED`. So the denial is the permission model's.
- **What this establishes:** the delivered child runs both new phases and the arming with no
  capability beyond reading `src/` and writing an fd it inherited (fd 3). Each control shows the
  instrument is armed for that capability.
- **Bound, stated:** the plant changes the child's argv. It shows what the unplanted child *needs*.
  It does not sandbox the delivered child, which runs with full rights like every test process.

## R3. QE-053-a on the full default lane (`composer-run.out.txt`, `composer-reds.out.txt`)

QE ran its two builds on the two `ABC-053` files only. These builds ran `biome check .`,
`tsc --noEmit`, and **all 51 files** (`vitest run`).

| build | lint | tsc | full lane | load1 | the red |
|---|---|---|---|---|---|
| `S-REEXPORT`: `cli-options.ts` re-exports `assembleFrame`; `glyph-mode.ts` binds it from there | 0 | 0 | **1** | 10.3–10.8 | `cli.test.ts` `ABC-042` `A6(i)`: `bare literal ./frame.ts` in the resolver |
| `S-DYNAMIC`: `cli-options.ts` binds it through `import("./frame.ts")` | 0 | 0 | **1** | 9.8 | `A6(i)`, plus `ABC-042` bar 1: `cli-options.ts contains import(` |
| **`S-REEXPORT-RS`**: the same re-export, hosted in `result-screen.ts` | 0 | 0 | **0, 1582/1582** | 7.9–8.1 | **none** |
| **`S-DYNAMIC-RS`**: the same dynamic bind, hosted in `result-screen.ts` | 0 | 0 | **0, 1582/1582** | 7.5 | **none** |
| `S-WRAP-CLI`: the entry point wraps the seam with a per-frame `gameStatusOf(h)` | 0 | 0 | **1** | 10.8–11.3 | `cli.test.ts` `ABC-043` `A1`: the pinned `render: makeRenderSeam(mode, orientation)` |

- **QE-053-a is real on the whole default lane.** Its spelling in QE's builds was caught only
  because `cli-options.ts` carries text guards of its own (`ABC-042` `A6(i)`, bar 1). That is an
  accident of the host module. In `result-screen.ts`, with no such guard, both spellings pass
  lint, typecheck and every test.
- **What bounds the consequence:**
  - The live frame path is wired at one line of the entry point.
  - That line is pinned textually (`ABC-043` `A1`).
  - A wrapper that adds a per-frame derive there is RED (`S-WRAP-CLI`).
  - So a second composer, however it is spelled, reaches the live loop only through a red edit of
    that pin, or through an edit to `turn-loop.ts`. `turn-loop.ts` is a licensed driver and already
    holds a value import from `./frame.ts`.
- **The production tree today holds 0 such spellings.** This grep is empty at `218677eb`:
  `grep -rnE 'export[^;]*from "\./frame\.ts"|import\(\s*["'"'"'\x60]\./frame' src --include='*.ts' | grep -v '\.test\.ts'`.
  The only value importers of `./frame.ts` are `render-seam.ts` (`assembleFrame`) and `turn-loop.ts`
  (`beginFrameSession`).
- **Why `ADR-0030`'s "fails safe" does not carry over.** `ADR-0030` decision 2 excludes `export …
  from` on purpose. For `A8`, an under-count reds a claim that a module is consumed, and that fails
  safe. The `ABC-053` tripwire is an **equality against a one-member set**, so the two directions
  of under-count differ:
  - Under-counting the root gives `[]`, which is RED. That fails safe.
  - Under-counting a **second** composer leaves it at `[root]`, which is GREEN. That fails open.

  So the definition the build correctly borrowed from `ADR-0030` fails open in exactly the
  direction the tripwire exists to close.

## R4. Cost, independent narrow set (`cost.sh`, `cost.tsv`, `cost.score.txt`)

- **Set:** `src/history-pane.nfr.test.ts` + `src/render-seam.test.ts`.
- **Trees:** base `e15eb31d`, head `218677eb`, and a twin, a second `git archive e15eb31d`.
- **Method:** `node node_modules/vitest/vitest.mjs run <set>`, one fresh process per run.
  CPU = user + sys (bash `time`). 9 rounds, arm order rotated, round 0 discarded, counts asserted
  (22 / 23 / 22), load1 logged before every run.
- **Twin check:** `/usr/bin/diff -r` against base is identical (`cost-twin.txt`). The script's own
  in-run check called a shell `diff` that resolves to `git diff` here and printed usage text. The
  identity was re-checked with `/usr/bin/diff` after the run. The script in `probe/` now calls
  `/usr/bin/diff`.
- **n = 8, k = 2, load1 median 6.74 (6.44–6.88):**
  - twin − base: **−0.004 s (−0.29 %), sign 3/8, interval −0.018..+0.035, R 0.035 s**. This is
    admissible under the catalog rule.
  - **head − base: +0.031 s CPU (+2.25 %), sign 6/8, interval −0.010..+0.059.**
  - wall: head +0.011 s; twin R 0.013 s.
- **The Engineer's set 2, re-scored from his TSV by this hop's `rescore.mjs`**
  (`rescore-engineer-set2.out.txt`): +0.008 s, R 0.052 s (twin), interval −0.023..+0.068. These
  are his figures exactly.
- **The two readings agree:**
  - The Engineer's median sits inside this interval.
  - This median matches `ADR-0029`'s estimate of about +30 ms.
  - The worst upper end of either is **+0.068 s**.
- **Spawn account:** `spawnSync(` 1 → 1, and the child count is 1 → 1. `N8-SPAWN` is charged by
  child count, so it moves by 0.
- **Floor account:** 0 files added.

## R5. Not re-run here, and why

- **The `ADR-0029` ledger, `A3b`, and QE's 40 builds:** QE rebuilt them with its own spellings
  (`…594c5d57`). This hop re-ran none of them. QE-053-e's two controls are taken as QE measured
  them.
- **The gate:** QE's gate run at `57251578` stands (`…928ba81f`). Commit `218677eb` adds only QE's
  notes and trace row on top of it, so the `src/` bytes are the same.
