---
id: 20261010T115422Z-software-engineer-observation-abc053-gates-ledger-controls-cost-3a8f5aa3
kind: observation
by: software-engineer
at: 2026-10-10T11:54:22Z
verified_by:
confidence: high
refs:
  - ABC-053
  - ABC-054
  - ABC-057
  - ABC-087
  - ADR-0029
  - ADR-0035
  - NFR-002
  - N8-LANE
  - src/history-pane.nfr.test.ts
  - src/render-seam.test.ts
  - src/render-seam.ts
  - src/result-screen.ts
  - src/cli.ts
  - 20261010T115422Z-software-engineer-decision-abc053-one-root-per-frame-phase-composer-tripwire-9594aafe
  - 20261010T082409Z-architect-design-observation-premises-rechecked-and-the-ledgers-behind-adr0029-adr0030-151fda8a
supersedes:
---

# `ABC-053` readings: gate green; the ledger is 9 of 9 RED with BASE green and `WGLYPH-DYN` green; every `A3b` control reds; cost +8 ms CPU on the narrow set (set 2 admissible, set 1 not)

This note is hand-authored and unsealed.
- Code: `c9509031` on `grugops/ABC-053-frame-path-per-frame`, base `e15eb31d`.
- Machine: Apple M3, 8 cores, Darwin 25.5.0, Node v26.11.0.
- Other hops (`ABC-087` build, Security/NFR) were running on the machine, so load1 is given beside
  every reading.
- Raw files are in `../probe/`, with absolute paths rewritten to `<repo>` / `<scratchpad>`.

## Gate (worktree at `c9509031`)

| step | result | load1 |
|---|---|---|
| `npm run lint` | exit 0, 98 files, no fixes, 0 warnings | 9.51 |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 | 9.51 |
| `npm test` | exit 0, **51 files / 1582 passed**, 6.27 s | 9.51 |
| skip count | `0`, measured (`jq '.numPendingTests + .numTodoTests'`) | 7.23 |
| `test-skip-integrity.js … --skip-count 0` | `No findings.`, exit 0 | 7.23 |
| `lane-inventory.js` | exit 0: "The lane collects 51 test files; git tracks 51. No findings." | 7.23 |

Before the change, the two files read 22/22 (load1 6.31). After it they read 23/23: the composer
tripwire is the one added `it`.

## `A3`: the kill ledger, rebuilt (`ledger.sh` + `mutate.py` → `ledger-run1.tsv`)

Each build was a fresh `git archive c9509031` copy with one mutation, run as
`npx vitest run src/history-pane.nfr.test.ts src/render-seam.test.ts`.

| build | exit | red assertion | load1 |
|---|---|---|---|
| BASE | 0 | — (23 passed) | 4.88 |
| `X5b` | 1 | `PER FRAME: history.ts was loaded by a frame call` | 4.88 |
| `X5b-CONDITIONAL` (`> 16`) | 1 | PER FRAME, **plus** `render-seam.test.ts` "no numeric literal" (`/\d/`) | 4.97 |
| `X5b-query` (`?v=2`) | 1 | PER FRAME, **plus** the same `/\d/` row | 4.97 |
| `X5b-computed` | 1 | PER FRAME | 4.97 |
| `X5c` (evaluate-only) | 1 | PER FRAME | 4.97 |
| `WDYNIMP` | 1 | `AT LOAD: history.ts was evaluated on the frame path` | 4.81 |
| `INLINE-TYPE` | 1 | AT LOAD, plus the licence equality | 4.81 |
| `WINDIRECT` | 1 | licence equality (regex) **only** | 4.81 |
| `SECOND-COMPOSER` | 1 | `a second frame composer…`: `['cli-options.ts','render-seam.ts']` | 5.15 |
| **`WGLYPH-DYN`** | **0** | — (23 passed): **the recorded loss**, named in the docblock | 5.15 |

**9 of 9 RED, BASE green, `WGLYPH-DYN` green.** This matches `ADR-0029`'s ledger row for row.

**My mutant spellings put digits in the seam** (`16`, `v=2`), and that also reds `ABC-041`'s
no-numeric-literal row. So I re-ran both kills with digit-free spellings (`ledger-run2.tsv`, load1
4.61). `X5b-CONDITIONAL-nodigit` (`> "abcdefghijklmnop".length`) and `X5b-query-nodigit` (`?v=x`) each
red **only** the per-frame assertion. `X5b` was repeated 4 more times (5/5 RED at load1 4.44–4.88).

## `A3b`: the controls cannot pass vacuously (builds of the PROBE, `ledger-run2/3.tsv`)

| build | result |
|---|---|
| (i) `CTRL-NO-FRAME`: the child reports `rows: 0` | RED: `rows the frame at 0 plies returned: expected 0 to be greater than 0` |
| (i) `CTRL-NO-FRAMES-AT-ALL`: no frame drawn | RED: `frames drawn…: expected [] to deeply equal [0, 40]` |
| (ii) `CTRL-EMPTY-ONLY+X5b-CONDITIONAL`: only the empty game framed | RED on `frames drawn…` (`[0]` vs `[0, 40]`) |
| (ii) diagnostic: only the empty game framed, with that assertion loosened, on `X5b-CONDITIONAL-nodigit` | **GREEN 23/23**. The > 16-ply state is what kills it, which reproduces `ADR-0029`'s measurement |
| (iii) arming last | structural: one recorder, cleared before the arming import, which is the last statement before the report |
| `CTRL-ZERO-SETTLE+X5b` | still RED per frame. The settle is not load-bearing on v26.11.0 |
| `CTRL-ROOT-STOPS-COMPOSING`: seam binds nothing from `frame.ts` | RED on the tripwire (`[]` vs `['render-seam.ts']`), with 5 other rows |

**One control of mine was wrong and is recorded.** The first "root stops composing" build
(`CTRL-NO-COMPOSER`) kept `import * as frameNs`. A namespace import binds values, so the tripwire
counted it and stayed green; `A11`'s spy reddened instead. That is the rule working as defined, not
a gap. The rebuilt control is the row above.

## Test note 2: the probe rooted both ways (`diag-roots.mjs` → `diag-roots.out.txt`)

- `render-seam.ts`: closure 11 modules, `history.ts` absent, both frames 23 rows.
- `turn-loop.ts`: closure 10 modules, **`history.ts` present**, so the probe is still armed.

## `A2`, `A4`, `A5`: read from git

- `A2`: `grep -c FRAME_PRODUCERS src/history-pane.nfr.test.ts` = **0**. The docblock names both
  phases, the one root `render-seam.ts`, and the four uncovered cases.
- `A4`: `glyph-mode.ts` is not a root, and the membership rule is stated in the docblock.
- `A5`: `git diff --name-only e15eb31d..c9509031` lists exactly
  `src/history-pane.nfr.test.ts` (+124/−52) and `src/render-seam.test.ts` (+6/−6).
  - 0 non-`.test.ts` paths under `src/`, so the zero-production-lines rule holds. 0 added files.
  - `spawnSync(` call count: 1 → 1.
  - `A9` asserts the root. The `LICENSED_DRIVERS` line is byte-identical.

**Production lines that name `FRAME_PRODUCERS` or the six-producer census, now stale. These are for
the owed `XS` follow-up and were not touched here:**
- `src/render-seam.ts:35`: "`src/history-pane.nfr.test.ts`'s `FRAME_PRODUCERS` (`ADR-0011` clause 2:
  the frame path is…". The sentence spans `:34-36`; it also says the module is "DECLARED as one".
- `src/result-screen.ts:14`: "in `src/history-pane.nfr.test.ts`'s `FRAME_PRODUCERS` (`ADR-0011`
  clause 2…".
- `src/cli.ts:8`: the census "frame producers 6 unchanged".

## Security clauses (for the Security/NFR gate; no verdict is claimed)

- (a) does not fire: no `package*.json`.
- (b) does not fire: no non-test `src/` file.
- (c) does not fire, on my reading: still exactly one `spawnSync(`. The child gains imports of
  `history.ts?fixture` and `legal.ts`, frame calls and a 3-turn `setImmediate` settle. It has no
  network and no filesystem write; its report is still on fd 3.
- **(d) FIRES by design**, as named in advance. `src/render-seam.test.ts` is a second test file under
  `src/`. The gate resolves it.

## Cost (`ADR-0035`, proposed; narrow set = the two modified files; `timing.sh` + `score.mjs`)

The harness used three `git archive` trees (base `e15eb31d`, head `c9509031`, and a twin of base,
`diff -r` identical). Each run was a fresh process; CPU = user + sys; arm order rotated; round 0
discarded; counts asserted (22 / 23 / 22); load1 logged before every run.

- **Set 1** (n = 8, load1 median 11.31, max 15.69): **INADMISSIBLE.** The twin's null median is
  +0.145 s, which is **+8.55 %**, over the 1.5 % rule, with sign 6/8. Nothing is read from it.
- **Set 2** (n = 12, k = 3, load1 median 11.34): **admissible.** The twin reads +0.008 s
  (+0.52 %), sign 7/12, interval −0.042..+0.052, **R 0.052 s CPU**.
  - Head − base: **+0.008 s CPU** (+0.52 %), sign 7/12, interval −0.023..+0.068.
  - Wall: +0.003 s; twin R 0.037 s.
- **`N8-LANE`:** its scope is files the branch ADDS under `src/`. There are **0**, so nothing is in
  scope (as `ADR-0029` predicted). If the 650 ms were applied to the narrow set, R 0.052 ≤ 0.650 would
  resolve it, and +0.008 s is under it. **That is not claimed as an `N8-LANE` line.** No `NFR-008`
  verdict is claimed.
- The two sets are reported unpooled. `ADR-0029` estimated about +30 ms for the probe test alone;
  this reading cannot separate +8 ms from +30 ms at that resolution.

## Overlap and sequencing

- `ABC-087`'s branch touches only `src/levels.ts` and `src/levels.test.ts`, so there is no file
  overlap. Its `levels.ts` imports neither `frame.ts` nor `history.ts`, so the new tripwire and the
  probe are unaffected by it as it stands at `3a133d26`.
- `ABC-054` and `ABC-057` edit these same two files, and must start from this branch's merge.

## Not verified

- Node 22 and 24 loader timing for the per-frame phase: `UNKNOWN - verify`. Only v26.11.0 was run.
