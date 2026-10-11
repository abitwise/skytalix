---
id: 20261011T101658Z-ba-pm-decision-fold-qe114-abc144-notes-cut-146-147-148-cb326c4b
kind: decision
by: ba-pm
at: 2026-10-11T10:16:58Z
verified_by:
confidence: high
refs:
  - ABC-114
  - ABC-113
  - ABC-144
  - ABC-085
  - ABC-083
  - ABC-146
  - ABC-147
  - ABC-148
  - QE-114-a
  - QE-114-c
  - ADR-0038
  - ADR-0040
  - NFR-008
  - plans/tickets/ABC-114-four-false-sentences-in-epic-006s-own-instrument-comments.md
  - plans/tickets/ABC-144-npm-test-chokes-the-macbook-air-m3-cut-its-cpu-and-cap-its-cores.md
  - plans/tickets/ABC-085-self-play-ladder.md
  - plans/tickets/ABC-146-abc085s-verdict-run-the-same-ladder-harness-under-plain-node-then-take-a1-a2-at-step-4.md
  - plans/tickets/ABC-147-how-much-of-npm-tests-cpu-is-vitests-per-node-engine-overhead.md
  - plans/tickets/ABC-148-the-binder-count-comment-lists-two-forms-as-open-that-tsc-already-closes.md
  - .grugops/context/qe-ABC-114/notes/20261011T091155Z-qe-e2e-decision-abc114-control-and-a4-strike-5d58ace9.md
  - .grugops/context/qe-ABC-114/notes/20261011T091155Z-qe-e2e-observation-abc114-gap-register-168698b8.md
  - .grugops/context/qe-ABC-114/notes/20261011T091155Z-qe-e2e-observation-abc114-readings-94a87a28.md
  - .grugops/context/qe2-ABC-114/notes/20261011T100544Z-qe-e2e-decision-abc114-qe2-verdict-6da307ca.md
  - .grugops/context/design-ABC-144/notes/20261011T085525Z-architect-design-observation-abc144-handoff-board-and-questions-f3beb336.md
  - .grugops/context/design-abc085-verdict-cost/notes/20261011T100239Z-architect-design-decision-abc085-verdict-runs-under-plain-node-same-harness-adr0038-addendum-2566e813.md
  - .grugops/context/design-abc085-verdict-cost/notes/20261011T100239Z-architect-design-decision-abc144-adr0040-addendum-window-a-rules-k3-7974985e.md
  - .grugops/context/design-abc085-verdict-cost/notes/20261011T100239Z-architect-design-observation-abc085-abc144-cost-arithmetic-from-recorded-readings-nothing-timed-5d70d79e.md
  - .grugops/context/design-abc085-verdict-cost/notes/20261011T100239Z-architect-design-observation-abc085-abc144-handoff-routing-and-owner-questions-be323233.md
supersedes:
---

# BA/PM fold: `ABC-114` re-sized and ruled, `QE-114-c` folded, `ABC-144` page notes, `ABC-146`/`147`/`148` cut

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Worked on** `grugops/bapm-fold-qe114-2026-10-11`, branched from the wave tip `117c1c8e` and rebased
  onto **`4784a69f`**, not `da93cc70`. The wave moved during the hop: the Orchestrator merged `ABC-114`
  (`87dc29a3`) and moved it to `Done`, merged `ABC-094`, closed QE `ABC-085` (`c9183b9c`) and moved `ABC-143` to In Review. Both `ABC-114` § QE
  sections are therefore already on the base, and this branch adds none.
- **Nothing was measured.** No timing, no CPU, no test run. Every number is cited from the notes in `refs`.
- **Not edited:** `src/`, `plans/board.md`, `AGENTS.md`, `ABC-113`'s page, any ticket's `status`/`column`.
  `ABC-114`'s front matter still says `ready`/`Ready` against the board's `Done`. That sync is the
  Orchestrator's.
- **Next free id was `ABC-146`**, checked across every local branch's `plans/tickets/` and `.grugops/queue/`.

## Item → result

| # | item | result |
|---|---|---|
| 1a | `ABC-114` re-size | **`S` → `XS` RECORDED.** The pre-registered trigger fired (STRIKE, `67296100`; QE 13/13). Front matter and § Size and priority |
| 1b | `ABC-114` `P1` trigger | **MET on its letter (`QE-114-a`). Promotion NOT taken. `P2` stays.** Reasons below. The owner may overrule |
| 2 | control clause | **Named.** `A1` (and `A2`): the one-row ablation (the file with only the count row's `expect` removed). `A3`: `cc037b3e^:src/result-screen.test.ts`. `cc037b3e^:src/cli.test.ts` is admissible as a second `A1` control, read per row. `## Test notes` follows. Struck words kept |
| 3 | `QE-114-c` | **Page corrected.** `A2`: the open remainder is `for…of` and a parenthesised `(history) =>` (both `tsc` 0 and green). `for…in` and `catch (history)` are closed by `tsc` (exit 2). A bare `history =>` is counted. `A4`(b): "for any program" → "a reader of Node's `process.stdin` stream". **Follow-ups:** the comment's list is false for two forms, and the `ABC-113` page note is imprecise → **cut `ABC-148`** (`XS`, `P3`). `A4`(b): the comment already has the narrow scope, so no follow-up. `ABC-113` line 64's own narrowing is correct and stays |
| 4 | `ABC-144` `A6` | **Page note:** test count reads **base + 1** (the `A7` pin, `ADR-0040` d3). File count reads base. Any other delta fails |
| 5 | `ABC-085` split | **CUT → `ABC-146`** (`XS`, `P1`, DoR 9/10). Pointer notes on `ABC-085` § Dependencies and under its cost table |
| 6 | `ABC-144` `A2` / Window B | **Page notes:** `A2` expects 3 at head (bar stays ≤ 4; the owner's k wins if he picks another). Window B logs `thermalpressurelevel` before and after every run, and `CPU_Speed_Limit` is never a reading. A background `ABC-146` run is a hop for window purposes |
| 7 | the vitest overhead question | **CUT → `ABC-147`** (`XS`, `P2`, a probe), not just an observation. Reason below |

## Ruling on the `ABC-114` `P1` trigger

- **The letter is met.** "A fifth false sentence found in the same two files": `QE-114-a` is one.
- **Promotion is not taken.**
  1. A priority orders waiting work. `ABC-114` is built, has passed its second QE (PASS_WITH_GAPS), and is
     merged. `P1` on it would order nothing.
  2. The sentence was written inside the repair and caught before merge by the ticket's own `A7` validator.
     That is what `## Risks` predicted, and `A7` working. The trigger's first clause, a hop routing work off
     one of these sentences, has never fired.
  3. What is left is sized on its own: `ABC-148`.
- **The defect was in the trigger's wording.** It did not say the sentence had to be found on `main`.

## Why `ABC-147` is a ticket and not an observation

- Removing a 4.35x factor recovers 1 − 1/4.35 ≈ 77 % of the CPU it inflates. Production code at ~21 % of the
  lane's CPU would match `ABC-144`'s K3 cut (−16.48 %). Under ~6.5 % it is worth under 5 %.
- Nothing on record bounds that share. The engine-heavy default-lane files are many, so a large share is
  plausible, and the reading is one hop with no code.
- The decision rule is fixed on the page before the reading: R ≥ 15 % → a `P1` lever ticket; 5–15 % → the
  owner; < 5 % → closed.

## `ABC-146`: what it waits for

- The owner's acceptance of the `ADR-0038` addendum. If he declines, `A1`–`A4` are cancelled, and the
  ticket becomes the run inside vitest at ~43.5 h, re-scored before it is pulled.
- `ABC-083`'s merge, for the verdict (`A5`).
- `ABC-085`'s merge, including `fix-ABC-085` (`QE-085-a`/`b`/`c` rows), for the move. **The split trigger
  fired during this hop:** QE passed `A3`–`A6` at `3783ae15` (wave `c9183b9c`). The page was first written
  before that landed and was corrected after rebasing.

## New tickets

| id | size | priority | DoR | UAT | recommended placement |
|---|---|---|---|---|---|
| `ABC-146` | `XS` | `P1` | 9/10 (⚠️ item 10) | waiver expected | `Backlog` until the owner accepts and `ABC-083` merges |
| `ABC-147` | `XS` | `P2` | 10/10 | waiver expected | `Ready` |
| `ABC-148` | `XS` | `P3` | 10/10 | waiver expected | `Ready` |

## Board moves recommended (the Orchestrator's to make)

1. **`ABC-146` → `Backlog`** row, waiting on the owner's word on the `ADR-0038` addendum and on `ABC-083`.
2. **`ABC-147` → `Ready`** and **`ABC-148` → `Ready`**. Ready goes from 4/8 to 6/8 on the board at `4784a69f`.
3. **`ABC-114` row in `Done`:** refresh its text to `XS`, `P2`, and sync the page's `status`/`column`.
4. **`ABC-085` row:** "DoR 7/10, needs ABC-087 + ABC-086; ~5 h opt-in run" is stale. It is 10/10, and its
   verdict now lives on `ABC-146`.
5. **Next free id: `ABC-149`.**
