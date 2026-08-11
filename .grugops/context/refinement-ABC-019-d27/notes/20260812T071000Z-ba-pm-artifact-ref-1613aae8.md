---
id: 20260812T071000Z-ba-pm-artifact-ref-1613aae8
kind: artifact-ref
by: ba-pm
at: 2026-08-12T07:10:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-016
  - ABC-017
  - ABC-027
  - ADR-0009
  - ADR-0010
supersedes:
---

# Artifacts touched — ONE file — and what each other artifact is OWED. Nothing else was edited.

> **Hand-authored**; `scripts/context-io.ts` absent, `mcp__grugops__propose_note` unavailable. **No
> `finding`.**

## Files changed by this hop

| file | change |
|---|---|
| `plans/tickets/ABC-019-turn-loop-skeleton.md` | **+245 / −14**, one hop header, three defect rulings (`[D49]`–`[D51]`), a fifth size/priority derivation and a fifth DoR re-check |

`git diff --stat` = **1 file**. **Zero `src/` bytes** (`git status --porcelain src/` = 0 lines before
and after). **`plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`,
`memory-bank/50-decisions/`, `ABC-017` and `ABC-027` were not opened for edit.**

Where each ruling landed inside that file:

- **`[D49]`** — `## Scope`, the `[D27]` block's closing sentence, plus a block-wide re-audit note
  recording what was checked and **survived** so the next hop does not re-derive it.
- **`[D50]`** — `## Scope`, the `[D27]` block's IMPORTED bullet.
- **`[D51]`** — `## Dependencies`, attached to **`[C9-4]`**, plus the two sentences in that section
  that `ABC-016`'s merge made false.

Queue, per Workflow 17: `.grugops/queue/pending/refinement-ABC-019-d27.md` →
`.grugops/queue/claimed/refinement-ABC-019-d27/`, plus the registry record `claim.md`. The `claimed/`
parent already existed. `scripts/claim.js` is absent, so the claim used the same atomic `mkdir`
primitive by hand; the registry record says so.

## What each artifact is owed — named here, NOT taken

**`ABC-019` — owed nothing further from this hop's mandate.** It stays `In Review`, held for
`ADR-0009` cl. 9f. What it still owes is unchanged and is recorded in the ticket: the cl. 9f
re-gate (now partially dischargeable), `A20`'s assertion at the rebase after `ABC-027` merges, and the
rebase itself.

**`ADR-0009` — owed at most one optional line, and it is NOT a defect. Owner Architect/Design.**
Its cl. 9b correction block cites the falsified sentence at
*"`plans/tickets/ABC-019-turn-loop-skeleton.md:242` as `main` reads today"*. **The phrasing is
self-dating, so it does not become FALSE when this branch merges** — but the `:242` locator will then
point at a line that no longer carries the sentence. **Non-blocking, optional, no clause involved,
and this hop did not edit any ADR.**

**`src/frame.test.ts` — owed four comment corrections, and they are NOT mine.** `:11`, `:51`, `:54`
and `:671` all say the two panels are unbuilt; **`ABC-016` is merged.** Comment-only, **no assertion
depends on them**. This ticket does not open that file and an Engineer is live in it for `ABC-027`.
**Owner: whoever next has a mandate in that file. Flagged, not taken.**

**`ADR-0010`'s `## Rollback` — still owed, still not mine, and I did not open it.** The Architect
flagged it as carrying the stale narrowing-fixture premise and deliberately left it; the board records
it as queued, not dispatched. **Restated here only so it is not lost, and NOT re-verified at this
hop.**

**`ABC-016`, `ABC-017`, `ABC-027` — owed NOTHING by this hop and none was opened.** `ABC-017` is
referenced only as an unmerged dependency, and its `HISTORY_ROWS = 8` is carried as
**`UNKNOWN - verify`** rather than asserted, because confirming it would have meant reading a ticket
this subtask put out of bounds.

**The re-gate, for the Orchestrator and QE.** `[D51]` gives cl. 9f a stated completion test it did not
have: **the swap ADDS a real-panel run and never REPLACES `A18`'s stub shapes**, and **a re-gate must
report WHICH panels were real.** Partial discharge is possible now; full discharge needs `ABC-017`.

## Evidence paths — one named in the brief did not need to be chased, and one correction to how they read

| brief named | actual |
|---|---|
| `.grugops/context/adr-done-2026-08-12/` | **present**, one `failed-attempt` note, read first as instructed |
| `.grugops/context/design-adr-transcription-fixes/notes/` | **present**, all four Architect notes read |
| `[D27]` at `plans/tickets/…:242` | **that is `main`'s line.** On this branch the block is at `:446-461` after this hop's edit; the brief's own footnote (*"line 242 on `main`; the branch has the amended `## Scope`"*) is what made the discrepancy findable rather than confusing |

**The brief's central premise was checked before it was acted on, and it did not hold for this
branch** — which is what the parent `failed-attempt` note asked the receiving role to do with any
unattributed number or claim. **The premise was true of `main`, and saying which tip a claim is about
turned out to be the whole of this hop's first finding.**
