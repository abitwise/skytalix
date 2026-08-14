---
task: abc042-docs-2026-08-15
subtask: security-nfr-ABC-042-recheck2
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md
ref: .grugops/context/security-nfr-ABC-042-recheck2/
parent_ref: .grugops/context/quality-gate-ABC-042-regate/
ticket: plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
enqueued_by: orchestrator
enqueued_at: 2026-08-15T21:10:00Z
branch: grugops/security-nfr-ABC-042-recheck2
base: grugops/quality-gate-ABC-042-regate @ d011df4
---

# Subtask: narrow re-check — your four bars against the tree that will actually merge

**Branch from `grugops/quality-gate-ABC-042-regate` @ `d011df4`, NOT from `main`.** `main` is NOT an
ancestor. This subtask file is tracked on `main` and will not exist in your tree; read it before you
branch. Its queue transition is the Orchestrator's.

## Why you are being asked again

**You reviewed `8b07d9f`. That is not the tree that will merge.** Since then: two instrument-repair
hops, a criteria repair, an `ADR-0011` amendment, and a re-gate — and **two of the changes are YOUR
OWN findings being implemented.** A PASS recorded against a superseded tree is a PASS against
something nobody will ship.

**This is deliberately NARROW.** Your `V2.2.1` re-probe, your ASVS L1 row-by-row and your four
accepted risks all stand unless this tree moved them. **Do not re-run the whole review; establish
what changed and whether it changed your verdict.**

## What to check

1. **`S2` and `S3` were TAKEN by the `B1` hop — they are your findings, so the judgement of whether
   they are closed is yours.** `S2`: bar 3 now locates the echoed token by whitespace split instead of
   reading line 0. `S3`: the only-argv-literal scan gained a template-literal alternation. **Confirm or
   reject, on your own evidence.**
2. **`S1` was ROUTED, not taken, and QE disagreed in an interesting way.** The `B1` hop measured bar
   1b's own regexes at **1/1/1 raw and 0/0/0 comment-stripped** and declined to write the row because
   choosing "comment-stripped" settles `Q5`'s open criterion clause by implementation. **QE judged the
   row WAS writable**, on the ground that the bar's own bolded *"call sites, NEVER occurrences"*
   already decides the reading. **You wrote that bar. Say who is right** — this is a wording question
   about your own text and it has now consumed two hops' attention.
3. **All four bars against the merging tree.** Production modules are blob-identical to your review
   (verify, do not assume). **The delivered TEST file has changed substantially** — bar 1b governs it,
   and it has gained near-miss derivation, a draw budget and two instrument repairs.
4. **`E3`, your own open item, is now CONFIRMED LIVE:** QE's `MP10` — a second `process.argv` read in
   the **merged** `src/history.ts` — survives all 856 tests. `A9`'s scope was ruled to the two new
   production modules, and Architect/Design ruled that scope RIGHT and not to be widened, with a named
   future trigger. **Do you accept that, or does `V2.2.2` require more?**
5. **The `ADR-0011` clause 3 amendment** changed the licence admission rule. **It is not an ASVS
   surface** and Architect owns it — but say whether it touches anything you rely on.

## `G1` — unchanged, and still not yours to close

Your escalation stands with the project owner and **the merge is held on it**. Two independent
measurements since yours agree the `B1` work did not move the lane (file-scoped delta −20 ms at
chance; the added family costs 0.0062 ms; zero new spawns). **Do not re-open, re-grade or resolve
`G1`** — if this tree changed the number materially, report the number and say so, nothing more.
**`plans/nfr-catalog.md` and `ADR-0008` stay closed.**

## Boundaries

- **No production behaviour changes, no criterion repairs, no ticket-page edits.**
- **Do NOT write `plans/board.md`** — the Orchestrator's. You MAY correct your own NFRs cell in
  `plans/traceability.md` if it needs it; that cell only, and re-split the row afterwards to assert
  **10 columns**. *(Note: your earlier repair of that cell is on an unmerged branch and is not on
  `main` — check the tree you are in before assuming it is done.)*
- **Never merge, never push, never deploy.**

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable here; do not invent one. Claim per Workflow 17 by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of the task directory. Commit on your branch.

Report: PASS or BLOCKED with severity; each of the four bars MET / NOT MET **against this tree**;
`S1`/`S2`/`S3` closed or not, and your ruling on the `S1` disagreement; your `E3` verdict; whether
anything moved your earlier ASVS L1 result; and every finding with severity, owner and whether it blocks.
