---
id: 20261104T211719Z-software-engineer-decision-988cd2cb
kind: decision
by: software-engineer
at: 2026-11-04T21:17:19Z
verified_by: 
confidence: high: built to ADR-0071; two D12 readings stated for challenge
refs:
  - se-ABC-282
  - ABC-282
  - ADR-0071
  - ABC-078
  - ABC-221
  - ABC-283
  - NFR-004
  - NFR-008
  - R-0071-3
  - src/engine.ts
  - src/uci-session.ts
  - src/engine.test.ts
  - src/uci-session.test.ts
  - grugops/ABC-282
  - 04ebeb7e
supersedes: 
seal: sha256:f1adb01e12051e640bbe306988dc06070951f6ed51c775bfcc347df7f0f5c4a4
---

# ABC-282 build decisions (ADR-0071, on `main` `22931005`)

Built as ADR-0071 D1–D7 with D12 items 1–4 and 6. No door added. No ADR, ticket, EPIC, board or `AGENTS.md` edit.

## The engine seam

- **Register on `Budget`, not a new parameter.** `budget.incumbent` (`null` unless `softMs` is set) and `budget.beaten` carry the keep. So `aspirate` is untouched and evidence survives across its passes with no plumbing. `deepen` resets `beaten` once per iteration.
- **D12 item 2 as code.** In `runIteration`, per pass: the incumbent is exact when its completed score is above the running `alpha`; a later root move is evidence when that holds and it displaces `best`. Moves are compared by identity, because `orderMoves` keeps `moves`' objects.
- **The incumbent is found by identity, not as "the first move".** D12 needs this: after a fail high, the re-search tries M first.
- **The `< betaIn` half of "strictly inside the window" is not written.** An incumbent at or above `betaIn` stops the root in the same step, so no later move can read the flag. A comment says so (coding rule 8).
- `maxNodes` aborts keep too: D4 says "aborted", not "aborted by the clock".

## Two readings of D12 item 2, stated so they can be challenged

1. **"Evidence stands until a later pass gives newer evidence"** is read literally: only a later M replaces it. If a later pass shows the incumbent exact and above M, and the abort lands with no newer M, the earlier M is still played. It needs search instability across passes. I did not scan for it, so how often it fires is `UNKNOWN - verify`.
2. **The kept score of a pass-1 fail high stays that lower bound**, even when pass 2 completes M exactly: M is tried first there, before the incumbent, so pass 2 gives no evidence. D5 says "its d + 1 score", and D12 accepts a lower bound.

## A deviation the ticket did not foresee: `ABC-221` A10 is re-pointed

That deep row sent `go wtime 3600000 btime 3600000 movestogo 40` and asserted `time >= 59 500`. That is D3's row, where W1 now stops at an iteration boundary, so the assertion cannot hold.
- The three searches now send `go movetime 90000`: the same 59 500 budget (`ABC-221` A7), W1 off, so the ceiling and memory reads keep their strength.
- A fourth search keeps the clock line as `ABC-282` A3 at the ceiling: `time >= 59 500 / 2.3` and wall ≤ 60 000. Read: 27 526 ms.
- The lane grows by one search. The `ABC-221` A10 title still says three.

## Placement

- Default lane: 25 rows added, none in `src/cli.test.ts`, no new file.
- `ENGINE_DEEP`: A0-1, A0-2, A1 (c) in `src/engine.test.ts`; A0-3's exact lines in `src/uci-session.test.ts`. The identity slice is A0-2's position-6 row, deep as ruled.
- Some A2 rows use `softMs = budgetMs`, which leaves the start test out of the way and reads the keep alone. A row at budget ÷ 2.3 stands wherever the scan found one small enough for the lane: A2 (a), (b). `softMs` above the soft fraction is not a shipped value; each row says which it uses.
