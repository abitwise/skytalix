---
id: 20260816T042000Z-ba-pm-observation-gaps-found-refining-q8-and-the-board-row-i-want-9c05d7a2
kind: observation
by: ba-pm
at: 2026-08-16T04:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-067
  - ABC-065
  - Q7
  - Q8
  - Q10
  - src/cli.test.ts
  - AGENTS.md
supersedes: 
---

# Gaps found refining `Q8`, each with severity and owner — plus the board row I want appended

Numbered **`B1`–`B8`** to stay clear of the Orchestrator's `G1`–`G3`, the Scribe's `G4`–`G7`, the
guard hop's `G8`–`G12` and QE's `Q1`–`Q10`, all of which are **referenced and not restated**.
**None blocks the ticket; `ABC-067` is cut and DoR 9/10.** **Two sibling BA/PM hops share this
working tree, so I ran no git command and repaired nothing outside my own two paths.**

## `B1` — QE's `-->` count is wrong: **ten** reported, **fourteen** measured. **LOW.** Owner: **record only** (corrected here; no action)

14 occurrences on 13 lines, all at or after the slot start, 13 of them after the slot's own closer,
the last being the file's final line. **The conclusion QE drew from it — `end < 0` is dead — is not
just preserved but strengthened**, so this is a corrected figure, not a reversed finding. Recorded so
nobody re-derives "ten" from the earlier note and quotes it forward. **This is the second time in two
hops a figure in a `Q`-note needed correcting** (QE itself publicly corrected its `Q2`
`slice(… + 17)` at `ABC-065`); the pattern is worth the Orchestrator noticing, not worth a ticket.

## `B2` — QE's byte figure for the extended slot: **1082** reported, **1089** measured. **LOW.** Owner: **record only**

Line count agrees exactly (9 → 16) and the swallowed content agrees exactly. Seven bytes is an
ordinary edit to the swallowed region between the two hops. **I could not check when it changed —
every git command is forbidden to this hop** — so I state only that mine is right at `5cf86d3` and I
do not adjudicate QE's. **Neither figure is load-bearing in the ticket**: `ABC-067` scores the bullet
count and fail-vs-green, deliberately, so that a prose edit cannot invalidate a criterion.

## `B3` — `end < 0` is stronger than "dead in practice": it is unreachable for any realistic edit. **LOW.** Owner: **BA/PM** (folded into `A3`; no separate action)

`AGENTS.md`'s **last line is a bare `-->`**. So the branch can fire only if the slot moves below the
end of the file or every closer is deleted at once. "Dead in practice" invites a reader to imagine
some input that revives it; there is none. `ABC-067`'s `A3` therefore offers the honest alternative —
make it live, **or stop claiming it exists** — rather than demanding a branch nobody can reach.

## `B4` — the block's comment asserts a protection the code does not have, and the ticket must repair the comment, not only the code. **MEDIUM.** Owner: **`ABC-067`** (criterion `A3`)

`src/cli.test.ts:902-903`: *"A GUARD MUST NEVER PASS BY BEING UNABLE TO LOOK: a renamed slot, **or
one whose comment never closes**, would otherwise arrive as an empty string."* The renamed half is
true and proved (`N13` reds). The never-closes half is false and always was. **A comment that
misstates a guarantee is worse than no comment: it is what the next reader trusts instead of
measuring, and this file's own history shows readers do exactly that.** A hop that bounds the window
and leaves that sentence standing has done half the ticket, so `A3` scores it explicitly: **zero
sentences in the block asserting a protection with zero tests behind it.**

## `B5` — the defect cannot be tested without either mutating `AGENTS.md` on disk or splitting the locator. **MEDIUM.** Owner: **Engineer at build** (named in Test note 1)

`devRunSlot()` performs its own `readFileSync`, so every input in `A1` and `A4` is a *file state*, not
an argument. Two routes: split the locator into a pure function over a string (right), or have the
test write `AGENTS.md` and restore it (wrong). **The wrong route is a repo-state hazard on a project
that has already been bitten four times by one working tree and one index (`G5`), and a test that
leaves the repository dirty when it fails is a worse instrument than the one being repaired.** I
wrote the prohibition into Test note 1 rather than into acceptance, because **which shape the split
takes is the engineer's call and writing it into a criterion would be BA/PM designing the fix.**

## `B6` — `Q10`/`G8`: `ABC-065`'s `A2` fences by line range and names the wrong block. **MEDIUM.** Owner: **the concurrent `refinement-abc065-wording` hop** (`ABC-068`…`ABC-071`) — NOT unowned

Ruled by QE with six hashes from four commits; upheld; unrepaired at `5cf86d3`. It is BA/PM's pen,
**not** `ABC-067`'s subject and **not** in my id range (`ABC-067`, one id, mine alone), so I left it
alone deliberately rather than helpfully.

**Corrected before publishing, because I nearly reported it as unassigned:** I read
`.grugops/queue/claimed/refinement-abc065-wording/` on the way out and its subtask names *"five
queued items from the `ABC-065` lane — `Q7`, `Q9`, `Q10`/`G8`, `G9`+`G11`, `G12`"* at
`id_range: ABC-068 … ABC-071`. **`Q10` is being cut right now by a sibling hop I cannot see the
output of.** I do not know which id it lands on and I do not guess.

**Standing risk while it lands, and it is sharper than it looks:** the criterion is green today for
the wrong reason, and **the next insertion above `src/cli.test.ts:193` ends that coincidence** —
**`ABC-067` edits exactly that file.** If `ABC-067` is built before `A2` is re-fenced, `ABC-065`'s
`A2` may go red or stay green arbitrarily depending on where the engineer's lines land. **Owner of
that interaction: the Orchestrator, at scheduling.**

## `B7` — `Q7` and `Q8` are ONE root cause, and they are now being cut by TWO CONCURRENT HOPS into TWO TICKETS. **MEDIUM (scheduling).** Owner: **Orchestrator**

`Q7` (a second `Dev / run` slot is invisible — `indexOf` takes the first match, `LOW`) and `Q8` (the
window has no end, `MEDIUM`) are **the same defect from opposite ends: the locator is anchored at
neither end.** Fixing one leaves the other half open, and a future reader will reasonably assume a
ticket that "bounded the slot" bounded both. **I did not fold `Q7` in**: its repair is a **uniqueness
clause added to `ABC-065`'s merged `A1`** ("the `Dev / run` slot", singular, which does not require
uniqueness) — merged ticket prose, a separate decision, and outside my one id. **Flagged in
`ABC-067` § Out of scope and § Dependencies so it is refused visibly rather than forgotten.**
**And I found out on the way out that this is not hypothetical.**
`.grugops/queue/claimed/refinement-abc065-wording/` holds `Q7` in its five-item list at
`id_range: ABC-068 … ABC-071`. **So `Q7` and `Q8` — one unanchored locator, two ends — are being cut
into two separate tickets by two hops running at the same time, neither of which can read the
other's output.** Neither hop is at fault: each was given a disjoint id range and told to stay in it,
and I obeyed mine.

**This is the Orchestrator's to resolve at scheduling, and it is the single most useful thing in this
note.** Three options, and I do not choose between them: (i) let both tickets stand and build them in
one hop, since they touch the same six lines of `devRunSlot()` and building them separately means the
second hop rewrites the first's function; (ii) fold `Q7`'s ticket into `ABC-067` before either is
pulled; (iii) leave them apart and accept a near-certain merge collision in one function.
**Recommendation if (i) or (ii): `Q7`'s whole repair is one assertion —
`expect(agents.split("- Dev / run:").length).toBe(2)` — plus a uniqueness clause in `ABC-065`'s
merged `A1`. Near-zero cost inside `ABC-067`'s hop. But the `A1` wording change is a merged
criterion, and that ruling is not mine to make.**

## `B8` — `ABC-067` edits the guard that `ABC-065`'s pending UAT will exercise. **MEDIUM (sequencing).** Owner: **Orchestrator**

`ABC-065` is merged at `460b9f5` and sits in `Ready for UAT`. Building `ABC-067` first changes the
UAT's subject underneath the UAT Planner; building it second means the UAT signs off an instrument
already known to be unbounded. **Both are defensible and neither is mine to choose.** It is
`ABC-067`'s single DoR ⚠️ (item 10) and is written there as an open question. **It is not a blocker —
the ticket is buildable at any moment — so it does not hold `ABC-067` out of `Ready`; it must be read
before the ticket is pulled.**

---

## The board row I want appended — Backlog, by the Orchestrator, not by me

**I did not write `plans/board.md` or `plans/traceability.md`; both are the Orchestrator's pen and my
hard limits forbid them.** One line, in the `Backlog` column's existing format:

```
- [ABC-067] The `Dev / run` slot guard's window has no upper bound — an unterminated HTML comment extends the scored region 9 → 16 lines and ships GREEN 32/32  (BA/PM, XS, P2, epic: —, since: 2026-08-16, **DoR 9/10 — ⚠️ item 10, TWO sequencing questions and neither a blocker: `ABC-065`'s pending UAT exercises the guard this ticket edits, and `Q7`'s ticket in `ABC-068`…`ABC-071` repairs the SAME function**; QE `Q8` MEDIUM; **both claims RE-MEASURED at this hop: 9 → 16 lines CONFIRMED (bytes 800 → 1089, QE said 1082); the `-->` count is 14, not ten — the `end < 0` branch is dead for every realistic input, which STRENGTHENS QE**; **"passed by luck" ruled NARRATIVE and its inverse ruled assertable — the bound is scored on the captured region's bullet count, 0 unmutated vs 4 mutated**; **QE's reachability claim PINNED as `A4`: two closers removed extends the window to 25 lines and reds on `--coverage`, i.e. the guard is one closer from failing for the WRONG reason**; **`Q7` IS THE SAME UNANCHORED LOCATOR FROM THE OTHER END and is being cut CONCURRENTLY in `ABC-068`…`ABC-071` — the two tickets repair the same six lines of `devRunSlot()`; build them in one hop or fold them, or the second rewrites the first**; 0 production files, 0 new spawns)
```

**Traceability**: `ABC-067` has no epic and no feature (like `ABC-061`–`ABC-064`); its upstream is
QE's `Q8` at task `quality-gate-ABC-065-qe`, and its code/test row is `src/cli.test.ts` only.
