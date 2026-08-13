---
id: 20260813T133000Z-ba-pm-observation-seven-things-verified-at-source-that-the-routing-aid-had-wrong-and-what-7-actually-means-2a8c4f37
kind: observation
by: ba-pm
at: 2026-08-13T13:30:00Z
verified_by:
confidence: high
refs:
  - ABC-052
  - ABC-035
  - ABC-030
  - ABC-040
  - EPIC-006
  - ADR-0008
  - N8-LANE
  - plans/traceability.md
  - plans/board.md
  - src/turn-loop.ts
  - src/turn-loop.nfr.test.ts
supersedes:
---

# Seven things I checked at source that the record had wrong — including the one I was told to expect — and what `~7` actually licenses

> **Hand-authored, no stamp.** `confidence: high` on everything measured; the two `UNKNOWN - verify`
> items are marked as such inline. My brief said its summary *"has been wrong before"* and told me to
> verify at source. **It was wrong in three places, and the two sources it points at were wrong in
> four more.** None of it was careless — every one is a line number or a count that moved after it was
> written, which is this board's characteristic defect and the subject of two of today's tickets.

## 1. `G-4`'s line numbers are stale — and the gap is already discharged

The brief: *"`plans/traceability.md:2` claims `1 insertion, 1 deletion` (measured 3/1) and `+88/−10`
where `:198` correctly reads `+89/−10`."* Measured on `main` at this hop:

```
"1 insertion(+), 1 deletion(-)"   lines 2 AND 4
"+88/−10"                          lines 2 AND 4
"+89/−10"                          lines 2 AND 200
```

**The Software Engineer's wrong header is at `:4`, not `:2`. The correct row is at `:200`, not
`:198`.** `:2` is the QE's own later `_Updated:` header, and it contains **all three strings because
it quotes them in order to correct them** — *"TWO NUMBERS IN THIS FILE'S OWN 2026-08-13
SOFTWARE-ENGINEER HEADER ARE WRONG, and are corrected here rather than by rewriting it
(append-only)"*, with the measured `3 insertions, 1 deletion` and the correct `+89/−10` named. The
brief carried the QE's **branch-local** numbers; two rows landed above them at the merge. **`G-4` is
NOT HOMED because it is already fixed, not because it is small.**

## 2. "Fifteen recorded gaps" is **fourteen distinct gaps**

`quality-gate-ABC-021`'s `G-7` and `quality-gate-ABC-026`'s row 6 are the same gap —
`.grugops/test-skips.md` absent, exit `2`, `H2` — recorded once by each gate.

## 3. `quality-gate-ABC-026`'s own note contradicts itself about its gap count

Its `artifact-ref` is headed *"with six gaps named"* and its requested board row says *"six gaps"*,
while its table numbers **1–8** and its prose reads *"None of gaps 1–8 is a defect introduced by this
diff."* **Eight is right.** The brief's "eight" matched the table; the source's own headline did not.

## 4. `ABC-035` contradicts itself **six** ways, not three — and two of the three nobody reported would have broken the build

Detailed in the disposition note and repaired on the page. The two unreported ones: the `## Scope`
table names the wrong **outcome kind** for `claim` (`command`, where merged code has a dedicated
payload-free `{ kind: "claim" }` arm at `src/turn-loop.ts:130`), and `## Dependencies` carries the
false *"this ticket produces the unavailable message"* sentence a **third** time.

## 5. The status-currency measurement: the prior hop reproduces EXACTLY, and the defect grew this morning

Re-measured independently at this hop — Done column read from `plans/board.md`, first row per id from
`plans/traceability.md`, escape-aware split, word-presence probe on the last cell:

```
Done column                     29 rows -> 27 ABC tickets + EPIC-001 + EPIC-002
Status cell with no "Done"      12 of 27
  ABC-013 ABC-016 ABC-017 ABC-018 ABC-019 ABC-021
  ABC-022 ABC-023 ABC-025 ABC-026 ABC-027 ABC-029
every row splits to             10 cells   (agrees with the file's own MEASURED STATE note)
```

**The prior hop measured 10 of 25. My twelve are its ten plus `ABC-021` and `ABC-026` — the two
tickets that merged this morning.** Its set reproduces member-for-member.

**That is the finding, and it changes the ticket's shape.** `ABC-021`'s cell ends *"Column: still `In
Review` on `main`"* — **correct when the gate hop wrote it, false hours later when the fast-forward
landed.** The defect is not a backlog of ten stale cells; it is **one stale cell produced per
merge**, which is why `ABC-052` is written over the mechanism and carries **no literal count in any
criterion**.

**Carried forward unchanged, because it is the honest caveat:** the count is a measurement; reading
it as *"the Status column is stale for twelve tickets"* is a judgement and is `UNKNOWN - verify` — a
row could record the same fact in other words.

## 6. `G-1`'s remedy is not "one line", and two of its sites were reported by nobody

The gate hop wrote *"the one-line remedy is the same spy I added"*. **The spy is one line. The gap is
six sites**, verified at source:

| site | what |
|---|---|
| `src/turn-loop.nfr.test.ts:40-43` | the `vi.mock("./history.ts")` factory wraps `repetitionCounts` **only** — `keyHistory` is spied by nothing |
| `:23` | *"`repetitionCounts` at 0 proves the loop derives nothing on its own"* — false after `ABC-021` |
| `:131` | **the same false sentence, second site — reported by nobody** |
| `:136` | test **name** *"derives ZERO times on a non-advancing prompt outcome"* — **false for the refused claim, which is non-advancing and derives `keyHistory` once. Reported by nobody** |
| `src/turn-loop.ts:105` | *"FOUR of these do not advance a ply"* — five; `:255` and `:259` in the same file say so |
| `src/turn-loop.ts:247` | *"sixteen transitions"* — `ABC-019`'s by-trigger table has **15 rows** (`plans/tickets/ABC-019-turn-loop-skeleton.md:363-379`, counted at source) and `ABC-021` adds **two**, so **seventeen** |

## 7. `~7` — what it licenses, and what it does not. **This is the disposition, not a ticket**

The number is published in `ADR-0008`'s addendum at `:223` (*"~7 more test files at today's all-in
cost"*) and `:272-273`. It is **owner-ratified territory and I may not edit it, and it does not need
editing: the arithmetic is right.** `10.390 ÷ 28 = 371 ms`, `2.610 ÷ 0.371 = 7.04`. The gate hop
recomputed every published figure and all of them reproduce exactly.

**What is wrong is not the number — it is reading it as a file budget.** The gate hop measured the
distribution it averages:

```
mean 309.0 ms   median 94.2 ms      mean is 3.3x the median
max 2224.4 ms   perft.test.ts       = 25.7% of ALL file time, in ONE file
min    1.1 ms   glyph-mode.nfr      spread ~1966x    7 of 28 files above the mean
```

**`~7` is a mean on a distribution with no typical member**, and the band published around it comes
from slope and sample variation — **not from file weight, which is the variable it is most sensitive
to.** Eight median-weight files fit with room to spare; **two or three `perft`-weight files do not fit
at all.**

**The reading instruction, for the `EPIC-006` lane budgeting against it right now and for the next
cut — this is what replaces the ticket I did not write:**

> **Do not plan in FILES. Plan in milliseconds, and price each planned file explicitly** — at the
> median (~94 ms of content over the ~158 ms floor) or at `perft` weight (~2224 ms), and say which.
> **`~7` is sound as a planning number and unsound as a guarantee.** The control that actually
> catches a heavy addition is **`N8-LANE`'s 650 ms-per-ticket bar**, not the file count — which is an
> argument for inheriting `N8-LANE` by name on every new ticket, and `ABC-050`/`ABC-051`/`ABC-052`
> each do.

## One thing I did NOT re-measure, and I say so rather than repeating it

**The suite total.** `816/816 on 28 files, skip 0` is the gate hop's reading on its own branch tip.
**There is no `node_modules` in this worktree and I did not install one** — a BA/PM refinement hop has
no business materialising a toolchain to re-confirm somebody else's green. **Inherited, not verified
by me: `UNKNOWN - verify` from this hop.** Every criterion I wrote that touches a suite number says
*measure the tip; do not paste a number from this page*, for exactly this reason.
