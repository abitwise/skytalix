---
task: ticket-to-pr-ABC-011
subtask: security-nfr-abc011-regate
role: security-nfr
claimed_at: 2026-08-03T16:05:00Z
claimed_by: security-nfr
resumed_at: 2026-08-03T19:40:00Z
resumed_by: security-nfr
method: MANUAL-BY-HAND
---

Claimed BY HAND, and this record is written LATE. That is the first thing it has to say.

## The interruption, recorded rather than glossed

A first attempt at this subtask ran on 2026-08-03 and was **cut off mid-flight**. What it left behind
on disk was:

- `plans/board.md`, `plans/nfr-catalog.md`, `plans/traceability.md` and `src/zobrist.nfr.test.ts`
  modified and **uncommitted**;
- the board already moved `In Security/NFR` → `Ready for UAT` with a **PASS** verdict and a long
  figure-carrying comment;
- **no typed notes published at all** — the newest notes under
  `.grugops/context/ticket-to-pr-ABC-011/notes/` were QE's, from the review pass before this one;
- the ticket's own front matter still reading `in-security-nfr`, so board and ticket disagreed;
- this subtask still sitting in `.grugops/queue/claimed/`, never transitioned to `done/`.

So the board asserted a verdict the shared verified context did not back. Under the Orchestrator's
"no published notes, no advance" rule that state is **not admissible**, and the project owner has
already declined to merge this ticket once — an unbacked PASS is exactly what must not slip through.

## A pre-existing `claim.md` was found here, and it is superseded rather than trusted

**This file already existed when this run picked the subtask up.** It carried a full
`completed_at: 2026-08-03T19:05:00Z` and an `outcome:` block asserting a PASS with detailed figures,
and a `moved:` line asserting that the `claimed/ → done/` transition had been completed. **The
transition had not been completed** — the subtask was still in `claimed/`. A record that asserts its
own completion while the disk says otherwise is not evidence, and it was treated as none. Its
figures were checked, not adopted; where they reproduced this run says so, and where they did not,
this run's figures are the record. The confirm / could-not-confirm split is set out explicitly in
`20260803T200500Z-security-nfr-observation-1bb8967d` §9.

## What this run did about it

This run **took everything the interrupted run left behind as evidence to be checked, not as its own
conclusions** — the board comment, the catalog prose, the traceability row, and the unexplained edit
to `src/zobrist.nfr.test.ts`. It has no access to that run's trajectory and inherited none of its
claims on trust. Every load-bearing number was re-derived here, on this run's own scripts, in this
run's own processes, with a byte-identical twin carried as a null control by identity.

**The uncommitted prose in the three plan files was REVERTED rather than patched**, and the record was
rewritten from this run's own measurements. It was never committed, so nothing left the audit trail;
and editing another run's numbers into place would have produced a record that read as this run's and
was not. The one thing kept was the `src/zobrist.nfr.test.ts` comment edit — kept because it was
checked and found correct, with one unsupportable sentence withdrawn.

Both legitimate outcomes were open at the start: stand behind the verdict and back it properly, or
reverse the board move and say why. The outcome taken is recorded under `outcome:` below.

## Substrate, degraded — same as all prior subtasks on this ticket

This install has **no `scripts/` directory**: no `scripts/claim.js`, so Workflow 17 step 2's atomic
`mkdirSync` claim primitive cannot be executed and nothing here provides exclusivity. Queue width is
1 and no contention is possible, so the claim is degenerate. `pending/` →
`claimed/ticket-to-pr-ABC-011-sec2/` → `done/` was moved **by hand**, exactly as the queued subtask
file instructed and as every prior subtask on this ticket recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent, so this role's context notes are **hand-written** into
`.grugops/context/ticket-to-pr-ABC-011/notes/` in the schema's exact shape. **No `finding` is written
— none is admissible without a §14 gate to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off`, so no `human:<name>` stamp is available either. Nothing is
self-stamped.** The kinds used are `decision`, `observation`, `claim` and `artifact-ref`. No derived
`index.md` / `index.jsonl` was hand-faked, because the renderer that produces them does not exist here.

## Read before acting

The `ref:` context folder was read BEFORE any gating was done. **It holds 31 notes across five roles,
not the seventeen the queued subtask file and the pre-existing `claim.md` both state** — that
miscount is corrected here rather than repeated: the Orchestrator's pull decision and its two
observations/decisions, the first design hop's four, the Engineer's first four, QE's first four, this
role's OWN first-pass gate (four), the second design hop's four, the Engineer's second four and QE's
second four. Read alongside them: the ticket, the board's column comments, `plans/nfr-catalog.md`'s
`NFR-005` row, and the uncommitted working-tree diff.

---
completed_at: 2026-08-03T20:20:00Z
outcome: PASS (`PASS_WITH_RISKS` in the role's own vocabulary — result PASS, FOUR accepted risks each
  with a named owner, NO required fixes outstanding). **The interrupted run's board verdict is UPHELD
  — but on THIS run's evidence, and with corrections, not ratified as written.** Gate run against
  `security.asvs_level: L1` and `security.block_on: high`; no security finding at any severity,
  nothing at or near `high`, so nothing blocks.
  CONFIRMED INDEPENDENTLY AT THIS RUN: both `NFR-005` bar positions MET with room — startpos
  **296.8–299.3 ns** and kiwipete **304.7–307.4 ns**, own four-tree protocol with a byte-identical
  twin as a null control by identity, against ~450 ns and 432–459 ns bars; the call-count sub-bar at
  **ZERO** predicate calls over **437,077** no-ep nodes of a **518,474**-node walk (81,397 ep-set,
  15.70%), reproduced to the node; the MEDIUM purity defect **CLOSED at HIGH confidence** on this
  run's own **336,000-input** hunt (0 impure, 0 throws) against the **real pre-guard tree `584defa`**
  as control (**14,341** impurities on the identical population, impure on 6 of the same 13
  reproductions); `Z1` and `Z4` both **killed** by `src/zobrist.nfr.test.ts`, verified by running
  them; the whole-key instrument **cannot** resolve the guards' cost, so no number is claimed from it;
  the guards' isolated cost of **about +0.9 ns** on the ep-set/no-capture shape.
  COULD NOT CONFIRM — this run's figures are the record: the interrupted run's startpos
  **300.8–302.5 ns** / kiwipete **309.3–313.1 ns** (this run reads 296.8–299.3 / 304.7–307.4 — both
  MET either way); its worst-case ep ratio **1.446–1.458x** (this run reads **1.401–1.412x**; three
  protocols now span about ±4%, which is itself why the earlier "the spread is resolved" claim stays
  WITHDRAWN); its **+1.6 ns** early-return figure, which this run WITHDREW rather than restated,
  because the same benchmark reads +0.9 to +2.9 ns on cells where that delta is structurally zero;
  its **2.5x** Proxy figure (this run measures the Proxy instrument as unusable in a stronger sense —
  it throws outright without a shim, costs 11.1–13.6x shimmed, and contaminates the un-instrumented
  path 2.0–3.0x); and its **133,200 / 8,847 / 41,700** input counts, which are a different
  generator's and are not carried.
  The uncommitted `src/zobrist.nfr.test.ts` edit was **comment-only** (proved: both revisions stripped
  of comments are md5-identical) and its four-combination deletion table was **re-derived here and is
  correct**, so it is **KEPT** — with one sentence withdrawn.
  The two cost-shaped equivalent mutants QE handed this column are **deliberately NOT pinned**, and
  this gate owns the decline: 0 of 9 call shapes distinguish them, one costs structurally zero through
  the only production caller, and the only instrument that could see them destroys what it measures.
  Owner: Security/NFR at `EPIC-004`.
  Suite **214 passed / 0 failed / 0 skipped** (9 files); lint, typecheck, build all exit 0.
  Board: In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4; ticket front matter moved to match.
  UAT recorded as DEFERRED to `EPIC-006`, not passed. `ADR-0005` still `proposed`; no agent may mark
  it `accepted` and this gate did not. **NO PR — this repo has no git remote. NOTHING MERGED, NOTHING
  DEPLOYED — a human holds both.**
moved: pending/ -> claimed/ticket-to-pr-ABC-011-sec2/ -> done/ticket-to-pr-ABC-011-sec2/ — ALL BY
  HAND (no scripts/claim.js in this install). The `pending/ -> claimed/` half was done by the
  interrupted run; this run completed `claimed/ -> done/` and wrote this record.
