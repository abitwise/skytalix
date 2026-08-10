---
id: 20260810T134756Z-security-nfr-observation-f7fb5ddc
kind: observation
by: security-nfr
at: 2026-08-10T13:47:56Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - NFR-002
  - NFR-003
  - ADR-0003
  - ADR-0004
  - src/san.ts
  - plans/nfr-catalog.md
  - plans/tickets/ABC-013-san-rendering.md
supersedes: 
---

# `N1`–`N4` RE-DERIVED on this gate's own instrument, on two builds and two protocols: ALL FOUR MET, and the Engineer's four figures REPRODUCE

The bars were measured by the engineer who wrote the module — the instrument of the role being
measured, which is this board's documented failure mode. Nothing below is inherited. The Engineer's
numbers appear only at the end, as a comparison, after this gate had its own.

## The instrument

Read-only harness outside the repository, importing `src/` by **absolute** path; nothing under `src/`
was written or touched. Two builds, two protocols, two fully independent samples in **separate OS
processes**. **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** — the machine class the
bars name; `UNKNOWN - verify` on any other hardware.

```
P60 = 1rb4r/3k4/p1ppNn2/1p1np1Q1/1q1P1B1P/PRP2p2/3KP1BR/6N1 w - - 2 31
      toFen round-trip byte-identical:  true
      legal moves:                      42     (ticket pins 42)
      moves giving check:                3     (ticket pins 3; all three are PIECE moves)
      pawn moves 8 / piece moves 34
      toFen byte-identical after the whole probe: true
```

- **Protocol A — per-move TIGHT LOOP.** One move, bulk-timed, iteration count calibrated to ~3 ms per
  round, 11 rounds, round 0 discarded, median of per-round means. This is the Engineer's stated
  instrument. **Null floor (empty body) 0.0009 µs** — 0.2% of the smallest figure below.
- **Protocol B — per-call timing INSIDE a 42-move sweep.** Every call of a full 42-move sweep timed
  individually, 200 untimed warm-up sweeps then 1,500 timed sweeps, per-move mean. This is the "worst
  member of a 42-move sweep" instrument. **Timer floor 0.0141 / 0.0164 µs** for the two `hrtime`
  calls around an empty body — 0.14% of an unassisted mean, but ~3% of a supplied mean, which is why
  B's supplied figures read slightly high and why A is the protocol the verdict is taken from.
- **Both builds emit identical strings.** The delivered `toSan` and the reference build were compared
  on all 42 moves in both call forms before either was timed: **0 mismatches**. A cost comparison
  between builds that do different work would be meaningless.

## The four bars, on the DELIVERED build

| id | bar | sample 1 | sample 2 | headroom | verdict |
|---|---|---:|---:|---:|---|
| `N1` | mean supplied ≤ **1/5** of mean unassisted, over all 42 at `P60` | **8.82x** | **8.80x** | 1.76x | **MET** |
| `N2` | mean `toSan(…, legal)` over all 42 ≤ **0.75 µs** | **0.480** | **0.482** | 0.64x of bar | **MET** |
| `N3` | mean `toSan(…)` over all 42 ≤ **6.5 µs** | **4.235** | **4.243** | 0.65x of bar | **MET** |
| `N4` | **no single** legal move over **14 µs**, either form | **10.307** un / 5.649 sup | **10.350** un / 5.677 sup | 0.74x of bar | **MET** |

Protocol B agrees on every bar and never flatters the build: `N1` 8.23x / 8.91x, `N2` 0.518 / 0.520,
`N3` 4.265 / 4.637, `N4` 10.392 / 10.629 µs. **All four bars are met under both protocols in both
samples.** `N4`'s worst move is `g5g7` = `Qg7+` in both, on both builds — the checking queen move that
pays two full generations.

Supporting figures, because an aggregate without its population is not a measurement:

```
pawn moves,      unassisted  (8)     0.136 / 0.135 µs
piece moves,     unassisted (34)     5.199 / 5.209 µs
checking pieces, unassisted  (3)     9.229 / 9.280 µs   ← a GROUP MEAN; see the attribution note
non-checking,    unassisted (39)     3.850 / 3.855 µs
non-checking,    supplied   (39)     0.167 / 0.168 µs
checking,        supplied    (3)     4.550 / 4.562 µs
```

## Comparison with the Engineer's figures — all four REPRODUCE

| | Engineer | this gate | agreement |
|---|---:|---:|---|
| `N1` | 8.76x / 8.73x | 8.82x / 8.80x | 0.7% |
| `N2` | 0.483 / 0.483 | 0.480 / 0.482 | 0.4% |
| `N3` | 4.228 / 4.220 | 4.235 / 4.243 | 0.4% |
| `N4` worst unassisted | 10.24 / 10.37 | 10.307 / 10.350 | 0.7% |
| `N4` worst supplied | 5.82 / 5.70 | 5.649 / 5.677 | 1.5% |

**Reproduced on a different harness, a different process and a different aggregation code path.**
Recorded plainly: this gate went looking for a self-serving measurement and did not find one. Where
this gate differs from the Engineer it is stated rather than smoothed — the two `N4` supplied figures
differ by 1.5%, which is inside this instrument's own run-to-run spread and is not attributed.

## `NFR-003` re-derived, and it also reproduces

42 moves × 0.480 µs = **20.2 µs, ~4,950x under the 100 ms budget**. The ticket's re-derived
"~20 µs, ~5,000x" is confirmed. The old parenthetical (~4 µs / ~25,000x) stays wrong.

## The gate (Workflow 05), re-run by this role on the branch tip

```
npm run lint       exit 0    biome, 38 files, 2 infos (the pre-existing biome-config migration
                             notices already on the main baseline), NO fixes applied
npm run typecheck  exit 0    tsc --noEmit
npm test           exit 0    652 passed / 652 on 20 files, 1.21 s
skip count         0         npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'
npm run build      exit 0    tsc --noEmit
```

All four of `quality.mandatory_gates` pass. `quality.gate_enforcement` is `blocking` and nothing was
softened. The `src/` diff is still **three added files, +628 / −0** (`git diff --numstat main..HEAD --
src/`: 109/0, 371/0, 148/0), and `package.json` / `package-lock.json` are byte-unchanged.

**Test-integrity: exit 2, recorded as an ERROR and never as a pass.**
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` →
*"cannot read the registry file"*. The checker exists; the registry does not. Pre-existing, not
introduced by `ABC-013`, and nothing is hidden — the skip count is independently **0**, so no skip
exists for a registry to justify. A human owns that registry (`quality.test_integrity` is `warn`).

## What this note does NOT establish

- **Any figure on other hardware.** `N2` / `N3` / `N4` are `UNKNOWN - verify` off Apple M3 / Node
  v24.12.0 / darwin-arm64. `N1` is a ratio and survives a hardware change — but see the sibling note
  on what it does NOT survive.
- **`npm run perft` was not run.** `src/moves.ts` and `src/legal.ts` are byte-unchanged, so the perft
  counts cannot have moved — but this gate did not run the lane and reports no result for it, the same
  position the Engineer and QE took.
- **No `plans/nfr-catalog.md` target was moved, and the file was not edited.** `N1`–`N4` are
  ticket-local derived bars; `NFR-002` and `NFR-003` are the catalog's and are untouched.
