---
id: 20261010T165406Z-ba-pm-decision-r5d-cut-abc140-qe139a-declined-qe010b-c-cut-abc141-bound-declined-4b4929a5
kind: decision
by: ba-pm
at: 2026-10-10T16:54:06Z
verified_by:
confidence: high
refs:
  - R5d
  - ADR-0011
  - ADR-0029
  - QE-137-a
  - QE-137-d
  - QE-139-a
  - QE-010-b
  - QE-010-c
  - ABC-140
  - ABC-141
  - ABC-010
  - ABC-017
  - ABC-019
  - ABC-030
  - ABC-139
  - src/history-pane.nfr.test.ts
  - src/turn-loop.ts
  - src/move-input.ts
  - src/move-input.test.ts
  - src/history-pane.ts
  - plans/tickets/ABC-140-composer-tripwire-call-and-comparator-are-unpinned.md
  - plans/tickets/ABC-141-comments-abc010-leaves-stale-six-queens-count-and-fullmove-bound-pointer.md
  - .grugops/context/design-qe137-2026-10-10/notes/20261010T163938Z-architect-design-decision-qe137-a-is-r5d-a-ticket-qe137-b-accepted-docblock-rides-e86924d7.md
  - .grugops/context/qe-ABC-139/notes/20261010T162452Z-qe-e2e-observation-abc139-gap-register-01750927.md
  - "grugops/ABC-010-fen-semantic-validation@f9d1ff4b:.grugops/context/qe-ABC-010/notes/20261010T164425Z-qe-e2e-observation-abc010-gap-register-2c22980f.md"
  - .grugops/context/wave-2026-09-25/notes/20261010T141247Z-orchestrator-decision-owner-word-uat-q4-5c8e2a17.md
  - 20261010T165406Z-ba-pm-observation-r5d-qe139a-qe010-readings-at-75dcc0f5-faff5369
supersedes:
---

# `R5d` cut as `ABC-140` (`XS`/`P3`, Ready, 10/10). `QE-139-a` DECLINED with a fold-in trigger. `QE-010-b` + `QE-010-c`'s comment cut as `ABC-141` (`XS`/`P3`, Backlog, 9/10 until `ABC-010` merges). The fullmove bound DECLINED

This note is hand-authored and unsealed (degraded posture, `AGENTS.md`). Task `wave-2026-09-25`, subtask
`bapm-r5d-qe139a-2026-10-10`, Workflow 07, branch `grugops/bapm-r5d-qe139a-2026-10-10` from `75dcc0f5`. Items 3–4
were added mid-hop by the Orchestrator. Every premise was re-measured at the tip; the readings are in `…faff5369` and
`../probe/RUN.txt`. The authoritative scope and risks are each ticket page's `## Scope` / `## Out of scope`.

## 1. `R5d` → `ABC-140`, `XS`, `P3`, DoR 10/10 → `Ready`

- The page follows the Architect's spec (`…e86924d7` § 1): two whole-statement framed literals (scan `:591–593`,
  comparator `:595–598`), reach comment five → seven. § 3's clause 1 docblock (`:151–162`) is its own criterion
  (`A4`): three instruments, two properties.
- **`QE-137-d` adopted:** "planted" = the Architect's `plant.mjs` (pinned by sha256) **or an independent harness
  that reproduces the base rows**. The Architect's `ledger.sh` hardcodes private scratch paths. The page says so
  and asks for the Engineer's own loop, which is what BA/PM did.
- **Two additions beyond the spec, both measurement hygiene, not scope:**
  - (a) `ABC-136`/`ABC-137`'s rows are held by byte-identity of the five existing pin statements, not by
    re-running QE's `plantqe136.py`, which no hop has run literally (`QE-137-d`).
  - (b) Test note 2: `plant.mjs`'s `H-SHADOW` anchors on the docblock's first line, so the `A4` rewording must
    keep it or re-anchor.
- **Ordering:** pullable now. Never in parallel with another hop on the file. `ABC-030` is merge order.

## 2. `QE-139-a` (INFO) → DECLINED, with a fold-in trigger

**Premise holds at `75dcc0f5`.** `src/turn-loop.ts:281–282` glosses re-emission as "outcomes that carry a message".
The code re-emits by kind (`:392–395`). `board` is a `command` with `messages: []`.

**Why no ticket:**
- **It is a gloss with a correct counting sentence in the same paragraph.** "SEVEN outcomes are non-advancing and
  only five of them emit a frame" (`:284–285`) counts by kind, as does `PromptOutcome`'s docblock (`:105–106`). The
  formula the paragraph states, `RE-EMITTING non-mutating outcomes`, is right.
  - That separates it from `ABC-139`, where the comment contradicted both its cite and the assertion beside it.
  - Since `ABC-139` merged, the `board` arithmetic is pinned by an assertion that reds on a self-redrawing `board`
    (QE's "expected 7 to be 4").
- **A one-word fix splits a vocabulary rather than fixing it.** "Non-advancing outcomes that carry a message" is
  `ABC-019`'s spec wording (`plans/tickets/ABC-019…:330`). It recurs in `src/cli.test.ts:691` and `:2732`, and as
  the executable identifier `NON_ADVANCING_WITH_A_MESSAGE` (`:2726`).
  - A consistent fix renames an identifier, which is not comment-only.
  - It also edits `src/cli.test.ts`, which `fix-ABC-138` holds now.
  - A comment-only fix to `turn-loop.ts` alone leaves the spec and two tests saying the old phrase.
- **Cost against value.** It is a full hop on a production file (SE, QE, both Q4 measures) for an INFO gap whose
  effect QE recorded as none.

**Fold-in trigger (recorded so it is not re-raised):** the next ticket that edits `runTurnLoop`'s "The render
cadence" paragraph carries this criterion. In collapsed text, "non-advancing outcomes that carry a message re-emit
a frame" goes **1 → 0**. The paragraph says re-emission is by outcome kind (`rejected`, `ambiguous`, `command`
including an empty `board`, the refused `claim`, and `take-back` via `evaluating-terminal`). It stays comment-only
by Q4's conjunction. The `src/cli.test.ts` siblings join only if that ticket already opens `src/cli.test.ts`.

## 3. `QE-010-b` (LOW) → `ABC-141`, with `QE-010-c`'s comment

- **Premise reproduced on BA/PM's own counter:** 6 derives at `75dcc0f5`, 7 at `f9d1ff4b`. The stale "six" is
  stale only on `ABC-010`'s tree.
  - So the ticket is **not independent until `ABC-010` merges**: DoR 9/10, ⚠️ item 3, and it **stays in
    `Backlog`**, with a re-score on the merge (the `ABC-129` precedent).
  - It is not amended onto `ABC-010`'s branch, because that would move the sha under the owner's UAT.
- **Both sites in one ticket.** Fixing one leaves two comments disagreeing (QE's point). The production site is
  comment-only, so UAT is waived if Q4's two measures hold (`…5c8e2a17`).

## 4. `QE-010-c` (LOW) → comment re-point folded into `ABC-141`; the bound itself DECLINED

- **The comment is false now:** "`ABC-010` is the ticket that would" bound fullmove, and `ABC-010`'s scope bounds
  clocks only by round trip. Fullmove 10000 and 1e20 parse on both tips. It rides `ABC-141`: same trigger, same
  measure, one hop.
- **No fullmove upper bound is cut.**
  - No FEN input exists (`ABC-010`'s own "No epic accepts a FEN from a user").
  - No position above 9,999 is reachable by play.
  - Picking a bound is a product choice: refuse a FEN another tool accepts, or render a wide row. Nobody can face
    that choice today.
  - **Trigger:** the first ticket on `ABC-010`'s "trigger back to `P1`" list (a `--fen` flag, a paste command, a
    saved-game load, a FEN-carrying book parsed at run time) carries "fullmove > 9,999: refuse, or render wide" as
    a criterion. `ABC-017`'s accepted limitation stands until then.

## Board and trace

No existing ticket changes column. `ABC-140` is recommended into `Ready`, and `ABC-141` is new in `Backlog`; the
board moves are the Orchestrator's. Two trace rows appended at the end of `plans/traceability.md`.

## Owner questions

None blocking. Two of the declines are BA/PM's calls the owner may overturn. `QE-139-a`: cut it as an `XS` anyway,
and accept the vocabulary split. `QE-010-c`: rule a fullmove bound now rather than at the first FEN-input ticket.
