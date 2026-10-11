---
id: 20261010T185518Z-qe-e2e-observation-abc141-gap-register-baafc88b
kind: observation
by: qe-e2e
at: 2026-10-10T18:55:18Z
verified_by:
confidence: high
refs:
  - ABC-141
  - QE-141-a
  - QE-141-b
  - QE-141-c
  - QE-141-d
supersedes:
---

# QE `ABC-141`: gap register (1 LOW, 3 INFO; none blocks)

This note is hand-authored and unsealed.

| id | severity | owner | gap |
|---|---|---|---|
| `QE-141-a` | LOW | Software Engineer (each hop that runs `npm test`) | **Suite flake, unnamed.** The SE saw one JSON-reporter run at the tip read 1662/1 failed. QE's 8 runs at load1 7.4–24.4 read 1663/0. The failing test is `UNKNOWN - verify`. This is not `ABC-141`: Q4 measure (ii) proves no executable byte changed. **Ask:** any hop that sees a red `npm test` keeps the JSON log (`--outputFile`) and names the test before rerunning. Re-rate it if a named failure recurs. Candidates by duration (unconfirmed) are the multi-hundred-ms search tests, e.g. "A1 — pruned and unpruned scores are identical" (1.4 s in run 8) |
| `QE-141-b` | INFO | none (accepted by the ticket) | **The derive count is unasserted.** The fixture control (`75dcc0f5`: 6) shows a future `SIX_QUEENS_FEN` re-author moves the number with no test going red. The ticket fences an assertion out ("the guard is the ARGUMENT, not the count"). The derivation the comment now carries ("one per checking candidate") is what lets a reader recount |
| `QE-141-c` | INFO | none | **Wording.** `history-pane.ts:56–57`, "the bound is for the first ticket that lets a human or a file supply a FEN to decide", parses only as "is for [that ticket] to decide". It is accurate but reads awkwardly. No change asked |
| `QE-141-d` | INFO | human (git host) | **`host-protection.js` exit 2.** `UNKNOWN - verify`: gh returned no readable HTTP status, so protection on `main` is unconfirmed by this check. This is environmental, not the ticket's |
