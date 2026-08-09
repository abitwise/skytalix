---
id: 20260809T090600Z-software-engineer-decision-176a65c3
kind: decision
by: software-engineer
at: 2026-08-09T09:06:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-013
  - ABC-014
  - ABC-015
  - ABC-016
  - ABC-017
  - EPIC-002
  - EPIC-003
  - RISK-005
  - src/frame.ts
  - plans/tickets/ABC-018-frame-output-and-redraw.md
  - 20260809T084500Z-ba-pm-decision-53b4877d
supersedes: 
---

# Five structural choices the corrected ticket still left open, decided here with the rejected alternative named

BA/PM's five corrections settled `N`, the reserved prompt row, the width constant and the ASCII
sanitizer clause. Building against them surfaced five further choices that no criterion decides. Each
is decided here, each is recorded with what it rejects, and each is pinned by a test that fails if it
is undone.

## 1 — `W` is derived from the PANEL rows only, never over the message rows

The ticket defines `W` as *"the widest row the assembled regions emit"*. Taken literally over **all**
assembled rows it is circular: the message region is one of the assembled regions, so one long
rejection would widen `W`, and a wider `W` is exactly how content breaks `4a`'s constant geometry —
a row wider than the terminal wraps and adds a screen row.

**Decided:** the board, status and history rows set `W`; the message region is bounded **by** it. The
ticket's own sentence supports this reading — *"the message region is where that is enforced"* — and
so does the fact that in a fits/does-not-fit pair the marker's presence must depend on the region's
capacity rather than on its content having already set that capacity.
**Rejected:** `W = max` over every row including the message rows. A mutant taking that reading is
killed by two tests.

## 2 — every row EXCEPT the reserved prompt row is padded to exactly `W`

This is the one decision a reviewer should look at hardest, because it is not visible in any
criterion's wording and it is what makes the redraw actually clean.

`ED(0)` erases from the cursor to the end of the screen. It does **not** erase what sits to the RIGHT
of a row that the new frame overwrites with a SHORTER row — and the message region's rows change
length between frames, which is precisely the ticket's named mechanism for stale rows *"even under a
bounded history"*. So a ragged frame leaves the previous frame's tail on screen and no
"is the erase sequence present" assertion can see it.

**Decided:** pad every row to exactly `W` in the assembler, so each row overwrites its predecessor in
full. The **prompt row is deliberately NOT padded** — it is the empty string. Padding it would leave
the cursor at column `W` instead of at the start of that row, which is the criterion the reserved-row
correction exists for.
**Rejected:** emitting an erase-to-end-of-line per row. It would work, and the Security bar forbids
it: *"the only escape sequences in the output are the two this module emits itself"*. A mutant that
does it is killed by four tests, one of them the screen model's throw on an unmodelled escape.
**Consequence, stated rather than hidden:** append mode now carries trailing spaces to a pipe. No
criterion forbids it, and `EPIC-006`'s eventual end-to-end comparison should know it is deliberate.

## 3 — the packing search runs DOWNWARD, because `N` and the marker are coupled

Dropping an item raises `N`, which can lengthen `(+N more)`, which can push another item out. A
single greedy pass cannot answer that; it has to be solved together.

**Decided:** take the largest number of leading items that fits **together with** the marker its own
absence implies. `N` therefore always equals the count of supplied items not shown in full — which is
the one thing the ticket pins — while WHICH items are shown stays this module's packing, which the
ticket explicitly leaves here.
**Rejected:** pack greedily, then overwrite the tail with the marker. It produces a marker whose `N`
disagrees with what is on screen, which is the "invents `N`" implementation the correction rules out.

## 4 — the sanitizer runs over EVERY string placed into the frame, panel rows included

**Decided:** sanitize the panel rows too. The ticket's `## Scope` says *"any supplied string is
stripped of control characters before it is placed"*, and from the assembler's position every row is
supplied by its caller. It costs one pass over ~22 short rows and it makes acceptance `2a` — zero code
points above `U+007F` over the **whole** emitted stream in ASCII mode — hold **by construction**
rather than by trusting three panels, two of which do not exist yet, to be pure.
**Rejected:** sanitize only the message items. It is the narrower security reading (the message region
is the only region carrying text this product did not generate) and it would pass every test in this
suite, because the stub panels are ASCII. It fails the moment a panel is not.

## 5 — widths are counted in UTF-16 units

**Decided:** `String.length`. It equals the code-point count for everything this frame can carry —
ASCII mode strips every code point above `U+007F`, and the Unicode glyph table is `U+2654`–`U+265F`,
all BMP. Stated in the module header rather than left to be discovered.
**Rejected:** code-point counting via the spread, which differs only for astral characters that
cannot reach a frame; and display-column counting, which is the genuinely correct quantity for a
terminal (a wide CJK glyph occupies two columns) and which **nothing in this epic supplies**. If a
future panel or a player's echoed text can carry a wide character, this is the assumption that
breaks, and it is written down for that day.

## And one choice that was NOT mine to make, taken as given

The API shape follows `ABC-015`'s split — a pure VALUE function plus a SESSION factory that reads its
signals once and closes over the answer — and `renderBoard`'s parameter order, where the glyph mode
arrives as an argument rather than as a session the module holds. Matching the two merged modules was
preferred over anything I would have designed fresh (`AGENTS.md` rule 11).
