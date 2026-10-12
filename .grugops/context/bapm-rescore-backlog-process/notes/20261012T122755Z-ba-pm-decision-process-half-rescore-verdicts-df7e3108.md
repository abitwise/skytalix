---
id: 20261012T122755Z-ba-pm-decision-process-half-rescore-verdicts-df7e3108
kind: decision
by: ba-pm
task: bapm-rescore-backlog-process
at: 2026-10-12T12:27:55Z
verified_by:
confidence: high
refs:
  - ABC-056
  - ABC-039
  - ABC-040
  - ABC-030
  - ABC-052
  - AR-1
  - 20261012T122700Z-ba-pm-observation-process-half-readings-bb718725
supersedes:
---

# Process-half re-score: verdicts, owner questions, pull order

This is a hand-authored, unsealed note. The readings are in `…bb718725`. Each verdict is written on its
page as an appended `## Re-score — 2026-10-12` section. Front matter, `plans/board.md` and the column
moves are the Orchestrator's.

| ticket | DoR | recommend | size | priority |
|---|---|---|---|---|
| `ABC-056` | 9 → **10** | **Ready** | XS | P2 (owner: Release Manager) |
| `ABC-039` | 9 → **10** | **Ready** | S | P2 |
| `ABC-040` | 10 → **10** (re-earned: `A1`/`A3`/`A4`/`A5` amended) | **Ready** | S | **P2 → P3** |
| `ABC-030` | 10 → **10** (re-earned: four files → three) | **Ready** | XS | P3 |
| `ABC-052` | 8 → **8** (old ⚠️ discharged, two new ones) | **stays Backlog**; drop under owner answer (A) | XS / S / M by answer | P2 |

**Pull order:**
1. **`ABC-056`.** Two `high` advisories sit under an override whose reason now covers none of them.
   `XS`. It passes under either answer to its owner question.
2. **`ABC-039`.** A false sentence is live on the board every role reads.
3. **`ABC-040`.** The repair is still exact, but it no longer grows.
4. **`ABC-030`.** Last, by its own instruction.

**Overlaps:**
- `ABC-052` no longer depends on `ABC-040` once it appends rows instead of editing cells.
- `ABC-039` and `ABC-040` share no edited line. Each appends a trace row at the tail only.
- `ABC-105` makes nothing here obsolete. It gives `ABC-052` a reusable `parseDone` and a Done-exit
  wiring precedent.

**Owner questions:**
- **`ABC-052` (blocking).** Choose (A), (B) or (C), worded exactly as on the page. BA/PM recommends (A).
- **`ABC-056` (non-blocking).** Choose (a) or (b), worded exactly as on the page.

**For the Orchestrator, not a ticket:**
- Five trace rows do not split to 10 cells (L630, L631, L739, L986, L1010).
- L479 misattributes the malformation to `ABC-052`.
- `ABC-100` and `ABC-154` each have a bare-id row pair that is really two different hops' rows.
