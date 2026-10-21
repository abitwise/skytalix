---
id: 20261021T102707Z-software-engineer-decision-67e9ccc1
kind: decision
by: software-engineer
at: 2026-10-21T10:27:07Z
verified_by: 
confidence: high
refs:
  - ABC-161
  - QE-101-a
  - QE-101-b
  - SEC-101-a
  - grugops/ABC-161
  - 69610c5b
  - plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
supersedes: 
seal: sha256:5a0b1b4f062878a2e1a550ec12c8f229ecad464a83cfbcbd5121a66b54d7f420
---

# ABC-161: STOP before any code edit. A1 and A3 cannot be met as written at base 69610c5b

The brief says stop and report if a criterion cannot be met as written. Two cannot, and both are about the base, so no diff can fix them:
- **A1** needs "P11 green on base". At `69610c5b` P11 is **red on base** (the `A8′` equivalence row, "level 4, call 1"). QE-101-a's gap closed when `ABC-174` re-cut the level table. Fix 1 (`call < 3` or a new seed) would still harden levels 1-3 against P11, but the row already reds it. Whether to keep fix 1 is a scope call for BA/PM.
- **A3** needs "P9d red on both". At `69610c5b` P9d is **green on base** (the slot's "ADR-0045" supplies the `4`). This widens the gap and does not weaken fix 3, which would red P9d on head. But "red on both" is false as written.

A2 (S2c green on base) and the base half of A3 for P9a, P9b, P9c and P9e hold as written.

**Nothing was edited.** `src/cli.test.ts` is untouched, and the branch carries only these notes. No production file and no `AGENTS.md` change. Owed: BA/PM re-words A1 (P11 is already caught on base; keep or drop fix 1) and A3 (P9d is green on base, red on head). Then this hop can be re-dispatched from the same branch or a fresh one.
