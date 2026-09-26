---
id: 20260925T204300Z-software-engineer-observation-abc121-n8lane-rehop-1575ms-gross-1415ms-net-still-over-e4d6fcc8
kind: observation
by: software-engineer
at: 2026-09-25T20:43:00Z
verified_by:
confidence: medium
refs:
  - ABC-121
  - N8-LANE
  - NFR-008
  - AR-N8LANE-079
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T200200Z-software-engineer-observation-abc121-n8lane-1830ms-gross-1670ms-net-over-line-stop-24e3648a.md
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-build.mjs
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-lane.mjs
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-n8-summary.txt
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-n8-raw.tsv
supersedes:
---

# `N8-LANE` after the placement: +1 575 ms CPU gross, +1 415 ms net. STILL OVER the 650 ms line (≈ 2.2x). Residual handed to Security/NFR; the owner decides

Hand-authored, no `seal`. **Confidence medium, because of load**: load1 median **22.8** (min 16.1,
max 32.1) from parallel hops on a 4P+4E M3. The protocol itself was followed.

## Protocol and arms

The protocol is `NFR-008`'s own, via the build's `lane121` harness with the arms parameterised
(`rehop-lane.mjs`):
- `npx vitest run --dir src`, one fresh process per run;
- **13 rounds** with the order rotated, round 0 discarded;
- counts asserted every run;
- CPU is user + sys from `/usr/bin/time -p`.

The arms are `git archive`s outside the repository:

| arm | tree | files / tests | median CPU | median wall |
|---|---|---|---|---|
| `X` | the placement, `6c1e895` | 48 / 1 466 | 31.670 s | 7.225 s |
| `NX` | a byte-identical copy of `X` | 48 / 1 466 | 31.540 s | 7.190 s |
| `A` | the build, `66afd16` (`src/` = `9823c27`) | 48 / 1 467 | 32.525 s | 7.515 s |
| `B` | the base, `15c6eb0` | 47 / 1 446 | 30.055 s | 7.080 s |

## Results (12 paired rounds)

- **Null control, NX − X:** median **+0.060 s (0.19%)**, sign 7/12. **Admissible.**
- **Charge, X − B:** median **+1.575 s**, X above B in 11/12 rounds.
  - Per round: 2.76, 2.23, 2.15, 2.57, 1.25, 1.22, 1.52, 0.84, 1.63, 1.40, 2.04, −0.50.
  - **Net of the 160 ms new-file floor: +1 415 ms against 650 ms. NOT MET, over by ≈ 765 ms.**
- **Saving, A − X:** median **+0.840 s**, sign 9/12.
- **Build charge in this run, A − B:** median +2.265 s, sign 12/12. The build read +1.83 s at load
  13.6, which is why absolute figures must be read at their load (`…e1e4a69f`).
- **The placement removes ≈ 30% of the charge within this run:** 1.575 / 2.265 = 0.70.
  - Scaled to the build's load, that is an ESTIMATE of ≈ +1.27 s gross, ≈ +1.1 s net. It is not
    a reading.
- 0 harness errors in 52 runs.

## Residual, for Security/NFR to rate

After the placement, what remains in the default lane is:
- the rows that are each some criterion's only default-lane guard (`…9bdce84b`, `…17a0830d`);
- `A3`'s table, which is cheap;
- `A5`'s position-3 guard.

**No further move keeps every planted variant red** (`…17a0830d`). The options stand as in
`…24e3648a`:
- accept the residual as an accepted risk, like `AR-N8LANE-078` / `-079`;
- re-measure at low load; or
- let QE / the owner rule on the one assertion-level saving named in `…9bdce84b`.

**Inherited, not this ticket's:** the lane is over `NFR-008`'s CPU and wall clauses with or
without `ABC-121` (base 30.1 s CPU / 7.1 s wall at this load).
