---
id: 20261010T155800Z-software-engineer-decision-abc137-one-framed-helper-pin-and-a-five-span-reach-comment-3c71e0a4
kind: decision
by: software-engineer
at: 2026-10-10T15:58:00Z
verified_by:
confidence: high
refs:
  - ABC-137
  - ABC-136
  - ABC-057
  - ADR-0011
  - R5c
  - QE-136-b
  - src/history-pane.nfr.test.ts
supersedes:
---

# `ABC-137` spelling: one framed, `\n`-escaped helper pin after the importer pin; the reach comment says "five spans", four of the guard's plus clause 1's helper

Hand-authored and unsealed (AGENTS.md: no `finding` is admissible on this install). The Architect decided what is pinned (`R5c`). This note records only how it is spelled.

1. **One pin**, the last `expect` in the drift-tripwire `it`, with the message "clause 1's one expression is
   unchanged". The literal is the helper's two lines exactly as at `:163`–`:164`, framed by a leading `\n` and
   ending in `\n`. It is written on one line with `\n` escapes (`ABC-057` `D1`), so it cannot match itself, and
   `plantqe136.py`'s `HELPER` anchor still occurs exactly once.
2. **Single-quoted**, because it holds `"` (Biome's quote choice, as in `ABC-136`'s importer pin). It holds no
   `${`, so no `biome-ignore` is needed. The count stays 1 → 1.
3. **A short `//` above the pin** names `R5c` and says what is at stake: a filename exclusion narrows all three
   scanned sets at once and every guard stays green.
4. **The reach comment** changes from "it pins four spans of the guard by TEXT" to "it pins five spans by TEXT".
   Four are the guard's (unchanged list). "The fifth is not the guard's: it is clause 1's helper definition
   (`R5c`)", which the licence guard, the composer tripwire and the frame-path probe all scan. The sentences
   about re-running the witnesses and "not tamper-proof" are kept, reflowed.
5. **Not touched:** the helper and its three call sites (lines `:163`–`:164` have the same sha256), `ABC-136`'s
   three pins and `ABC-057`'s spans (all hash-identical, code and comment alike). No new `it`, file or spawn. No
   new literal or comment spells the `LICENSED_DRIVERS` or `COMPOSITION_ROOT` declaration.
