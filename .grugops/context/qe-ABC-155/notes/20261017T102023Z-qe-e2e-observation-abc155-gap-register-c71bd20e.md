---
id: 20261017T102023Z-qe-e2e-observation-abc155-gap-register-c71bd20e
kind: observation
by: qe-e2e
at: 2026-10-17T10:20:23Z
verified_by:
confidence: high
refs:
  - ABC-155
  - ABC-153
  - QE-153-a
  - QE-153-b
  - QE-153-c
  - QE-155-a
  - QE-155-b
  - QE-155-c
  - QE-155-d
  - AR-145-CLI-WIRING
  - 20261017T102023Z-qe-e2e-observation-abc155-plants-0877aec3
supersedes:
---

# QE `ABC-155`: gap register (none blocking)

Hand-authored and unsealed. None of these is a criterion of `ABC-155`, and every criterion is MET.
`QE-153-a`, the gap this ticket was cut for, is **closed**: `Q-PREFIX` and `Q-PREFIX63` are green on the
base test and red on the head test.

| id | severity | owner | gap |
|---|---|---|---|
| `QE-155-a` | LOW | BA/PM (decide whether to cut or accept; SE if cut) | **A compare that keeps the last hex char and drops any other position passes the head test, 19/19.** Two plants show it: `Q-SUFFIX8` (`actual.slice(-8) !== expected[file].slice(-8)`) and `Q-SKIP8` (`slice(8)`). Both also pass on base. The page's *Value* line says "the lane catches a check that compares less than the whole digest". That over-claims: the lane catches a check that drops the **last** char. `A1`/`A2` as worded (they name `Q-PREFIX`) are met. One more near-miss, on the FIRST char, kills `Q-SUFFIX8` (scratch reading `T-FIRSTCHAR` × `Q-SUFFIX8` is red). With last + first, both contiguous narrowings would be caught. No finite set short of one near-miss per position pins an arbitrary subset. This is the same class and the same promotion trigger as `QE-153-a`. |
| `QE-155-b` | INFO | none | **The full-length compare is pinned for `e.tsv` only.** `Q-SPARE-E` (full compare for `e.tsv`, an 8-char prefix for the others) passes both tests. The narrowing has to be file-dependent to survive, which no plausible edit does. No action. |
| `QE-155-c` | INFO | none | **`QE-153-c` is now stale, and the change is positive.** The restore after the last file (`e.tsv`) used to be observed by nothing. The near-miss case runs after the loop and depends on it: `T-NORESTORE-LAST` is red, because the refusal carries the altered actual instead of `own`. The page's *Out of scope* says the ticket "does not set out to observe it". It does so incidentally. No action. |
| `QE-155-d` | INFO | Orchestrator (record only) | **The brief's "ONLY hop running (width 1)" was overtaken during the hop.** `main` `e7d9d657` set width 3 and dispatched `ABC-056` and `ABC-039` beside this hop. No timing was read, so no reading is affected. |
| `QE-153-b` (`Q-CASE`) | INFO, closed no-action (unchanged) | none | Re-read: green/green, equivalent, as the page records. |
| `AR-145-CLI-WIRING` | accepted residual (unchanged) | none | Out of scope by the page. The diff touches nothing outside the `A1/A2` `it`. |
