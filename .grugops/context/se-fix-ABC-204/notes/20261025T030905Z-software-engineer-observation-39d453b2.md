---
id: 20261025T030905Z-software-engineer-observation-39d453b2
kind: observation
by: software-engineer
at: 2026-10-25T03:09:05Z
verified_by: 
confidence: high (each command run by the SE on 2026-10-25 in the worktree and scratchpad; outputs read)
refs:
  - ABC-204
  - EPIC-008
  - ABC-205
  - QE-204-a
  - QE-204-b
  - plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
  - qe-ABC-204/20261025T025833Z-qe-e2e-decision-b5f4d5a1
  - qe-ABC-204/20261025T025833Z-qe-e2e-observation-fbff3e18
  - qe-ABC-204/20261025T030130Z-orchestrator-decision-f9d109ea
  - grugops/se-fix-ABC-204
  - 2c8a84f2
  - 16c51d1c
  - tools/rating/rating.ts
  - tools/rating/dist-manifest.ts
  - 8ccba739
  - 3497aad2
supersedes: 
seal: sha256:f4b397ff18b98869ef18d6d8ec37997d756719416c1ca494d3020799aae1308d
---

# Software Engineer: ABC-204 fix proof. The hash tells the builds apart, the symlink probe goes red to green, and the gates, as they ran

Task `se-fix-ABC-204`, commit `2c8a84f2` on `grugops/se-fix-ABC-204`. Scratch: `<scratchpad>/se204fix/`. No engine game was played and no reading was run. The only engine process that could have started is the base probe's Stockfish `uci` handshake (the probe killed the run at its first write). At head the harness never ran past its guard.

## QE-204-b: hash proof
- 3 scratch builds, made with the harness's own steps (`git clone --no-checkout`, `git checkout <sha>`, `npm ci`, `npm run build`): `8ccba739` once, and `3497aad2` twice in separate clones. `npm ci` ran with `--ignore-scripts`. The package has no install or prepare script, and the build is `tsc -p tsconfig.build.json`. All 3 rc 0.
- Run on each build: `artifactRecord` and `distManifest` from `tools/rating/dist-manifest.ts` at this tip (`<scratchpad>/se204fix/scripts/hash-proof.mts`, output `hash-proof.txt`):

| build | old `dist/uci.js` sha256 | new tree sha256 | files |
|---|---|---|---|
| `8ccba739` | `877e9595…b98d` | `3798b8d19fa7e5917a12f0eee61b7243f8d47021a042ae6a67fc81d73d6ebffc` | 22 |
| `3497aad2` (A) | `877e9595…b98d` | `726e52257d0eb6fa87ccaf1581ec22ba8eab8fce1eb8fbd3ef45e89adcae1ce4` | 22 |
| `3497aad2` (B) | `877e9595…b98d` | `726e52257d0eb6fa87ccaf1581ec22ba8eab8fce1eb8fbd3ef45e89adcae1ce4` | 22 |

- **The two different engines now print different hashes**, where the old line printed equal ones. **The two identical builds print equal hashes.** Both tree values equal QE's by-hand manifests (`3798b8d1…` and `726e5225…` in `qe-ABC-204/…fbff3e18`). The shell pipeline gives the same 3 values.
- The printed block for `3497aad2` is a header line, then 22 manifest lines from `./apply.js` to `./zobrist.js`, with `./uci.js` at `877e9595…`.

## QE-204-a: symlink probe (`<scratchpad>/se204fix/scripts/probe.sh`)
- Setup: an empty directory inside the worktree, and a scratch symlink `out-link` to it. Then `node tools/rating/rating.ts r HEAD <scratch>/out-link`. The probe stops the run as soon as anything appears inside the checkout, and removes the directory afterwards.
- **Red at base** (the `16c51d1c` `rating.ts`, put back for the probe and then restored, `cmp` equal to the fix): the guard let it through. The run wrote `host.log` inside the checkout before the probe killed it (rc 143). No clone began.
- **Green at head:** rc 1, `Error: <probe>/out-link is inside <worktree>`, and nothing was written inside the checkout.
- No over-refusal: a real outside directory and a symlink to an outside directory both pass the guard and stop at the next check, `… is not empty` (both were seeded with one file, so nothing ran).
- `git status` was clean apart from the fix after the probes.

## Gates in the worktree (own `npm ci --ignore-scripts`, rc 0)
- `npm run lint` rc 0 (`Checked 128 files … No fixes applied.`), `npm run typecheck` rc 0, `npm run build` rc 0. `dist/` holds 22 files and no `tools/` file.
- `npm test` rc 0: 62 files, 2073/2073 passed. **Duration 9.55 s**. `.test-results/last-run.json`: success true, 2073 passed, 0 failed, 0 pending, 0 todo. The file count is 62, as on base.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, rc 0.
- Two other SE hops (ABC-216 and ABC-217) ran on the host on their own branches at the same time. Timings are not readings.

## Owed
- **QE:** a short re-check of QE-204-b and QE-204-a at this tip. No readings: the fix changes recording, not play.
- **Orchestrator:** merge `grugops/se-fix-ABC-204` into the ABC-204 line, and decide whether the page's harness sha256 line gains the new values. Board and trace belong to the Orchestrator.
