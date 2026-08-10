---
id: 20260810T155238Z-software-engineer-claim-5c63a728
kind: claim
by: software-engineer
at: 2026-08-10T15:52:38Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-025
  - src/san.qualifier.hardening.test.ts
  - src/san.ts
supersedes: 
---

# What this hop does NOT certify

Recorded as a `claim` with `confidence: UNKNOWN - verify` because none of it is verified and none of
it is admissible as a `finding` — there is no §14 gate verdict record under this task to issue a
`§14-gate#<id>` stamp, and `context.human_admission` is `off`, so no `human:<name>` stamp exists on
this install either. Nothing below was self-stamped.

1. **That 13 is the complete set of wrong builds.** The mutants were re-specified from the ticket's
   own descriptions, so a defect class nobody has asked about would not appear. `ABC-023`'s QE hop
   found fourteen where its ticket predicted two; that is the honest prior, and QE's independent hop
   is the check, not this one.
2. **That the 63 strings match the PGN specification TEXT.** They match `chess.js@1.4.0` and they
   match a hand derivation done by someone who had already read the table. Where a widely-used
   implementation and this repository could be wrong in the same way, both checks are blind.
3. **That `A1`'s unassisted call form is dispensable.** It changes no verdict across these 13
   mutants — that is a measured statement about these 13 and nothing more. It was delivered.
4. **That `A2`'s 44-cell grid is the right partition.** It is the ticket's, re-derived here; a
   different axis (occupant piece type on a capture, promotion piece, pinned rivals) would produce a
   different census, and `## Out of scope` names the first of those as the `L` trap.
5. **Any wall-clock figure on hardware other than Apple M3 / Node v24.12.0 / darwin arm64**, or under
   a runner other than vitest 3.2.7 — the ~5x vitest-vs-plain-node factor behind the `N5` breach is
   itself an instrument property that another runner may not share.
6. **That `ABC-025` may leave `In Review`.** That exit is QE/E2E's. Nor does this hop close
   `RISK-ABC013-04`, which closes on merge.
7. **That the substrate this hop ran on is sound.** `scripts/claim.js` and `scripts/context-io.ts`
   do not exist in this install and the structured `mcp__grugops__propose_note` tool is not in this
   session's tool set — re-checked at the source, not inherited. The queue claim was taken with a
   plain atomic `mkdir(2)` and these notes were hand-written in the shape of
   `agent-factory/contracts/context-note.md`. **Nothing mechanically validated them**, and
   `index.md` / `index.jsonl` do not exist for this task because nothing renders them. That is a gap
   in the substrate, not in the work, and it is the same gap BA/PM recorded at the cutting hop.
