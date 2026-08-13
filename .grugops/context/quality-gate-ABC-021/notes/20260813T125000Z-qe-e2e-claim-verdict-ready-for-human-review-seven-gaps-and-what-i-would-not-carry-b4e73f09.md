---
id: 20260813T125000Z-qe-e2e-claim-verdict-ready-for-human-review-seven-gaps-and-what-i-would-not-carry-b4e73f09
kind: claim
by: qe-e2e
at: 2026-08-13T12:50:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-021
  - EPIC-002
  - ABC-030
  - ABC-035
  - NFR-002
  - N8-LANE
  - agent-factory/workflows/05-pr-quality-gate.md
  - plans/board.md
supersedes:
---

# `READY_FOR_HUMAN_REVIEW` — eight criteria MET, zero code defects, seven gaps with owners

> **Hand-authored, and recorded as a `claim` rather than a `finding` on purpose.** There is no §14
> gate in this install to issue a `§14-gate#<id>` stamp, `context.human_admission` is `off`, and
> **no verdict record exists under this task**. `confidence: UNKNOWN - verify` is the schema's
> honest floor for an unstamped result; **the measurements themselves were all RUN** and are in the
> sibling `observation` notes with their commands. Nothing here is self-stamped.

## The verdict

**`READY_FOR_HUMAN_REVIEW`.** All four `mandatory_gates` exit **0** with `gate_enforcement` at
`blocking`; **816 passed / 816 on 28 test files, skip 0**; `self_fix_attempts` **0 of 2 consumed**;
**all eight acceptance criteria MET**, each with a named wrong build and a measured verdict; **zero
defects in shipped behaviour** — I wrote no production line and none needs writing for the ticket's
own acceptance to hold. **`EPIC-002`'s last open ticket is deliverable.**

Not `SPLIT_REQUIRED`: three files, `+298/−11`, one type arm and nine loop lines. `S` (2) was right.

**Test-integrity: exit `2` — COULD NOT RUN, and it is recorded as that and never as a pass.**
`.grugops/test-skips.md` does not exist. Exit `2` is not the human-only exit `1` short-circuit, so it
does not force `BLOCKED_NEEDS_FIX` on its own; the skip count behind it is a real, measured **0**, not
an `UNKNOWN`. **I did not create the registry** — it is `H2`, a named human's, and an agent
self-authoring a justification to clear its own gate is the one thing Workflow 05 § step 4 forbids
outright. There is nothing to justify at zero skips.

**`PERFT_DEEP`: RULED NOT REQUIRED — and run anyway.** The rules-core diff is empty for the branch
and for my hop; `PERFT_DEEP=1 npx vitest run src/perft.test.ts` → **32/32, exit 0, 37.47 s**.

## The gaps, with severity and owner. None of them blocks this ticket

| # | gap | severity | owner |
|---|---|---|---|
| **G-1** | **`turn-loop.nfr.test.ts`'s per-ply bar cannot see `keyHistory`, and its header sentence *"`repetitionCounts` at 0 proves the loop derives nothing on its own"* is FALSE after this ticket.** Measured: a build calling `keyHistory` once per ply passes **814/814** unedited. Remedy is one line, named in the derive note, in the file the bar lives in | **MEDIUM** | **`ABC-030`** (the four `*.nfr.test.ts` rewrite). My `A8` (i) is a proxy in the acceptance file, NOT the fix |
| **G-2** | **`ABC-035` contradicts itself three ways** on who owns the unavailable-claim message (scope table → `ABC-021`; scope prose and `## Out of scope` → itself). `plans/board.md` sides with the table. Duplicate work, LIVE. **And the correction: the derive hazard it carries fails LOUDLY — 7 tests red, 4 of them `ABC-019`'s — so the ruling rests on ownership, not on an invisibility that does not exist** | **MEDIUM** | **BA/PM**, before `ABC-035` is built |
| **G-3** | **`src/turn-loop.ts` contradicts itself.** `:105` *"FOUR of these do not advance a ply"* vs `:255` *"FIVE outcomes are non-advancing"* — same set, one file. `:247` *"sixteen transitions"* vs the file's own *"one outcome, TWO EDGES"* and `ABC-019`'s by-trigger table, which makes it **seventeen** | **LOW-MEDIUM** | **Software Engineer** — one hop, comment text, zero behaviour |
| **G-4** | **`plans/traceability.md` disagrees with itself about this diff:** `:2` claims `git diff --stat` reads `1 insertion(+), 1 deletion(-)` (**measured 3/1**) and `+88/−10`, while `:198` reads `+89/−10` (**measured +89**). It also pins `main` at `87e771a` and records a board move as owed that `02fe652` has already made | **LOW** | corrected in **my own append**, not by rewriting his header — this file is append-only by its own convention |
| **G-5** | **No CRITERION says the LOOP owns transition 16 in a form any test could falsify.** A build with the loop's whole claim arm deleted and the seam adjudicating via `keyHistory` passed **814/814**. My `A8` (iv) falsifies it now; the ticket page still does not | **LOW** (criterion gap, not a defect) | **BA/PM**, if the boundary should be held by the page rather than by my row |
| **G-6** | **The human playing BLACK and claiming on its own ply is covered by no acceptance row** — every row drives `humanColour: "white"`, and `A4`'s black run puts the claim on the ENGINE's side. Driven by hand this hop: **CORRECT**, `{draw, threefold-repetition, 0}` at 8 plies | **LOW** | **whoever is next in `src/turn-loop.test.ts`** — one row, no new file. Not worth a hop of its own |
| **G-7** | `.grugops/test-skips.md` absent → test-integrity exit `2` on every gate this repo runs | **INFO** | **`H2`, a named human.** Not mine to fix and I did not |

**One more, flagged by the Engineer and verified by me, in a file neither of us may edit:**
`ABC-035` `## Scope` `:36` cites the `command` outcome as `src/turn-loop.ts:122`; on this branch that
arm is at **`:129`**, moved by the seventh arm and the amended doc comment.

## What I changed, and what I refused to change

**Changed: `src/turn-loop.test.ts` only.** One call-through spy added to the existing
`vi.mock("./history.ts")` factory, and two rows — `A8` (the derive ledger) and `A9` (the widest
refusal message at the narrowest frame). **ZERO new test FILES**, so `N8-LANE`'s binding term moves
by nothing and `ABC-026`'s file-count measurement does not need re-taking on my account. Cost
measured against a null control: **≤ ~200 ms CPU, not distinguishable from the control at ±130 ms**,
against a `≤ 650 ms` allowance.

**Refused:**

- **No production line, in any file.** `src/turn-loop.ts` md5 is `347755ed…` at the start of this hop
  and at the end of it. Every mutant was applied to a pinned tree and restored in a `finally`.
- **`src/turn-loop.nfr.test.ts` NOT opened** — the per-ply bar is proved by it *unedited*, and that is
  part of the evidence. Its hole is `G-1`, named for its owner, not patched by me.
- **The four `*.nfr.test.ts` files `ABC-030` owns NOT opened.**
- **`plans/board.md` NOT opened**, nor `plans/metrics.md`, nor `plans/nfr-catalog.md`, nor
  `memory-bank/`, nor any ticket file but `ABC-021`'s.
- **`.grugops/test-skips.md` NOT created.**
- **No wall-clock NFR number claimed.** `NFR-002` is enforced here as a CALL-COUNT bar, which is the
  clause that binds; the timing half is `A17`'s out-of-tree instrument and is Security/NFR's at the
  gate. I did not re-run it and I do not repeat its figures as mine.
- **No `finding`, no stamp, no `index.md` / `index.jsonl` fabricated.**
- **Nothing merged, nothing pushed, nothing deployed. `main` never checked out.**

## For `plans/board.md`, verbatim and short — the Orchestrator's file, not mine

> **QE `READY_FOR_HUMAN_REVIEW` 2026-08-13 at `quality-gate-ABC-021` — ALL EIGHT criteria MET, ZERO
> code defects, SEVEN gaps, none blocking. 17 named mutants on a md5-pinned tree, 15 killed; the two
> survivors were KILLED by two rows QE added to the existing file at ZERO new test files (814 → 816
> on 28, skip 0; ≤ ~200 ms CPU, inside a null control). `src/turn-loop.ts` md5 UNMOVED — QE wrote no
> production line. Lint/typecheck/build 0, self-fix 0 of 2. `test-integrity` exit **2 = COULD NOT
> RUN** (registry absent, `H2`'s), never read as a pass. `PERFT_DEEP` ruled not required and run
> anyway: 32/32. Coverage of `src/turn-loop.ts` 100 %; with the `ABC-021` rows skipped it is 81.11 %
> and the uncovered lines are exactly the ticket's own. THE DEDUCTION SURVIVES, THE BAR GUARDING IT
> DID NOT: a build deriving `keyHistory` once per ply passed 814/814 with `repetitionCounts` at 0 and
> `gameStatus` at `plies + 1` — `ABC-030` owns closing that in `turn-loop.nfr.test.ts`. `ABC-035`'s
> three-way self-contradiction CONFIRMED for BA/PM, and its derive hazard corrected: it fails LOUDLY
> (7 red), not silently. `src/turn-loop.ts` contradicts ITSELF at `:105` vs `:255`, and `:247`'s
> *sixteen transitions* is seventeen by `ABC-019`'s own by-trigger table — Software Engineer, one
> hop, zero behaviour.**
