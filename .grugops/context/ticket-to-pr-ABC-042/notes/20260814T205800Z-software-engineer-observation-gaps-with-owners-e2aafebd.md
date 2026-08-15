---
id: 20260814T205800Z-software-engineer-observation-gaps-with-owners-e2aafebd
kind: observation
by: software-engineer
at: 2026-08-14T20:58:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - N8-LANE
  - ADR-0011
  - plans/board.md
  - plans/traceability.md
supersedes: 
---

# Every gap this hop found, with its severity and its owner

Seven. **None of them is a failing criterion** — all twelve are MET — and none is repaired here,
because none is this hop's to repair.

| # | gap | severity | owner |
|---|---|---|---|
| **G1** | **`N8-LANE` is breached: 1240 ms CPU net against a 650 ms bar (1.9x)**, median of 7 paired rounds, sign 7/7. ~1000 ms of it is the ten child processes the criteria require, and **no conforming build is cheaper** — the arithmetic is in `…observation-n8-lane-measured-78268cf3`. It needs a human decision of the same shape `ABC-025` got (accept as an owned risk at 1.6x) or a re-scoped bar, and it **cannot be closed by this build** | **medium** — no correctness impact, and `NFR-008`'s own 13 s total still holds at ~10.7 s; but a stated bar is breached and `gate_enforcement` is `blocking`, so it is a decision, not a note. **Security/NFR may grade it higher at the gate and that is theirs to do** | **BA/PM** (the bar's owner at each cut), **checked by Security/NFR** at the gate |
| **G2** | **The spawn count is 10, and the ticket says "single digits".** It is G1 in another unit. The floor is forced: `A1` needs the bare `npm run <name>`; `A4` names three colour runs; `A6`(iii) names four argvs verbatim; bar 3 says "spawn once". I looked for a merge for every one and there is none that does not change a criterion's meaning | **low** | **BA/PM** — either the guidance moves or one of the e2e halves does |
| **G3** | **`plans/traceability.md` has no row for `ABC-042`.** The role normally appends one; `A12`'s file list and the subtask's hard limit both say the diff is six paths and **nothing else**. I obeyed the criterion and left the row **owed and untaken** rather than failing `A12` to satisfy a workflow step | **low** | **Orchestrator**, at the merge hop |
| **G4** | **The board move `In Development -> In Review` is owed and untaken.** Workflow 04 gives that transition to this role; the subtask reserves `plans/board.md` to the Orchestrator and the human. Recorded rather than taken | **low** | **Orchestrator** |
| **G5** | **`npm` writes two banner lines on the child's STDOUT before the entry point writes anything.** `A1`'s "the process writes a frame of exactly N rows" is therefore asserted as a byte-exact **tail** plus "zero frame rows before it". Not a defect in either the build or the criterion — a scoping fact that the next reader of `A1` should not have to re-measure | **low** | **BA/PM**, if `A1` should say "the script's output" |
| **G6** | **`ADR-0011` clause 3 still says "game-owning driver" while the second licence entry is a composition root.** Architect/Design flagged this and dated its trigger *"now — it fires the day `ABC-042` lands"*. **It has landed.** The property is satisfied and nothing is blocked; the sentence describes the class it happened to match rather than the class it names | **low, non-blocking** | **Architect/Design**, via an `ADR-0011` amendment hop (their route, unchanged) |
| **G7** | **`A12` says the licence gains "its citation line", singular; the citation Architect/Design supplied is a five-line paragraph.** The delivered numstat on that file is **+7 −1**, not +2 −1. The text pasted is theirs, verbatim; only the word "line" is narrower than the ruling it points at, so the bound reads as breached to anyone checking the word instead of the ruling | **low** | **BA/PM** — one word (`its citation`), or a pointer to the ruling |

## What I did NOT raise, so the list is not padded

- **The `--difficulty` gap in `EPIC-006`'s acceptance criterion #4.** The ticket already names it as
  out of scope and unmet; nothing changed.
- **Packaging (`EPIC-006` #1, `npx <package>`).** `A10` holds the fence and it holds — no `bin`, no
  `main`, `private` still `true`. It is undecided **by design** and no part of this build nudges it.
- **`process` aliasing to dodge `A9`(2)** — Security already recorded it as considered-and-declined,
  and the delivered assertion (`exactly one occurrence`) catches it anyway: zero is not one.
- **The six rejection children each loading the whole engine before rejecting.** It is a real ~450 ms
  of the lane cost and a dynamic-import fix exists, but the result still misses `N8-LANE` and the
  complexity is what coding rules 5 and 7 forbid. Measured, declined, and recorded in the `N8-LANE`
  note rather than dressed up as a follow-up ticket.
