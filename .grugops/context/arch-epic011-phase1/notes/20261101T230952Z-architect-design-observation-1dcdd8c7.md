---
id: 20261101T230952Z-architect-design-observation-1dcdd8c7
kind: observation
by: architect-design
at: 2026-11-01T23:09:52Z
verified_by: 
confidence: high (read from the ticket pages, EPIC-011 and ADR-0057 at main 13627d0f)
refs:
  - ABC-238
  - ABC-237
  - ABC-257
  - ABC-258
  - ABC-236
  - ABC-081
  - ABC-253
  - ADR-0058
  - ADR-0025
  - ADR-0056
  - ADR-0057
  - EPIC-011
  - qe-ABC-263
  - arch-adr0057-fix
  - arch-epic011-phase1
supersedes: 
seal: sha256:a3633d7f9d9cb643c2c107541e8f4a89382ea32ed3f3628068a107342bc36a67
---

# DoR rows now met, couplings named (not decided), and wording deltas for BA/PM

## DoR
- **ABC-238 row 10** ("no major unresolved blocker", was "ADR; ABC-237"): **met** under reading (b) — ADR-0058 is written (PROPOSED), the build may proceed, the read and merge wait on the owner (ABC-208 / ABC-209 precedent). The "ABC-237" half was already lifted by the 2026-11-01 re-home (T1 first). => DoR 10/10; Ready is BA/PM's move. Priority row still reads P3 while the re-home block says P2 (BA/PM sync).
- **ABC-237 row 10** (was "ADR"): the ADR half is **met** under reading (b) (ADR-0025 amendment written, PROPOSED). What remains on row 10 is EPIC-011's sequence hold "ABC-238 merged or closed" (shared src/transposition.ts) — BA/PM scores it (precedent ABC-208: held by sequence). The amendment is written to stand whether ABC-238 merges or closes.

## Wording deltas for BA/PM (criteria review is at the Ready for Dev exit)
- ABC-238 A3: in BOTH recursions (search() fixed d5; chooseMove iterated to d5); max drift a report; add the 287-corpus sign floor (deep lane). A6: intent GAIN. Dependencies: "amends ADR-0025" is not needed for T1 (ADR-0058 alone); "ABC-253 changes the TT keys first" is stale (ABC-253 dropped, qe-ABC-263 G1).
- ABC-237 A2: two DIFFERENT keys sharing a slot, plus the same-key case (replaces) and equal depth (replaces); add the d5 drift row (ADR-0025 amendment). A6: intent GAIN with the 100 ms limit stated. Dependencies: same ABC-253 staleness.
- Both A6 rows: "41 at ADR-0056's count" is stale; EPIC-010's close read Levels 57/57 (arch-adr0057-fix refreshes ADR-0056).
- ABC-081: a dated line carrying ADR-0058 d8's revised A1.

## Couplings (named, not decided)
- **ADR-0057:** both rules are layout-neutral (word 2 keeps 17+2+13). T1 is what Lazy SMP lives on (agrees with "after phase 1"). T2 under a lockless table is a read-compare-write; a lost race costs effort only, the XOR check guards hits. An age field for T3 could only take bits from the 13-bit depth field — an ADR-0057 layout question.
- **ABC-257:** (1) ADR-0058 d7's pre-root argument holds within one search only; prior keys grow between searches. (2) The 2026-10-26 ADR-0025 d4 amendment's "an entry cuts only at its exact stored depth ... never wrong, only possibly useless" is false once T1 lands. (3) Depth-preferred with no age lets old deep entries hold slots for a game. ABC-257's design owes all three.
- **ABC-236:** deeper cutoffs under fail-soft raise PVS instability; aspiration re-search must tolerate fail-high then fail-low.

## Open question for the Orchestrator (owner's if asked: a C2' change)
May a mechanism that cannot fire at the read's control (T2, T4) be read on the NEUTRAL bar with its gain shown by its own mechanism rows? Default: GAIN bar.
