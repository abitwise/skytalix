---
id: 20261010T131017Z-software-engineer-observation-abc057-gates-ledger-arming-controls-cost-4d731ea3
kind: observation
by: software-engineer
at: 2026-10-10T13:10:17Z
verified_by:
confidence: high
refs:
  - ABC-057
  - ADR-0011
  - ADR-0035
  - AR-053-ORDER
  - N8-LANE
  - M15
  - src/history-pane.nfr.test.ts
  - .grugops/context/qe-ABC-053/probe/plant.py
  - 20261010T131017Z-software-engineer-decision-abc057-equality-pinned-by-framed-literal-clause3-transcribed-composer-claim-narrowed-b4c2a298
supersedes:
---

# `ABC-057` readings: gates, the mutant ledger, the arming-order controls, and cost

This note is hand-authored and unsealed. The raw files are in `../probe/`. Each build was planted into
a fresh `git archive` copy outside the worktree (`ledger057.sh` → `plant057.py`). `Q-CTRL-*` builds are
delegated, unchanged, to QE's `qe-ABC-053/probe/plant.py`. Base = `079284d9` (wave tip), head =
`404934f3`. Node v26.11.0, Apple M3.

## Gate on `404934f3` (in the worktree; `probe/gates.txt`)

| command | result |
|---|---|
| `npm run lint` | exit 0, 98 files, no fixes |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0, **51 files, 1583 passed**, 5.93 s, load1 8.16 before and 7.67 after |
| skip count (`vitest --reporter=json`, pending + todo) | **0**, measured |
| `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| `lane-inventory.js` | "The lane collects 51 test files; git tracks 51. No findings.", exit 0 |

The touched file has 12 tests at base and 12 at head. One assertion was added inside an existing `it`.

## Per criterion

| # | verdict | reading |
|---|---|---|
| `A1` | MET | `M15` (QE's text) on head: **RED**, 1 failed / 11 passed. The one failure is "runs the guard's OWN expression…", `the licence guard compares with an EQUALITY`. Over the whole `src` lane, 1 failed / 1582 passed. **Control:** `M15` on base survives the whole lane, 1583/1583. The opposite direction, `M15-SUB` (`toEqual(expect.arrayContaining(<licence>))`), is RED on head with the same single attribution and survives on base. **The trap:** `NAIVE+M15` is GREEN, 12/12 (decision `D1`) |
| `A2` | MET | Base and head give the same verdicts and the same failing tests. `WLAUNDER` is 3 failed (the licence equality, `A6.3`'s unmutated control, `A6.4`'s falsifiability control). `WPERFT-STATIC` is 1 failed (the equality, `[cli.ts, perft-bench.ts, …]`). `WSTALELICENCE` is 1 failed (the equality, `['cli.ts']`). The sibling tripwire is byte-identical (3 lines, sha1 `cc0307e211c9` at both base and head) |
| `A3` | MET | `game-owning driver`: 0 in the whole file (`grep` exit 1). (i) NECESSITY and (ii) THE SINGLE SUPPLIER IS INTACT are stated in the amendment's words |
| `A4` | MET | 2/2. `turn-loop.ts` and `cli.ts` each name why a type import is unavailable (a call is needed) and why an injected history is unavailable (it is data, not operations; or there is no one above the root to inject it). Each says it never constructs a `positionCounts` map |
| `A5` | MET | `git diff --name-only 404934f3~1 404934f3` = `src/history-pane.nfr.test.ts` only. The production filter prints nothing (exit 1). numstat +34/−12. The only non-comment `+`/`−` lines are the 3 lines of the new `toContain`. 0 new files, 0 spawns, no new `readFileSync`. Suite green, skip 0 |

**Stop-condition spans** (`spans.py`, base vs head, `probe/spans-*.txt`): the licence regex lines (3,
`a291254dc642`), the composer tripwire span from `const directory` to `.toEqual([COMPOSITION_ROOT]);` (17
lines, `a7d6a4389a3c`), the sibling tripwire (`cc0307e211c9`) and the guard body (`1bd29dbb2707`) are
**identical**.

**Test note 5 (`AR-053-ORDER`)** on both base and head: `Q-CTRL-DEAF-AFTER-LOAD+X5b` is **RED**, "the probe
is ARMED: expected [] to include 'history.ts'". `Q-CTRL-ARMING-FIRST+DEAF+X5b` is **GREEN**, 12/12, by
construction, and is reported rather than required. The diff does not move `await import(arming)` or
either `loaded = []`, so no phase-label assertion is owed.

**A plant bug of mine, recorded, not hidden.** In `ledger-file.tsv` the first head `M15` and `M15-SUB`
show `PLANT-FAILED`. The guard's 4-space-indented text also occurs inside the new literal (after its
`\n`), so the plant's uniqueness assert refused. I re-anchored on a real newline and re-ran; those are
the readings in `ledger-m15.tsv`. Load1 across the ledger was 3.39–8.35.

## Cost (`ADR-0035`, PROPOSED). Narrow set = `src/history-pane.nfr.test.ts`; no production file

`cost.py` is QE's ABC-054 harness with the set and counts changed (12/12/12). It runs three
`git archive` arms (base `079284d9`, head `404934f3`, a twin of base). `diff -r` exit 0, apart from
"directory loop" warnings on the `node_modules` symlink. 9 rotated rounds, round 0 discarded, n = 8,
k = 2. Two sets were pre-registered, and I stopped there.

| set | load1 | twin − base median | twin sign + | twin R | head − base median | head interval x(2)..x(7) | state |
|---|---|---|---|---|---|---|---|
| 1 | 7.26–8.44 | −0.022 s (**−1.97 %** of 1.131 s) | 3/8 | 0.058 s | −0.013 s | −0.039..+0.007 s | **INADMISSIBLE** (twin > 1.5 %) |
| 2 | 6.37–7.16 | +0.012 s (+1.07 % of 1.120 s) | 5/8 | **0.058 s** | **−0.027 s** | −0.041..+0.008 s | **admissible; R ≤ 650 ms; MET** |

- **`N8-LANE`: MET under `ADR-0035` as proposed, on set 2.** It is admissible, it resolves b = 650 ms
  (R = 0.058 s), and the head median is −0.027 s, which is ≤ b. Set 1 is reported beside it, not
  discarded.
- 0 files added under `src/`, so `N8-LANE`'s added-file scope is empty. No `NFR-008` verdict is claimed.
- The base arm read above its identical twin again in set 1 (median −1.97 %). Set 2 read the other way
  (+1.07 %, 5/8). The cause is still `UNKNOWN - verify`.
