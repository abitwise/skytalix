# ABC-020 — board history

> **Relocated from `plans/board.md` on 2026-08-10 by the Orchestrator.** The board had grown to
> 549,833 characters, 97% of it per-hop transition narrative. This file holds every board entry
> written about `ABC-020`, **verbatim** — only the surrounding `<!--` / `-->` HTML-comment delimiters
> were removed so the text renders. Nothing was rewritten, summarised or dropped, and none of it
> is duplicated back on the board.
>
> Ticket: [`ABC-020-claimable-draws-and-fide-96-backstops.md`](../ABC-020-claimable-draws-and-fide-96-backstops.md)

Entries appear in the order they stood in `board.md` (newest first, as the board was written).

---

## In Security/NFR (WIP 0/2) — column note

ENTERED 2026-08-03 from QE/E2E's PASS. In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; no limit
  approached, no override taken. See the exit comment under `## In Review` for the full QE record.

  WHAT THIS COLUMN INHERITS, so the gate starts ahead of where QE did rather than rediscovering it.

  1. NFR-005 IS THIS COLUMN'S AND QE MEASURED NONE OF IT. Deliberately, on the ABC-020 precedent:
     two roles measuring the same bar is waste. Unverified from QE and inherited as reported by the
     Engineer, all on Apple M3 / Node v24.12.0 / darwin-arm64 (`UNKNOWN - verify` elsewhere):
       startpos, no ep      302.9-306.5 ns  (bar ~450)      0.963-1.008x merged
       kiwipete, no ep      309.1-315.6 ns  (bar 432-459)   0.984-1.015x merged
       ep set, capture available            worst-case per-call shape 1.357-1.383x
       amortized, 120,000-node pool         0.9948-1.0218x merged
     The design hop recorded 1.45-1.48x for the same worst-case shape; the dev hop measured lower.
     Both are on the record so this gate can adjudicate the spread rather than discover it.

  2. THE SUB-BAR ("the no-ep-square path is not made slower at all") IS PINNED BY NOTHING IN THE
     REPO, AND QE UPHELD THE ENGINEER'S DECISION TO LEAVE IT HERE -- on evidence, not deference.
     Three mutants survive a 189-test suite and they are ONE gap:
       Z1  `if (hasLegalEnPassant(position) && position.epSquare !== NO_SQUARE) {`   in zobrist.ts
       Z4  `if (hasLegalEnPassant(position)) {`                                      in zobrist.ts
       L11 delete `if (target === NO_SQUARE) return false;`                          in legal.ts
     All three are BEHAVIOUR-EQUIVALENT -- verified, not assumed: each leaves 189/189 green and none
     changes any key on any input, because the predicate's internal guard makes the reordered
     condition compute the same thing. Only COST moves, and only on the majority path. No assertion
     about a key can ever fail them, so a behavioural test is the wrong tool: the instrument is a
     SPIED CALL COUNT, the shape src/gameend.nfr.test.ts already has and the shape this column wrote
     for NFR-001 on ABC-020. The Engineer measured it out-of-repo (0 calls over 260,292 no-ep
     nodes); nothing in src/ holds it.
     THE FACT NEITHER PRIOR HOP HAD: Z1 AND L11 TOGETHER -- the reorder plus deleting the guard that
     then LOOKS redundant, an ordinary tidy-up rather than a contrived mutant -- still leave 189/189
     GREEN, and on `4k3/8/8/8/8/8/p7/4K3 b - - 0 1` one zobristKey call then writes a white pawn
     onto OFF-BOARD SQUARE 15, breaking the invariant src/position.ts states in its own comment
     ("Off-board squares stay EMPTY and are never read"). Latent rather than live -- zobristKey and
     toFen both skip off-board squares -- but it turns the reorder from a cost regression into a
     correctness one, and every test in the repo is blind to it.

  3. ONE NEW DEFECT, NAMED BY QE AND NOT FIXED, WHICH THIS COLUMN MAY WANT TO WEIGH: since ABC-011,
     zobristKey PERMANENTLY corrupts a position whose ep square is semantically inconsistent (three
     reproductions in the In Review exit comment and in QE's `claim` note). Trigger class is
     semantically invalid FEN only -- the same class ABC-009 needs and ABC-010 exists to close, both
     explicitly carried by this ticket -- and 277,949 reachable nodes are 0 impure. NO SECURITY
     TRIGGER is claimed for it: no injection sink, no trust boundary, no privilege, no data
     exposure. It is a correctness/robustness item pointing at ABC-010, and the ticket's own
     Security/NFR triggers section already says "No security trigger. ... Do not inflate it."

  4. NFR-001 IS EXPLICITLY NOT AT RISK and `npm run perft` is NOT the oracle here -- src/perft.ts
     never imports zobrist, and the hashing module's only production consumer is src/gameend.ts.
     Stated on the ticket, re-confirmed by QE's own rebuild of the module graph, and repeated so
     nobody spends 38 s on the deep lane believing it proves something.

  Previously 2026-08-01: EXITED by Security/NFR on a PASS verdict: ABC-020 -> Ready for UAT. WIP 1/2 -> 0/2;
  no limit approached, no override taken. The column is empty again.

  WHAT THIS COLUMN ADJUDICATED, and the result. A10's three bars, all re-measured independently --
  nothing was accepted from the Engineer's report and nothing was quoted from it:

    legalMoves calls per gameStatus   EXACTLY 1, across sixteen call shapes         PASS
    zobristKey calls per gameStatus   <= 1: exactly 1 when the counts map is
                                      consulted, 0 bare, 0 when a cheaper branch
                                      decides                                       PASS
    gameStatus(startpos, emptyMap)    2.13-2.26 us over three fresh processes
                                      = 0.56x-0.60x of the 3.78 us bar, and
                                      0.98x-1.01x of the pre-ABC-020 tree measured
                                      in the SAME process                           PASS

  Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64. `UNKNOWN - verify` on any other hardware.
  Call counts were SPIED with instrumented throwaway copies of legal.ts + zobrist.ts outside the
  repo, gameend.ts cmp-verified byte-identical; timings load both trees in ONE process and measure
  them interleaved A,B,B,A so drift hits both equally. Primitives cross-check to three earlier
  agents' published figures (zobristKey 281-293 ns vs 288-306; legalMoves 2.02-2.16 us vs 1.83-2.22).

  ONE CORRECTION, AND IT IS TO THE BAR RATHER THAN THE CODE. The 3.78 us figure is a START-POSITION
  number and plans/nfr-catalog.md did not say so. gameStatus is dominated by its one legalMoves
  call, which costs 2.1 us at startpos and 3.2 us in a middlegame, so gameStatus(kiwipete, emptyMap)
  measures 5.30-5.47 us on this branch and 5.29-5.85 us on MERGED code -- 1.4x the "bar" on both
  trees. Read as an absolute ceiling it indicts the baseline, not this change. The catalog row now
  carries its position and names the machine-independent quantity (the ratio to the same position on
  the baseline tree: 0.94-1.01). Third time this file has learned the same lesson, after NFR-005's
  "in a middlegame position" and NFR-002's ply count.

  QE'S ORDERING SUSPICION: CHASED, CONFIRMED, AND IT GENERALISES. This is the substantive result.
  Moving the 150-ply clock check below the fivefold check leaves gameend.test.ts 45/45 green, and
  spied, it takes a counts-map caller at clock >= 150 from 0 to 1 zobristKey calls. Two precisions,
  because they decide the severity: the bar AS WRITTEN (at most 1) is NOT broken -- the mutant still
  measures max 1 -- so this is a durability gap and not a bar failure; and the cost is one key read,
  281-293 ns, on a terminal position reachable at most once per game (the wall-clock delta measured
  129 ns, inside this harness's +-340 ns noise floor). On its own it would not have been worth a
  ticket.

  What made it worth acting on is that two FURTHER mutations show all three bars were held by
  NOTHING in this repository:

    a second legalMoves() call                       all 45 tests green
    two zobristKey reads instead of the shared local all 45 tests green
    the 150-ply check below the fivefold check       all 45 tests green   (QE's)

  The doubled generation is the serious one: it doubles the cost of the single hottest call in
  EPIC-004's search and every value assertion in the suite stays green. plans/nfr-catalog.md had
  already warned that these bars "must be spied, not inferred" -- the warning had no teeth.

  CLOSED, AND THIS COLUMN OWNED THE CALL. Both prior roles handed the decision here in writing: the
  Engineer's decision note recorded keeping the spy out of the suite as "reversible in one small
  commit if Security/NFR wants the guard permanent", QE declined because "a call-count spy is this
  column's instrument, not QE's", and this block previously read "that is the call to make here".
  Made: src/gameend.nfr.test.ts, three spied assertions, one per bar. NO production code changed and
  no existing test touched. The Engineer's objection -- a vi.mock factory is hoisted to file scope,
  so it would re-route the module graph for all 45 tests in gameend.test.ts to buy three assertions
  -- was correct, and a SEPARATE FILE dissolves it rather than overruling it; that option was not on
  the table when the judgment was made. Verified one mutant per assertion:

    second legalMoves call  -> "bare, in progress: expected legalMoves 1 times, got 2"
    two zobristKey reads    -> "expected zobristKey 1 times, got 2"
    the reorder             -> "expected zobristKey +0 times, got 1"

  LEFT UNPINNED ON PURPOSE, and QE's reasoning survives intact. Five occurrences AND clock >= 150
  both apply and the code reports seventy-five-move; pinning an arbitrary choice between two rules
  that both hold is how a later correction becomes a "regression". The zero-key assertion therefore
  uses a counts map holding ONE occurrence, where no repetition rule is in play at all -- it kills
  the reorder purely on COST and says nothing about which rule names the tie. EPIC-006's result
  screen still decides that.

  ALLOCATION. State (c) -- in progress, nothing claimable, the common case at every search leaf --
  measures 1.33 B/call on this branch and 1.33 B/call on the pre-ABC-020 tree over 1,000,000-call
  windows with zero GC events inside them: indistinguishable, so the branch adds none. Worth stating
  precisely: state (c) is not literally allocation-free and never was (merged code already allocates
  the returned literal), and src/gameend.ts:161 allocates `const draws = []` unconditionally, on the
  state-(c) path too -- it costs nothing because TurboFan sinks it into the branch where it escapes,
  which is the path a hot search leaf runs. State (b) allocates the DrawClaims the ratified shape
  asks for (~+2.3 B/call measured, a lower bound), and state (b) means a claim genuinely exists.

  STRUCTURAL. No new dependency edge (the import list is byte-identical to 65cb789's), no new state
  on Position (src/position.ts unchanged), and no dependency change at all -- package.json and the
  lockfile are untouched and the project has zero runtime dependencies.

  THE SECURITY HALF IS EMPTY, AND IT WAS RE-CHECKED RATHER THAN ACCEPTED. gameStatus is a pure
  function of an in-memory Position and an optional Map: no interpreter, no parser, no file, no
  socket, no process boundary, no credential, no persistence, no user data. Working the L1 tier of
  the ASVS checklist (70 requirements at security.asvs_level L1), every applicable row is
  not-applicable by ABSENCE of the surface it names. Two are worth naming rather than dismissing:
  V2.2.1 (gameStatus validates nothing and is right not to -- its contract is a well-formed
  Position; FEN semantics are ABC-010's and the integrity defect on this path is ABC-009, carried
  and ticketed) and V11.4.1 (zobristKey is a repetition hash, not a security control -- nothing
  authenticates or authorizes on it, and its collision behaviour is ABC-011's correctness question).
  NO FINDING AT ANY SEVERITY, and nothing at or near security.block_on: high. The consequence of a
  defect here is a wrong chess result, which is what the whole ticket is about -- not inflated, not
  deflated.

  ACCEPTED RISKS, EACH WITH AN OWNER. (1) The us figure is a single-machine number, UNKNOWN - verify
  elsewhere; the new guard is the machine-independent half, and no wall-clock assertion was added to
  the suite because it would pass or fail on the machine that runs it -- owner EPIC-004's non-M3
  spike, which already carries the same obligation for NFR-005. (2) The un-optimized (cold) cost of
  the state-(c) empty-array literal is UNKNOWN - verify: measured and inconclusive, and irrelevant at
  a hot leaf -- owner EPIC-004. (3) ABC-009 and ABC-011 remain carried, not owned -- owners their
  own tickets.

  NOT RE-LITIGATED HERE. QE's four LOW defects and three unsettled items stand as recorded: A5/A8's
  Given wording and FIDE 9.6.1's "consecutive" are BA/PM's, and the dead GameResult alias is
  Architect/Design's. This column adding an opinion to them would be noise.

  GATES, re-run on this branch with the guard in place: npm test 174 passed / 8 files (was 171),
  skip count 0, npm run lint exit 0 (the same 2 pre-existing biome config infos), npm run typecheck
  exit 0, npm run build exit 0, src/gameend.ts still 100% stmt/branch/func/line.

  Still NO git remote, so still no PR to open; the work sits on the local branch
  grugops/ticket-to-pr-ABC-020. A HUMAN HOLDS MERGE AND DEPLOY. Merge order is still load-bearing:
  this merges BEFORE ABC-019 and ABC-016.

  ---
  ENTERED 2026-08-01 by QE/E2E on a PASS verdict. WIP 0/2 -> 1/2; no limit approached, no override
  taken. FIRST OCCUPANT of this column since it was cleared -- the ABC-004..007 stack passed
  through it on 2026-07-24.

  WHAT IS OWED HERE, and it is a short list because QE deliberately did not touch it. ABC-020's
  acceptance criterion A10 is "the cost bar in `Security / NFR triggers` holds when measured", and
  that is the whole of what this column has to adjudicate:

    - legalMoves calls per gameStatus stays EXACTLY 1;
    - zobristKey calls per gameStatus stays AT MOST 1 (fivefold and threefold share one key read);
    - gameStatus stays within 1.5x of its measured 2.52 us per call (bar: <= 3.78 us).

  The Engineer reports these SPIED, not inferred, on Apple M3 / Node v24.12.0 / darwin-arm64:
  legalMoves = 1 across ten call shapes, zobristKey <= 1 and 0 when the caller is bare or an earlier
  branch decides, cost 2.17-2.24 us. `UNKNOWN - verify` on any other hardware. QE did NOT re-measure
  any of it -- two roles measuring the same thing is waste, and nothing about it looked suspicious.

  ONE THING QE FOUND THAT BEARS ON THIS COLUMN. Mutation testing showed that moving the 150-ply
  clock check BELOW the fivefold check kills no test in the suite. That mutation would break the
  bar-2 property the Engineer measured -- "zobristKey = 0 when the clock decides", since the key
  read would then happen before the clock short-circuits -- and nothing would notice. QE did not add
  that guard: a call-count spy is this column's instrument, not QE's, and the Engineer's decision
  note records deliberately keeping the spy out of the permanent suite as reversible in one small
  commit if this column wants it. That is the call to make here.

  The ticket also records "No security trigger": no injection sink, no trust boundary, no privilege,
  no data exposure. The consequence of a defect in this module is a wrong chess result -- which is
  what the whole ticket is about, and neither to be inflated nor deflated.

---

## Ready for UAT (WIP 0/4) — column note

ENTERED AND EXITED. Entered 2026-08-01 by Security/NFR on a PASS verdict; exited 2026-08-02 when
  the Orchestrator moved ABC-020 to Done on merge. WIP 0/4 -> 1/4 -> 0/4; no limit approached, no
  override taken. First occupant of this column since it was cleared on 2026-07-24.

  UAT IS DEFERRED TO EPIC-006, AND IT IS RECORDED AS DEFERRED RATHER THAN PASSED. ABC-020 is
  rules-core-only work: it renders nothing and prompts for nothing (its own `## Out of scope` sends
  the interaction to ABC-021, the panel row to ABC-016, the prompt verb to EPIC-003 and the result
  screen to EPIC-006). There is no surface a human can exercise until a runnable game ships, so
  there is no UAT to run and marking one passed would be a fabrication. This is exactly the posture
  ABC-004..007 were given on 2026-07-24 and the reason is unchanged. The traceability UAT cell reads
  "UAT deferred — EPIC-006" so the gap stays visible.

  What a human WILL be able to exercise once EPIC-006 ships, and what UAT should then cover: that a
  threefold repetition or a 100-ply clock offers a claim instead of ending the game, that declining
  it and playing on is possible (the G-1 line's Re8# is the acceptance case), that the claim is
  offered to the side to move and to nobody else, and that a game with no claim ever made still
  ends -- on fivefold for a caller with history, on the 75-move backstop for one without.

  ---
  Cleared 2026-07-24: the ABC-004..007 stack was merged to main and moved to Done. UAT
  execution for the EPIC-001 rules core is DEFERRED, not skipped — it is a pure library with
  no surface a human can exercise until EPIC-006 packaging ships a runnable game. The
  traceability UAT cells read "UAT deferred — EPIC-006" so the gap stays visible rather than
  being quietly marked passed.

---

## Done (WIP unlimited) — column note

ABC-020 merged 2026-08-02. THREE stacked branches landed in ONE fast-forward, because they were
  a single linear chain and nothing had diverged: main d53ce31 -> cb62c9f, 27 commits, no merge
  commit created.

    main
     └─ grugops/architecture-audit-2026-07-29     ADR-0002 + ADR-0003 ratified; ABC-009/010/011 cut
         └─ grugops/epic-to-tickets-EPIC-002      EPIC-002 decomposed; ADR-0004 ratified; ABC-020/021 cut
             └─ grugops/ticket-to-pr-ABC-020      ABC-020 implemented + gated

  Verified BEFORE the merge (on the tip) and AGAIN AFTER it (on main): 174/174 green, 0 skips,
  lint + typecheck + build all exit 0. Re-verifying on main is the ABC-004..007 precedent and it is
  the only check that catches a merge which breaks something no branch broke on its own.

  ALL NINE branches in this repo are now contained in main; `git branch --no-merged main` is empty.
  No branch was deleted -- that is the owner's call, not an agent's.

  BRANCHES DELETED 2026-08-02 on EXPLICIT owner instruction ("validate if these branches have been
  merged and if so then delete each"), which is the owner making the call the line above reserved
  for them. NOT standing authorization: no future branch is deleted without the same instruction.
  Validated BEFORE deleting, per branch, by `git merge-base --is-ancestor <branch> main` plus
  `git rev-list --count main..<branch>` -- all eight returned contained / 0, and
  `git branch --no-merged main` was empty. Deleted with `git branch -d`, the safe form that REFUSES
  an unmerged branch; `-D` was never used, so an unmerged branch could not have been lost even if
  the validation had been wrong. Tips recorded here so they are recoverable independent of the
  reflog, and each was re-confirmed an ancestor of main AFTER deletion:

    grugops/ticket-to-pr-ABC-020           cb62c9f
    grugops/epic-to-tickets-EPIC-002       d6c7e71
    grugops/architecture-audit-2026-07-29  4d00cb1
    grugops/close-out-EPIC-001             d53ce31
    grugops/ticket-to-pr-ABC-007           cd9caae
    grugops/ticket-to-pr-ABC-006           07cfac5
    grugops/ticket-to-pr-ABC-005           8eb8b69
    grugops/ticket-to-pr-ABC-004           ce05df9

  `main` is now the only branch, still at 4a73cf3 -- unmoved by the deletions. NO COMMIT WAS LOST:
  every SHA above is still reachable from main. Nothing was merged and nothing was deployed.

  The merge was performed by an agent on EXPLICIT human instruction ("merge the one open"), the
  same one path that crosses the "humans hold merge" line without breaking it: the human holds the
  DECISION, the agent supplies the keystroke. This is NOT standing authorization; the standing rule
  is unchanged and no future merge happens without the same explicit instruction. Identical to the
  rule already recorded for ABC-001/002/003/008 and for the ABC-004..007 stack.

  MERGED WITH ONE OPEN QUESTION AGAINST IT, recorded so it is not lost: FIDE 9.6.1 says "five
  CONSECUTIVE alternate moves" and this code uses a plain 5-count (QE, `UNKNOWN - verify`, declined
  to assert it from a remembered sentence). The Orchestrator recommended settling it BEFORE the
  merge; the owner merged first. That is a legitimate call -- the error direction is the safe one,
  as with ABC-011 -- but the consequence is now real: closing it means a SECOND change to
  src/gameend.ts on main rather than one change on a branch. It is open question 1 in
  memory-bank/60-progress.md.

  THAT OPEN QUESTION IS CLOSED, 2026-08-02, task `refinement-fide-9-6-1` (Workflow 07): THE CODE
  CONFORMS AND THE SECOND CHANGE IS NOT OWED. BA/PM ruled it against the retrieved Laws text and
  the Orchestrator re-fetched independently before accepting -- Article 9.6.1 at
  handbook.fide.com/chapter/E012023 reads verbatim "the same position has appeared, as in 9.2.2 at
  least five times", and the word CONSECUTIVE occurs ZERO times in the whole 2023 Laws. QE's
  memory was verbatim correct for the 2014 edition, which the 2017 edition replaced: right words,
  wrong edition -- a failure only retrieval can catch, so QE's refusal to assert it is VINDICATED
  rather than overturned. `occurrences >= 5` matches "at least five times" (and `>=` is the right
  direction); `halfmoveClock >= 150` matches 9.6.2's "at least 75 moves ... by each player"; 9.6's
  "if the last move resulted in checkmate, that shall take precedence" is the terminal-check order
  A6 already pins. NO TICKET CUT, no column moved, no override taken. The conditional
  Architect/Design hop -- held in case consecutiveness needed ADR-0002 clause 3's per-ply key list
  -- is CANCELLED rather than deferred; ADR-0002 needs no amendment on this account. Response bytes
  and their sha256 are retained under .grugops/context/refinement-fide-9-6-1/sources/. No gate was
  re-run: nothing under src/ or any test file changed.

  ABC-004..007 merged 2026-07-24 as one fast-forward of the stacked unit
  (main f80a15a → cd9caae, no conflicts), suite re-verified 143/143 green ON main after the
  merge. EPIC-001 (Chess rules core) is now COMPLETE: all 8 tickets closed.

  The merge was performed by an agent on EXPLICIT human instruction — the same one path that
  crosses the "humans hold merge" line without breaking it: the human holds the DECISION, the
  agent supplies the keystroke. This is NOT standing authorization; the standing rule is
  unchanged and no future merge happens without the same explicit instruction. Identical to
  the rule already recorded for ABC-001/002/003/008.

---
