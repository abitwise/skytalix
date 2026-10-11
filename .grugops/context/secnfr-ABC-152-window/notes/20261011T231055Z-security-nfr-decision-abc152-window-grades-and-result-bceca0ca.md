---
id: 20261011T231055Z-security-nfr-decision-abc152-window-grades-and-result-bceca0ca
kind: decision
by: security-nfr
at: 2026-10-11T23:10:55Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-056
  - AR-1
  - ADR-0042
  - ADR-0040
  - ADR-0035
  - NFR-008
  - RISK-ABC144-FCAP
  - RISK-ABC152-PUZZLE-SPY
  - RISK-ABC152-NEGWORKERS
  - RISK-ABC151-FOREIGN
  - RISK-ABC151-WALL-MARGIN
  - RISK-ABC151-HEAT-NOGAIN
  - .grugops/context/secnfr-ABC-152-window/notes/20261011T231055Z-security-nfr-observation-abc152-v12-dependency-review-daf38cf7.md
  - .grugops/context/secnfr-ABC-152-window/notes/20261011T231055Z-security-nfr-observation-abc152-window-readings-40741ea8.md
  - .grugops/context/secnfr-ABC-152-window/notes/20261011T231055Z-security-nfr-observation-abc152-window-method-and-limits-397a05b6.md
  - .grugops/context/secnfr-ABC-152-window/probe/readout.out.txt
supersedes:
---

# `ABC-152` Security/NFR: `V12` MET; `V9` **−20.74 %** (interval −21.06..−19.31 %), in the merge band; `V10` MET at 6.31 s; `V11` H 4/8 against B 5/8. Result: **PASS_WITH_RISKS**, no required fixes, no owner word owed by any bar

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). It is graded against
the `ABC-152` page and `ADR-0042` addendum ruling 6 as written, with `ADR-0035` d1's statistics.
- B = `91024242` (vitest 3.2.7, runner on, k = 2). T = B in a second tree. H = `3c55b965` (4.1.11, runner off, k = 2).
- Each tree ran its own `npm ci`. Width 1, n = 8, round 0 discarded, warm, unprofiled, on AC power.
- **The gate waited 15 min 8 s for another project's test runner.** That runner was present before 0 of the 37
  graded runs.

Readings: `…40741ea8`. Method and limits: `…397a05b6`. Dependencies: `…daf38cf7`.

## Admissibility first

| test | reading | admissible |
|---|---|---|
| the ticket's (`V9`): twin CPU R ≤ 15 % of B's median | R 0.440 s = **1.88 %** of 23.41 s | **yes** |
| `ADR-0035` d1: twin median within 1.5 % of B, sign at chance | +0.145 s = +0.62 %; sign 5/8 (chance band 2..6) | **yes** |

## The grades

| criterion | bar | reading | state |
|---|---|---|---|
| **`V12`** | lockfile, licences, install scripts and audit reviewed; `--omit=dev` stays 0; 0 production lines | +3 / −61 / 20. All permissive licences; no licence changed. Install scripts: the same set (`esbuild`, `fsevents`), and npm 11.20 ran neither. Audit: base 8 (2 critical), **head 3 (0 critical)**; `--omit=dev` 0 / 0. 66 / 66 signatures verified. `src/` diff empty | **MET** |
| **`V9`** | H − B paired median CPU ≤ −15 % of B's median → merges | **−4.855 s = −20.74 %** of 23.41 s; interval **[−21.06 %, −19.31 %]**; sign 0/8. Every round's delta is beyond the −3.511 s bar. Ratio of medians 0.792 | **MET: the merge band** |
| **`V10`** (warm) | H warm median wall + T wall R ≤ 10 s | 6.115 + 0.190 = **6.305 s** | **MET**, by 3.695 s |
| **`V10`** (paired) | H − B paired median wall ≤ + T wall R | **−3.105 s** (interval [−3.190, −2.820]) ≤ +0.190 s | **MET** |
| **`V10`** (cooled) | owed only if warm + R > 9.0 s | 6.305 s | **not owed**, so not read |
| **`V11`** | level logged before and after every run; to the owner if H's count at level ≥ 1 exceeds B's | scored runs at level ≥ 1: **H 4/8, B 5/8**, T 4/8. One level-2 read: the after-read of the 27th and last run (H). From round 5 on, every arm read level 1 | **reported. H is not higher than B, so nothing goes to the owner** |
| count assertions | every run: base 56 / 1740, head 56 / 1741 | 27 of 27 warm runs as asserted, 0 harness errors | **held** |

### `RISK-ABC152-PUZZLE-SPY` (the wall reading; not a gate)

- `PUZZLE_DEEP=1`: the printed `PUZZLES … wall` is **H 3.96 s against B 19.95 s** (paired median −16.00 s, n = 4).
  The command wall is **H 6.00 s against B 29.16 s**.
- Every run reads `solved 54/58` with 18 passed. The 58 per-row verdict and move columns are byte-identical, B against H.
- **The recording `evaluate` spy costs nothing visible** against the runner-off saving, and the results are unchanged.
- **The wall half of this residual is read and closed** by its owner (Security/NFR).
- The spy's memory (it keeps every call until the file ends) was not read, and it is outside the residual's text.
- **`AGENTS.md`'s 32–36 s for this lane is stale after the merge** (≈ 6 s). That is the Scribe's.

### `RISK-ABC144-FCAP` (the full-lane twin R at k = 2)

- **Read: CPU R 0.440 s, wall R 0.190 s** (warm, n = 8, 3.2.7, runner on, k = 2). The recorded `F` is 1.72 s / 3.25 s.
- **Ruling 6: this R closes `RISK-ABC144-FCAP` for the lane before the merge, and after the merge it is listed, not
  used.**
- The floors were not edited here (`plans/nfr-catalog.md` is untouched). Moving the recorded `F` is Architect/Design's,
  as the risk's owner.
- **After the merge, the full lane keeps 1.72 s / 3.25 s** until a twin R is read on 4.1 with the runner off at k = 2.
  This window did not read one, because head had no twin, as ruling 6 specifies.

## Security (ASVS L1, `block_on: high`)

**No security finding against this diff.** It is a dev-toolchain swap: no runtime dependency, no input surface, no
network, no secret and no data path. It **removes** two critical advisories (`tinypool`, RCE gadgets), the
`@vitest/mocker` path traversal, and the `brace-expansion` highs. `--omit=dev` stays 0. Details: `…daf38cf7`.

## Result: **PASS_WITH_RISKS**. No required fixes

- **Nothing holds the merge** on the page's wording: `V9` is in the merge band, and `V10` and `V12` are met.
- **No owner word is owed by any bar.** `V9` is not in the owner band, `V11`'s H count is not higher, and the cooled
  state is not owed.

| id | risk | severity (reason) | owner |
|---|---|---|---|
| `AR-1` drift (pointer for `ABC-056`) | Head keeps 3 dev-only advisories: `nanoid` high, `source-map-js` high and `postcss` moderate, all via `vite` 7.3.6 → `postcss`. **`source-map-js` (GHSA-68fv-2mgg-jv7q) is in neither `AR-1`'s nor `ABC-056`'s set.** It is present at base too. `brace-expansion`, `AR-1`'s own subject, leaves the tree | low here (dev only; `--omit=dev` 0; no runtime artifact; not introduced by this diff) | **Release Manager** (`ABC-056`) |
| `RISK-ABC152-NEGWORKERS` | kept as ruled (addendum 2, ruling 11). Not re-run here | low | QE; Security/NFR |
| `RISK-ABC151-FOREIGN` | **Another project's session ran vitest repeatedly through this window.** It held the gate for 15 min 8 s and voided this hop's first puzzle pass (present before 7 of 10 runs, which are listed, not graded). It was absent at the boundaries of every graded run. Presence is read only at run boundaries | low (no graded run touched; no grade can flip on it) | the Orchestrator (scheduling width 1 across the owner's sessions) |
| `NFR-008` heat, for the owner's information (`RISK-ABC151-HEAT-NOGAIN`) | Per run, H spends **20.7 % less CPU in 33 % less wall**, so it runs denser: CPU ÷ wall is **3.03 against 2.55**. `V11` does not separate the arms on 27 back-to-back runs: the first level-1 read came after run 15, every arm read level 1 from round 5 on, and H took the one level-2 read, on the last run. **Whether the lane heats the fanless machine less is not shown** by this instrument | low (no bar; `V11` met) | **Olger Oeselg (owner)**, as information beside the merge; no word is owed |
| `RISK-ABC151-WALL-MARGIN` | Read at head: **the warm margin under W is 3.70 s**, against 0.6–0.7 s at 3.2.7, k = 2. Cooled was not read (not owed) | low (it narrows the risk) | Olger Oeselg (owner); Security/NFR re-reads at the next lane window |

**Recommendation to the Orchestrator** (the board is not touched here):
- the `In Security/NFR` exit;
- the UAT waiver applies on the measurement (`src/` diff empty, `V12`);
- **after the merge**, the Scribe re-reads `AGENTS.md`'s `PUZZLE_DEEP=1` wall (32–36 s → ≈ 6 s), alongside the items
  already owed (`…e50fbbe3`);
- the straddle rule (`ADR-0040` d5) voids any paired reading whose base and head straddle this merge, including
  `ABC-146` `A1`.
