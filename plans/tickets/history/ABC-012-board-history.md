# ABC-012 — board history

> **Relocated from `plans/board.md` on 2026-08-10 by the Orchestrator.** The board had grown to
> 549,833 characters, 97% of it per-hop transition narrative. This file holds every board entry
> written about `ABC-012`, **verbatim** — only the surrounding `<!--` / `-->` HTML-comment delimiters
> were removed so the text renders. Nothing was rewritten, summarised or dropped, and none of it
> is duplicated back on the board.
>
> Ticket: [`ABC-012-game-history-module.md`](../ABC-012-game-history-module.md)

Entries appear in the order they stood in `board.md` (newest first, as the board was written).

---

## In Review (WIP 1/3) — column note

ENTERED 2026-08-04 by the Software Engineer (task `ticket-to-pr-ABC-012`, Workflow 04): ABC-012
  implemented with tests and a green mandatory gate. In Development 1/3 -> 0/3, In Review 0/3 -> 1/3;
  no limit approached, no override taken. The full record -- the seven mutants, the byte-level
  no-existing-file-touched proof, the measured DAG, the five met NFR bars with their machine, and the
  instrument that failed its own null control -- is in the In Development comment above and in
  .grugops/context/ticket-to-pr-ABC-012/notes/.

  TWO THINGS FOR WHOEVER OWNS THIS COLUMN NEXT, neither of them a gate:

  (1) ONE ACCEPTANCE CRITERION IS STALE AND IS BA/PM'S, NOT QE'S. Criterion 2 asks gameStatusOf to
  return `result: "draw", reason: "threefold-repetition"`, which src/gameend.ts cannot return and its
  TYPE cannot express -- ABC-020 ruled threefold CLAIMABLE on FIDE 9.2.1. The criterion's intent is
  tested and green; the wording was not edited here.

  (2) FOUR ADVERSARIAL LEADS ARE HANDED OVER RATHER THAN ABSORBED, with the reason each is a lead
  rather than a defect: criterion 2's own test does not pin the BOARD half of takeBack; the
  keyHistory off-by-one is killed by exactly one assertion; the double-push repetition test the
  Orchestrator named for this column is still unwritten and was deliberately not added in dev; and
  playMove validates nothing by SEAM 1's priced decision.

---

## In Security/NFR (WIP 0/2) — column note

ENTERED 2026-08-04 by QE/E2E (task `ticket-to-pr-ABC-012`, subtask `qe-abc012-review`, Workflow
  04) on a PASS verdict. In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; no limit approached, no
  override taken. The full review record -- the 21 mutants, the three that survived the delivered
  suite, the compiler-verified ruling on criterion 2, and the two corrections of record -- is in the
  In Review comment above and in .grugops/context/ticket-to-pr-ABC-012/notes/.

  WHAT THIS COLUMN IS BEING HANDED, BY NAME:

  (1) THE FIVE NUMERIC NFR BARS, DELIBERATELY NOT RE-MEASURED BY QE. takeBack(2) <= 5 us,
  keyHistory <= 60 us, repetitionCounts <= 75 us, gameStatusOf <= 75 us, playMove <= 100 ns, all at
  120 plies, plus the growth check repetitionCounts @300 plies <= 150 us. The Engineer measured all
  of them MET on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and `UNKNOWN - verify`
  anywhere else. Two fences travel with those figures and should not be dropped: the takeBack number
  is an UPPER BOUND (its two restoring playMove calls sit inside the timed region, ~0.025 us of the
  2.45 us), and gameStatusOf's 3.2-3.6 us margin over repetitionCounts is the one legalMoves call
  inside gameStatus, which is POSITION-dependent in a way the two derives are not.

  (2) NOTHING COST-SHAPED WAS ADDED BY THIS GATE. The 5 new tests carry no wall-clock assertion.
  They add 12 replays of at most 12 plies and one 41-ply game; the file runs in 18 ms.

  (3) A COVERAGE HAZARD YOU WILL HIT, WITH ITS MITIGATION MEASURED. coverage/ is TRACKED (22 files)
  and unignored, and a coverage run damages it: plain `npx vitest run --coverage` modifies 15
  tracked files; `--coverage.include=...` DELETES 12 and modifies 3. Both reproduced here under a
  controlled restore. Use `--coverage.reportsDirectory=<path outside the repo>` -- verified to leave
  coverage/ byte-identical. Whether a generated report should be tracked at all is a human's call,
  flagged and not fixed, and the committed report is already stale (it predates src/history.ts).

  (4) ONE PRODUCTION-CODE GAP THAT IS NOT A COST BAR: takeBack(history, NaN) silently discards the
  whole game. Named, not fixed, not pinned. It is BA/PM's to rule and ABC-019's to consume, but it
  is recorded here because this column sees the module before the turn loop does.

  (5) THE TEST-INTEGRITY CHECKER STILL RETURNS EXIT 2, re-run by this gate exactly as Workflow 05
  step 3 specifies: `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` -> "cannot read the registry file", exit=2. Exit 2 is "the checker could not run"
  and is NOT a pass and NOT the exit-1 short-circuit. The suite's skip count is 0, measured with the
  AGENTS.md command, so there is nothing for the registry to justify; the registry is human-owned
  and no agent may self-author one to clear its own gate. Recorded, not cleared.

  No security trigger on this ticket -- no injection sink, no trust boundary, no privilege, no data
  exposure, no user-supplied string reaches this module -- stated with its reason rather than
  assumed. Nothing was merged and nothing was deployed; a human holds both.

---

## Ready for UAT (WIP 0/4) — column note

ENTERED 2026-08-04 from Security/NFR's PASS_WITH_RISKS verdict (task `ticket-to-pr-ABC-012`,
  subtask `security-nfr-abc012-gate`, Workflow 04). In Security/NFR 1/2 -> 0/2, Ready for UAT
  0/4 -> 1/4; no limit approached, no override taken. The full gate record -- the independently
  re-measured six-bar table, both fences tested rather than repeated, the discarded instrument, the
  judged ASVS L1 tier and the reasoned takeBack(NaN) ruling -- is the EXIT comment under
  `## In Security/NFR`.

  UAT IS DEFERRED TO EPIC-006 AND RECORDED AS DEFERRED, NOT PASSED -- the ABC-004..007, ABC-020 and
  ABC-011 posture, unchanged and for the unchanged reason: ABC-012 is a library module with ZERO
  importers that renders nothing and prompts for nothing, so there is no surface a human can
  exercise, and marking a UAT passed would be a fabrication. The traceability UAT cell says so.

  What a human WILL be able to exercise once EPIC-006 ships: that taking a move back rewinds the
  repetition history too, so a draw that was claimable before the undo is not still claimable after
  it. That is the whole user-visible consequence of this ticket, and it is EPIC-006's named test.

  WHAT THE OWNER SHOULD KNOW BEFORE MERGING, stated plainly because autonomy=pr reserves this
  decision for them: all three gates passed and NO required fix is outstanding, but FIVE accepted
  risks travel with the merge, and TWO of them are real defects that are unreachable today only
  because this module has no caller. takeBack(NaN) -- and the raw string "abc", and {} -- silently
  discards the ENTIRE game; playMove accepts a move from a different position and then reports a
  confident WRONG game result. ABC-019 is the ticket that makes both reachable, and this gate has
  recorded that the first one becomes a HIGH-severity ASVS L1 failure at that point, which WILL
  block. Merging ABC-012 is safe; merging ABC-019 without ruling the guard is not.

  NO PR EXISTS -- this repository has no git remote (`git remote -v` is empty), so there is nowhere
  to push and none was invented. The work is committed on the working branch and a human holds merge
  and deploy.

---
