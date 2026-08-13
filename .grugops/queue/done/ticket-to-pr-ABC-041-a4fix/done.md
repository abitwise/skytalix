---
task: ticket-to-pr-ABC-041-a4fix
by: software-engineer
at: 2026-08-13T22:36:00Z
state: complete
---

Work COMPLETE. This claim is finished, not stale — read it that way if the
`queue.stale_ttl_minutes` (30) window has passed.

Result: **the instrument now matches the repaired `A4`, and my own refuted claim is superseded on
the record.** `src/render-seam.ts` is **byte-untouched** — absent from `git diff --numstat 8dbe2b4`
entirely, md5 `bc18d0830b84adaff123affce66561c5` unmoved across the whole hop, mutant included. The
branch diff is **one file**: `src/render-seam.test.ts`, +48/−28.

**The circular width is fixed and it was WATCHED failing.** `A4`'s `const width = (frame[0] as
string).length` read the width off a board row; it is now a `Math.max` over the rows of `renderBoard`
+ `renderStatusPanel` + `renderHistory`, for both orientations, mirroring `assembleFrame`'s own
reduce. QE's `X2` padding mutant (nine blanks, digit-free) was **rebuilt here, not read**: with the
adjacent whole-frame equality removed, the **new** width line goes RED and the **old** one goes
GREEN — QE's `8 passed` reproduced by my own hand. Mutant reverted; module md5 re-verified.

**`A11` needed no new row.** The gate's `A4 (purpose)` row already asserts exactly it (the merged four
each called once), so it was **renamed** to `A11` with its assertions untouched. **The lane allotment
of 1 test file stays spent at one; no second file was added and no test was added** — 12 in the file,
**828/828 on 29 files, skip 0**, the same numbers as the base. The gate's standalone `A4 (width)` row
is **kept, not folded in**, and the overlap is flagged for QE rather than resolved by me.

**"Strictly stronger" is WITHDRAWN**, in a new note whose `supersedes:` names the original's id. The
original note is **neither edited nor deleted**; its three unrefuted sections are carried forward in
the superseding note so replay does not lose them. The refuted phrase in `plans/traceability.md` is
corrected by an **append**, with the original wording left standing.

Gates on the branch tip: lint **0** (green on the first run, `self_fix_attempts` 0 of 2; the 2 infos
are pre-existing `biome.json` notices), typecheck **0**, build **0**, `npm test` **828/828 on 29**,
skip **0**, `test-integrity` **`No findings.` exit 0**. `PERFT_DEEP` NOT run — the diff is one
`*.test.ts` and cannot reach the rules core.

Five notes recorded under `.grugops/context/ticket-to-pr-ABC-041-a4fix/notes/`, committed on
`grugops/ticket-to-pr-ABC-041-a4fix` @ `78a3db8`. **No `finding`, no invented `§14-gate` stamp.**

**The `pending -> done` queue move is OWED TO THE ORCHESTRATOR**, for the same reason BA/PM recorded:
`.grugops/queue/pending/ticket-to-pr-ABC-041-a4fix.md` is committed on `main`, which is ahead of this
branch's base, and this hop commits only on its own branch. This `claim.md` / `done.md` pair is
written into the MAIN repo's working tree and left **untracked** for that reason.

**`ABC-041` was NOT moved on the board — it stays `In Review`.** The `BLOCKED_NEEDS_FIX` on `A4` is
answered; **lifting it is QE's** at the narrow re-gate. Nothing was merged, nothing was deployed, and
the ticket page was not opened.
