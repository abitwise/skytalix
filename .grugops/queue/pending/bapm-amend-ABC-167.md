---
subtask: bapm-amend-ABC-167
role: ba-pm
ticket: ABC-167
page: plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
branch: grugops/bapm-amend-ABC-167 (from main 86e8be75)
ref: .grugops/context/bapm-amend-ABC-167/
---

# Amend ABC-167's criteria for QE's gaps (records only)

`qe-ABC-167` gave PASS_WITH_GAPS. Read its notes first: `.grugops/context/qe-ABC-167/notes/`, especially the decision note `…e100c23c` and the break-attempts note `…44fa966c`. Then read the SE's choices note `…297da9e5`, which is on branch `grugops/ABC-167` @ `4dbbfbd8` (`git show 4dbbfbd8:<path>`).

ADR-0044 (D3, D4, D5, D12) is the authority. If the ADR does not decide a point, **say so**: write a recommendation and mark it "owner may overrule". Do not edit the ADR.

## Amend the ticket page

Add dated lines to the ticket page. Make each criterion one that a wrong build fails.

- **QE-167-b (MEDIUM).**
  - Extend A5 with rows that pin D4's increment, `movestogo`, and `movetime`-beats-the-clock rules.
  - Use clocks above the 3 000 ms cap so the rows can actually discriminate. QE's example is `wtime 2000 winc 1000` → G 600.
  - State each expected G, and the bound G ≤ time ≤ G + 2·step.
- **QE-167-a (MEDIUM).** Amend A4's printable check so it runs on lines that echo the input. QE names two: `position … moves e2e4\x1b…` and `go depth \x1b…`.
- **QE-167-c (LOW).** Tighten the 1 ms row so the 50 ms overhead is pinned.
- **QE-167-d (LOW).** Add a `go ponder` hold row (D4.3).
- **QE-167-e (LOW).** Rule what a held `bestmove` does on a new `go`, on `position`, on `ucinewgame` and on `quit`. Base it on D3/D5 ("one bestmove per go").
  - Recommend whether `position`/`ucinewgame` while a `bestmove` is held should write it first.
  - Pin the ruling in A6.
- **QE-167-f (LOW), SE choice 2.** Decide the time-token value rules, and what a keyword without a value does. Example: `go depth movetime 100`.
- **Choices 4 and 5** (`searchmoves` consumption, the `nps` formula) and **QE-167-h**: either decide them or record them as out of scope. Keep it short.
- **QE-167-g (LOW).** The A11 text-only guard. Record whether this goes to the Security/NFR hop or to a follow-up. Do not amend A11 unless the fix is cheap and clear.

Re-score DoR. The ticket stays size S.

## Fences
- Records only: the ticket page, plus notes under `ref:`. Do **not** touch:
  - `src/`
  - `plans/board.md`
  - `plans/traceability.md`
  - ADR-0044
  - `../wt-ABC-167`
  - `../wt-ABC-146`
- Never push, never merge.
- Commit only on `grugops/bapm-amend-ABC-167`. Create it with `git worktree add ../wt-bapm-amend-ABC-167 -b grugops/bapm-amend-ABC-167 86e8be75`.

## Handoff
Write `.grugops/queue/done/bapm-amend-ABC-167.md` and `.claim.md` in main's working tree, uncommitted. Include:
- the commit,
- each gap with its ruling,
- the exact new rows the SE fix hop must make green,
- which rulings are recommendations the owner may overrule,
- a trace row.
