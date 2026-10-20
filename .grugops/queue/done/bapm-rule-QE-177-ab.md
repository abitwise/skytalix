---
subtask: bapm-rule-QE-177-ab
role: ba-pm
tickets: [ABC-177]
ref: .grugops/context/bapm-rule-QE-177-ab/
held: released 2026-10-21 (qe-ABC-177-timing ended)
---

# BA/PM: rule on QE-177-a and QE-177-b (records only)

The owner's word on 2026-10-21: "yes, BA/PM can rule on QE-177-a and -b".

## Read first
- `.grugops/queue/done/qe-ABC-177.md`.
- QE's open-points note `…02deb2e2` and its gap probes in `.grugops/context/qe-ABC-177/probe/`.
- The ABC-177 page.
- ADR-0046.
- Your step ruling `…e7b3c210`.

## Rule each gap: accept, or cut a test-only ticket
- **QE-177-a (LOW):** the A6 fold dropped the cross-session comparison. A build that shares `held` across sessions now survives the default lane.
- **QE-177-b (LOW):** with U7 at step 1000, a `go` that drops `depth`/`nodes`/`mate` and has no time token can have its budget cut to 2 500 ms unseen. The blind band grows from about 100 ms to about 1 000 ms.

## If you cut a ticket
- Use the next free id, ABC-178.
- It is test-only, and you score it against the DoR.
- **Cost the row against R-174-1 / NFR-008:** it must not re-break the ≤ 10 s lane. If it needs a step finer than ABC-177's, say so.
- Do not reopen ABC-177's scope.
- Also give an INFO ruling on QE-177-c, U8 at depth 1: is it fine as is, or should the literal go back to 10?

## Fences
- Records only: new ticket pages and your notes. Leave them uncommitted.
- No `src/`, ADRs, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`.
- No lane runs and no timing. Never push or merge.

## Publish
- Notes under `ref:`, including a `kind: decision`. Use the sanctioned writer if available.
- `.grugops/queue/done/bapm-rule-QE-177-ab.md` (brief + `## Result`) and `.claim.md`, uncommitted.

## Result (ba-pm, 2026-10-20 22:00Z): **QE-177-a CUT, QE-177-b CUT** (both into `ABC-178`, Backlog, DoR 9/10). **QE-177-c ACCEPTED as is** (U8 stays at step 100)

**Notes** (`.grugops/context/bapm-rule-QE-177-ab/notes/`) are hand-authored and unsealed: `scripts/context-io.js` is
absent from the repo and the kit, and no `propose_note` tool was available.
- **`…7c41e9a2`: the decision**;
- `…3e95b0d1`: artifacts.

### Rulings
| gap | ruling | cost (estimates, not readings) |
|---|---|---|
| `QE-177-a` (LOW) | **Cut.** `ABC-178` R1: session 1 is left holding on `go infinite`, then a fresh session's `stop`/`ponderhit` must write `[]`. Kills QP1. Step 1 000 (U1's); no finer step needed | ≈ 655 nodes, ≈ 4 ms in-thread |
| `QE-177-b` (LOW) | **Cut.** `ABC-178` R2: one `go depth 0` row, outside U7's loop, `3 000 ≤ time ≤ 3 200`. This brings the band back to 100 ms and adds an upper pin. **It needs step 100, which is finer than `ABC-177`'s 1 000 for U7.** It is a new row, not a U7 change. U7 back to 100 (≈ 0.9 s) is rejected | ≈ 25 621 nodes, ≈ 150 ms in-thread |
| `QE-177-c` (INFO) | **Fine as is. The literal stays 100, not 10.** It is in-ticket ({10, 100}), and condition 2 named step 1 000 only. `ABC-171` A7's moves and kill set are unchanged. Depth is pinned at the engine layer. Going back costs ≈ 0.2 s in-thread for no named kill | — |

**Against `R-174-1` / `NFR-008`.** R1 + R2 ≈ 155 ms in-thread, ≈ **+0.08 s of wall** (`ADR-0046` D3's 2-slot model).
That is about 10 % of the predicted ≈ 0.8 s of headroom. `ABC-178` is gated in two ways:
- **it is pulled only after `ABC-177` merges and its A10 reads.** If A10 reads > 9.2 s, BA/PM re-rules R2 first;
- **its own gate** reads `N8-LANE` ≤ 650 ms CPU (B7) and `NFR-008` ≤ 10 s on AC (B8). A reading above 10 s goes to
  the owner. The recommended fallback is to drop R2. No cap moves.

`ABC-177`'s scope is not reopened: the `ABC-178` diff only adds lines (B3).

### Ticket cut
- `plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md`: XS, P2, EPIC-007,
  criteria B1–B9.
- **DoR 9/10.** Item 10 fails: `ABC-177` is not merged (B3/B4 have no base yet), and its A10 is OWED.
- It flips to 10/10 with no re-cut once both land and A10 reads ≤ 9.2 s.
- **Recommended: it stays in `Backlog` until then.** Column moves are the Orchestrator's.

### Owner questions
None new. The quiet window (pausing `oeselg-labs/platform`) is already owed for `ABC-177`, and `ABC-178`'s B7/B8 reuse
it.

### What I did not do
- No commit, push or merge.
- No lane run, no probe and no timing.
- I did not touch `src/`, the ADRs, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, the `ABC-177` page or
  the epic page.
- `../wt-ABC-177` was read only.

### Trace row (for the Orchestrator to append)
`| ABC-178 (B1–B9) | QE-177-a, QE-177-b (QE …02deb2e2); BA/PM …7c41e9a2; EPIC-007 / ABC-167 A6, A7 | — (Backlog, DoR 9/10; after ABC-177 merges) | src/uci-session.test.ts (+2 rows, additive) | — | — |`
