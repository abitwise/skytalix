---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T14:05:34Z
subtask: arch-ABC-265
role: architect-design
ref: .grugops/context/arch-ABC-265/
branch: new grugops/arch-ABC-265 from main (0d7b9d2f) — worktree .claude/worktrees/arch-ABC-265
width: records; any probe ≤ 5 min and wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; deterministic counts only, no timing (a game read holds the host).
---
# Design ABC-265 (TH-1, shared table): write the ADR-0025 amendment
## Read
plans/tickets/ABC-265*.md, ADR-0057 § Inputs for the thread tickets + D2.3, ADR-0025, ADR-0058 (accepted, not in force), src/transposition.ts.
## Do
- Write the ADR-0025 amendment (decision 2, decision 4's last bullet) for the 4×Uint32 SharedArrayBuffer slot with XOR check, key split inside probeTable/storeEntry, node-equal at Threads 1. Status PROPOSED (the owner accepts it — reading (b) lets the build start once it exists).
- Settle ABC-265 open items: does it owe the ≈1 h S2 nps read on top of G6 + profile (EPIC-011 rule vs ADR-0057)? Give one answer with reason; if yes it is an owner ask (> 1 h).
- Name anything the page needs to reach DoR 10/10.
## Fences
memory-bank/50-decisions and your records only; no src/tests/plans/board. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task arch-ABC-265, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result

*2026-11-02, Architect/Design (claude-opus-5-5, task `arch-ABC-265`), records plus scratch probes on
`grugops/arch-ABC-265` from `main` `2a61bd3f`. Not pushed, not merged. Nothing in `src/`, tests, plans or the board
moved. Every probe ran under `flock host-test.lock`, each under 5 min, deterministic counts only, no clock read.
Scratch deleted; nothing left running.*

- **Written: the `ADR-0025` amendment for `ABC-265`, PROPOSED** (end of the file, plus a top dated line). The owner
  accepts it. Reading (b): the build may start now; the merge waits on his acceptance.
  - **Decision 2, first bullet:** four `Uint32` words a slot in one `Uint32Array` over one `SharedArrayBuffer`
    (`keyLo^data`, `keyHi^score`, `data`, `score>>>0`). 2^18 slots, 4 194 304 B. Key split inside
    `probeTable`/`storeEntry`, signatures `bigint`. Slot `keyLo & mask`. Hit = non-zero data word and both XOR
    equations, compared unsigned; at one writer that is exactly today's full-key test. Store 2, 3, 0, 1, plain, no
    `Atomics`.
  - **New rule D2.3 does not state, the verified copy:** `tableCutoff(slot, …)` uses the data and score words the
    check verified, read once at the probe. Otherwise, with several writers, a store between `probeTable` and
    `tableCutoff` hands another key's value to this key, unseen by the check. Nothing stores between the two at
    `Threads 1`, so it is node-equal. The hash move stays a live read of word 2: it is a legality-checked hint, and
    the live read is today's read.
  - **Decision 4, last bullet:** one table per process, shared by every worker. Torn entries read as misses. There
    is one clear per search; how the pool orders it is the TH-2 ADR's. Threading is no longer `UNKNOWN - verify`.
  - Falsifiers T8 (identity), T9 (`G6` below base fires the fallback), T10 (the check and the verified copy). The
    alternatives rejected, the couplings (`ADR-0058`, T2, the token amendment, `ABC-257`/`ABC-258`) and the rollback
    are in the section.
  - `ADR-0057` gets one dated pointer line in § Status.
- **Probe (scratch prototype, not `A3`):** base, head, the copy-the-move variant and a counting build were equal on
  **90/90** fixed-depth rows (`search()` at d1–7 and `chooseMove` at d1–8, six perft roots; move, score, nodes;
  7 698 099 nodes a build).
  - Slot overwritten before `entryMove`: 0 in 40 455.
  - The `ABC-081`/`122`/`208` files ran unedited, **85/85** (default lane).
  - `tsc` passes with the view typed `Uint32Array<ArrayBufferLike>`. Without it, it fails with TS2322, a trap now
    named in the ADR.
  - `arrayBuffers` counts a 4 MiB `SharedArrayBuffer` to the byte.
- **The S2 answer: no.** `ABC-265` owes no S2 nps reading on top of `A4` (`G6` + profile), so there is no owner ask.
  - S2 is "the ticket meets its own mechanical bar". An nps reading is a speed ticket's bar. `ABC-265`'s cost bar is
    `A4`, which the owner-accepted `ADR-0057` names.
  - `probeTable` + `storeEntry` take 0.95–1.44 % of samples. Even doubled, nps would move about 1.5 % at most, below
    the 1.8–5.9 % A/B spread, so a ≈ 1 h ALONE read would report noise. The profile measures the two functions
    directly.
  - The fallback's own overall reading was about 1.00×.
  - The ruling on the `EPIC-011` line stays the Orchestrator's; this is the Architect's recommendation. The fallback
    trigger stays `G6` below base, and the profile is reported.
- **DoR: row 10 met. 10/10 on reading (b) once BA/PM applies two page deltas:**
  - (1) `A2` gains the T10 unit row: overwrite the slot through the handle between `probeTable` and `tableCutoff`;
    `tableCutoff` returns K's value.
  - (2) `A7` and the `adr:` line cite the amendment and the no-S2 answer.
  - Optional: Scope 7 adds header lines `:11-15` / `:17-20`.
  - The board move is the Orchestrator's.
- **For the Orchestrator:**
  - (a) To the owner: *"accept / decline the ADR-0025 shared-table amendment"*. It gates the merge only. The
    Architect recommends asking, not reading OQ-1 as covering it.
  - (b) Rule the S2 line as above.
  - (c) The TH-2 ADR owes the clear/stop ordering and how a worker adopts the buffer.
  - (d) `ABC-267` `A2` may add the probe-then-cutoff case under several writers.
- **Commits:** claim `e9a1f1ff`; ADRs + notes `45a99e16`. This Result and the move to done/ are in the closing
  commit.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at`
  2026-11-02T14:33:10Z from `date -u`; 2 of 2 read back, index rendered):
  - observation `20261102T143310Z-architect-design-observation-6b1aba14` (the probe, artifacts);
  - decision `20261102T143310Z-architect-design-decision-e396e5ab` (the amendment, S2, DoR, open questions).

### Trace row (10 cells, header order)

| arch-ABC-265 | ADR-0025 amendment for ABC-265 TH-1: four Uint32 words a slot over one SharedArrayBuffer, XOR check, key split inside probeTable/storeEntry, store 2,3,0,1, no Atomics; new verified-copy rule for tableCutoff; hash move a live read; decision 4 last bullet one shared table; no S2 nps reading on top of A4; probe 90/90 node-equal (7.70 M nodes a build), 0/40 455 stale, 85/85 unedited rows, SAB counted in arrayBuffers | EPIC-011 | ADR-0025 amendment (PROPOSED; owner's); ADR-0057 dated pointer line; cites ADR-0026, ADR-0058, ADR-0005 F6 | NFR-009 (4 MiB, unchanged), NFR-005 (G6 at Threads 1); no NFR file | `grugops/arch-ABC-265` (records only; claim `e9a1f1ff`, ADRs + notes `45a99e16`) | scratch prototype only (deleted) | — (records) | — | Records done (Architect); awaits the owner (accept/decline), BA/PM page deltas (A2 T10 row, A7/adr line), the Orchestrator's S2 ruling and board move |
