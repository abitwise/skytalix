---
id: 20260925T090444Z-security-nfr-decision-nfr009-placed-at-16mib-3830d8a4
kind: decision
by: security-nfr
at: 2026-09-25T09:04:44Z
verified_by:
confidence: high
refs:
  - NFR-009
  - ABC-081
  - ABC-080
  - ADR-0025
  - plans/nfr-catalog.md
  - 20260925T080916Z-architect-design-decision-r4-abc081-memory-nfr-row-draft-nfr009-4dd1bbaa
  - 20260925T080516Z-architect-design-observation-castling-pairs-subtrees-and-memory-baseline-30cea5d2
  - 20260925T160000Z-orchestrator-decision-c457f8bc
supersedes:
---

# `NFR-009` placed at 16 MiB on the owner's word. 128 MiB is the re-level ceiling, not the level

This note was written by hand, with no `seal`. That is the degraded posture described in
`AGENTS.md`: no `finding` can be admitted on this install. The level is the owner's decision. The
consistency check below is this role's reading of files on disk. **Nothing was measured at this
hop.**

## The owner's word, verbatim

*"2. 16MiB sounds small in todays standards, if more is needed you can extend it to 128MiB. I
approve otherwise."* (Olger Oeselg, 2026-09-25, recorded in
`.grugops/context/wave-2026-09-24/notes/20260925T160000Z-orchestrator-decision-c457f8bc.md`.)

## What was placed

One row, `NFR-009 | Resource / memory`, is inserted after `NFR-008` in `plans/nfr-catalog.md`,
with one `_Updated_` line under the title.

- **Level:** at most 16 MiB in total for search-held memory: the TT and key array (`ABC-081`) and the
  killer table (`ABC-080`).
- **Growth clause:** after `gc()`, `heapUsed` and `arrayBuffers` each move by at most 1 MiB between a
  1 s search and a 3 s search.
- **FAIL:** the total goes over 16 MiB, or either field grows by more than 1 MiB.
- **Ceiling:** 128 MiB is recorded as the ceiling of any re-level, not as the level. A re-level
  needs a measured need on record.
- **Verifier:** (a) a static `byteLength` sum; (b) the `arrayBuffers` delta; (c) the `heapUsed`
  delta. The verifier must be seen failing first: (c) goes RED against a retained `Map`.
- **Lane:** `ENGINE_DEEP`. The row stays `UNKNOWN - verify` until `ABC-081` builds it.

`NFR-001` to `NFR-008` are byte-identical. I hashed each row before and after
(`fcae7ccf…`, `75fcc5e2…`, `79e391ff…`, `053ba48a…`, `f9c6579b…`, `850ba137…`, `a6121cbd…`,
`080ba017…`). The diff on the catalogue is +2 / −0.

## Consistency with `ADR-0025` and the baseline: 16 MiB is consistent and is NOT raised

- **Design point.** 2^18 × 16 B = 4 MiB (`BigUint64Array(2^18)` 2 MiB + `Uint32Array(2^19)` 2 MiB).
  The probe read 4.01 MiB in `arrayBuffers`, so the level gives 4x headroom.
- **Baseline.** RSS was 79.8 MiB after import and 93.1 MiB after a 3 s search (these are the
  figures in the note). At 16 MiB, the search structures stay under about a fifth of a process that
  exists anyway.
- **No measured need to go above 16 MiB.** `ADR-0025` T2 (the replacement-rate A/B against a
  larger table) has not been run. The owner's 128 MiB licence therefore stays unused.

## Inconsistencies found, and what was done with each

1. **The draft rationale says the Engineer "can pick 2^19 or 2^20 entries … without re-opening the
   row". For 2^20 that is false.** 2^20 × 16 B = 16.00 MiB for the table alone. With the key array
   and the killers added, the total goes over the level. The row now says it outright: 2^20 is a
   re-level and 2^19 (8 MiB) fits. `ADR-0025` T2's A/B against 2^20 is still fine as a
   measurement. Shipping 2^20 would need a re-level up to the 128 MiB ceiling, with T2's reading
   as the measured need. `ADR-0025` was not edited (fence).
2. **Verifier (a) cannot count `ABC-080`'s killer table.** The built `KillerTable`
   (`src/search.ts`) is `Move[][]`, which grows lazily per ply and has no `byteLength`. The row says
   (c) counts it. It is tiny: at most two `Move` references per ply reached. It is also dropped
   when the search returns. Its size was reasoned, not measured.
3. **Limit of the verifier, stated in the row.** Every read is taken after the search returns, so
   it measures what the search RETAINS. A structure that is allocated per search and dropped on
   return is invisible to (b) and (c). They only bite because of `ADR-0025` decisions 2 and 4:
   typed arrays, allocated once per process and cleared per search. The red-first control must
   therefore be a `Map` retained across searches. A per-search `Map` would pass (c).
4. **The baseline file does not match its note.** `probe/mem.txt` on disk reads 79.11 → 92.02 MiB
   RSS and `heapUsed` 7.48 → 7.98. Note `…30cea5d2` quotes 79.78 → 93.14 and 7.48 → 8.12. The
   probe was probably re-run and the file overwritten. That is `UNKNOWN - verify`. The
   difference is ≤ 1.1 MiB and changes no conclusion above. It does affect the 1 MiB tolerance's
   margin: the draft cites 0.64 MiB of `heapUsed` drift, and the file shows 0.50 MiB. Both are
   import-to-post-search deltas, not the 1 s vs 3 s delta the row actually checks. **That delta
   has never been measured.** Whether 1 MiB is enough to stop the check flaking under vitest is
   `UNKNOWN - verify` at `ABC-081`'s build.

## Not done here (fence)

- No `src/` change.
- `plans/board.md`, `AGENTS.md` and the ADRs are untouched.
- `ABC-081`'s DoR item 10 is **not** re-scored. A `## DoR item 10` line records that the row exists,
  and BA/PM re-scores it.
