---
id: 20260815T192600Z-qe-e2e-observation-every-remaining-gap-with-severity-and-owner-c6e17067
kind: observation
by: qe-e2e
at: 2026-08-15T19:26:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q1
  - Q2
  - Q3
  - Q4
  - Q5
  - Q6
  - Q7
  - Q8
  - Q9
  - Q10
  - B4
  - B5
  - E3
  - G1
  - R5
  - A9
  - A12
  - AGENTS.md
  - src/history-pane.nfr.test.ts
supersedes: 
---

# Every remaining gap, with severity and owner — and every one of mine that is now CLOSED

Continuing my own `Q1`…`Q10`. The engineer's `G1`…`G8`, the fix hop's `E1`…`E4`, Security/NFR's
`S1`…`S3` and the `B1` hop's `B1`…`B5` all stand.

## CLOSED by this hop, each on evidence I produced myself

| # | status |
|---|---|
| **`Q1`** | **DISCHARGED.** `A6`(i)'s near-miss family, complete over position, kills all eleven membership weakenings I built — including four the record did not have, aimed at the **middle** of the string and at **truncation** rather than only the front. Every kill attributed to that row specifically |
| **`Q2`** | **DISCHARGED.** All ten `process`-acquisition and argv-branch spellings die on `A9`'s row, including `MP8` — **one read, but a branch on argv after the resolver returns**, which no prior census built and which the identifier count alone cannot see. The set of ways to branch on argv after the resolver is closed by three independent rows |
| **`Q4`** | **CLOSED, reproduced in both directions.** Old instrument + CONTAINS filter: **did not terminate in 60 s**. Tip: **RED in 1.27 s**. Control (old instrument, filter untouched): green — so the hang is the mutant, not the old instrument |
| **`Q6`** | **CLOSED.** The spawn pin is closed at its source, not at the wrapper. `MS1` (an eleventh child via a direct `spawnSync`) and `MS2` (a namespace import of `node:child_process`) both **RED** |
| **`Q7`** | **CLOSED.** A binding published on `globalThis` without `export` reds `A2` **and** `A9` |

## Open, and NOT mine to close

| # | gap | severity | owner |
|---|---|---|---|
| **`Q9` = `G1`** | **`N8-LANE` breached.** Formal figure of record: Security/NFR's **NOT MET at 2.00×**. Re-measured this hop only to answer *"did `B1` move it?"* — **no**: file-scoped delta −20 ms with the sign **at chance** (3/9), and the added family costs **0.0062 ms**. Zero new spawns | **MEDIUM**, and **NOT MINE TO GRADE** | **PROJECT OWNER** — escalated, unanswered, ticket **HELD at the merge**. My result does not lift that hold |
| **`Q3` = `R5`** | **The merged licence guard's `toEqual` can be weakened to a containment with nothing asserting it** (my `M15`, survived). The delivered build does **not** do this — comparator intact at `src/history-pane.nfr.test.ts:335`, verified again this hop | **MEDIUM** | **Architect/Design** — registered as `R5` in `ADR-0011` this hop and **routed to a new ticket**, correctly: `A12` bars that file, so asserting it here would breach `A12` to protect `A12` |
| **`E3`** | **`A9`'s scope is the NEW production modules, and I confirmed the hole is live**: `MP10` — a second, unvalidated `process.argv` read placed in the **merged** `src/history.ts` — **SURVIVES all 856 tests.** This is a ruled scope, not an oversight; what catches it today is `A12`'s byte-identity read, which is **diff review, not an assertion**, and I performed that read (18/18 blob-SHA identical) | **LOW–MEDIUM** | **Security/NFR** — stated accurately by the fix hop; I confirmed it by building it rather than repeating it |
| **`Q5` / `B4`** | **`BAR 1b`'s regexes count occurrences, not call sites.** Re-measured at my hand: raw **1/1/1** (all in the file's own docblock), comment-stripped **0/0/0**, `spawnSync` argv an array literal, one call site. Property **MET**; the bar's stated mechanism false-REDs the correct file. **I judge the row WAS writable** under the bar's own *"call sites, NEVER occurrences"* clause — see my `S1` note — but the routing was prudent and I do not fault it | **LOW** | **BA/PM first** (one clause: apply the regexes to comment-stripped text), **then Software Engineer** (~8 lines; the numbers it will assert are above) |
| **`B5`** | **The distance-≥2 residual is REAL and ACCEPTABLE, but its witness on record is WRONG.** BA/PM's and the `B1` hop's own example, `token.replace("xx","") === COLOUR`, is **KILLED** by the only-argv-literal row. A witness that survives: `OFFSET = COLOUR.length - RANDOM.length; token.slice(OFFSET) === COLOUR.slice(OFFSET)` — **no new literal, no new number, SURVIVES 856/856**, and `node src/cli.ts xxcolour black` prints a 23-row board and exits 0 | **LOW** (no live defect; the class is out of reach of any finite family and `E1` priced and declined closing it) | **Nobody, yet** — this note is the record. **The correction matters:** a future census that "verifies" the residual with the named shape will watch it go red and close an open gap |
| **`Q8`** | `A8`'s stream ends with **two newline bytes** because the frame's 23rd row is the empty string. Re-confirmed. **Not a violation** — the delivered assertion reads it correctly; a reviewer running `tail -c 2` will reopen a closed criterion | **LOW, informational** | **BA/PM**, only if `A8` should say so; otherwise this note is the record |
| **`Q10`** | **`A1`'s "no other setup" clause, partly improved and still not closed.** This worktree had **no `node_modules`** and I ran a real `npm install` (exit 0, 1.5 s) before the gate — stronger than the symlinked trees the last three hops used. **A genuinely cold `git clone && npm install && npm run chess` is still unperformed by me** | **LOW** | **UAT** — exactly the destination `EPIC-006` gives the deferred UAT columns |

## New this hop — three of them produced by the INTEGRATION, one by the record

| # | gap | severity | owner |
|---|---|---|---|
| **`Q11`** | **A legal prose change in the resolver can red `A6`(i)'s only-argv-literal row.** Measured (`R9`): changing `MISSING_VALUE` to name `-h` reds it. **By the criterion's letter this is correct** — a message naming `-h` writes an argv literal for a flag the allowlist does not contain — so it is friction, not a false RED. **It predates `B1`**; `S3`'s backtick alternation adds no new literal to check (13 before, 13 after, measured) | **LOW** | **BA/PM**, only if the clause should exempt prose that names a token in order to refuse it. My recommendation: **leave it** — the friction is one line and the row is load-bearing |
| **`Q12`** | **`A12`'s "and nothing else" reads differently against the branch than against the build commit, and the page does not say which it means.** Build commit `e140355`: **exactly `A12`'s six — MET**. Branch `7df25b9...HEAD`: the six **plus** `memory-bank/50-decisions/ADR-0011-…md` (Architect/Design's `G6`) **plus** `plans/tickets/ABC-042-…md` (BA/PM's `E1`). **My ruling: `A12` is MET on the build-commit reading**, which every prior hop used and which is the only one the criterion can bear — a literal branch reading is breached by every context note ever written. **But the human turning the merge key runs the branch diff** | **LOW** | **Orchestrator** — the ambiguity was created by the co-merge decision, not by the criterion. One sentence in the merge hand-off naming which diff `A12` was checked against |
| **`Q13`** | **`AGENTS.md` now contradicts itself, in a file this ticket edited.** § Commands line 62 reads `` Dev / run: `npm run chess` ``; § Deployment posture (~line 184) still reads *"there is also **no CLI entry point yet**, which is why `Dev / run` above is `UNKNOWN - verify` and stays that way"*. **Both clauses are false on the delivered tree.** `A1`'s row is blind to it — it asserts a different string. **No prior `ABC-042` note raises this; it is new.** `AGENTS.md` is **inside `A12`'s licensed six**, so it is fixable on this ticket. **NOT a posture change** — `ADR-0007` and the deploy fence are untouched and must not be read as moved | **LOW** | **Software Engineer** (the file is already inside `A12`'s licence) **or BA/PM** for the prose. I did not fix it: editing `AGENTS.md` at a gate would consume `A12`'s budget and force a reviewer to re-verify the file |
| **`Q14`** | **The `ADR-0011` amendment and `src/history-pane.nfr.test.ts` disagree on the merged tree.** The ADR **strikes** clause 3's admission sentence; the test file **restates it verbatim** at `:196-199`. **The Architect named it, routed it and explained why `A12` bars fixing it here** — so it is stated, not hidden. I verified all four of their line citations (`:196-199`, `:219`, `:335`, `:441`) are **exact**, and confirmed **no test in this repository reads any ADR file**, so the amendment cannot move the suite in either direction | **LOW** | **Architect/Design** — already routed to a new ticket with the docblock row and `R5`. Recorded here because "stated on one branch" and "true on the merged tree" are different facts |

## What I am NOT raising, so the list is not padded

- **The two `biome.json` lint infos.** Pre-existing, checked rather than inherited, not this ticket's.
- **The ticket page citing `LICENSED_DRIVERS` at `:213` when it is now at `:219`.** A consequence of the
  citation edit `A12` licensed. Not worth a repair; noted so nobody re-measures it.
- **`A10`/`A12`'s halves being held by diff review rather than an assertion.** The ticket says so itself
  and I performed both reads independently again this hop — `A10` key-by-key against real
  `git show main:package.json` (top-level added `[]`, removed `[]`, reserved keys `[]`, `private` still
  `true`, scripts added `["chess"]`, **none changed**, `engines` and `devDependencies` identical), `A12`
  by blob SHA across all 18 modules. **Design, not defect.**
- **The six rejection children each loading the whole engine.** Measured and declined by the engineer
  under coding rules 5 and 7. I agree and add nothing.
- **`AR-1`'s C1/CSI class**, **`--difficulty`** and **packaging** (`EPIC-006` #4 and #1). Ruled, owned,
  or named unmet by the ticket already. `A10`'s fence holds and I verified it holds.
- **The board move and the `plans/traceability.md` row.** The subtask reserves both to the Orchestrator
  and says the board move is not a gap I must report. **I wrote neither file.**
