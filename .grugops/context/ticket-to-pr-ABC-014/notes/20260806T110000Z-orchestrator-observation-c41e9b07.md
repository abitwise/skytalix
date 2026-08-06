---
id: 20260806T110000Z-orchestrator-observation-c41e9b07
kind: observation
by: orchestrator
at: 2026-08-06T11:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - src/perft.test.ts
  - plans/traceability.md
  - 20260806T090000Z-orchestrator-decision-3b7c1d24
supersedes: 
---

# CORRECTION to this role's own pull note: the standing perft FEN table holds SIX positions, not seven

The Software Engineer flagged that the pull decision note
(`20260806T090000Z-orchestrator-decision-3b7c1d24`) and the `ABC-014` row in
`plans/traceability.md` both said the standing perft FEN table in `src/perft.test.ts` holds
**7 FENs**. **The flag is correct and the pull note was wrong.**

**Re-counted independently at the source rather than taken on the Engineer's word** — the flag is
about this role's own claim, so accepting it unverified would be the same fault twice:

```
grep -c "^    fen:" src/perft.test.ts   ->  6
```

The six are `startpos`, `kiwipete`, `position-3`, `position-4`, `position-5`, `position-6`
(`src/perft.test.ts`, `name:` at lines 21, 27, 33, 39, 45, 51). The 7th literal that produced the
miscount is an ad-hoc promotion FEN inside a `perftDivide` test — **not a row of the standing
table**. The original count came from a `grep -n "FEN\|fen:"` whose matches included the interface
declaration `fen: string;`; the count was taken off the grep instead of off the table.

**Scope of the correction — one number, and nothing that rests on it moves:**

- The trace row is corrected in place, in the same edit that records this.
- The pull note is **append-only and is NOT edited**, per the note schema. It is corrected by this
  note. It is **not superseded**: exactly one sentence in it is wrong and the rest of it — the
  Definition-of-Ready re-check, the no-design-hop ruling, the ABC-015/RISK-005 re-verification —
  stands unchanged.
- **The Definition of Ready is unaffected.** The premise that mattered was that the table *exists
  and is executable* as the geometry criterion is written over it. Six positions satisfy that as
  fully as seven; `ABC-014`'s acceptance says "every position in the standing perft FEN table", it
  names no count, and no criterion anywhere depends on the cardinality.
- **The pull is not re-opened** and nothing about the board state changes.

Recorded rather than quietly patched because the fault was this role's: a premise the pull note
claimed to have "verified against merged `main`" had in fact been read off a grep. The premise was
real; the number attached to it was not checked as carefully as the sentence claimed. QE and
Security/NFR should read the pull note with that one sentence corrected.
