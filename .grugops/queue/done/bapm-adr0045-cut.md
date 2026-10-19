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

---

## Result (ba-pm, 2026-10-19)

- **Commit:** `5a387687` on `grugops/bapm-adr0045-cut` (parent `6fc32150`), in `../wt-bapm-adr0045-cut`. Not pushed, not
  merged. 11 files, +711/−21.
  - **0 lines** under `src/`, `AGENTS.md`, `plans/nfr-catalog.md`, `plans/board.md` and `plans/traceability.md`.
  - `git merge-tree` with `grugops/ABC-171` (`9ae31679`) is **clean**: that branch carries no page edits
    (`git diff 7df64755 9ae31679 -- plans/` is empty).
- **Notes** (hand-authored, unsealed; `context-io.ts` is absent on this install), under
  `.grugops/context/bapm-adr0045-cut/notes/`:
  - decision `…3f7a5c21`;
  - observation `…8b2d4e60`;
  - artifact-ref `…5d1e9a74`.

### Pages
- **ADR-0045 → accepted** 2026-10-19, citing `…1a9c7f42` (Q1–Q3 verbatim).
  - It carries an id-correction fold line: every `ABC-173` in the body that names the build reads `ABC-174`, and the
    re-take is `ABC-175`.
  - It names the folds.
  - It routes `AGENTS.md` line 59 to the **Scribe**, and the `plans/nfr-catalog.md` `NFR-004` lines (`AR-NFR004-A`
    "level 3", `:1364`) to **Security/NFR**.
- **Folds:**
  - `ABC-087` `A1`: default = 5;
  - `ABC-101`: ruling 2 struck and overturned; `A2` now the maximum, not the middle; `A8′` now `DEFAULT_LEVEL` 5 and
    plays as today;
  - `ADR-0044` D3, D6, D11 and Consequences: `default 5`; the rate-0 path is level 5 only, and levels 1–4 take
    `createLevel`;
  - `ABC-085` § Dependencies: the 2026-10-19 verdict goes STALE on `ABC-174`'s merge.
- **New:** `plans/tickets/ABC-174-re-cut-the-level-table-per-adr-0045-the-default-moves-to-level-5-and-plays-as-today.md`
  (S, P1, EPIC-004).
- **New:** `plans/tickets/ABC-175-abc-085-verdict-re-take-on-abc-174s-qe-passed-branch-route-v.md` (XS, P1, EPIC-004).
- **Amended:** `ABC-171`:
  - `A3` gains "a `go` with no bad token";
  - `A8` is reworded;
  - `A13a`–`d` are added;
  - § QE-171-f gives one line per ruling.

### DoR
- **ABC-174: 10/10.** → `Ready` once `ABC-171` merges.
- **ABC-175: 10/10.** → `Ready` when `ABC-174` enters QE.
- **ABC-171: 10/10, unchanged.** Re-scored at `6fc32150`.

### The rows for ABC-171's SE hop (`src/uci-session.test.ts` only; `A12`'s two-file fence holds)
Each row is green on the tip's behaviour (QE P2–P5) and must red its mutant, watched once and reverted:
- **A13a (QE-171-a), the seed oracle.**
  - Setup: level 1, `seededRandom(k)` for k = 1..8, `position startpos`, `go movetime 1000`.
  - Assert: the session's `bestmove` equals
    `createLevel({ budgetMs: 100, blunderRate: LEVELS[1].blunderRate }, { seed: Math.floor(seededRandom(k)() * 2 ** 32), now })`
    on a fresh clock of the same step, **8/8**.
  - Non-vacuity: the oracle's moves are not all equal (reds S32), and on some k the `* 2 ** 16` seed gives a
    different move (reds S33). If 1..8 is vacuous, the SE widens k or adds a position and says so.
- **A13b (QE-171-b), a book hit at a blunder level.**
  - Setup: `START_BOOK`, `OwnBook` on, `seededRandom(1)`, each level with `LEVELS[n].blunderRate > 0` (1 and 2 today).
    Send `setoption name Skill Level value <n>`, `position startpos`, `go movetime 1000`.
  - Assert: exactly `info string book`, `bestmove e2e4`; no `info depth`; the `random` counter is **0**.
  - Reds S25 and S31.
- **A13c (QE-171-c), the dropped-limit line, at level 1 on startpos.**
  - `go nodes 100` writes 3 lines: one `info string` containing `nodes`, a level info line with no `score`, then
    `bestmove`.
  - `go depth 3 nodes 100 mate 2` writes 3 lines: **exactly one** `info string` containing `depth`, `nodes` and
    `mate`, a level info line, then `bestmove`.
  - The wording beyond those tokens stays the SE's. Reds S38 and S39.
- **A13d (QE-171-d), an invalid `OwnBook` keeps `true`.**
  - Setup: a fresh session with `START_BOOK`. Send `setoption name OwnBook value maybe`.
  - Assert: one `info string`. Then `position startpos`, `go movetime 1000` writes exactly `info string book`,
    `bestmove e2e4`.
  - Reds S12.
- **A8, reworded:**
  - `ucinewgame` draws 0;
  - each `go` that plays through a blunder level draws **exactly 1**;
  - a book hit draws **0** at any level;
  - a rate-0 level draws 0.
  The existing A8 row stands. A13b adds the book-hit half.
- **QE-171-f:** f1 (case-sensitive `OwnBook` values), f2 (the joined value), f3 (bad-token lines before the book
  line) and f4 (`01` / `1.0` / `0x1` refused) are **all ACCEPTED, with no row**. QE-171-e stays routed to ABC-168.

### Order with ABC-173: recommended BEFORE ABC-175's run
- **Order:** ABC-171 → ABC-173 → ABC-174 (branched after both) → QE → **A0 re-take** → ABC-175 overnight → owner UAT
  on ABC-174 → merge (ABC-174 first; ABC-175 `A5` tree check).
- **Finding: `ABC-146` `A0` is already STALE on `main` `6fc32150`, by its own rule, before either ticket.**
  - Against `eb216351`, the staleness diff prints three files:
    - `package.json` (ABC-169's `"license"` field);
    - `src/engine.ts` (ABC-170's `maxDepth` / `maxNodes`);
    - `src/evaluate.ts` (ABC-169's attribution comment).
  - The `vitest.config.ts` and `src/ladder.test.ts` md5s are unchanged.
  - So `ADR-0045` D6.5's "`A0` stays current" does not hold. **`A0` must be re-taken (Security/NFR, width 1) or the
    owner names route N.** BA/PM did not waive it.
- **What A0 then needs:** one re-take **after ABC-173 merges**, on the run tree. It records the new
  `vitest.config.ts` md5, the `src/ladder.test.ts` md5 (and the verdict row count, if ABC-173 adds a row there), and
  the versions. ABC-175 `A1` checks against that commit.
- **Why before:**
  - one A0 re-take covers the final config;
  - the 5.5 h run happens under the owner's cap;
  - no ABC-173 merge can land between the run and ABC-174's merge.
- **Fallback, if ABC-173 slips:** run uncapped with A0 re-taken there, and **hold ABC-173's merge until ABC-174 has
  merged.**
- **Note:** ABC-085's verdict staleness list does not include `vitest.config.ts` or `package.json`. Only A0's list
  does.

### Pins the Architect's shape missed (now on ABC-174 § Pins that move)
- The `ABC-061` A2/A3 whole-object rows: `difficulty: 3` ×7 at `src/cli.test.ts:1319-1386`.
- `levelTime`'s `level <= 2` selector at `src/uci-session.test.ts:647`.
- The `:719` read-back.
- The `:44` comment.
- The 211–212, 284–285, 412, 448 and 453 rows keep **3 000 ms**, because the default is still 3 000. Only their labels
  move.

### Trace rows (for the Orchestrator to append; columns: Ticket | Title | Epic | Feature | NFRs | Code | Tests | UAT | Release | Status)
| ABC-174 | Re-cut the level table per ADR-0045 (data only); the default moves to level 5 and plays as today. Cut by BA/PM `bapm-adr0045-cut` (`5a387687`) on owner word `…1a9c7f42` / `…b2e6d4a9` | EPIC-004 | — | `NFR-004` A (default 3 000 ms) / B (max level 3 000 < 5 000, clamp unchanged); `NFR-005` referent unchanged; `NFR-008` ≤ 10 s at load1 ≤ 8 | `src/levels.ts` (LEVELS 100/0.4, 180/0.2, 330/0.1, 1000/0.05, 3000/0; DEFAULT_LEVEL 5), `src/cli-options.ts` (DEFAULT_DIFFICULTY 5), `src/uci-session.ts` (default from DEFAULT_LEVEL), `src/cli.ts` (comment) | A1–A8; re-pins in levels/cli/uci-session tests; ENGINE_DEEP levels, LADDER_DEEP=1 short mode | owner, with ABC-175's score in hand | — | Backlog (DoR 10/10; after ABC-171) |
| ABC-175 | ABC-085 verdict re-take on ABC-174's QE-passed branch (route V); one shot, pre-registered | EPIC-004 | — | `NFR-008` unchanged (0 default-lane games); est. ~5.5 h, not timed | none (0 `src/` lines) | A1 pre-flight (A0 re-take owed: stale on main), A2 17/5/180, A3 MET/RED ≥ 90 % / > 50 %, A4 no score unless complete, A5 tree check at merge, A6 fences | waiver expected (measured at exit) | — | Backlog (DoR 10/10; after ABC-174 QE) |
| ABC-171 (amend) | A8 reworded (book hit draws 0 seeds); A13a–d rows for QE-171-a..d; QE-171-f ruled (accept ×4) | EPIC-007 | — | unchanged | `src/uci-session.test.ts` rows only | A13a seed oracle 8/8; A13b 0 draws on a hit; A13c one line naming depth/nodes/mate; A13d invalid OwnBook keeps true | owner | — | In Review (DoR 10/10, unchanged) |
| ADR-0045 | accepted 2026-10-19 (`…1a9c7f42`); folds into ABC-087 A1, ABC-101 ruling 2/A2/A8′, ADR-0044 D11, ABC-085 staleness | EPIC-004 / EPIC-006 / EPIC-007 | — | — | — | — | — | — | Accepted |

**Next free id: ABC-176.**
