---
id: 20261102T143310Z-architect-design-decision-e396e5ab
kind: decision
by: architect-design
at: 2026-11-02T14:33:10Z
verified_by: 
confidence: high for the design and the S2 reasoning; the amendment is PROPOSED, acceptance is the owner's
refs:
  - ABC-265
  - arch-ABC-265
  - EPIC-011
  - ADR-0025
  - ADR-0057
  - grugops/arch-ABC-265
  - 2a61bd3f
  - src/transposition.ts
  - ADR-0026
  - ADR-0058
  - ADR-0056
  - ADR-0005
  - ABC-266
  - ABC-267
  - ABC-257
  - ABC-237
  - NFR-009
  - NFR-005
  - EPIC-008
supersedes: 
seal: sha256:62c1318b137d18ebf195949fd8f0c50c60421c36a8216e5c51636b4d513ab253
---

# ABC-265 (TH-1): the ADR-0025 shared-table amendment is written, PROPOSED; no S2 reading; DoR 10/10 on reading (b) after two page deltas

- **The amendment** (end of `ADR-0025`, PROPOSED, the owner's to accept; reading (b): build may start, merge waits). Decision 2's first bullet: four `Uint32` words a slot over one `SharedArrayBuffer` (`keyLo^data`, `keyHi^score`, `data`, `score>>>0`), 2^18 slots, 4 194 304 B; key split inside `probeTable`/`storeEntry`, signatures `bigint`; slot `keyLo & mask` (today's slot); hit = non-zero data word and both XOR equations compared unsigned (at one writer exactly today's full-key test); store 2,3,0,1, plain, no `Atomics`. Decision 4's last bullet: one table per process shared by every worker; torn entries read as misses; one clear per search, ordered by the TH-2 ADR; threading no longer `UNKNOWN - verify`; `ADR-0005` F6 does not fire. Second and third bullets of decision 2, decisions 1, 3, 5-7, the parked T2 text, the not-in-force decision-4 amendment and `ADR-0058` are untouched.
- **New rule D2.3 does not state: the verified copy.** `tableCutoff(slot, …)` reads after `probeTable`; under several writers a store between them would hand another key's depth/bound/score to this key, unseen by the check. So the cutoff uses the data and score words the check verified, read once at the probe (per-thread module-private copy; `tableCutoff`'s and `probeTable`'s contracts unchanged). At `Threads 1` nothing stores between the two calls (`engine.ts:399-402`, `search.ts:472-475`), so it is node-equal (probe 90/90). The hash move stays a live read of word 2: it is a legality-checked hint and a live read is today's read after the null-move subtree, at any depth.
- **S2 answer: no.** `ABC-265` owes no S2 nps reading on top of `A4` (`G6` + profile), and nothing goes to the owner. S2 = "meets its own mechanical bar" (`EPIC-008`); nps is a speed ticket's bar. `ABC-265`'s cost bar is `A4`, named by owner-accepted `ADR-0057`. `probeTable`+`storeEntry` are 0.95-1.44 % of samples, so even a 2x cost moves nps at most ~1.5 %, below the 1.8-5.9 % A/B spread: the ~1 h ALONE read would report noise, while the profile measures the two functions directly. The fallback (halves path) read ~1.00x overall, so a small cost has nothing measured to buy back. The `EPIC-011` line's ruling stays the Orchestrator's; this is the Architect's recommendation. The fallback trigger is `G6` below base (§ Inputs, `ABC-265` F2); the profile is reported.
- **Falsifiers added:** T8 (`Threads 1` identity, `A3`), T9 (`G6` below base, fires the fallback), T10 (a torn slot hits, or a cutoff returns another key's value after an overwrite between probe and cutoff).
- **DoR:** row 10 met (the amendment exists, PROPOSED, reading (b)). **10/10 on reading (b) once BA/PM applies two page deltas:** (1) `A2` gains the T10 unit row (overwrite through the handle between `probeTable` and `tableCutoff`; `tableCutoff` returns K's value); (2) `A7` and the `adr:` line cite this amendment and the "no S2" answer. Optional: Scope 7's comment list gains the header lines `:11-15` / `:17-20`; the build note on the view type (`Uint32Array<ArrayBufferLike>`). Board move is the Orchestrator's.
- **For the Orchestrator:** (a) to the owner: "accept / decline the ADR-0025 shared-table amendment" (gates the merge only); Architect recommends asking rather than reading OQ-1 as covering it. (b) rule the `EPIC-011` S2 line for `ABC-265` as above. (c) the TH-2 ADR owes the clear/stop ordering and how a worker adopts the buffer. (d) `ABC-267` `A2` may add the probe-then-cutoff case under several writers (TH-3 design hop).
