---
id: 20261012T065549Z-qe-e2e-observation-abc153-readings-cfba105e
kind: observation
by: qe-e2e
at: 2026-10-12T06:55:49Z
verified_by:
confidence: high
refs:
  - ABC-153
  - ABC-145
  - QE-145-a
  - NFR-008
  - plans/tickets/ABC-153-the-book-sha256-test-alters-only-the-first-source-file.md
  - tools/opening-book/book.test.ts
supersedes:
---

# QE `ABC-153`: per-criterion readings (RUN 2026-10-12, QE's own)

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). **No timing reading
was taken** (a parallel read-only QE hop runs). Reviewed: `grugops/ABC-153-book-sha256-every-file` tip
`fe6add38`, code `917df052`, base `main` `21980135`. QE branch `grugops/qe-ABC-153` off `fe6add38`, own
worktree `../wt-qe-ABC-153` (`node_modules` symlinked from the main checkout).

## `A1` — every file is checked: MET

- Head test, unmutated compiler: lane `npx vitest run tools/opening-book/book.test.ts` exit 0, 19 passed.
- The `it` asserts `new Set(Object.values(expected)).size === 5` before the loop; the loop runs over
  `SOURCE_FILES` (5) and per file asserts refusal 3 of 3 (`file`, `expected[file]`, `actual`) and
  `existsSync(out) === false` on a fresh `abc145-altered-<file>.json` under the `mkdtemp` scratch.
- QE's independent byte reading (same `HEADER` + `GOOD_ROWS[i]` texts, same rename rule):

  | file | expected sha256 | altered sha256 | lengths | bytes changed | 3 columns after |
  |---|---|---|---|---|---|
  | `a.tsv` | `4ff4c0b12a7d…` | `5bd98e3f4f40…` | 43 / 43 | 1 | yes |
  | `b.tsv` | `28bc0b72e582…` | `cc3034955647…` | 55 / 55 | 1 | yes |
  | `c.tsv` | `a40a0963af68…` | `6daaced877dd…` | 43 / 43 | 1 | yes |
  | `d.tsv` | `801eea690fa7…` | `e19fdc53ffa1…` | 44 / 44 | 1 | yes |
  | `e.tsv` | `ea39227dc78f…` | `da7f381d8b5d…` | 57 / 57 | 1 | yes |

  Distinct expected hashes: **5**. Every altered hash differs from its expected one.
- **Only the hash refuses:** each singly-altered directory, passed to `writeBook` (no check) in a scratch
  copy, compiles and writes — 5 of 5. So the refusal the test reads is the sha256 check's, not the validator's.

## `A2` — control: MET

The unaltered control call runs before the loop and asserts the output exists (part of the 19 green).

## `A3` — the eight readings (QE re-planted; `git archive 917df052` copy in the session scratchpad, OUTSIDE the repo)

Only `checkThenWriteBook`'s loop differs per build. Base test = `21980135:tools/opening-book/book.test.ts`; head
test = `917df052`'s. `compile.ts` at base and head `cmp` 0, so one compiler source serves both.

| build | mutation | base test | head test |
|---|---|---|---|
| unmutated | none | exit 0, 19 passed | exit 0, 19 passed |
| `M05` | `SOURCE_FILES.slice(0, 1)` | **exit 0, 19 passed** | **exit 1, 18 passed / 1 failed** — `expected [] to deeply equal [ 'b.tsv', …(2) ]` |
| `M-SWAP` | `b.tsv` vs `expected["c.tsv"]`, `c.tsv` vs `expected["b.tsv"]` | **exit 0, 19 passed** | **exit 1, 18 / 1** — the control throws `b.tsv: sha256 is 28bc0b72…, expected a40a0963…` |
| `M06` | `SOURCE_FILES.slice(1)` | exit 1, 18 / 1 — `[ 'a.tsv', …(2) ]` | exit 1, 18 / 1 — `[ 'a.tsv', …(2) ]` |

`M05` and `M-SWAP` green on base, red on head; `M06` red on both; unmutated head green. **MET.** The failing
test is in every red row the `A1/A2` `it` only; 0 pending, 0 todo in all eight. Agrees with the SE's table.

## `A4` — fences: MET

- **Path fence, CODE range `21980135..917df052`:** `M tools/opening-book/book.test.ts` only; 0 added files.
  The tip commit `fe6add38` adds only record paths: 4 SE notes under `.grugops/context/ticket-to-pr-ABC-153/notes/`,
  the ticket (§ Delivery) and `plans/traceability.md` (one row).
- **`cmp` windows (QE's own boundaries):** base and head both put the `ABC-145` describe at 270, `fixture()` at
  68–75 and the `A1/A2` `it` title at 274.
  - lines 1–274 (imports, `fixture()`, every block before, the describe header, the `sha256` helper, the `it`
    title): `cmp` 0;
  - base 304–314 = head 316–326 (the `it`'s closing line, the `A3` `it`, the describe's close, EOF; both end `0a`):
    `cmp` 0;
  - `fixture()` 68–75 alone: `cmp` 0.
  - `/usr/bin/diff` hunks all sit at head 275–315, i.e. inside the `A1/A2` `it` body. No import changed.
- `tools/opening-book/compile.ts` and `data/opening-book/book.json`: `cmp` 0 against `21980135`, at `917df052`
  and in the tip worktree.
- `spawn|execFile|child_process` in `book.test.ts`: **0** (base 0). `it(` lines 12 → 12, `describe(` 5 → 5.
- `npm test`: base (a `git archive 21980135` copy) exit 0, **56 files, 1743 tests**, 0 failed, 0 pending, 0 todo,
  `success: true`; head (tip worktree) exit 0, **56 files, 1743 tests**, 0 failed, 0 pending, 0 todo,
  `success: true`. Equal. Skips 0.

## Gates (tip worktree)

`npm run -s lint` 0, `typecheck` 0, `build` 0, `npm test` 0 (above). `node tools/grugops/test-skip-integrity.js
.grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0. `git status --porcelain` empty after every run.
