---
id: 20260815T221000Z-security-nfr-artifact-ref-branch-harness-and-what-was-touched-4e0a91cd
kind: artifact-ref
by: security-nfr
at: 2026-08-15T22:10:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - grugops/security-nfr-ABC-042-recheck2
  - grugops/quality-gate-ABC-042-regate
  - plans/traceability.md
supersedes: 
---

# Branch, base, harness, and what this hop did and did not write

## Branch and base

```
grugops/security-nfr-ABC-042-recheck2   off   grugops/quality-gate-ABC-042-regate @ d011df4
```

**`main` is NOT an ancestor** — `git merge-base --is-ancestor main d011df4` is false, checked before
branching, exactly as the subtask states. Worked in a **git worktree** under this session's
scratchpad; the main checkout stayed on `main` and `git checkout main` was never run.

The subtask file `security-nfr-ABC-042-recheck2.md` is tracked on `main` and therefore does not exist
in this tree. **I read it before branching. Its `pending → claimed → done` transition is the
Orchestrator's** and I did not fake one.

## Files this hop wrote

```
.grugops/context/security-nfr-ABC-042-recheck2/notes/   5 notes (this one included)
.grugops/queue/claimed/security-nfr-ABC-042-recheck2/   claim.md
plans/traceability.md                                   ONE CELL of the ABC-042 row (NFRs, column 5 of 10)
```

**That is the complete list. Zero bytes under `src/`** — `git status --porcelain src/` is empty.

### The traceability edit, with its guards run mechanically

**My earlier repair of this cell is on `grugops/security-nfr-ABC-042-gate`, which is NOT an ancestor
of this tree** — I checked rather than assumed, and found the cell still stale here. Left alone it
would merge saying *"three bars"* where there are four and calling a review obligation a firing
threshold. Corrected, plus the `G1` figure and the re-check result recorded.

```
pipe fields BEFORE                       12  (10 interior columns)
replacement asserted pipe-free           yes, before writing
replacement asserted newline-free        yes, before writing
pipe fields AFTER, by RE-SPLITTING       12  (10 interior columns) — and equal to the header row's 12
awk field 6 = the NFRs column            confirmed against the header, not assumed
cells 1,2,3,4,5,7,8,9,10,11 (awk)        UNCHANGED, compared by md5 against HEAD, not eyeballed
awk field 6                              CHANGED — the one cell I own
git diff --numstat                       1  1  plans/traceability.md   (exactly one line)
total lines before / after               378 / 378
git status --porcelain                   M plans/traceability.md   — and nothing else
```

**Merge note for whoever holds the key:** this same cell is also repaired on
`grugops/security-nfr-ABC-042-gate`. If both branches are ever merged, that one line will conflict.
**This branch's version is the current one** — it is written against `d011df4` and carries the
re-check result; the gate branch's version was written against `8b07d9f`. Flagged rather than
discovered later.

## The measurement harness — out of tree, and the repository's `src/` never opened for writing

| tree | what it is |
|---|---|
| `wt-sec2` | the worktree at `d011df4`. Real `npm install` (this worktree had **no** `node_modules`), not a symlink |
| `mtree` | out-of-tree copy, `node_modules` symlinked, `diff -r` verified **IDENTICAL** to the worktree `src/` before anything changed. Mutants `M3`, `M3b`, `M3f`, `M2`, `M0` |
| `mtree2` | second copy, same verification. Mutants `M3g`, `M3h`, `MP10`, `MS3`, `MS3b`, `MS4`, and the prose-change probe |

Every mutant is **one anchored replacement that aborts unless its anchor occurs exactly once**, run,
then restored **by byte copy from an in-memory pristine capture — never `git checkout`** (the `E4`
lesson, taken from the record rather than re-learned). Both trees `diff -r` **IDENTICAL** to the
worktree at the end.

**The control was run first and it caught my own harness error.** The first control run read
**28/29** because I had not copied `AGENTS.md` into the mutant tree and `A1`'s row reads it. I fixed
the copy and re-ran; **every verdict reported anywhere in this folder is against a 29/29 GREEN
control.** Recording it because a mutant census graded against a red control is worthless and the
failure is silent.

## Numbers I did NOT re-measure, and why

**I did not re-run the `N8-LANE` lane measurement.** `G1` is escalated and the subtask forbids
re-opening it; two independent measurements since mine already agree the `B1` work did not move the
lane. What I did instead is measure **the added work directly** — 138 resolver calls vs 18, as pure
evaluations — which is a decisive microsecond-scale measurement rather than a noisy second-scale one:
**0.0033 ms vs 0.0005 ms per full pass**, against a 650 ms bar. Together with a byte-untouched child
set and a green spawn pin at ten, **`G1`'s number is structurally unchanged and I report it as
unchanged.**

## What is NOT here

- **No `kind: finding` and no `§14-gate#<id>` stamp.** `context.human_admission` is `off`;
  `scripts/context-io.ts`, `scripts/claim.js` and `mcp__grugops__propose_note` are absent from this
  repository and from the kit. Everything is `observation` / `decision` / `artifact-ref`,
  hand-authored per `agent-factory/contracts/context-note.md`. **No stamp was invented.**
- **`plans/board.md`** — the Orchestrator's. Not opened.
- **The ticket page**, **`plans/nfr-catalog.md`**, **`ADR-0008`**, **`ADR-0011`** — read, cited, not
  opened for writing. **No target, bar, level or ratified figure moved.**
- **The kit** at `/Users/olgeroeselg/.grugops/agent-factory` — read only.
- **Not merged. Not pushed. Not deployed. `main` never checked out.**
