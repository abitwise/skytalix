---
id: 20261022T201857Z-agents-md-scribe-decision-a3aef2d3
kind: decision
by: agents-md-scribe
at: 2026-10-22T20:18:57Z
verified_by: 
confidence: high (each note read in full before the entry was written)
refs:
  - memory-bank/45-standing-rulings.md
  - ABC-189
  - AR-1
  - QE-198-a
  - 20261022T155615Z-ba-pm-decision-9d0dc304
  - 20261022T174000Z-orchestrator-decision-1b62e80b
  - 20261022T180500Z-orchestrator-decision-b935fad8
  - 20261022T174056Z-release-manager-decision-edd18e94
  - 20261022T172640Z-ba-pm-decision-479ce351
  - 20261022T195000Z-orchestrator-decision-e459881c
supersedes: 
seal: sha256:55e5c531926b4430e86755aaecd0b5ecadfc870ce2c67e494f47fa1871449303
---

# Five dated entries carried into memory-bank/45-standing-rulings.md; one item pending for the Release Manager

New section `## Dated entries (2026-10-22)` at the end of `memory-bank/45-standing-rulings.md` (+33 lines). The five existing section headings are untouched.

1. ABC-189 reopen trigger R1 (packaging / installed-launch check), pointer to `…9d0dc304`.
2. Process rule: a ticket that adds a `bin`, a build output or a runtime dependency owes an AR-1 premise re-read before Done, pointer to `…1b62e80b` (and `…b935fad8` for the lifted hold).
3. AR-1 is read from `…edd18e94` alone; the pair-list `diff` replaces the count (its trigger 3).
4. Not in the brief's Do list but named in its inputs: the `QE-198-a` interim re-run rule from `…479ce351`, marked as ended when ABC-199 merges. ABC-199 had not merged on main when this was written (merge held behind ABC-178). The entry says who retires it. If the Orchestrator did not want it, drop the one paragraph.
5. Pending for the Release Manager: AR-1 check 4 is to be spelled `command diff` (`…e459881c`; fail-safe today). The AR-1 record is sealed and was not edited.

Each entry cites its note and states only the operative sentence.
