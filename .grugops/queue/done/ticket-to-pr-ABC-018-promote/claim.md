---
task: ticket-to-pr-ABC-018
subtask: bapm-abc018-promote
role: ba-pm
claimed_at: 2026-08-09T08:18:45Z
claimed_by: ba-pm
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has **no `scripts/` directory at all** — checked at the source rather
than taken from the subtask's or the Orchestrator's word: `ls scripts` returns `No such file or
directory` in the repo AND `ls /Users/olgeroeselg/.grugops/agent-factory/scripts` returns the same in
the kit. So there is no `scripts/claim.js` and Workflow 17 step 2's atomic `claimTask` could not be
executed. The claim directory was created with a plain `mkdir` (still atomic, still `EEXIST` on a
second writer) and this registry record written into it; `pending/…md` → `claimed/…/…md` was a plain
`mv` (atomic rename). Queue width is 1 and `claimed/` was empty, so no contention was possible and
the claim is degenerate. Recorded rather than glossed, exactly as every prior subtask on this board
recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-018/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off`, so no `human:<name>` stamp is available either. Nothing is
self-stamped.** No derived `index.md` / `index.jsonl` was hand-faked, because the renderer that
produces them does not exist here.

## Read before acting

`.grugops/context/ticket-to-pr-ABC-018/notes/` holds exactly ONE note —
`20260809T081615Z-orchestrator-decision-046a7d60` — and it was read in full at the source before any
judgement was formed. Then, and deliberately NOT on its authority:
`plans/tickets/ABC-018-frame-output-and-redraw.md` line by line,
`plans/epics/EPIC-002-terminal-board-and-game-loop.md` (amendments `[A1]`–`[A4]`, acceptance
`2a`/`2b`/`2c` and `4a`/`4b`/`4c`/`4d`, the reference layout, the `RISK-005` correction),
`plans/tickets/ABC-016-status-panel.md`, `plans/tickets/ABC-017-bounded-move-history-pane.md`,
`plans/tickets/ABC-019-turn-loop-skeleton.md`, `plans/tickets/ABC-021-draw-claim-interaction.md`,
`plans/tickets/ABC-015-glyph-mode-selection.md` (its two correction blocks, as the precedent for the
shape of this exit), `plans/epics/EPIC-003-move-input-and-controls.md`, `plans/board.md` (`Columns`,
`Backlog`, `Ready`), `plans/traceability.md` (row `ABC-018`), `plans/nfr-catalog.md` (`NFR-002`'s
section and its 2026-07-30 correction), `AGENTS.md`, `.grugops/factory.config.json`,
`agent-factory/checklists/definition-of-ready.md`, and **merged `main`** — `git show
main:src/render.ts` in full plus `git grep` for `columns|COLUMNS|width` and `process.stdout` across
`src/` on `main`.

**The Orchestrator's pre-check was RE-DERIVED, not inherited.** Two of its rows are corrected by
this subtask (`acceptance testable` — it is a FAIL, not an amber; and its item 2, where the number
`23` does have a source and the real fault is a different one). See the promotion decision note.

---
completed_at: 2026-08-09T08:44:00Z
outcome: PROMOTED, WITH FIVE ACCEPTANCE DEFECTS CORRECTED IN PLACE FIRST — ABC-018 moved
  Backlog -> Ready. Ready 3/8 -> 4/8; no limit approached, no override taken, no written reason
  owed. The ticket did NOT meet the Definition of Ready as it stood at 08:18Z: the "acceptance
  criteria clear, testable and measurable" check FAILED. Its own Definition-of-Ready block (written
  2026-07-30, never re-checked) ticked that row green; the Orchestrator left it AMBER with three
  named specifics. Of those three: item 1 AGREED (a defect, and worse than described), item 2
  AGREED-IN-SUBSTANCE-BUT-NOT-AS-DIAGNOSED (23 has a source; the real fault is a missing row), item
  3 AGREED (a real boundary hole). Two further defects were found that no pre-check had named.

  DEFECT 1 (Orchestrator item 1) - `(+N more)` HAD NO DEFINED N, AND THE NAMED INPUT DID NOT
  NECESSARILY PRODUCE THE MARKER IT ASSERTS. "As many candidates as fit" needs a width; merged
  `main` has none (`git grep -E "columns|COLUMNS|width"` over non-test `src/` on `main` returns
  ZERO), and in append mode there is no width at all. Worse than the pre-check said: with any
  plausible width SIX 4-character SANs (29 characters) FIT a 2-row region (36 characters at W=18),
  so a correct implementation shows all six, emits NO marker, and FAILS the criterion as literally
  written -- while a one-candidate-per-row implementation answers N=5. RULED: the frame has ONE
  width W, a session constant = the widest row the assembled regions emit (`process.stdout.columns`
  is NOT read - it does not exist in append mode, the mode EPIC-006 tests in); the region takes a
  LIST of items (a newline is C0 and the sanitizer removes it, so a "2-line rejection" was never
  one string); each item is placed whole or not at all; and N is DEFINED RELATIONALLY as the count
  of supplied items not shown in full. Split into two criteria - one that fits (6 candidates, all
  shown, no marker) and one that does not (10 candidates, 49 characters against 36) - so packing
  stays the engineer's while N stops being a number the implementation may invent.

  DEFECT 2 (Orchestrator item 2, RE-DIAGNOSED) - A ROW NO TICKET OWNED. `23` is NOT unsourced: it
  is EPIC-002 `4a`'s reference layout, 9 board + 3 status + 8 history + 2 message + 1 PROMPT = 23.
  ABC-018's own `## Scope` assembles only four of those five regions and sums to 22. The prompt row
  is in NO ticket's scope - grepped across ABC-014/016/017/019/021 and EPIC-003 - and ABC-016 line
  72 says ABC-018 owns "all writing". So the row the player types into was inside the epic's frame,
  outside this ticket's frame, and owned by nobody. Consequence, and it is the exact failure 4b
  names: "the TTY reports at least as many rows as the frame" would have been short by one, and the
  first keystroke scrolls the frame origin off the top. RULED: the frame RESERVES a 1-row prompt row
  as its last row, it is inside H, and the in-place write leaves the cursor at its start with no
  trailing newline. EPIC-003 keeps its input surface; this ticket reserves the row, it does not
  render a prompt. The rejected alternative (frame stays 22, in-place needs R >= H+1) is recorded
  with its reason - it would have amended the epic's own rule to fix this ticket's omission.

  DEFECT 3 (Orchestrator item 3) - THE EQUALITY BOUNDARY WAS UNTESTED. "At least as many rows"
  was exercised at 24/23 and 10/23 only. Added a 23/23 criterion asserted on the screen model.
  It kills two named mutants, not one: `>` where the rule says `>=`, AND a trailing newline after
  the frame's last row, which at exactly this size scrolls the origin off the top.

  DEFECT 4 (NOT in any pre-check) - THE NFR-002 BAR WAS AMBIGUOUS BY 2x. "When compute and write are
  measured separately, then EACH TOTAL is < 16 ms" reads as "each half < 16 ms", which passes a 31 ms
  frame against a 16 ms bar. The ticket's own `## Security / NFR triggers` says "compute + write
  < 16 ms" and `plans/traceability.md` row ABC-018 says the same. Rewritten to the SUM at each ply
  count, both halves still recorded separately. No target moved - the ambiguity was removed, the
  16 ms is EPIC-002's and is untouched.

  DEFECT 5 (NOT in any pre-check) - A CRITERION THAT COULD NOT FAIL, THE ABC-015 DEFECT-2 SHAPE
  AGAIN. "Given the strategy chosen at startup, when `process.stdout.isTTY` changes afterwards, then
  the strategy in use is unchanged" names an ambient global that the design this ticket's own
  `## Test notes` MANDATE (a captured sink) never reads - so it passes for every implementation,
  including one that re-decides on every write. Restated against the injected sink (mutate its
  `isTTY`/rows after construction, write two more frames, both still in place), which kills that
  mutant.

  ONE FURTHER COLLISION CLOSED WHILE THERE (folded into the Security bar, not counted as a sixth):
  acceptance 2a asserts ZERO code points above U+007F over the WHOLE emitted stream in ASCII mode,
  while the sanitizer removed only C0 and U+007F - so a player typing `é` made two of this ticket's
  own criteria contradict each other. RULED: in ASCII glyph mode the sanitizer removes code points
  above U+007F from SUPPLIED strings too; in Unicode mode they survive.

  ADJUDICATED AND DELIBERATELY NOT CHANGED: acceptance criterion 1 (identical row count at 80 and
  300 plies) is near-vacuous under the stub panels this ticket is built against - a constant-height
  stub makes any assembler pass - but it is epic 4a verbatim, it is falsifiable at integration, and
  criterion 2 (message content x thinking state) carries the falsifiable weight here. Left alone; an
  observation note records it. No statistic (median/p95) was added to the NFR criterion either: this
  repo has NO in-repo wall-clock bars by convention (`src/zobrist.nfr.test.ts:112` states the reason)
  and NFR figures are re-derived out-of-tree at the Security/NFR gate.

  SIZE, PRIORITY, SCOPE BOUNDARY, OUT-OF-SCOPE LIST, DEPENDENCIES, RISK-005's MERGE-ORDER CONSTRAINT
  AND THE SECURITY DISPOSITION ALL UNCHANGED - S (2), P0. Checked rather than asserted: the
  corrections add one reserved row placed by the same mechanism as the message region, one width
  constant, one sanitizer clause and four tests. No argv, no I/O, no new module.

  BOTH BLOCKERS RE-VERIFIED AT THE SOURCE, not read off the Orchestrator's note: ABC-014 is in Done
  and `git show main:src/render.ts` returns a 150-line module whose `renderBoard` is on merged
  `main`; ABC-015 merged (f1743a3 -> f4d5d31) and is in Done, so RISK-005's merge-order constraint
  is satisfied before this ticket starts. The Blocked column is empty.

  NOT DONE, DELIBERATELY: nothing implemented, `src/` untouched, the ticket NOT moved past Ready,
  the Definition of Ready NOT applied as the pull gate (that is the Orchestrator's at
  `Ready -> In Development`), EPIC-002 NOT edited (the epic's own layout is what this ticket now
  matches - nothing there had to change), ABC-016/ABC-017/ABC-019 NOT edited and NOT vouched for,
  and no `finding` written. NOTHING MERGED, NOTHING DEPLOYED.
moved: pending/ -> claimed/ticket-to-pr-ABC-018-promote/ -> done/ticket-to-pr-ABC-018-promote/ —
  ALL BY HAND (no scripts/claim.js in this install or in the kit; the claim dir was created with a
  plain mkdir, still atomic and still EEXIST on a second writer).
