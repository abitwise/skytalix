---
id: 20261010T161218Z-qe-e2e-decision-abc137-verdict-pass-with-gaps-f440af61
kind: decision
by: qe-e2e
at: 2026-10-10T16:12:18Z
verified_by:
confidence: high
refs:
  - ABC-137
  - ABC-136
  - ABC-057
  - ADR-0011
  - R5c
  - QE-136-b
  - QE-136-c
  - QE-137-a
  - QE-137-b
  - QE-137-c
  - QE-137-d
  - src/history-pane.nfr.test.ts
  - 20261010T161218Z-qe-e2e-observation-abc137-ledger-comparison-spans-gate-01c2d8fc
  - 20261010T161218Z-qe-e2e-observation-abc137-gap-register-853f77e5
  - 20261010T155800Z-software-engineer-decision-abc137-one-framed-helper-pin-and-a-five-span-reach-comment-3c71e0a4
  - 20261010T155800Z-software-engineer-observation-abc137-gates-ledger-a1-a4-cost-9e4b2d17
supersedes:
---

# `ABC-137` QE: **PASS_WITH_GAPS**. `A1`–`A4` are MET on QE's own independent harness; QE's committed planters were refused for QE too; no test added; one new LOW gap routed to Architect/Design

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).

- **Scope.** Subtask `qe-ABC-137`, Workflow 04 review exit. Branch `grugops/ABC-137-helper-pin`: tip `455a0846`, code
  `54280bc8`, base `2946e22a`. The authoritative scope and risks are the ticket's `## Scope` / `## Out of scope`.
- **Method.** QE tried its own unchanged planters first. The permission layer refused copying them (`../probe/RUN.txt`),
  and QE did not work around that or ask anyone else to run them. QE wrote its own independent harness
  (`../probe/qe137-*.mjs|sh`), with its own anchors and spellings, the vitest JSON reporter, and biome + tsc per build. It
  read the SE's port only for the comparison. One fresh `git archive` tree per build.

## Verdict per criterion

| | verdict | evidence, in one line |
|---|---|---|
| `A1` | **MET** | `XHELPER-NARROW+FMT` and `+WPERFT-STATIC`: exit 0 12/12 at base → **exit 1** at `54280bc8`. The one failed test is the drift tripwire, on the message "clause 1's one expression is unchanged" |
| `A2` | **MET** | `CONTROL` exit 0, 12 tests. `QSCAN-NARROW`/`QLHS-INTERSECT` (`+FMT+WPERFT-STATIC`) and `M15`/`M15SUB` (`+FMT`) red on the tripwire. `WLAUNDER` fails A6.3, A6.4 and the licence guard; `WSTALELICENCE` and `WPERFT-STATIC` fail the licence guard. Those are the same names as at base. No PLANT-FAILED. QE's ten planter anchors (`HELPER` included) count 1 at base and at head. `XSHADOW-HELPER+FMT+WPERFT-STATIC` is recorded green at both (`QE-136-c`, accepted) |
| `A3` | **MET** | Collapsed text: "it pins four spans of the guard by TEXT" 1 → **0**. The tripwire's `//` comments: `R5c` 0 → 2, "clause 1's helper definition" 0 → 2 |
| `A4` | **MET** | `2946e22a..54280bc8` name-only = `src/history-pane.nfr.test.ts`, +12/−4. The tip adds only `plans/` and `.grugops/context/` (0 `src/` files added). Helper `:163–164` is byte-identical, and the framed helper (real newlines) counts 1 → 1. 11 of 12 `it` blocks hash identically, and so does every byte outside the tripwire `it`. All 18 of the tripwire's base code lines are kept in order, plus one `expect`. The gate is green, skip count 0, integrity `No findings.` |

## Decisions

- **The harness deviation is stated, not hidden.** The ticket defines "planted" as QE's runner with
  `plantqe136.py`/`plantqe057.py` copied unchanged. Neither the SE nor QE could execute them on this host.
  - Two independent harnesses (the SE's line port and QE's own) agree on every shared row, at base and at head.
  - A literal run of the unchanged scripts stays `UNKNOWN - verify`, for a host that permits it (`QE-137-d`, INFO).
- **The reach comment is accurate.** "Five spans by TEXT" matches five `toContain` pins, and four of them are the
  guard's. The comment names the helper's three consumers, and claims nothing about their call sites.
- **No `biome-ignore` was added** (count 1 → 1), as test note 2 expected.
- **QE's own helper narrowings** were each gate-clean and green at base; every one is red at head on the new pin. They
  are a `startsWith`, an `includes`, a regex rewrite, a chained second `.filter`, a block body and a parameter
  rename. Two variants stay green; both fall outside a text pin of the helper:
  - **`H-READDIR-SHADOW`:** the helper's callee is rebound at module scope. Recorded as `QE-137-b`, the
    `QE-136-c` class.
  - **`H-COMMENTED`:** the pinned text is kept in a block comment. This is the class the comment itself names.
- **One new gap, `QE-137-a` (LOW): the composer tripwire's own call site (`:591`) is unpinned.** It was green at base
  too and is outside this ticket's fences. Routed to Architect/Design (`…853f77e5`).
- **No test is added.** Closing `QE-137-a` or `QE-137-b` changes *what is pinned*, which is the Architect's ruling and
  not QE's spelling. Folding it in here would be hidden scope.
- **Cost:** not re-measured, because load1 was 15–35 during this hop. The SE's two admissible sets are cited.
  Structurally, the change is one `toContain` on a string the test already reads.
- **Deep lanes:** none triggered. No production file changed, and nothing on the puzzle-suite trigger list changed.
- **The board move is the Orchestrator's.** The ticket may leave `In Review`. UAT is waived by the standing rule:
  0 production lines, measured. Not merged, not pushed.
