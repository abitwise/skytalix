---
subtask: bapm-adr0045-cut
role: ba-pm
tickets: [ABC-174 (new), ABC-175 (new), ABC-171 (amend)]
branch: grugops/bapm-adr0045-cut (from main, current tip)
worktree: ../wt-bapm-adr0045-cut
ref: .grugops/context/bapm-adr0045-cut/
---

# Record ADR-0045 accepted; cut ABC-174 and ABC-175; amend ABC-171 A8 (records only)

The owner's words are in two notes: `…1a9c7f42` (ADR-0045, Q1–Q3, ABC-171 rows) and `…b2e6d4a9` (re-cut).

1. **ADR-0045 → ACCEPTED.**
   - Change its status line to ACCEPTED, dated 2026-10-19, and cite `…1a9c7f42`.
   - Fold the amendments it names. The Architect listed them in `.grugops/queue/done/arch-levels-recut.md` § "Folds owed by BA/PM":
     - ABC-087 A1;
     - ABC-101 ruling 2, A2 and A8′;
     - ADR-0044 D11's `default 3`;
     - an ABC-085 note that the 2026-10-19 verdict goes stale on merge.
   - Route `AGENTS.md` line 59 to the Scribe and the NFR catalog line to Security/NFR. Name them only; do not edit those files.
2. **Cut ABC-174** (S, P1, EPIC-004). Title: "Re-cut the level table per ADR-0045 (data only); the default moves to level 5 and plays as today".
   - Use the Architect's ticket shape in that done file: scope, A1–A6, and the test pins that move.
   - Dependency: **ABC-171 merged first.**
   - Add the time-budget criterion as written in ADR-0045, with no wall-clock readings.
3. **Cut ABC-175** (XS, P1, EPIC-004). Title: "ABC-085 verdict re-take on ABC-174's QE-passed branch (route V)".
   - Use ABC-166 as the template:
     - an A1 pre-flight: AC power, lid open, width 1, staleness against the run tree;
     - A2 completeness: 5 PAIR, 180 GAME, 17/17;
     - an A3 reading;
     - A4: no score is quoted unless the run is complete;
     - the meta file records the command.
   - Pre-register it as **one shot**: a RED pair goes to the owner, and no table is tuned from the games.
   - Sequence:
     1. ABC-174 passes QE.
     2. ABC-175 runs on ABC-174's branch overnight.
     3. The owner gives ABC-174's UAT word with the score in hand.
     4. Both merge.
   - Also record the order with ABC-173 (vitest caps). That ticket changes `vitest.config.ts` and `package.json`, which are on the A0 staleness list. Recommend whether ABC-173 lands before or after ABC-175's run, and say what A0 then needs.
4. **Amend ABC-171 A8 for QE-171-b.**
   - A book hit draws 0 seeds, even at a blunder level, and that is what the tip does. Word A8 so the row pins it.
   - Add the four row specs that close QE-171-a..d, from `.grugops/context/qe-ABC-171/notes/…9d61b7e3` and `…c48a1f60`:
     - a: the seed oracle `floor(random()·2^32)`;
     - b: a book hit at a blunder level draws 0 seeds;
     - c: the dropped-limit line for `nodes` and `mate`, one line;
     - d: an invalid `OwnBook` keeps `true`.
   - Rule QE-171-f in one line each: accept, or add a row.

Next free id after this hop: **ABC-176**.

## Fences
- Records only: ticket pages, ADR status and fold lines, and notes.
- Do not touch:
  - `src/`
  - `AGENTS.md`
  - `plans/nfr-catalog.md`
  - `plans/board.md`
  - `plans/traceability.md`
  - `../wt-ABC-171`
  - `../wt-arch-ABC-173-adr0008`
- Never push. Never merge.

## Hand off
Write `.grugops/queue/done/bapm-adr0045-cut.md` and `.claim.md` in main's working tree, uncommitted. Include:
- the commit;
- the pages cut or amended;
- each ticket's DoR;
- the exact rows for ABC-171's SE hop;
- the recommended order with ABC-173;
- trace rows.
