---
id: 20261102T170102Z-qe-e2e-observation-ace42c34
kind: observation
by: qe-e2e
at: 2026-11-02T17:01:02Z
verified_by: 
confidence: high: gaps named from this hop's readings; weights are QE's
refs:
  - qe-ABC-265
  - ABC-265
  - EPIC-011
  - ADR-0025
  - ADR-0057
  - ADR-0026
  - ABC-081
  - ABC-122
  - ABC-208
  - ABC-266
  - NFR-005
  - NFR-009
  - NFR-008
  - grugops/qe-ABC-265
  - grugops/ABC-265
  - e5694864
  - cad6ae13
  - 94be445f
  - src/transposition.ts
  - src/transposition.shared.test.ts
  - QE-265-a
  - QE-265-b
  - QE-265-c
  - QE-265-d
  - QE-265-e
  - qe-ABC-265/20261102T153933Z-qe-e2e-decision-1aca37a5
  - se-ABC-265/20261102T152900Z-software-engineer-observation-df9a3b3a
supersedes: 
seal: sha256:e0848f27cd6d708a81ff320b969a3ead14582c9f95be79090d25a6dd9ce01be6
---

# qe-ABC-265 gaps: QE-265-a LOW (no row pins the empty-slot term of the hit rule; QP4 survives every lane); QE-265-b/c/d/e INFO. None blocks the merge; the merge waits only on the owner's acceptance of the ADR-0025 amendment

- **QE-265-a (LOW, the Engineer, optional).** **No row pins the hit rule's "non-zero data word" term.** Plant QP4 drops it and survives the default lane (189/189), `SEARCH_DEEP` transposition (40/40) and the A3 plant mode (0 differ).
  - Why it survives: on a cleared slot the XOR equations give keyLo = keyHi = 0, so only key `0n` can pass them. Even then the hit carries data 0: depth 0 never cuts at `remaining ≥ 1`, and move 0 is never legal. Only `probeTable`'s return changes (slot 0, not −1), and the `vi.mock` hit counters read that return.
  - Base has the same rule (`words[slot] !== 0`). So this is a pinning hole, not a behaviour change.
  - Suggested row: `clearTable(); expect(probeTable(0n)).toBe(-1)`.
- **QE-265-b (INFO, for `ABC-266`'s design).** **Before the first `clearTable`, head fails silently where base threw.** Fresh-process probe, `raw/edge/edge.jsonl`:
  - head's `storeEntry` is a silent no-op on the zero-length view, and `probeTable(0n)` returns 0, a "hit" on an unallocated table. `probeTable` of any other key returns −1;
  - base threw `TypeError` on each of these;
  - after a clear, both builds behave the same, including key `0n`, a key ≥ 2^64 and its truncation.
  - This cannot happen on a shipped path: both recursions clear at entry. But a worker that never adopts the handed buffer would lose every store without an error. `ABC-266` should not rely on a throw to catch that.
- **QE-265-c (INFO).** **On the default lane, only the new file catches a wrong slot index.** QP2 (slot from keyHi) and QP3 (overlapping 2-word stride) are red only in `transposition.shared` (7 and 4 rows). No pre-existing value row catches either.
  - Both change node counts at Threads 1. QE's cross-build A3 reds them: QP2 47 and QP3 32 mismatch lines in plant mode (`raw/plants/QP2.a3-extra.txt`, `QP3.a3-extra.txt`).
  - After the merge, the regression net for the slot mapping is the new file's `slotOf` assertions.
- **QE-265-d (INFO).** **The A1 layout row pins the Engineer's whole-buffer clear** (`wordsOf(slot)` equals `[0, 0, 0, 0]`). The amendment allows a word-2-only clear, and plant QP8 (word-2-only) reds that one row.
  - A later ticket that wants a cheaper clear edits this row. It is not one of `ABC-081`'s, `ABC-122`'s or `ABC-208`'s rows, so no `ADR-0026` ruling is needed.
- **QE-265-e (INFO).** **No test tells the hash move's live read from a read of the verified copy.** Plant QP6 (the amendment's rejected alternative) survives the default lane, `SEARCH_DEEP` transposition, the A3 plant mode and QE's full A3 sample: 1 382 fixed-depth rows, 96 tick-clock rows and 140 game plies, 0 differ (`raw/plants/QP6.a3-full.txt`).
  - This matches the amendment's own probe: 0 overwrites in 40 455 non-cutting hits. The live read is today's read by construction, and the reviewed code does it.
- **Not gaps:** QP7 and QP10 survive as declared (value-equivalent at both call sites). The profile is reported, not graded. Its caveats are in the profile note.
