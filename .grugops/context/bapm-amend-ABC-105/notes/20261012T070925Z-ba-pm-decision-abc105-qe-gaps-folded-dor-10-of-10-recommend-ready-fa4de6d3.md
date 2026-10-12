---
id: 20261012T070925Z-ba-pm-decision-abc105-qe-gaps-folded-dor-10-of-10-recommend-ready-fa4de6d3
kind: decision
by: ba-pm
task: bapm-amend-ABC-105
at: 2026-10-12T07:09:25Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - A8
  - A9
  - N8-LANE
  - plans/tickets/ABC-105-qe-hop-detector.md
  - 20261012T070000Z-qe-e2e-decision-abc105-recheck-verdict-buildable-with-page-amendments-72ae8565
  - 20261012T070924Z-ba-pm-observation-abc105-amend-re-measurements-sweep-cutover-malformed-94f479e1
supersedes:
---

# `ABC-105`: all 15 QE gaps disposed of, DoR 10/10, recommend `Backlog → Ready`

This note folds QE's pre-build re-check (`…72ae8565`) into the page. It is an agent `decision`, not a stamp. The
page's `## Scope` and `## Acceptance` are authoritative; this note records why each change was made. My
re-measurements are in `…94f479e1`.

## Dispositions

| gap | sev | disposition | where on the page |
|---|---|---|---|
| QE-105-a | HIGH | **Amended.** Cutover = the `## Done` rows of `git show 9998a544:plans/board.md` (the directive commit): 38 ids, 304 B, written once, never regenerated, no mode in the tool writes it. The 38-vs-40 ambiguity is settled at 38, because the 40 at `e23c8484` adds `ABC-031`/`ABC-076`, which were QE'd under the directive and are `A2`'s proofs. The § Dependencies ordering note is struck. Test note 5 pins the file | § Scope 3, § Dependencies, Test note 5 |
| QE-105-b | HIGH | **Amended.** Condition 3: some refs element names `T` under `A5`'s normalisation (a bare id, a ticket path or a note id). QE measured, and I re-ran: only `ABC-076` flips. `A3` (`ABC-062`) and `A9` (`ABC-073`) are unchanged. `A2` now also states that `ABC-076` must fail under an exact reading | § Scope 1, `A2`, `A5` |
| QE-105-c | MED | **Amended.** `A4` gives expected counts at two named trees (131/38/76/2/15 at `21980135`, 132/38/77/2/15 at `a37a4e12`). It lists all 15 findings by id in 5 classes, including the new "QE'd, off-convention" (5), with an instruction not to loosen the rule to clear them. **QE's "75" corrected to 76**: 75 is the exact-refs count, and QE's line did not sum | `A4` |
| QE-105-d | MED | **Amended. Findings stand permanently, and there is no disposition route in this ticket.** `--sweep` exits 1 at build and while any finding stands. A later gate must read the list, not the code. An owner-closed ticket with no QE hop exits 1 under `--ticket`; the row moves only on the owner's recorded word, and the id stands thereafter. A register of accepted findings is out of scope (it is the external-signal ticket's question). Test note 4's example is rewritten to the tip's real sweep | § Scope 2, § Out of scope, Test note 4 |
| QE-105-e | MED | **Amended.** "Malformed" is defined as three shapes. Missing keys, an inline `refs` and quoted values are explicitly not malformed. The domain is defined per mode. Expected count at build is 0, measured at three trees | `A6` |
| QE-105-f | MED | **Amended.** The convention and the ceiling go to `memory-bank/40-contributing.md` § Conventions. The Scribe tightens `AGENTS.md` first to free room for one pointer line under § QE validation authority. If that cannot be done without losing a reading, there is no `AGENTS.md` edit. `A7` adds `wc -c AGENTS.md ≤ 24,576` | § Scope 1, § Scope 4, `A7`, § Dependencies |
| QE-105-g | MED | **Named in the ceiling, with no rule change.** I rejected the alternatives. A `qe-recheck-*` exclusion is a naming convention nothing enforces, and it would reach one QE folder today. A temporal condition needs a merge or build time the tool cannot read without git. The pre-build note is honest, and the printed covering path shows it at the `Done` exit. `A7` names `qe-recheck-ABC-105` as the example | § Scope 4 quote, `A7` |
| QE-105-h | MED | **Amended.** § Scope 5 is the test seam: exported `parseDone`, `coverage`, and `main(argv, { snapshotIds? })`, plus a one-line CLI wrapper. The test passes the real notes and the snapshot minus the id, in memory. It is not an override, because the command line cannot supply a snapshot. **0 spawns** (the stale "≤ 2 spawns" is struck). Test note 3 now also forbids `--snapshot` | § Scope 5, `A1`, `A3`, `N8-LANE`, Test notes 2–3 |
| QE-105-i | LOW | **Amended.** `N8-LANE` is rewritten in today's terms: 1 file under `tools/`, 0 spawns, `ADR-0035` decision 2 narrow set, 650 ms fixed under R-1, provisional `F` 16 %, vitest 4.1.11 with the runner off and `maxWorkers: 2`, `npm test` collects it and `--dir src` does not. The cost of walking the real notes tree is left to QE's reading | § Security / NFR |
| QE-105-j | LOW | **Amended.** "or its `src/`-side equivalent" is struck. **`PERFT_DEEP=1` 32/32 is struck from `A8`**, because a diff with no `src/` file cannot move perft | `A8`, `N8-LANE` |
| QE-105-k | LOW | **Amended.** 1288/223 are marked as history, with QE's 2607/622. "20 of 38" becomes **30**, re-measured at `e908b8e6` under both refs readings | § Scope 1, § Scope 3 |
| QE-105-l | LOW | **Accepted as information.** `A3` notes QE's count of 2. The board row's "three" is the Orchestrator's to correct | `A3` |
| QE-105-m | LOW | **Amended to `M (3)`** on the board's `M=3, L=5` scale. The cut's label was `M`, and it names what would make it `L`. `L (5)` was rejected: this amendment adds no new piece of work. **The Orchestrator's board row still says `M (5)`** | front matter (unchanged `M`), § Size |
| QE-105-n | LOW | **Amended.** The convention says the folder spells `T` as `ABC-xxx` or `abcxxx`, and `QE115` is cited as unseen | § Scope 1 |
| QE-105-o | LOW | **Partly folded, the rest accepted.** History is condensed to pointers and the page went from 374 to 328 lines. The remaining length is scope and acceptance, which process rule 2 keeps on the ticket, and the budget is a median over ten tickets, not a cap. **The board row's "DoR 9/10 ⚠️" lead is the Orchestrator's to refresh** | § History |

## DoR re-score

**10 of 10** against `agent-factory/checklists/definition-of-ready.md`. The table is on the page.

**Recommended board move: `Backlog → Ready`.** That is the Orchestrator's move, and its row text also needs
the `M (3)` correction and a new lead (QE-105-m, -o). I made no edit to `plans/board.md`.

## Owner questions

**None blocking.** Every disposition above is BA/PM's call inside the scope the owner already set. One is close
to his line and is recorded so he can overrule it: **QE-105-d**. Standing findings are permanent, and an
owner-closed ticket exits 1 at `--ticket` and moves on his recorded word. If he wants a disposition register,
it is a new ticket and his to commission. If he wants drops exempted from his 2026-08-17 rule, that is a
change to his rule, and nothing here assumes it.
