---
id: 20260813T082000Z-security-nfr-observation-nfr002-re-derived-at-the-tip-and-the-lane-total-stays-abc026s-un-discharged-b41e77a9
kind: observation
by: security-nfr
at: 2026-08-13T08:20:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-026
  - ABC-019
  - NFR-002
  - NFR-008
  - N8-LANE
  - ADR-0008
  - src/history-pane.ts
  - src/turn-loop.test.ts
  - plans/nfr-catalog.md
supersedes:
---

# `NFR-002`'s premise **RE-DERIVED at the tip and MET** — the importer set grew and it survived. `ABC-028`'s own scope **DOES** move the lane's content, and the lane TOTAL is **`ABC-026`'s and STILL OWED**

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` **`off`**, no stamp invented. **NO TIMING MEASUREMENT WAS TAKEN, and §3 says why
> that is the correct measurement decision rather than a skipped step.**

## 1. `NFR-002` — **MET**, re-derived rather than quoted

The ticket claims the pane has **zero production runtime importers**. I did not take that from the
page. The importer census over the whole tree at `HEAD` `0ee148e`:

| importer of `src/history-pane.ts` | kind |
|---|---|
| `src/history-pane.test.ts:30` — `HISTORY_COLS, HISTORY_ROWS, renderHistory` | TEST |
| `src/history-pane.nfr.test.ts` | TEST |
| `src/frame.test.ts:33` — `HISTORY_ROWS` | TEST |
| `src/turn-loop.test.ts:61` — `HISTORY_ROWS, renderHistory` | TEST |

Cross-checked from the other direction: **each of the 17 production `.ts` modules under `src/` was
grepped individually for `history-pane`. Not one hit.** `src/turn-loop.ts` — the branch's new
production runtime module — imports `frame.ts`, `gameend.ts`, `history.ts`, `legal.ts`, `moves.ts`,
and **not the pane**.

**PRODUCTION RUNTIME IMPORTERS: ZERO. `NFR-002`'s `O(window)` structural premise HOLDS at the merged
tip.**

**The part worth writing down: the importer set GREW during this branch and the premise survived.**
`src/turn-loop.test.ts` is a **new** importer of the pane — and it is a **test**, and it is
**`ABC-019`'s**. *"Zero importers"* is exactly the kind of sentence that goes stale silently while
still reading true; this one was re-measured and it did not.

**`ABC-028`'s own scope could not have moved this in any case:** zero production lines, and
`src/history-pane.ts` has an **empty diff at all four of its commits**, so it imported nothing new
into the pane. **No bar, target or level moved. `plans/nfr-catalog.md` was NOT opened for edit** —
nothing to write there, so nothing was written.

## 2. `N8-LANE` — **YES, `ABC-028`'s own commits move the lane's CONTENT.** Measured

The lane is the two `history-pane` test files. What this ticket's own four commits put into it:

```
+536 / -25 lines across the two lane files
tests added:   8de988d  6 plain `it`
               26e452f  1 `it.each` table, A5_SHAPES at :1030, TWO rows -> 2 tests
               593ba70  0   (comment text only, every changed line begins `//`)
               1ae7b8f  0   (comment text only)
               ------------------------------------------------------------
               EIGHT tests added by ABC-028's own scope
file count in the lane:  TWO, unchanged -- zero new files under src/ from this ticket
```

**So the honest answer to "does this ticket's own scope move the lane" is YES on content and NO on
file count.** Because the file count held at TWO, the lane's ~320 ms floor allowance does not move
and the 160 ms-per-added-file subtraction does not apply — **by the ticket's own rule, not by mine**.

**What that emphatically does NOT license.** Content moved, which is precisely the condition under
which the lane's TOTAL needs re-measuring. **I did not measure the total and I am not reporting any
number that could later be read as one.** The per-ticket delta figures already on the ticket page —
`A4` **−21.9 ms** median CPU at sign 3/8 against an identity null control reading **−71.0 ms** at 3/8
in the same session; `A5` **4.34 ms** which `ADR-0008`'s paired instrument could not resolve (median
0.000 s, n=11) — are **prior hops' measurements, taken on the 16-file tree, each below its own
instrument's resolution, and they do not add up to a total.** They are cited as theirs.

## 3. `ADR-0008`'s two ratified clauses — **NOT re-run, deliberately, and the tree is the reason**

The brief offered them as cheap to re-run on the tip. **I declined, and this is a measurement
decision, not an omission:**

- **A QE re-gate is LIVE.** `git worktree list` shows a second registered worktree at
  `…/scratchpad/qe-regate-uniq-1/wt`, detached at `0ee148e`. Its job is the four mandatory gates on
  this exact tip.
- **`npm test` here would contend for the same 8 cores** and corrupt **both** numbers — mine, and
  **theirs**. Damaging a parallel gate's result to decorate my note with a wall-clock figure is the
  worst trade available on this hop.
- **A wall/CPU clause measured on a busy machine is a number wearing a clause's clothes** — this
  page has already paid twice for figures that travelled without their conditions.
- Building my own worktree does not help: the contention is CPU, not the filesystem.

**Status of the two clauses on THIS tip, from me: `UNKNOWN - verify`.** Their last recorded readings
are prior hops' — `laneD` **1.69–1.74 s** wall against ≤ 3 s and **8.93–8.99 s** CPU against ≤ 13 s,
and the board's post-merge run on `main` — **quoted as theirs, not re-derived here.**

## 4. RE-HOMED, EXPLICITLY, so it cannot be quietly counted as discharged

> **`N8-LANE`'s LANE TOTAL re-measurement — the *"whichever of `ABC-028` / `ABC-029` lands second
> re-measures the TOTAL"* rule — is `ABC-026`'s. It fell due AT this merge. It is STILL OWED and is
> NOT discharged by this hop, by this note, or by anything in the Security/NFR column.**

I ran none of it, absorbed none of it, and reported no figure that resembles it. `N-1` — the
protocol's session-dependent unresolvable floor (**±390 ms** at n=8 on one session against the
record's **±130 ms** on the same machine and method), **owner `ABC-026`** — is untouched here and
**not re-litigated**.

**The trap I was warned about and did not walk into:** a Security/NFR note that says *"the lane is
fine"* would read, six hops later, as if the total had been taken. **It has not been. Nobody has
taken it since the merge.**
