---
subtask: qe-ABC-198
role: qe-e2e
ticket: plans/tickets/ABC-198-four-new-dev-only-advisories-on-vitest-4-1-11-and-vite-7-3-6-and-an-in-range-lock-bump-clears-them.md
ref: .grugops/context/qe-ABC-198/
branch: grugops/ABC-198 (tip ef1d5ebc; lock a42f4bbb; re-pin d1a175f5; base 4952425a); worktree ../wt-ABC-198 (read only)
width: 2 (beside security-nfr-ABC-198, records only)
---

# QE gate for ABC-198: in-range lock bump (vitest family 4.1.12, vite 7.3.7) and one test literal re-pinned. A1–A7 are yours, including the A7 socket probe. **One open item has priority: an unexplained intermittent failure**

## Do
- Create your own worktree `../wt-qe-ABC-198` on `grugops/qe-ABC-198` from the tip. **Merge the current `main` into it first** (a merge, not a rebase) and report the sha. Install its own `node_modules` with `npm ci --ignore-scripts` inside the worktree. Never symlink main's, and never run npm in main's checkout.
- Verify A1–A6 with your own runs **before** opening the SE's notes (`…59297619`, `…f4334765`, `…240b63df`, `…7e9699c3` on the branch). A2: compare the audit set pair by pair (not the count) on fresh clones of base and tip.
- **The intermittent failure, first priority.** The SE saw 1 of 5 head runs of `npm test -- --coverage --coverage.thresholds.lines=100` with one red row, `src/engine.test.ts` `ABC-170 A2` (`describe` at line 1265, "maxNodes aborts, and the last COMPLETED iteration is played"), and lost the log. Base was 3 of 3 clean. Find out whether this is a flake that pre-exists on base (timing-, load- or coverage-sensitive) or something the 4.1.12 runner introduced:
  - read the row and say what it depends on;
  - run it repeatedly at base and at head, one-file and in that coverage form, with enough runs on each side to tell them apart (state N and the rate), keeping every log;
  - note the host load during the runs.
  If it is a pre-existing flake, say so with the evidence and propose a route. If head-only, that is a FAIL against A5.
- **A7:** a plain `npm test` opens 0 listening sockets across `run-bounded.js` → vitest → its workers. Prove the probe can fail with a planted listener in a scratch copy.
- Gates at your merge: lint, typecheck, build; `npm test` + `last-run.json` success (60 / 1995, names equal to base); skip-count capture as spelled → `test-skip-integrity.js`; `CLI_DEEP`, `UCI_DEEP`, `PERFT_DEEP`. Heap 128 multi-file, 400 one-file. No timing claims.
- UAT waiver form must print nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register (`QE-198-x`).

## Fences
- Work only in `../wt-qe-ABC-198` and scratch clones in your scratch area. Commit typed notes inside your worktree (context root `../wt-qe-ABC-198/.grugops/context`) and a `## QE` section on the ABC-198 page there.
- No edits to `package*.json` or `src/` on the tip, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, other pages. Do not touch other worktrees or main's `node_modules`. Never set git config. Never push, `--force`, `--amend` or rebase; never merge into `main`. Temp files in your scratch area, not `/tmp`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-198`). Every `at` from `date -u`. Include a `kind: decision`. Append-only.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/qe-ABC-198.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.

## Result

**PASS_WITH_GAPS.**
- A1–A7 are met on my own runs.
- Gaps: `QE-198-a` LOW (proposed), `QE-198-b` LOW/INFO, `QE-198-c` and `QE-198-d` INFO. None is against a criterion.
- Branch `grugops/qe-ABC-198` @ **`981c2bff`** (worktree `../wt-qe-ABC-198`, cut at the tip `ef1d5ebc`).
- **My merge of `main`: `24f32527`** (`git merge main` → `fbb967f2`, no conflicts; `main` had moved `.grugops/`/`plans/` only since `4952425a`). Every reading was taken at `24f32527` or on fresh clones of it.
- `main` then moved to `94ae5a68`, carrying the Security/NFR records only (no `src/` or package change). I did not merge again. `git merge-tree --write-tree main grugops/qe-ABC-198` is clean.
- Commit `981c2bff`: 6 notes and the `## QE` section. No `src/`, package, `AGENTS.md`, board or traceability edits.

**Notes.** Sealed by `admitAndAppend` (grugops 2.1.0, task `qe-ABC-198`), with the context root `../wt-qe-ABC-198/.grugops/context` passed explicitly. `at` came from `date -u`, and `findings` was `[]` for all 6. All 6 read back through `readContext`. There is no `finding`, because there was no §14 gate run.
- `20261022T171339Z-qe-e2e-observation-430a0941`: A1–A3 and the installed delta, file by file.
- `20261022T171339Z-qe-e2e-observation-0751bfeb`: the `ABC-170 A2` intermittent (row dependency, N, rates, load, reproduction).
- `20261022T171339Z-qe-e2e-observation-1478c7fc`: `QE-198-b`, the `@vitest/mocker` coverage-mode cost, bisected.
- `20261022T171339Z-qe-e2e-observation-feb20104`: A7 (instrument, calibration, readings, control, limit).
- `20261022T171339Z-qe-e2e-observation-8f2ab7fe`: A4–A6, `BUMP_RERUN_LIST` (1)–(3) re-read, the waiver, and the SE comparison.
- `20261022T171405Z-qe-e2e-decision-0b183705`: the verdict and gap register.

**The intermittent (first priority): a pre-existing flake, not 4.1.12. No FAIL against A5.**
- **What the row depends on.** `engine.test.ts:1265` row 2 is deterministic: `tickingClock(1)`, `maxNodes 20 000`, and `clearTable()` per call. Its one wall-time dependency is vitest's default `testTimeout` 5 000 ms, applied after the synchronous row returns (`@vitest/runner` `withTimeout`, byte-identical at 4.1.11 and 4.1.12). It costs about 160 ms plain and about 1.0–1.6 s under v8 coverage.
- **N and rates at the default bound, base 0/73 and head 0/73:**
  - coverage suite, sequential and interleaved: 15/15 per side;
  - coverage suite, base and head concurrent: 12/12;
  - one-file: 26/26;
  - one-file with coverage: 20/20.
  - Load1 was 2.9–12.1 on 8 cores, with other hops live.
  - With the SE's runs it is head 1/78 against base 0/76, which does not tell them apart.
- **Reproduced at base:**
  - Under `taskpolicy -b` (CPU-starved), the same row is the first `engine.test.ts` row past 5 s: **base 3/3 (4.1.11)** at 6017–7275 ms, and head 3/3. All six runs then hit the 60 s bound (124).
  - With `--testTimeout=800` both runners fail it with an identical `Test timed out in 800ms.`
  - The same class hit `ABC-167 A7` at base under concurrent load: `Test timed out in 5000ms` 5404 ms (base 1/12, head 2/12).
- **What 4.1.12 does add** (`QE-198-b`): `@vitest/mocker` 4.1.12 makes coverage-mode CPU about 5 % heavier on `engine.test.ts`. It is paired, bisected to that package alone (9/10 and 10/10), with no shift without coverage. It narrows the margin; it does not create the failure.
- Every log and `last-run.json` (556 files) is in `…/scratchpad/qe198/runs/` and `…/qe198/logs/`.

**A7 (socket probe).**
- **Instrument:**
  - a `listen()`/`bind()` interposer dylib, delivered by a `node` shim on `PATH`, with `posix_spawn`/`execve` re-injection for `env: {}` children;
  - plus an `lsof` sweep every 0.2 s;
  - `npm test` as spelled, in a fresh clone after `npm ci`.
- **Head: 0** listening sockets in 3/3 runs (27 probe-loaded processes each, including `esbuild`).
- **Planted** `net.createServer().listen(0, "127.0.0.1")`: **1** (a worker thread, `127.0.0.1:53799`). The `lsof` sampler alone read 0 on the plant, so it would have been vacuous.
- `QE-198-c`: one `/bin/sh`-launched `node src/cli.ts` child per run is outside the interposer. It is covered by the backstop and a static read (no listener call site in `src/`/`tools/`).
- Nothing routes to Security/NFR.

**Audit pairs (A2).**
- Base 13 rows:
  - `@vitest/coverage-v8 via:vitest`
  - `@vitest/mocker` GHSA-qxg6-89mg-rqv8 and GHSA-xp26-3454-mjgp
  - nanoid GHSA-2v37-7h3g-55p8
  - postcss GHSA-fxqj-rqcc-2cmp
  - source-map-js GHSA-68fv-2mgg-jv7q
  - vite GHSA-587h-7wmj-h5pm, -698v-4r3x-3vcv, -9jrq-w75r-8gcw, -r825-w8mm-5pxw and -rq7h-c2jc-7f22
  - `vitest via:@vitest/coverage-v8`
  - `vitest via:@vitest/mocker`
- Head 3 rows: nanoid, postcss and source-map-js.
- Removed = exactly the 7 pairs + 3 via rows; added = none. Metadata at head `{moderate 1, high 2, total 3}`; `--omit=dev` 0 at both ends.

**Gates at `24f32527`.**
- lint, typecheck and build 0.
- `npm test` 60/1995 rc 0, and `last-run.json` reads `success` true, `exitCode` 0, fresh. Test names are byte-equal to base `fbb967f2` (60/1995).
- Skip-count capture as spelled gives `0`, and `test-skip-integrity.js` reads `No findings.`
- Deep lanes, one file each at heap 400: CLI_DEEP 11/11, UCI_DEEP 5/5, PERFT_DEEP 32/32.
- Red-first (literal back to 4.1.11): 1/1994 on ABC-192 A2.
- The A6 plant reads `success: false`.
- `BUMP_RERUN_LIST` (1) refusal on SUITE and ONE-FILE (pipe exit 5, `Skip count was not provided`).
- The UAT waiver form prints nothing.

**Gap register:**
- **`QE-198-a`** (LOW, proposed): the coverage/CPU-pressure timeout flake on `ABC-170 A2` row 2 and `ABC-167 A7`. Route: BA/PM, to lighten the row as `ABC-173` did, or pin a per-row timeout. The reporter's exit-code-only row should be re-run on a quiet host when a timeout red voids it.
- **`QE-198-b`** (LOW/INFO): the `@vitest/mocker` 4.1.12 coverage-mode cost of about 5 %; mechanism `UNKNOWN - verify`. It is not an `NFR-008` timing claim. Route: BA/PM / Architect, beside `QE-198-a`.
- **`QE-198-c`** (INFO): the A7 instrument's limit described above.
- **`QE-198-d`** (INFO):
  - The brief's coverage form always exits 1 (lines 99.25 %), so classify it by `numFailedTests`.
  - This session's scratchpad is shared across hops: the SE's single `cov-head.log` and the Security/NFR scratch dir sit beside mine. I worked only in `…/scratchpad/qe198/` and did not read the others' files. Route: Orchestrator, for per-hop scratch subdirectories.

**SE comparison.** I opened `…59297619`, `…f4334765`, `…240b63df` and `…7e9699c3` only after my readings. They agree on every shared number. Their one open item (the A2 red on 1 of 5 coverage-form runs) is answered above.

**Board.** QE releases `In Review` → `In Security/NFR`. Security/NFR's A8 is already recorded PASS on `main` (`…0f626230`), and it expected exactly this A7 = 0. The Orchestrator applies the move (`plans/` fenced). **UAT** is waived by measurement (0 production lines); that is not a signature.

**Trace row** (for the Orchestrator):

| ABC-198 (qe-ABC-198) | QE: A1–A7 met on own runs at 24f32527 (main fbb967f2 merged); ABC-170 A2 intermittent ruled a pre-existing coverage/CPU timeout flake (5 s default: base 0/73, head 0/73; CPU-starved: base 3/3, head 3/3, same row, same signature); A7 socket probe 0 at head, 1 on the planted listener | — | — | AR-1 (A7 settles …216ceb43: 0 listeners); RISK-ABC143-01, RISK-ABC173-STATE re-read; QE-198-a LOW, QE-198-b LOW/INFO, QE-198-c/-d INFO | grugops/qe-ABC-198 @ 981c2bff (merge 24f32527)<br>.grugops/context/qe-ABC-198/notes/ (6), ABC-198 page ## QE | lint/typecheck/build 0; npm test 60/1995, names = base, success true; skips 0, No findings.; CLI_DEEP 11, UCI_DEEP 5, PERFT_DEEP 32; red-first 1/1994 (ABC-192 A2); audit 13 → 3, nothing added, --omit=dev 0; A6 plant success false; A7 0 / plant 1 | UAT waived (0 production lines; waiver form empty; not a signature) | — | In Review → In Security/NFR (QE PASS_WITH_GAPS; A8 PASS already recorded) |
