---
task: ticket-to-pr-ABC-015
subtask: bapm-abc015-promote
role: ba-pm
claimed_at: 2026-08-08T18:17:03Z
claimed_by: ba-pm
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has **no `scripts/` directory at all** — checked at the source, not
taken from the subtask's word: `ls scripts` returns `No such file or directory`, so there is no
`scripts/claim.js` and Workflow 17 step 2's atomic `claimTask` could not be executed. The claim
directory was created with a plain `mkdir` (still atomic, still `EEXIST` on a second writer) and
this registry record written into it. Queue width is 1 and no contention was possible, so the claim
is degenerate. Recorded rather than glossed, exactly as every prior subtask on this board recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-015/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off`, so no `human:<name>` stamp is available either. Nothing is
self-stamped.** No derived `index.md` / `index.jsonl` was hand-faked, because the renderer that
produces them does not exist here.

## Read before acting

`.grugops/context/ticket-to-pr-ABC-015/notes/` holds exactly ONE note —
`20260808T181100Z-orchestrator-decision-915c585e` — and it was read in full at the source before any
judgement was formed. Then, and deliberately NOT on its authority:
`plans/tickets/ABC-015-glyph-mode-selection.md` line by line, `plans/tickets/ABC-018-*.md`
(`## Dependencies`), `plans/epics/EPIC-002-terminal-board-and-game-loop.md` (amendment `[A1]`,
acceptance `2a`/`2b`/`2c`), `plans/board.md` (`Backlog`, `Ready`, `Done`, `Blocked` and the column
table), `plans/traceability.md` row `ABC-015`, `plans/nfr-catalog.md` (`NFR-007`), `AGENTS.md`,
`.grugops/factory.config.json`, `agent-factory/checklists/definition-of-ready.md`, and **merged
`main`'s `src/render.ts`** via `git show main:src/render.ts`.

**The Orchestrator's pre-check was re-checked, not inherited, and one row of it is wrong.** The
discharged-blocker row is RIGHT and was re-verified independently (`GlyphMode` is exported from
merged `src/render.ts:61`). The `acceptance testable` row is WRONG as written — see the promotion
decision note.

---
completed_at: 2026-08-08T18:25:00Z
outcome: PROMOTED, WITH TWO ACCEPTANCE DEFECTS CORRECTED IN PLACE FIRST — ABC-015 moved
  Backlog -> Ready. Ready 3/8 -> 4/8; no limit approached, no override taken, no written reason
  owed. The ticket did NOT meet the Definition of Ready as it stood at 18:17Z, and it was not
  promoted as it stood: the "acceptance criteria testable and measurable" check failed on two
  counts, both of them the class the Orchestrator's pre-check ticked green.

  DEFECT 1 — AN INPUT TUPLE WITH NO STATED OUTPUT. `--ascii` and `--unicode` arrive as two
  INDEPENDENT booleans (argv is EPIC-006's; this ticket takes them already parsed). Table rows 1
  and 2 BOTH match when both are true, and nothing in the ticket said which wins. The
  reject-with-a-message guard lives in EPIC-006, which is UNDECOMPOSED and merges LATER, so the
  precondition is not held by any merged code at the moment this function gets its first caller.
  RULED: the table is applied IN ORDER, row 1 wins, the answer is ASCII, and the function neither
  throws nor prints. Costs zero code (the ordered table already yields it) and keeps the
  conflict-rejection policy in exactly one place.

  DEFECT 2 — AN UNFALSIFIABLE CRITERION. Acceptance #9 ("the mode already handed to the renderer is
  unchanged ... the selection is made once, before the first frame, and cached") could not fail any
  implementation this ticket's scope permits: with the signals injected as arguments, it tests that
  a `const` does not mutate. Its only failing form — a module-level accessor that re-reads
  `process.env` — is FORBIDDEN by the ticket's own test notes. This is ABC-014's "not the white
  frame with its rows simply reversed" defect, caught this time BEFORE an engineer writes against
  it rather than at QE. REWRITTEN as two criteria that a real mutant kills: the pure rule reads no
  ambient global, and the session value survives a rewrite of the ambient signals while the pure
  rule called with the NEW signals returns the different answer.

  OWNERSHIP SEAM CLOSED WHILE THERE: epic `2b`'s "decided exactly once, before the first frame" was
  claimed by ABC-015's scope for EPIC-006 and by ABC-018 (lines 110-112) for ABC-015 — so nobody
  owned it and no ticket could test it. RULED to ABC-015, because ABC-018 already writes that
  ABC-015 "owns that rule and runs it once at startup" and it is the ticket with the rule in it.
  ABC-018 and EPIC-006 are NOT edited by this subtask; nothing there had to change.

  SIZE, PRIORITY, SCOPE, RISK-005's MITIGATION AND THE MERGE-ORDER CONSTRAINT ALL UNCHANGED —
  S (2), P1, merges with or before ABC-018. Checked rather than asserted: the corrections add one
  memo and two tests, no argv, no I/O, no new module of consequence.

  THE BLOCKER IS GENUINELY DISCHARGED, verified at the source: `export type GlyphMode = "unicode" |
  "ascii";` at `src/render.ts:61` on merged `main` (`f1743a3`), ABC-014 in `Done`, `Blocked` column
  empty. The board's own `Ready` test — "no unbuilt dependency", the single item this ticket failed
  on 2026-08-04 — now passes.

  ONE PRE-CHECK ROW CORRECTED: "nine enumerated input tuples" is EIGHT tuples plus one session
  property, in the Orchestrator's note AND in the ticket's own DoR line, which is where it was
  copied from. Same shape as the "7 perft FENs that were 6" correction on 2026-08-06. After the
  corrections it is NINE tuples plus two session criteria, and the ticket now says so.

  NOT DONE, DELIBERATELY: nothing implemented, `src/` untouched (`git diff --stat -- src/` empty),
  the ticket NOT moved past Ready, the Definition of Ready NOT applied as the pull gate (that is
  the Orchestrator's at `Ready -> In Development`), and no `finding` written. NOTHING MERGED,
  NOTHING DEPLOYED.
moved: pending/ -> claimed/ticket-to-pr-ABC-015-promote/ -> done/ticket-to-pr-ABC-015-promote/ —
  ALL BY HAND (no scripts/claim.js in this install; the claim dir was created with a plain mkdir,
  still atomic and still EEXIST on a second writer).
