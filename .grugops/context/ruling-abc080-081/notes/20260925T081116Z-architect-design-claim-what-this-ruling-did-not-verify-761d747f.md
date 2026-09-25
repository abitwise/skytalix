---
id: 20260925T081116Z-architect-design-claim-what-this-ruling-did-not-verify-761d747f
kind: claim
by: architect-design
at: 2026-09-25T08:11:16Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-080
  - ABC-081
  - NFR-005
  - NFR-009
supersedes:
---

# What this ruling did not verify

- **All depth readings come from a prototype, on one machine (Apple M3), under background load
  (load average 3.6–4.5), on two positions.** The build's own `A7` and `NFR-005` measurements
  replace them. `NFR-005`'s depth-7 level is PROVISIONAL pending non-M3 measurement, and so is
  everything here.
- **The `ABC-080`-only depth row (5 / 5) came from the four-way parallel run.** Its ms are
  inflated, so the true reading may be the same or better. It was not re-run sequentially.
- **Null move and LMR were checked for score agreement on two positions only.** That they keep
  game quality is not verified.
- **Pseudo-legal search (C3) was not probed.** Its 2.6x is `ADR-0003`'s perft-path figure.
- **The probe has no in-tree repetition.** `ABC-081`'s repetition scan adds a backward scan per
  node (`ADR-0002` prices it at 9–23 ns/node) and was not timed here.
- **The `NFR-009` draft's 16 MiB level is a judgment from one baseline.** No platform memory
  budget exists on record to derive it from.
- **The probe runs under node, not vitest.** QE measured the engine about one ply shallower under
  vitest (`ABC-079 (qe)` trace row).
- **Clock note.** This hop's system clock read 07:52Z at the claim, which is earlier than the
  enqueue stamp (12:30Z) and the BA/PM notes (12:05Z) of the same day. The stamps here are the
  system clock's, as read. Why the clocks disagree was not investigated.
