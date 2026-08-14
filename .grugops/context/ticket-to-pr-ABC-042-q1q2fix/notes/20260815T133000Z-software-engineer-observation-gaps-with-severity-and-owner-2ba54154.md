---
id: 20260815T133000Z-software-engineer-observation-gaps-with-severity-and-owner-2ba54154
kind: observation
by: software-engineer
at: 2026-08-15T13:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - E1
  - E2
  - E3
  - E4
  - Q1
  - Q3
  - Q4
  - A6
  - A9
  - N8-LANE
  - src/cli.test.ts
supersedes: 
---

# Every gap this hop leaves, with severity and owner

**Numbered `E1`…`E4`** to avoid colliding with the engineer-hop `G1`…`G7` and QE's `Q1`…`Q10`, which
all stand. Two of QE's are **discharged** by this hop and say so; the rest are untouched and stay with
their owners.

## Discharged by this hop

| # | status |
|---|---|
| **`Q2`** | **CLOSED, and beyond its diagnosis.** `process["argv"]` plus four further spellings (alias, ESM import, optional chain, `globalThis`) now red against `A9`'s own row, each watched as a rebuilt mutant. See the spellings note for what is still NOT asserted |
| **`Q6`** | **CLOSED.** The spawn pin no longer counts only through `childOf`: `spawnSync` is proved to be the only name taken from `node:child_process` and to have exactly one call site. `MX14` — an eleventh child — now reds |
| **`Q7`** | **CONFIRMED already armed by QE**, not re-armed. `MX13` rebuilt and watched red against `A2` |
| **`Q1`** | **PARTIALLY discharged — read `E1` before treating it as closed.** The diagnosis QE gave (prefix matching, case folding) is dead and verified dead at my hand. The criterion's *property* is not closed |

## New gaps

| # | gap | severity | owner |
|---|---|---|---|
| **`E1`** | **`A6`(i)'s near-miss set names three mutant classes and there is a fourth.** `token.endsWith(COLOUR)` (`MX5`) and `token.trim() === COLOUR` (`MX4`) are `--colour` membership weakenings that ship **856/856 green against the ARMED row**, and `node src/cli.ts "x--colour" black` prints a **23-row board, exit 0, stderr empty**. This is `Q1`'s sentence again, one class over. **The instrument is faithful to the criterion — the criterion enumerates only *"upper-case form, `+"x"` extension and one-character truncation"*, which is why `derived` is 6 × 3 = 18.** Closing it needs a fourth derivation (a prefixed and/or whitespace-padded form), which changes which builds `A6` reds — **a criterion decision, so I stopped.** This is the **ASVS `V2.2.1 [L1]`** surface that was the original HIGH on this ticket | **HIGH.** Same criterion, same ASVS clause and same demonstrated behaviour as `Q1`, which was accepted as blocking. I record it at `Q1`'s severity rather than discounting it because it is not mine to fix | **BA/PM** — one clause on `A6`(i). **I can implement the row immediately once the clause exists**; the mutant and the probe are in my census note so nothing needs rediscovering |
| **`E2`** | **`A9`'s textual instrument cannot see a second argv read from a MERGED production module.** `A9`'s scope is the two NEW modules — ruled, and for a good reason (a whole-tree reading reds on `src/frame.ts`'s docblock and `src/glyph-mode.ts`). But it means a merged module acquiring `process.argv` tomorrow trips nothing. Not a live defect: I checked, and no merged production module names `process.argv` today | **LOW** | **Architect/Design**, if `ADR-0011`'s rule should have a tree-wide guard; otherwise this note is the record |
| **`E3`** | **`A9`(2) is asserted entirely TEXTUALLY.** Every spelling I closed, and every one QE closed, is a regex over source. No test runs a build carrying a second argv read and observes it. A second read introduced at runtime rather than in source text — a loader, a `--require` hook, a dependency — is invisible to the whole row | **LOW, informational** | **Security/NFR**, if the ASVS `V2.2.2` reading wants a behavioural arm. Recording it so "V2.2.2 is asserted" is not read as more than it is |
| **`E4`** | **My own mutation harness produced a false SURVIVED before I caught it.** `git checkout -- src/` reverts uncommitted **instrument** work along with the mutant, so every run after the first measured the un-strengthened file. I guarded the mutation side (anchored, abort-on-miss) and not the instrument side. Fixed with an instrument guard, census re-run, discarded run recorded in the census note | **LOW, methodological.** Nothing shipped on it | **Me — already fixed.** Recorded because the next role to build a mutation harness in this repo will hit the same edge, and because a false SURVIVED is the exact mirror of the false KILLED everyone does guard against |

## Still open and NOT mine — carried forward unchanged

- **`Q3`** (the merged licence comparator weakenable to a subset) — **MEDIUM, Architect/Design.**
  `src/history-pane.nfr.test.ts` not opened for writing; byte-identical by md5 and blob SHA. I agree
  with QE's routing: asserting there would breach `A12` to protect `A12`.
- **`Q4`** (`A6`(ii)'s 250-per-shape control is a tautology) — **MEDIUM, BA/PM.** Untouched.
- **`Q5`** (bar 1b's regexes count occurrences, not call sites) — **LOW, BA/PM.** Untouched.
- **`Q8`**, **`Q9`**, **`Q10`** — untouched. On `Q9` / `G1` see my lane note: I neither improved nor
  worsened it, and it stays with the owner.
- **`G3`** (`plans/traceability.md` has no `ABC-042` row) and **`G4`** (the board move) — **the
  subtask reserves both to the Orchestrator and says the reservation is deliberate and is not a gap I
  must report.** Named here only so a reader of this list does not think I forgot them.

## What I am NOT raising, so the list is not padded

- **`A11`, `A10`, `A12`'s diff-read halves.** QE checked all three independently and I changed
  nothing that touches them. Re-listing them would be noise.
- **The six rejection children each loading the whole engine.** Measured and declined two hops ago
  under coding rules 5 and 7; nothing in my change moves that arithmetic by a millisecond.
- **The `M17` / `A6`(ii) hang.** QE's `Q4` owns it and I add nothing.
