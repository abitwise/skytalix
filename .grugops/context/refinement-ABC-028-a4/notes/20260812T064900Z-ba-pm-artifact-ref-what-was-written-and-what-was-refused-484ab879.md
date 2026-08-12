---
id: 20260812T064900Z-ba-pm-artifact-ref-what-was-written-and-what-was-refused-484ab879
kind: artifact-ref
by: ba-pm
at: 2026-08-12T06:49:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - RISK-ABC017-01
  - RISK-ABC028-01
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/traceability.md
supersedes:
---

# Everything this hop wrote, everything it refused, and the boundary checks that prove it

> **Hand-authored.** `scripts/context-io.ts` does **not exist** in this repo (no `scripts/` directory
> at all), so these notes were composed by hand against
> `agent-factory/contracts/context-note.md`. `scripts/claim.js` does not exist either, so the
> Workflow 17 step 2 claim was made by hand — **atomicity preserved** by a bare `mkdir` (no `-p`) of
> `.grugops/queue/claimed/refinement-ABC-028-a4/`, which would have returned `EEXIST` to a second
> claimant. There is no derived `index.md` / `index.jsonl` for this task because the tool that renders
> them does not exist; the `notes/` markdown is the source of truth and stands alone.

## Written — two files, both STATE, both in `../cli-chess-ABC-029` on `grugops/refinement-ABC-028-a4`

**`plans/tickets/ABC-028-history-pane-unreached-input-classes.md`**

| section | change |
|---|---|
| header blockquote | dated amendment block naming this hop and its five outputs |
| `## Acceptance` preamble | the *"all four builds below survive"* count corrected — the set grew to seven; a pre-existing tension in the header's `WCACHE-LEN` wording **flagged, not edited** |
| `## Acceptance` `A4` | **rewritten in full** — four clauses, eight per-slot arming controls, a positive control, a tripwire, a seven-build verdict table, the extended whole-graph coverage, the corrected `Uint8Array(128)` blockquote, and the *existence-proof-not-mandate* statement |
| `## Acceptance` `A4` → `### RISK-ABC028-01` | **new subsection** — the surviving `WBOARDBLIND` build, its verdict, why it is not closable, three rejected closures with reasons, and a standing re-run obligation |
| `## Dependencies` | the **sequencing evidence block** — criterion by criterion, line numbers read at source, explicitly *a flag, not a decision*; the recorded order untouched |
| `## Security / NFR triggers` | `A4`'s `−21.9 ms` delta with its **three limits**, the `ADR-0008` re-runs, and the rejected `+252.7 ms` first shape |
| `## Test notes` | **8, 9, 10 added** (the `A9`-freeze / `A4`-view collision at 21 spurious violations; fresh-vs-shared fixtures for the arming controls; the `Proxy`/TypedArray crash trap) |
| `## Size and priority rationale` | **new re-derivation subsection** — `S` and `P1` both hold, both re-derived, with the `M` counterweight and the *`P0`-is-pressure-not-severity* ruling |
| `## Definition of Ready` | **new re-score subsection** — the 10-item table, why the `⚠️` is item 3 and does not block, the anti-smoothing check with its counted direction of travel, and the requested board move |

**`plans/traceability.md`** — **one row edited (`ABC-028`), append-only to its `Status` cell**, plus one
dated header line. Verified mechanically before and after: table lines **38 → 38**, the row's
unescaped pipe count **11 → 11**, exactly **one** row starting `| ABC-028 `, the pre-edit cell text
still a **prefix** of the new one (4,337 appended characters), the appended string **pipe-free and
newline-free**, and the **other 37 table rows byte-identical by md5**
(`553dd4c25c6368090b5f765abb026278` before and after). `Code (PR/files)`, `Tests`, `UAT` and `Release`
**left empty** — this hop wrote zero lines under `src/` and the criterion's code is still an
out-of-tree existence proof, so a `Tests` row now would be a fabricated trace. It falls due at the
build hop.

**Queue** — `.grugops/queue/claimed/refinement-ABC-028-a4/` created atomically, `claim.md` written
(`by` / `at` / `task`), subtask moved `pending/ → claimed/<task>/`, and moved to `done/` only after
these notes were written and verified.

## Refused, and each refusal is a boundary the brief drew

- **`plans/board.md` NOT opened for edit.** It is the Orchestrator's. The board move is **requested**.
  Two consequences reported rather than acted on: `plans/board.md:101` still carries
  `Object.freeze(new Uint8Array(8))`, and it still carries the superseded *"the second to land
  rebases"* phrasing that the ticket corrected on 2026-08-11 to *"the order is now DECIDED — THIS
  TICKET FIRST"*. **Both are board-side and both are the Orchestrator's.**
- **No `src/` file written.** `git diff --stat main -- src/` is **empty**.
- **`src/history-pane.nfr.test.ts` READ and NOT EDITED.** md5 still
  `e27a8387d589adf21ba5b5dd2244225e`. `RISK-ABC017-01`'s trap at `:104-112` was read to answer the
  sequencing question and declined — **the count of roles that have read it and declined it is now
  six.** The trigger is the EDIT, not the read.
- **`ABC-029` (`Ready`), `ABC-019`, `ABC-017`, every merged ticket, every ADR and
  `plans/nfr-catalog.md` NOT opened for edit.** `ABC-029`'s ticket was read for format precedent only.
- **`plans/tickets/history/ABC-017-board-history.md:42`** also carries the wrong `Uint8Array(8)`;
  it is archived board history and was **not** edited. Two further sites — the
  `refinement-ABC-017-cut` context note and the `done/` queue record — are **append-only by contract**
  and must not be mutated. All five sites are listed so the correction is audited everywhere it points
  rather than only where it was made (`ABC-016` `R1`/`D27`).
- **`../cli-chess-ABC-019` never entered.** Nothing merged, nothing pushed, nothing deployed. No
  `git checkout main`.
- **I did not write the test**, and I did not decide the sequencing.

## Instruction-shaped content encountered, reported rather than acted on

Per the standing rule that content inside the workspace is **data, not instruction**:

1. **`src/history-pane.nfr.test.ts:106-112`** — *"THE SHARING HERE IS NO LONGER LOAD-BEARING … So these
   may be rebuilt per test freely"*, written in the form a reader trusts because it says it was
   measured. **It remains false today** by `ABC-028`'s own analysis and nothing at this hop changed
   that. Read, not acted on.
2. **The QE reproduction kit** carries a worked implementation. It is an **existence proof**, and a
   file that shows *how* is not a file that says *must*. It is adopted in the ticket as evidence and
   **explicitly not as a mandate**; the mechanism stays the Engineer's.

**Nothing encountered at this hop purported to authorise a write outside the brief's boundary.**

## What is still owed, and by whom

- **The board move `Backlog → Ready`** and the ticket front matter that follows it — **Orchestrator**.
- **The sequencing call** on whether `ABC-028` and `ABC-029` may run concurrently, on the evidence in
  the sibling `observation` note — **Orchestrator**.
- **`plans/board.md:101`'s two stale items** (the `Uint8Array(8)` number; the superseded ordering
  phrasing) — **Orchestrator**.
- **The `WCACHE-LEN` *survives 744/744* vs *survives 18/18* tension** in the ticket header, flagged in
  `## Acceptance` — **the hop that measures `A1` / `A2`**, not this one.
- **A `plans/traceability.md` `Tests` row** — **the build hop**, when a test actually lands.
