---
id: 20261023T223723Z-architect-design-decision-d7ce173f
kind: decision
by: architect-design
at: 2026-10-23T22:37:23Z
verified_by: 
confidence: high on the ruling (ADR-0015 letter read, cli.ts measured, plants probed in both hosts); in-process cost UNKNOWN - verify (Security/NFR)
refs:
  - ABC-213
  - EPIC-006
  - ABC-203
  - AR-203-UNLINK
  - AR-203-LANEGAP
  - QE-203-b
  - QE-203-c
  - NFR-008
  - N8-SPAWN
  - N8-LANE
  - ADR-0015
  - ADR-0047
  - ADR-0036
  - ADR-0009
  - af4a934c
  - plans/tickets/ABC-213-a-failed-pgn-save-reports-its-first-error-code-even-when-the-cleanup-also-fails-and-leaves-no-partial-file.md
  - bapm-cut-levels-6-7/20261023T213402Z-ba-pm-decision-44bee405
  - bapm-cut-levels-6-7/20261023T213354Z-ba-pm-observation-78d4532b
  - security-nfr-ABC-203/20261023T211544Z-security-nfr-decision-eaaa1133
  - qe-ABC-203/20261023T210415Z-qe-e2e-decision-f28588e1
  - bapm-cut-ABC-200-followups/20261022T201509Z-ba-pm-decision-97a4b809
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - arch-design-ABC-213/20261023T223723Z-architect-design-observation-ecac899f
supersedes: 
seal: sha256:ecc8d171e6921cf1fed1f8cb6cd3b76628a5df7c767e2fb1cf560b909cf7eccb
---

# ABC-213 rig ruled: (b′), the vi.mock("node:fs") double hosted in the existing src/pgn.test.ts; 0 spawns, 0 files, writer child byte-identical; no ADR changed or proposed; ADR-0047 D4 dated line drafted for routing

Architect/Design, task `arch-design-ABC-213`, at `main` `af4a934c`. Full text: the ABC-213 page § Design ruling (2026-10-24) on branch `grugops/arch-design-ABC-213`. The evidence is the observation note sealed with this one.

## Ruling
- **(a) and (c): refused by `ADR-0015`'s letter.** `node:fs` is not a bag supplier. Licensing either would need an addendum scoping the rule to children that run the delivered composition, which is an accepted-ADR change (owner). **Not proposed.** Clause 2: "a widening bought to unblock a ticket is a precedent, not a rule", and (b′) needs none.
- **(b′) RULED.** An in-process double is outside the rule's letter, and standing practice agrees (`engine.capacity.test.ts`, `gameend.nfr.test.ts`). It does not walk round the fence: no product source is replaced, the holder runs whole, and `node:fs` has a published errno contract, so (C) holds. (N) is BA/PM's and holds. 0 spawns and 0 files; it matches the page's Scope 2 and A7.
- **The double:** spread the real module and double only the five holder bindings (and `default`). Unarmed it passes through, and a relative path throws. Armed it re-roots relative paths under the row's mkdtemp (D3's seam without chdir), writes 1 real byte and then throws W, closes and then throws C, throws U or a codeless Error on unlink. A canary asserts the double's marker before the first armed call. The rows are A1 ×2, A2 ×2 (real `games/` read as `[]`) and A3.
- **Fallback:** the same block in its own file (rig (b)), with an `N8-LANE` reading owed.

## NFR
`N8-SPAWN` 0. `N8-LANE`: no file, no spawn, no in-child content. Writer child CPU growth is 0 against the 50 ms target, so no reading is owed by the page's bars. About +0.07 s in-process (indicative) is reported for Security/NFR under `ADR-0036` Ruling 2. ASVS: no row.

## ADR-0047 D4 dated line (drafted on the page, not written; outside this hop's fence)
A reading: on a double fault, removal is best-effort, the first code is reported, and a codeless unlink throw is rethrown (D5). It reverses nothing. This role reads it as below the owner's bar (`…5aaf7cec` item 3). **The Orchestrator confirms when routing.** If it reads the line as a change, the line goes to the owner as INFO first.

## Next move (Orchestrator)
Merge this records branch, then move ABC-213 In Design → Ready for Dev. Queue `ticket-to-pr-ABC-213` (SE, (b′)) after `qe-timing-ABC-203`. Then QE (plants X1/X3/X4/X5, A5 by hand), then In Security/NFR (Ruling 2; closes `AR-203-UNLINK`). Route the D4 line to Architect/Design at the build's records step.

## STOP
None. No accepted ADR is changed or proposed.
