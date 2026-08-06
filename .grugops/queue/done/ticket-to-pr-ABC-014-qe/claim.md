---
task: ticket-to-pr-ABC-014
subtask: qe-abc014-break
role: qe-e2e
claimed_at: 2026-08-07T09:50:00Z
claimed_by: qe-e2e
done_at: 2026-08-07T10:30:00Z
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has no `scripts/claim.js`, so Workflow 17 step 2's atomic `claimTask`
could not be executed. The claim directory was created with a plain `mkdir` — still atomic, still
`EEXIST` on a second writer — and this registry record was written into it. Width is 1 and no
contention was possible, so the claim is degenerate. Recorded rather than glossed, exactly as the
queued subtask instructed and as every prior task on this board recorded.

DEPENDENCY CHECKED AT THE SOURCE, not taken from the activating prompt: `depends_on:
ticket-to-pr-ABC-014-dev` is present in `.grugops/queue/done/ticket-to-pr-ABC-014-dev/` with its own
`claim.md` carrying `done_at: 2026-08-06T10:40:00Z`. The chain is satisfied.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-014/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a stamp — and nothing is self-stamped.**
The kinds used are `artifact-ref`, `observation` (×3), `decision` and `claim`.

The `ref:` context folder was read IN `at` ORDER BEFORE any test was written, all nine notes: the
Orchestrator's pull decision, its `ABC-012` observation, the Engineer's layout decision, its
artifact-ref, its mutation observation, its NFR claim, its handover observation, its metrics
observation, and the Orchestrator's own CORRECTION note
(`20260806T110000Z-orchestrator-observation-c41e9b07`) — which corrects the pull note's "seven perft
FENs" to six. The corrected number was re-counted at the source here too, and the six FENs
transcribed into `src/render.test.ts` were machine-compared against `src/perft.test.ts`: the sets
are identical, and the only extra match in a naive grep is the interface line `fen: string;` — the
same artifact that produced the original miscount. The ticket, `EPIC-002` acceptance `2a` / `4a` and
amendments `[A1]` / `[A4]`, and `AGENTS.md` were all read at the source.

DONE CONDITION MET: verdict **PASS** on `ABC-014`. 10 tests added to `src/render.test.ts`, suite
243 → 253 on 11 files with skip count 0; lint 0 errors, typecheck and build exit 0; `src/render.ts`
100% on all four coverage axes and **md5-identical to the Engineer's** after 16 mutate-and-restore
cycles, so no production code was changed. 10 new mutants, one of which survived all 17 delivered
tests and is now killed; 4 of the Engineer's re-run as a control; two delivered assertions shown
blind by experiment; the 22 unverified snapshots closed by a FEN-text oracle. The
`In Review → In Security/NFR` board move made — the one exit this role owns — and
`plans/traceability.md` updated in exactly one row. No E2E was written and none could be, which is
reported as a gap rather than filled with a fake. Nothing was merged and nothing was deployed — a
human holds both.

TRANSITIONS, ALL BY HAND:
  pending/ticket-to-pr-ABC-014-qe.md
    -> claimed/ticket-to-pr-ABC-014-qe/ticket-to-pr-ABC-014-qe.md   (2026-08-07T09:50:00Z)
    -> done/ticket-to-pr-ABC-014-qe/                                (2026-08-07T10:30:00Z)
The whole claim directory moves, keeping this registry record beside the subtask file — the shape
`done/ticket-to-pr-ABC-014-dev/` already uses on this board.
