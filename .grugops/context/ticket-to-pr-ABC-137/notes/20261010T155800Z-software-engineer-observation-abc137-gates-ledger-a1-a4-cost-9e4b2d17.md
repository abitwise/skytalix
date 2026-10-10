---
id: 20261010T155800Z-software-engineer-observation-abc137-gates-ledger-a1-a4-cost-9e4b2d17
kind: observation
by: software-engineer
at: 2026-10-10T15:58:00Z
verified_by:
confidence: high
refs:
  - ABC-137
  - ADR-0011
  - R5c
  - QE-136-b
  - ADR-0035
  - N8-LANE
  - src/history-pane.nfr.test.ts
  - 20261010T155800Z-software-engineer-decision-abc137-one-framed-helper-pin-and-a-five-span-reach-comment-3c71e0a4
supersedes:
---

# `ABC-137` readings: the gate is green; `XHELPER-NARROW+FMT` (and `+WPERFT-STATIC`) go from green 12/12 to red on the tripwire; the rest of the ledger is unchanged; cost is admissible and `N8-LANE` MET. Planters are an SE port

Hand-authored and unsealed.
- Branch `grugops/ABC-137-helper-pin`, from `2946e22a`. The code commit is `54280bc8` (`src/history-pane.nfr.test.ts` +12/−4).
- Not merged, not pushed. Apple M3, Node v26.11.0.
- Raw files are in `../probe/` (`RUN.txt`).

**Deviation, which QE should know first.** The permission layer refused to execute QE's planters (`plantqe136.py`,
`plantqe057.py`) and runner on this host. The SE read them and ported only the builds named here to
`probe/plant137.mjs` + `ledger137.sh`, keeping the same anchors, the same text and the same count==1 assertion.
- The port reproduces BA/PM's `5d55cc48` ledger row for row at `2946e22a`.
- The ticket's "QE's runner unchanged" was **not** literally used. QE should re-run `A1`/`A2` with its own scripts.

**Premise re-verified at `2946e22a` before editing.** The file is byte-identical to `5d55cc48`. Both
`XHELPER-NARROW` builds exit 0 with 12/12. Load1 was 4.32 → 5.62.

| build | base `2946e22a` | delivered `54280bc8` |
|---|---|---|
| CONTROL | exit 0, 12/12 | exit 0, 12/12 |
| XHELPER-NARROW+FMT | exit 0, 12/12 | **exit 1**, tripwire |
| XHELPER-NARROW+FMT+WPERFT-STATIC | exit 0, 12/12 | **exit 1**, tripwire |
| XHELPER-NARROW (no FMT) | — | exit 1, tripwire |
| QSCAN-NARROW+FMT+WPERFT-STATIC, QLHS-INTERSECT+FMT+WPERFT-STATIC | exit 1, tripwire | exit 1, tripwire |
| M15+FMT, M15SUB+FMT | exit 1, tripwire | exit 1, tripwire |
| WLAUNDER | 3 failed (A6.3, A6.4, licence) | same 3 by name |
| WSTALELICENCE, WPERFT-STATIC | 1 failed (licence) | same 1 by name |
| XSHADOW-HELPER+FMT+WPERFT-STATIC (recorded, `QE-136-c`) | exit 0, 12/12 | exit 0, 12/12 |

- No build printed PLANT-FAILED. Every XHELPER red is "clause 1's one expression is unchanged".
- **A1 MET** (see the table).
- **A2 MET** (see the table). The `HELPER` anchor occurs 1 time at both base and head.
- **A3 MET**, measured on collapsed text:
  - "it pins four spans of the guard by TEXT" goes 1 → **0**.
  - `R5c` goes 0 → **2**.
  - "clause 1's helper definition" occurs 2 times.
- **A4 MET:**
  - The name-only diff is `src/history-pane.nfr.test.ts` alone.
  - Helper lines `:163`–`:164` have the same sha256 at base and head (`88ad40ed…`).
  - The framed helper (real newlines) occurs 1 time at base and at head.
  - The span hashes before and after are identical, covering `ABC-057`'s seven rows and `ABC-136`'s three pins.
  - There are no new `it` blocks (12 → 12) and no new `biome-ignore` (1 → 1).
- **Gate** (worktree, `54280bc8`):
  - lint exit 0 (100 files);
  - typecheck exit 0;
  - build exit 0;
  - `npm test` exit 0, 52 files / 1608 passed, 7.70 s, load1 16.90 → 18.37;
  - skip count 0; integrity prints `No findings.`;
  - `lane-inventory.js` prints "52 test files; git tracks 52. No findings."
- **Cost, `ADR-0035` (proposed):** narrow set `src/history-pane.nfr.test.ts`, base/head/twin, 9 rounds, round 0
  dropped, CPU = user+sys.
  - Set 1 (load1 median 10.52): twin +0.001 s (+0.04 %), sign 4/8, R 0.063 s. Head − base median −0.008 s,
    interval −0.069..+0.041.
  - Set 2 (load1 median 8.91): twin −0.002 s (−0.15 %), sign 4/8, R 0.022 s. Head − base median +0.019 s,
    interval −0.048..+0.032.
  - **Both sets are ADMISSIBLE** (twin ≤ 1.5 %, sign at chance).
  - Against `N8-LANE` (650 ms), both resolve it (R ≤ 0.650 s), and both treatment medians are ≤ 0.650 s:
    **MET**.
  - Against the file's 0.058 s floor: set 2's R is 0.022 s, below the floor. Set 1's R is 0.063 s, above it.
    No sub-floor charge is claimed. The change adds one `toContain` on a string the test already reads.
  - Harness deviation: vitest was run as `node node_modules/vitest/vitest.mjs`, not `npx vitest` (the same
    binary, without npx's start-up).
