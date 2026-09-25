---
id: 20260925T092600Z-security-nfr-observation-abc080-n8lane-no-measurable-charge-minus-250ms-gross-null-admissible-516e88de
kind: observation
by: security-nfr
at: 2026-09-25T09:26:00Z
verified_by:
confidence: medium
refs:
  - ABC-080
  - NFR-008
  - N8-LANE
  - ADR-0019
  - AR-N8LANE-079
  - .grugops/context/ticket-to-pr-ABC-080/notes/20260925T085300Z-software-engineer-observation-abc080-n8lane-charge-170ms-gross-10ms-net-inside-null-control-met-9a61f2d7.md
  - .grugops/context/secnfr-ABC-080/notes/raw-harness-lane.mjs.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-harness-lane-files.mjs.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-lane-summary.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-lane.tsv.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-lane-load.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-lane-files.json.txt
supersedes:
---

# ABC-080 `N8-LANE`: NO MEASURABLE CHARGE. The Engineer's reading is CONFIRMED as "inside the noise", not as "+10 ms"

Hand-authored, with no `seal`. **Confidence is medium because of load, not because of the
protocol.**

## The instrument

This is `secnfr-ABC-079`'s lane harness, re-pointed at this gate's arms. The only changes are the
arms directory, the arm labels and the charge label; `raw-harness-lane` shows the full diff in its
header. It follows `NFR-008`'s own protocol:
- contained lane `npx vitest run --dir src`, one fresh OS process per run;
- condition order rotated every round, 9 rounds, round 0 discarded;
- file and test counts asserted per run;
- CPU = user + sys from `/usr/bin/time -p`.

The arms are this gate's own: A = `cb8ca55` (QE's build, not `ac5215c`), N = a byte-identical copy,
B = `4f74acc`.

## The reading

| arm | files / tests | median CPU | CPU range | median wall |
|---|---|---|---|---|
| A (ABC-080) | 44 / 1 418 | 23.720 s | 23.24 – 23.98 | 5.880 s |
| N (identity) | 44 / 1 418 | 23.680 s | 22.97 – 24.44 | 5.775 s |
| B (base) | 43 / 1 395 | 23.700 s | 23.30 – 24.55 | 5.740 s |

- **Null control N − A:** per round −0.86 0.27 −0.02 0.83 −0.05 0.80 −0.75 −0.19. Median
  **−0.035 s (−0.15%)**, sign 3/8. **Admissible** (≤ 1.5%, sign at chance). **Per-round spread is
  ±0.86 s**, which is wider than the 650 ms bar itself.
- **Charge A − B:** per round −0.34 0.16 −0.57 −0.62 0.15 −0.22 0.46 −0.28. Median **−0.250 s CPU
  (−1.05%)**, sign 3/8. Net of the 160 ms per-file floor for the one new file, that is **−0.41 s**.
- **Load was very high:** the 1-minute load before each run was min 7.21, median 15.74, max 21.05.
  Other work shared the machine. Harness errors: 0 of 27.

## The ruling on the Engineer's figure

- **CONFIRMED in substance, CORRECTED in form.**
  - The Engineer read +170 ms gross (+10 ms net), sign 6/8.
  - This gate reads −250 ms gross, sign 3/8.
  - Both are inside their own null control's spread.
- **The honest reading is "no measurable content charge; `N8-LANE` MET".** It is not "+10 ms"
  and not "−410 ms". Neither instrument, at this load, resolves a charge that small. Quoting either
  number as the ticket's cost would be false precision.
- **Attribution, which the Engineer left `UNKNOWN - verify`, is now measured.** This is test time
  from the vitest JSON (`raw-harness-lane-files`, re-pointed with the arms directory only; 3
  alternating rounds; an indicator, not CPU):
  - The new file `search.ordering.test.ts` adds **+955 ms**.
  - The existing search files got cheaper by **−509 ms**: `search.test.ts` −211, `quiescence.test.ts`
    −161, `search.qe.test.ts` −137.
  - That is ordering the existing searches, the Engineer's candidate, now shown.
  - The rest (±50–70 ms on unrelated files) is noise.

## About the lane, not about `ABC-080`

- The lane reads **about 23.7 s CPU** with or without this ticket, against `NFR-008`'s 15 s.
- `ADR-0019` trigger (a) stays fired. `AR-N8LANE-079` was **accepted by the owner** on 2026-09-25
  (option a, `wave-2026-09-24` note `…36b66fbd`), and lane reduction is not scheduled.
- **This ticket adds nothing measurable to the breach**, and nothing here moves it.
- The wall clause (≤ 3 s; this gate reads 5.9 s) is reported, not ruled. `ABC-111` owns it.
