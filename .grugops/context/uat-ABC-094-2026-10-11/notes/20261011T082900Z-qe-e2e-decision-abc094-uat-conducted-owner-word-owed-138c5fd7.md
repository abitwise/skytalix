---
id: 20261011T082900Z-qe-e2e-decision-abc094-uat-conducted-owner-word-owed-138c5fd7
kind: decision
by: qe-e2e
at: 2026-10-11T08:29:00Z
verified_by:
confidence: high
refs:
  - ABC-094
  - ABC-095
  - QE-094-a
  - grugops/ABC-094-book-probe
  - 20261011T082600Z-qe-e2e-artifact-ref-abc094-uat-pack-4b00155a
  - 20261011T082700Z-qe-e2e-observation-abc094-uat-run-nine-scenarios-c47971a0
  - 20261011T082800Z-qe-e2e-observation-abc094-not-observable-until-abc095-09cc0bac
  - 20261010T193535Z-qe-e2e-decision-abc094-verdict-a9a9fe1b
supersedes:
---

# UAT `ABC-094` conducted: PASS_WITH_GAPS on the observable half. NOT accepted; the owner's word is owed

This note is hand-authored and unsealed. `human_admission` is `off`, so this is a `decision` by an agent and
never a stamp.

> **Read this first.** "The UAT run passed" means **an agent ran the scenarios and they came back green**.
> It does **not** mean the owner accepted `ABC-094`. Under `AGENTS.md` § Test and UAT authority, the owner's
> own word in session is the only `In UAT` signature. A green agent report is explicitly not that word. Until
> he gives it, `ABC-094` is **UAT conducted, owner's word owed**.

## Result: PASS_WITH_GAPS

- **9 of 9 scenarios PASS** against the real book through the module's public API, at `7362f1f9`, twice and
  byte-identical (`…c47971a0`). That covers known openings, out-of-book quiet, seed repeatability, seed
  variety, weights honoured, missing book, 11 damaged-book cases, no network and no eval, and no read at
  construction.
- **The gaps are what cannot be observed yet, not failures** (`…09cc0bac`). The book in a real game, and
  the warning's stream and once-per-process count, are `ABC-095`'s. Of those, **`QE-094-a` is still open**:
  `ABC-095`'s page does not yet ask for the warning on stderr.
- **Defects found: 0.** There are two INFO observations for `ABC-095`: an out-of-book `bookMove` still draws
  a random number, and a deep illegal entry warns mid-game.

## The question the owner answers to sign

> **Do you accept ABC-094, the book probe, on this UAT (9 of 9 scenarios pass against the real book through
> the module, and the in-game half, including the warning going to stderr, is left for ABC-095 to prove):
> yes or no?**

## What happens next (none of it is QE's)

- **Yes:** the Orchestrator transcribes the owner's word and owns the board move out of `In UAT`.
- **No:** the reason goes to the Orchestrator for routing.
- Either way, BA/PM still owes the `QE-094-a` fold into `ABC-095` `A5` before `ABC-095` is pulled.
- QE has not merged, has not pushed and has not moved the board.
