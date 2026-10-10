---
id: 20261010T085203Z-ba-pm-decision-abc051-recut-keep-18-drop-site1-withdraw-a2-15914c23
kind: decision
by: ba-pm
at: 2026-10-10T08:52:03Z
verified_by:
confidence: high
refs:
  - ABC-051
  - ABC-019
  - ABC-021
  - ABC-030
  - ABC-036
  - ABC-120
  - ADR-0021
  - NFR-002
  - N8-LANE
  - src/turn-loop.ts
  - src/turn-loop.nfr.test.ts
  - src/turn-loop.test.ts
  - src/history.ts
  - plans/tickets/ABC-051-turn-loop-records-false-and-per-ply-bar-blind.md
  - plans/traceability.md
  - .grugops/context/ticket-to-pr-ABC-051/notes/20261010T084259Z-software-engineer-observation-abc051-reverify-premise-moved-ac73a414.md
  - .grugops/context/ticket-to-pr-ABC-051/notes/20261010T084259Z-software-engineer-decision-abc051-stop-no-partial-build-42b950e1.md
supersedes:
---

# `ABC-051` re-cut: site 2 keeps 18 with its rule, site 1 dropped, `A2` withdrawn — DoR 10/10, page `Ready`

Hand-authored, no seal (degraded posture, `AGENTS.md`). Task `wave-2026-09-25`, subtask
`recut-abc051`, branch `grugops/recut-abc051` from `d211c64`. Read against `src/turn-loop.ts` md5
`0b0687a1bb533f0db5e8629f7d0590a0` and `src/turn-loop.nfr.test.ts` md5
`d48a0eb3a53a14e55972418614b8bdf2`. Both match the Engineer's stop at `b9e94d8`, so his `M2`
measurement stands for today's tree. Both files were green here: 63 + 4 tests, `npx vitest run`.

## Q1 — Site 2: option (b), keep 18 and write the counting rule beside it

- **The authority is the later accepted record.** `ADR-0021` clause 5 says *"Transitions go 16 →
  18"*. Code and merged tests cite 17 and 18 by number (`src/turn-loop.ts:116`, `:192`, `:346`,
  `:378`, `:432`). Option (a) renumbers or adds an unnumbered nineteenth, and either way it amends an
  accepted ADR (Architect/Design plus the owner) to fix a comment. That cost is out of proportion.
- **The page's own fence already refused (a).** `## Out of scope` excluded *"re-counting the
  transitions from scratch, or re-ratifying `ABC-019`'s table"*. Counting the refused claim as a
  row is that re-count.
- **(b) is consistent with the record, not a fudge.** `ADR-0021` clause 5 lists the refused claim
  beside 7, 8, 9 with no number. `ABC-019`'s row 15 lets the prompt-driven `game-over` reach
  `game-over` with no number of its own. `src/turn-loop.ts:124` says `resign` and `claim` "both
  drive" one transition. So "18 **numbered** transitions; the refused claim's edge is not one of
  them" is a true sentence, and every part of it can be sourced.
- **The defect at site 2 was re-classified, not dropped.** The count is true. What is wrong is the
  missing rule. Three readers produced three counts from the same records: the `ABC-021` gate said
  17 against the then-16, `ADR-0021` said 18, and this page's rule said 19. The last one stopped a
  build hop. `A3` now requires the docblock to carry the source, the word "numbered", and the
  exclusion of the refused claim. Test note 5 is rewritten so it is not arithmetic, and it carries a
  stop-and-route-to-Architect condition if the rule cannot be stated without contradicting the ADR.
- **No ⚠️.** Nothing is amended. The sentence quotes the ADR.

## Q2 — Site 1 dropped

`src/turn-loop.ts:105` now names all seven non-advancing outcomes (`ABC-120`, `d8e7ccc`), so it
carries its own rule. The `FOUR of these do not advance` half of `A3`'s grep is also dropped. It has
zero hits on the unmodified tree, so it cannot tell a delivered build from an undelivered one.
Keeping it as a regression check would guard text nobody is changing (coding rule 5). Row numbers
2–6 are kept so earlier notes still resolve.

## Q3 — `A2` withdrawn, and its purpose moved into `A1`

- **It is a straight duplicate.** Merged `src/turn-loop.test.ts` `A8` (ii)/(iii) (`:1826-1839`)
  asserts `keyHistory` 1 on one refusal and 2 on two, with `repetitionCounts` 0. The page's own Out of
  scope says the ticket *"does not touch, duplicate or 'simplify'"* `A8`.
- **It is also off-subject for the file.** The refused-claim price is per command, not per ply
  (`src/turn-loop.ts:248-250`; `ADR-0021` NFR impact). `src/turn-loop.nfr.test.ts` owns the per-ply
  bar.
- **Its real job was wiring proof, and `A1` already does it.** `M2` leaves `gameStatus` at
  `plies + 1` and `repetitionCounts` at 0 (the Engineer measured 4/4 green). So the only assertion in
  the NFR file that can go red on `M2` is the new `keyHistory`-at-0. `A1` now **requires** the
  reported failing assertion to be that one. A spy wired to nothing cannot produce it. Test note 3 is
  rewritten to match.
- **`A1` is not a duplicate of `A8` (i)**, and I checked this because the same Out-of-scope line could
  be read against it. `A8` (i) is an 8-ply run in the acceptance file. `A1` puts the zero into
  `NFR-002`'s own bar at `A17`'s 40/120/300 plies, beside the `repetitionCounts` zero whose sentence
  claims to prove *"derives nothing"*. **The alternative I rejected:** narrowing sites 3/4's sentences
  without adding a spy. That would make the file true at `XS`, but the bar file would stay blind at
  the ply counts `NFR-002` targets. `A1` costs one mock line and two assertion lines.

## Also changed

- **Re-anchored to today's lines:** `claimShortfall` `:255` (call `:256`), `PromptOutcome` `:135`,
  the count `:268-271`, the refused claim `:287-290` and `:371-374`, the advancing derive `:436`,
  and `A8` `:1813-1848`.
- **Found:** the NFR header's `history.ts:152` cite points at `gameStatusOf`'s declaration. The call
  is `:153`. It is folded into site 3, since that sentence is being rewritten anyway.
- **`A4`** gains a runnable pipeline for "zero non-comment lines". I tested it on scratch copies: it
  prints nothing for a comment-only edit and prints the `M2` line for a code edit (BSD grep, macOS).
- **Dependencies** pre-clear the two premises a re-verification could trip on next. `ADR-0021`
  clause 10 predicts the site-5 rename ("narrows", "numbers do not move"). `ABC-120`'s
  byte-identical fence on the NFR file closed with that ticket.
- **Size `S`, unchanged.** `A1`'s instrument and the sourced site-2 rule keep it out of `XS`.
- **Priority `P2`, re-dated.** The 2026-08-13 trigger is two-thirds spent (`ABC-035` and `ABC-037`
  are `Done`). The new trigger is the measured cost of one stopped hop plus this re-cut, and "whoever
  next opens the file" is now 0-for-3 (`ABC-120` refreshed 16 → 18 with no rule).
- **Title and H1** now say three false sentences plus a bare count, not four false sentences. The
  board row's text (*"false in four places"*) is now stale and is the Orchestrator's to sync. I did
  not edit the board.

## Result

**DoR 10/10. The page is `status: ready` / `column: Ready`. The board move is the Orchestrator's.** No
⚠️ and no ruling owed. Process rule 1 (the criteria re-read at the `Ready for Dev` exit) applies as
usual.
