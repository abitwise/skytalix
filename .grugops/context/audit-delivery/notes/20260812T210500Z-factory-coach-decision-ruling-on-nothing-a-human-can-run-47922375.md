---
id: 20260812T210500Z-factory-coach-decision-ruling-on-nothing-a-human-can-run-47922375
kind: decision
by: factory-coach
at: 2026-08-12T21:05:00Z
verified_by:
confidence: medium
refs:
  - delivery-audit-2026-08-12
  - plans/metrics.md
  - plans/board.md
  - AGENTS.md
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - ABC-009
  - ABC-011
  - ABC-022
  - ABC-027
  - ABC-028
  - NFR-001
  - src/turn-loop.ts
supersedes:
---

# RULING: the hardening is NOT the waste — the RECORD is. And `EPIC-006` at `P2` is a real defect, fixable with one small ticket rather than a re-prioritisation

The question: 30 tickets, 807 tests, 17 modules, 21 days, 68 points closed — and **no human can
play a game of chess.** Both cases below are made from measurements, then I rule.

## THE CASE THAT THIS IS WASTE

1. **The last ten tickets to reach `Done` are 40% hardening with a zero production diff**
   (`ABC-023`, `ABC-025`, `ABC-029`, `ABC-028`). The first ten were 90% capability.
2. **Test lines outran production lines 8 : 1 over the last four days** (1164 production, 9292
   test) and **1219 : 1 on 2026-08-12 alone** — six tickets reached `Done` that day and the entire
   day's production diff was **one word renamed**.
3. **The record has grown to 77× the size of the product it describes.** Measured this hop:
   **10,078,320 bytes** of prose across `plans/`, `memory-bank/` and `.grugops/context/` (839
   context-note files alone, 97,745 lines), against **130,748 bytes** of production TypeScript.
   Even counting the tests as product, it is **13.6 : 1**.
4. **And the record is accelerating faster than anything else in the factory.**
   `ABC-001`…`ABC-008` are **708 lines of ticket** and produced **1530 production lines** — 0.46
   ticket-lines per production line. `ABC-022`…`ABC-030` are **8922 lines of ticket** and produced
   **63 production lines** — **142 ticket-lines per production line.** That is a **300× change in
   documentation intensity in three weeks.** `ABC-028` alone is **2962 lines of ticket for zero
   production lines.**
5. **`plans/board.md` is 20,510 words in 232 lines** (134 KB) — one file, and its single
   `_Updated:` header line is 864 words. *(My brief called it "~6000 words"; it is 3.4× that. Even
   the people inside this factory under-estimate how large its record has become.)*
6. **The user-facing outcome after all of it is exactly zero.** No `bin`, no `main`, no CLI entry
   point; `AGENTS.md:48` records `Dev / run: UNKNOWN - verify`; UAT is deferred → `EPIC-006` and
   **explicitly not passed** on all 25 `Done` tickets. One of the nine frozen metrics
   (`Escaped defects`) is **structurally unmeasurable** as a direct result.

## THE CASE THAT THIS IS THE OWNER'S PRIORITY WORKING EXACTLY AS SPECIFIED

1. **The directive is explicit, dated, and quoted, not inferred.** Olger Oeselg, 2026-07-31:
   *"The most important thing is that chess moves are legal according to game rules, everything
   else comes after that."* The factory reordered to it the same day — `ABC-020`/`ABC-021` cut,
   `ABC-009` escalated `P2` → `P1` and promoted. **This is a factory following an instruction, not
   a factory avoiding hard work.**
2. **The rules core needed it, and this is the strongest fact in the audit. Three real behavioural
   defects escaped the 2026-07-24 merges and shipped to `main`:** `ABC-009` (`legalMoves` offers an
   illegal `FLAG_CASTLE` and writes a phantom king), `ABC-011` (Zobrist hashes en passant with no
   legal capture — a missed draw), `ABC-022` (`generateMoves` offers en-passant its own
   preconditions forbid). All three were in `EPIC-001`, all three passed the gates of the day, and
   all three were caught later by exactly the audit-and-harden regime now being questioned.
3. **A rules bug found late is not a bug, it is an encoded assumption.** `ABC-011`'s own ticket
   states the mechanism: every consumer's tests get written against the wrong key, *"and the defect
   stops being a bug and becomes an encoded assumption."* Every module built since — renderer,
   frame, SAN, status panel, history pane, turn loop — sits on `generateMoves`/`legalMoves`. A
   defect there in three weeks' time invalidates the 807 tests, not just the 30 lines.
4. **The verification is real, and the brief is right that this is a defence rather than a
   rationalisation.** Deep perft **32/32 exact**, `NFR-001` ≈ 6.2M nps, **807/807 green** —
   re-run four times by me this hop, not quoted. That is a rules core you can build on.
5. **The hardening tickets found things.** `ABC-025`'s cutting hop re-derived five known wrong
   builds and found a **sixth** that the five's own fix does not catch. `ABC-027` produced this
   project's only Security/NFR **FAIL**, measured on a real pty, catching a defect that ate **the
   entire h-file plus its label, 9 rows of 23, on every frame** at one window width. **That is a
   user-visible bug, caught before a user existed.** These are catches, not busywork.
6. **The factory has NOT stopped building, and the waste case's own ratio hides this.** The
   2026-08-09…12 window added **1164 production lines** — the second-highest four-day production
   output in the project's history, behind only the opening week. **Five production modules were
   created in the last six days** (`san.ts`, `frame.ts`, `status-panel.ts`, `history-pane.ts`,
   `turn-loop.ts`, 1044 lines between them). The test : production ratio rose because **tests rose
   faster, not because production fell.** Any argument that reads "8 : 1" as "they stopped
   building" is reading the ratio wrong.

## THE RULING

**On the hardening: the defence holds. I rule for the owner's directive.** A chess engine whose
rules core is wrong is worthless; this one's is verified by deep perft and by three real defects
found and fixed; the branching factor of the gate-cut chain is **0.48** and decaying (see the
lineage note), so the hardening is terminating on its own rather than compounding. **Nothing in
the measurements supports "stop hardening."**

**On the record: this is where the waste is, and it is separable from the hardening.** 142
ticket-lines per production line, 10 MB of prose for 131 KB of code, a 20,510-word board file, and
a 2962-line ticket that shipped zero production lines. **None of that is required by the
legality-first directive.** The directive says get the rules right; it does not say write 2962
lines about it. **The waste is the record, not the rigour** — and confusing the two is how a real
retro turns into a bad instruction to loosen the gates.

**On `EPIC-006` at `P2`: the priority is wrong, and I rule that it is a defect — but the fix is not
a re-prioritisation.** The evidence that it is wrong:

- It is the **only `P2`** among the epics that gate user-visible outcomes; `EPIC-003` (move input,
  `M`) and `EPIC-004` (engine, `L`) are both `P0`.
- It is the destination of a **25-ticket-deep undischarged obligation**: every `Done` ticket
  records *"UAT deferred → `EPIC-006`, explicitly NOT passed."* A `P2` cannot be the sink for 25
  tickets' worth of `P0`/`P1` acceptance debt.
- It is the reason `Escaped defects` cannot be measured, `Dev / run` is permanently
  `UNKNOWN - verify`, and the factory has **no feedback channel from reality at all**. Every
  quality signal in this repository is currently self-generated.

**But promoting `EPIC-006` to `P0` is the wrong correction**, because `EPIC-006` is *packaging* —
distribution, install, session persistence — and almost none of that is what is actually missing.
**What is missing is small and it already has all its parts.** `src/turn-loop.ts` exists (313
lines: ply dispatch, both seams stubbed, clean termination), and so do `frame.ts`, `render.ts`,
`status-panel.ts`, `history-pane.ts`, `glyph-mode.ts`, `history.ts`, `san.ts`. **What does not
exist is a `bin` entry, an argv/stdin wiring, and a `main`** — `package.json` has neither `bin` nor
`main` today.

**RULED: carve a thin "it runs" slice out of `EPIC-006` and pull it next — an `S`, not an epic.**
Not the packaging epic; a single entry point that boots the existing turn loop against the existing
renderer with the input seam wired to stdin, even if the opponent is a stub that plays the first
legal move. It is the cheapest ticket on the board with the highest leverage, because it converts
this factory's blindest spot into a measurable one: `Dev / run` gets a value, UAT gets a
destination, `Escaped defects` gets a detector, and for the first time a human can say whether the
thing is any good. **Priority `P0`, and the reason is not "users are waiting" — there are no users.
The reason is that the factory currently cannot see itself.**

**One thing I will not do, and will name instead of quietly deciding:** the legality-first directive
is **12 days old** and was issued when `EPIC-001` was effectively the whole product. The factory
has treated it as standing ever since. Whether it still binds now that the rules core is
perft-proven and five renderer modules are merged is **not mine to rule and not gate-adjudicable —
it is the owner's call.** I recommend it be put to Olger Oeselg explicitly rather than assumed for
a thirteenth day. That is the escalation path Workflow 16 names, and I am naming it rather than
resolving it in my own favour.
