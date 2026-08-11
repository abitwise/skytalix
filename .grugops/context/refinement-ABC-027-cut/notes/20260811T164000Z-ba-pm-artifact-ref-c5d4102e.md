---
id: 20260811T164000Z-ba-pm-artifact-ref-c5d4102e
kind: artifact-ref
by: ba-pm
at: 2026-08-11T16:40:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-019
  - ABC-027
  - ADR-0010
  - EPIC-002
  - plans/tickets/ABC-027-frame-writer-clears-each-row.md
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - plans/traceability.md
supersedes:
---

# Artifacts written at `refinement-ABC-027-cut`, the BOARD ROWS REQUESTED, and what was deliberately not written

> **Hand-authored** — `scripts/context-io.ts` absent from this repository and from the kit,
> `mcp__grugops__propose_note` not in this session's tools. **No `finding` in this task's notes.**

## Written

| path | what | scope |
|---|---|---|
| `plans/tickets/ABC-027-frame-writer-clears-each-row.md` | **NEW.** `Ready`, `S`, `P1`, `EPIC-002`. Six criteria `A1`–`A6`, each witnessed against the merged writer and three mutants. DoR **MET 10/10**. Carries the merge-order dispute and three flags | BA/PM's own |
| `plans/tickets/ABC-017-bounded-move-history-pane.md` | **AMENDED.** `ADR-0010` cl. 6 applied at **three** sites (D21). `A2`'s assertion unchanged character for character; acceptance stays at **13**; `S` and `P2` re-derived and unmoved; `ABC-027` added to `## Dependencies` as ordering-only; DoR re-derived — **still MET 10/10**, stays in `Ready for Dev` | BA/PM's own |
| `plans/traceability.md` | **ONE row APPENDED** for `ABC-027`. `Code (PR/files)`, `Tests`, `UAT` and `Release` left **deliberately EMPTY** — nothing is built, nothing is gated, nothing is released, and filling them would be a fabricated trace | BA/PM's own |
| `.grugops/context/refinement-ABC-027-cut/notes/` | this note + one `decision` + one `observation` | Workflow 16 |
| `.grugops/queue/claimed/…` → `done/…` | subtask record, Workflow 17, claimed by hand | — |

## BOARD ROWS REQUESTED — `plans/board.md` is the Orchestrator's and was NOT written

Two rows. One new, one edited in place. Both are one line each, per the board's own rule.

**1. NEW ROW, under `## Ready`** (currently `WIP 0/8`, so this takes it to 1/8 — no limit is
approached):

```
- [ABC-027] The in-place frame writer clears each row as it writes it — a narrowing frame leaves stale columns on screen  (owner: BA/PM, size: S, P1, epic: EPIC-002, cut: 2026-08-11 by BA/PM at refinement-ABC-027-cut from accepted ADR-0010 cl. 1, routed by the Orchestrator because ABC-018 merged 2026-08-09 and is CLOSED; **DoR MET 10/10 — BA/PM signed the Backlog → Ready exit; the Ready → Ready for Dev gate is the Orchestrator's and was deliberately NOT taken**; blocked-until: NONE — ABC-018/ABC-014 merged, ADR-0010 accepted, and **INDEPENDENCE WAS MEASURED not assumed**: neither panel module exists on main, no symbol is imported from either, and the whole change runs **681/681 on 22 files, skip 0** with both absent; **ABC-027 BEFORE ABC-019 is FORCED and BA/PM confirms it independently** — cl. 7's criterion fails on the merged writer at 80 and 120 columns and passes on the clause-1 writer; **BA/PM DISPUTES the ABC-027-after-ABC-017 PREFERENCE and recommends the reverse, CONDITIONALLY** — ABC-027 has exactly one ordering constraint while ABC-017's own A13 is "not evaluable until ABC-016 has merged", the two tickets edit DISJOINT line ranges of src/frame.test.ts so the shared-file reason favours neither, and the risk asymmetry is real (ABC-027 changes a MERGED production expression that ABC-019's live Engineer is building against; ABC-017 changes ZERO production lines) — **but if a dev slot opens before this ticket is gated, pulling ABC-017 first beats pulling nothing**; **the whole change was BUILT and gated out-of-tree at the cut**: one expression at src/frame.ts:216 plus one constant plus the header sentence at :27-29, **+66 chars exactly = (H−1)×3**, one \x1b[0J, one write(), 0 stale rows at 80 and 120; **ADR-0010's "three test changes" is FIVE assertion sites across FOUR tests** (:374 and :419 are not named by the ADR and :374 MASKS :376) **and its "first narrowing fixture" clause is FALSE — src/frame.test.ts:735-771 already has one and it ASSERTS THE DEFECT IS PRESENT**, a characterization no correct build can satisfy after this ticket, which A6 replaces rather than deletes; **PROHIBITION carried: no constant-FRAME-width criterion, here or downstream — W varies by design and F4 was measured to fail the CORRECT build**; zero src/ bytes written, since: 2026-08-11)
```

**2. EDITED IN PLACE, the existing `ABC-017` row under `## Ready for Dev`** — the ticket does not
move columns and its size and priority do not change. Suggested addition to the row's parenthetical,
appended rather than replacing anything:

```
; **AMENDED 2026-08-11 by BA/PM at refinement-ABC-027-cut applying ADR-0010 cl. 6 — NO criterion changes, acceptance stays at 13, A2's constant-width ASSERTION is KEPT character for character, size S and priority P2 both re-derived and both unmoved, DoR re-derived and STILL MET 10/10 so the ticket does NOT move back to Ready**; what is struck as MEASURED FALSE is A2's claim that the pane "is expected to be the widest panel and therefore to SET W" — 21–24 columns against the delivered status panel's 45/50/67 — and **D21: ADR-0010 names ONE site and the ticket carried THREE** (A2's parenthetical plus the ABC-014 and ABC-018 dependency lines), so correcting only the named one would have left the ticket asserting it twice, the same shape as D19; ABC-027 added to Dependencies as ORDERING-ONLY with the shared file named and the line ranges measured disjoint; zero production lines, zero test lines
```

**No other board row is requested and no other column moves.** `ABC-016` stays `In Review`,
`ABC-019` stays `In Development`, and neither ticket file was touched.

## Traceability row appended

`ABC-027` | `EPIC-002` | no feature | `NFR-002` (denominator note only, no target moves) and
`NFR-008` / `N8-LANE` (zero files added). `Code`, `Tests`, `UAT`, `Release` **empty on purpose** —
nothing is built. Status cell records `Ready`, the DoR verdict, the forced edge and the disputed
preference.

## NOT written, deliberately

- **Zero `src/` bytes.** `git status --porcelain src/` = **0 lines**. Every harness and the entire
  build-and-gate rehearsal ran on a copy outside the repository, with `node_modules` symlinked.
- **`plans/board.md`** — the Orchestrator's. Rows requested above, not made.
- **`plans/tickets/ABC-019-*.md`** — an Engineer is live in that worktree building `A9b`. Its owed
  criterion **and** its owed prohibition are recorded in the `observation` note with a named owner.
- **`plans/tickets/ABC-016-*.md`** — QE is live in that worktree. Its one stale rationale sentence is
  recorded the same way. `A7` stands; zero production lines; non-blocking.
- **`memory-bank/50-decisions/`** — including `ADR-0010` itself, whose `## Consequences` this hop
  measured to under-count the test changes and to be wrong about the *"first narrowing fixture"*.
  **Recorded and flagged with an owner, not applied.** `ADR-0010` and `ADR-0009` are accepted and
  neither was re-litigated.
- **`plans/nfr-catalog.md`** — no target, bar or measured figure moves; **no new NFR row**, because a
  per-frame correctness invariant with no target to miss belongs in an acceptance criterion. The
  Architect's reasoning was accepted, not overridden. **No lane bar re-derived.**
- **Nothing merged, pushed or deployed.** `main` never checked out. **Nothing relayed to the two live
  agents** — every cross-ticket item above is an on-disk flag with a named owner.

## Gate posture

**No gate was run in this repository and none is claimed.** This hop wrote zero `src/` lines and zero
test lines here, so lint / typecheck / build / test are unaffected and `main`'s **676/676 on 22
files** baseline is untouched by it. The projected shape for whoever builds `ABC-027` —
**681/681 on 22 files, skip 0** — was measured on a copy and is stated as a projection, not as a gate
result. The real gate lands on `ABC-027`'s build, and it will be a genuine one: the screen model at
`src/frame.test.ts:187-188` throws on an unmodelled escape and **five tests go red** until it learns
`\x1b[K`.
