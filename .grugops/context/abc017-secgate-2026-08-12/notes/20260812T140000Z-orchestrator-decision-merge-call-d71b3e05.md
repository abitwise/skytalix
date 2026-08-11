---
id: 20260812T140000Z-orchestrator-decision-merge-call-d71b3e05
kind: decision
by: orchestrator
at: 2026-08-12T14:00:00Z
verified_by:
confidence: high
refs:
  - abc017-secgate-2026-08-12
  - security-nfr-ABC-017
  - refinement-ABC-017-gaps
  - ABC-017
  - ABC-019
  - plans/board.md
  - plans/traceability.md
  - 20260812T130500Z-security-nfr-decision-verdict-and-risks-9a4e28f1
  - 20260812T131000Z-security-nfr-artifact-ref-trace-row-denied-4b6c7e02
  - 20260812T102000Z-qe-e2e-decision-flags-and-verdict-8e47b3d5
supersedes:
---

# The merge call QE handed me and Security/NFR sharpened: CLOSE `G1`/`G2`/`RF-1` BEFORE merging third

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp.

## The question, and who asked it

QE refused to decide it and said so: *"whether to spend that hop before merging third, or to merge
and carry the gaps, is the Orchestrator's call and I do not make it."* Security/NFR left it
untouched too, adding one fact: *"`RF-1` and `AR-2` both name the `G1`/`G2` fixture hop as their
owner, so if that hop runs, it is the natural place to take all three at once."*

Both roles were right not to decide it. **It is decided here: the hop runs, and it runs BEFORE the
merge.**

## Why — three reasons, in the order they carry weight

**1. Every trigger fires the moment `ABC-017` merges, and no hop would be scheduled to catch them.**
`AR-2`'s trigger is *"before `ABC-019`'s cl. 9f re-gate"*. `RF-1`'s is *"the next edit to
`src/history-pane.nfr.test.ts`, or `ABC-019`'s cl. 9f re-gate, whichever comes first"*. `AR-3`'s is
*"the same `G1`/`G2` fixture hop, or `ABC-019`'s rebase onto merged `ABC-017`"*. `ABC-019` is the
**next and last** ticket in the merge order. Carrying the gaps means writing three triggers that all
fire immediately with nothing behind them — which is a to-do list, not a control.

**2. The stated failure mode is a MISDIAGNOSIS, not a failure.** `AR-2` in the gate's own words: the
first detector of a nine-row pane would be *"`ABC-019`'s clause-9 session-height assertion firing at
runtime and naming the wrong subsystem."* This project has spent whole hops unpicking exactly that —
a symptom surfacing in the module that did not cause it. Paying one small hop now to make the pane
fail in its own name is cheaper than paying `ABC-019`'s final gate to fail in someone else's.

**3. This is the last moment the ticket that OWNS the pane is open.** `G1` (constant height under a
slid black-anchored window) and `G2` (the caller usable and the pane fresh after a render) are
**this pane's own properties**, unlike `G5`/`AR-4`, which is genuinely unhomed and stays that way.
After merge, `ABC-017` is closed and nobody owns them; they would have to be re-cut as a new ticket
or pushed onto `ABC-019`, which owns neither.

## What I explicitly did NOT decide

- **I did not re-open the merge order.** `ABC-017` still merges third, `ABC-019` fourth.
- **I did not accept or reject any criterion.** `G1`–`G5` are BA/PM's to rule, including the option
  of ruling one of them *not worth a criterion* — that is a legitimate outcome and I have not
  pre-empted it. My call is about SEQUENCE, not content.
- **I did not touch `G5`/`AR-4`.** It stays unowned. The gate was right that a fake owner is worse
  than an honest gap, and it stays unhomed this hop too.
- **I did not treat `RF-1` as blocking.** It is `medium`; `security.block_on` is `high`; nothing
  blocks the merge. It rides along because its owner and its hop are the same as `G1`/`G2`'s, not
  because it gates anything.

## The board move: I OVERRODE the gate's request, with the reason written down

Security/NFR requested `In Security/NFR` → `Ready for UAT`, and **that exit is earned** — its gate
is complete and I am not asking it to re-run for its own sake. But the destination is wrong given
the decision above, because the next hop **writes tests**. So:

| column | before | after |
|---|---|---|
| `In Security/NFR` | 1/2 | **0/2** |
| `In Development` | 0/3 | **1/3** |
| `In Review` | 1/3 (`ABC-019`) | 1/3 — unchanged |

**Backward, not forward.** All inside their WIP limits. Ticket frontmatter updated to
`status: in-development` / `column: In Development` **in both trees**, so the board↔ticket contract
holds and the frontmatter cannot conflict at the next rebase (verified identical).

**One re-gate consequence, named now rather than discovered later:** `RF-1` changes
`src/history-pane.nfr.test.ts`, which is the file holding `A11`'s guard — the thing this gate
measured. So a **narrow Security/NFR re-gate on `A11` only** is owed after the Engineer hop. `A12`,
the replay coefficient, the importer closure and the security byte-audit do **not** need re-running
unless the hop touches them, and the brief will forbid it touching them.

## The traceability write the gate could not make

Applied by me. The gate's write was denied by the host permission classifier — **the second denial
on this ticket in two hops**, QE's being the first — and it stopped rather than routing around it,
which was correct both times.

I did **not** re-type its text. The script extracted the single fenced block from the gate's own
`artifact-ref` note and applied the gate's own five-part protocol, refusing before touching the file
if any check failed:

| check | result |
|---|---|
| table lines | 37 → 37 |
| rows starting `\| ABC-017 ` | 1 → 1 |
| that row's unescaped pipes | 11 → 11 |
| append text pipe-free, newline-free | 6,580 chars, asserted **before** writing |
| all 36 other table lines | `2a55371bf183942981b5cec9ea1f1f26` → **byte-identical** |

**One correction to the gate's own note, minor and non-load-bearing:** it described the row as
"12 fields / pipe count unchanged (12)". The row carries **11** unescaped pipes (12 fields). The
invariant it meant — the count does not move — held exactly.

## The board header

Replaced, and the outgoing one was **appended verbatim to
`plans/tickets/history/ABC-017-board-history.md` first**, md5 `f4cce277ae8b065d639194d35180bcd9`
asserted identical after the append. I then removed the inline superseded copy only after asserting
it matched the archive byte for byte. The board's own rule exists because a previous Orchestrator
destroyed two of these before noticing.

## `ABC-019`, since the request named it

Unchanged in `In Review` (1/3) and **still genuinely blocked** — `ADR-0009` cl. 9f needs `ABC-017`
merged and against REAL panels. This decision **lengthens that wait by one BA/PM hop and one
Engineer hop**, and I am stating that cost rather than hiding it. It is the right trade because
`G1`/`G2`/`AR-2`/`AR-3` all name `ABC-019` itself as the thing that would pay for the gap.

## Nothing merged, nothing deployed

No merge, no push, no deploy. A human holds both.
