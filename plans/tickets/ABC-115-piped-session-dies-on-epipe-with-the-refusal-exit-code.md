---
id: ABC-115
title: A piped session dies on `write EPIPE` with a raw Node stack and exits `1` — the code the product reserves for a refused command line
status: ready-for-dev
column: Ready for Dev
size: S
priority: P1
epic: EPIC-006
feature: —
---

# ABC-115 — a reader that closes early kills the session, prints a stack trace at the player, and reports the wrong failure to the shell

> **Cut 2026-08-20 by BA/PM** (task `cut-epipe-regression-2026-08-20`, subtask `cut-epipe-regression`,
> Workflow 03). **RE-MEASURED AT THE CUT ON `main` @ `414ef75`, NOT QUOTED** — a QE/E2E hop found and
> bisected this at `qe-ABC-043-review-exit-2026-08-20`, but that note is an **unstamped `observation`**
> (`human_admission` is `off`, no `finding` is admissible on this install), so every number below was
> re-derived here and the two places where **my measurement disagrees with that note are written down
> rather than smoothed** (`## Provenance`).
>
> **`ABC-043` IS NOT RE-OPENED, NOT RE-SCORED AND NOT MOVED.** It is `Done` on the project owner's word
> ("ABC-043 passes, sign it off", Olger Oeselg, 2026-08-20). **That signature closed the ticket; it did
> not close this** — no criterion on that page reaches this path, which is exactly why this is a
> separate ticket and not a re-opening. `ABC-042`, `ABC-044`, `ABC-113` and `ABC-114` are untouched.
>
> **NOTHING IN `ABC-043`'s DIFF IS WRONG.** The hazard is a *consequence* of the feature it delivered:
> the entry point stopped writing one frame and started holding a session open across many writes, so
> for the first time a write can land after the reader has gone away.

## Problem

**The user:** anyone who runs the product with its stdout piped into a reader that stops reading — the
three ordinary shapes are `| head`, `| less` followed by `q`, and any pager or filter the human closes.
On this project that is also **every agent and every script that samples the product's output**, which
is how the defect was found in the first place (a mistyped `cat -A`).

**The pain, measured at this cut on `main` @ `414ef75`, Node v24.12.0, macOS:**

```
node src/cli.ts --ascii </dev/null | head -2    →  child exits 1
```

and stderr carries a raw Node crash:

```
node:events:486
      throw er; // Unhandled 'error' event
      ^
Error: write EPIPE
    at afterWriteDispatched (node:internal/stream_base_commons:159:15)
    ...
    at runTurnLoop (file:///…/src/turn-loop.ts:313:14)
    at async main (file:///…/src/cli.ts:156:21)
```

Three separate things are wrong with that, and they are three different defects wearing one symptom:

1. **The player is shown a Node stack trace** — internal file paths, internal line numbers, and the
   absolute path of the checkout. `src/cli.ts:100-105` states the product's own position on this in
   writing: *"the stack belongs to whoever debugs the bug"*, and the delivered crash path prints an
   `internal error:` line and no stack precisely so this cannot happen. This path bypasses that.
2. **The exit code lies to the shell.** `1` is `USAGE_EXIT_CODE` (`src/cli.ts:90`), reserved for **a
   refused command line**, and `AGENTS.md` `## Development` states the whole contract: *"0 when the
   session ran, 1 for a refused command line, 70 for an internal error"*. **Both were measured at this
   cut and they collide:** `node src/cli.ts --nonsense` exits **1**, and the piped session also exits
   **1**. `src/cli.ts:109-115`'s own docblock says `70` was chosen over a bare `2` *"so that a shell can
   tell a refused command line from a crashed session at all"* — on this path it cannot.
3. **It reports a bug where there is none.** Nothing crashed and no chess code failed; a downstream
   consumer stopped consuming. The product says otherwise, in the loudest way it has.

**Why it fails no criterion anywhere, stated so nobody reads this ticket as softer than it is.** The
`'error'` event on `process.stdout` is emitted **asynchronously, outside the promise chain**, so the one
`try`/`catch` in `main()` (`src/cli.ts:167-183`) cannot see it and no `await` ever returns. `ABC-043`
`A3`'s Given is *"an `InputSeam` that throws"* — this build is not that Given, and `A3` passes as
written. The exit-code ruling on that page is scoped to *"an exception that never became a
`LoopOutcome`"*. **Its letter does not reach this path. Its spirit is breached observably:** *non-zero
is reserved for exactly two things* now has a third, wearing the first one's number.

Full measurement tables, the threshold sweep, the two harness shapes I proved reproduce it, and the
disagreements with the QE note are in `.grugops/context/cut-epipe-regression-2026-08-20/notes/`, not on
this page (`AGENTS.md` `## Process rules` 2).

## Provenance — it is a REGRESSION, and I re-ran the bisect rather than citing it

The QE/E2E `observation` **claims** three isolated trees pin the introducing commit. **I re-ran all
three at this cut, in throwaway worktrees, same Node, same command line, and the claim reproduces:**

| tree | total stdout lines | `\| head -2` |
|---|---|---|
| `54cbb23` — `ABC-042`'s tip, the board-printer | 23 | **exit 0**, no stack |
| `46457b8` — `ABC-043`'s delivery | 24 | **exit 1**, unhandled `write EPIPE` |
| `d127ae3` — `main` when QE measured | 24 | **exit 1**, unhandled `write EPIPE` |
| `414ef75` — `main` today | 24 | **exit 1**, unhandled `write EPIPE` |

`ABC-042` was **safe by accident**: it wrote one frame and returned, so the write had completed before
the reader could go away. The regression range is `54cbb23…46457b8` — **this is a re-measurement of the
note's claim by an independent hop, not a citation of it.**

**Where my measurement DISAGREES with the QE note, and it narrows the trigger:**

- The note lists `| grep -q` as a trigger. **It is not, here: 5 consecutive runs of
  `node src/cli.ts --ascii </dev/null | grep -q 8` exited 0 with zero `write EPIPE` lines.** The
  session's whole output is 24 lines and it ends at end-of-input before `grep -q`'s exit is observed.
- The note gives `| head -30 → exit 0` as the boundary. **The real boundary is the total output:** swept
  `head -N` at `N ∈ {1,2,5,10,15,20,21,22,23,24,25,28,30,40}` — **`N ≤ 23` reproduces (exit 1),
  `N ≥ 24` does not (exit 0)**. 24 is the full output, so the rule is *any reader that closes before the
  session's last write*, and a criterion must be written against that rule, not against `head -30`.
- **Not format-specific and not stdin-specific**, both measured here and neither in the note: the
  default glyph mode (`node src/cli.ts | head -2`) reproduces identically, and so does a session that
  actually plays a move (`printf 'e4\nquit\n' | node src/cli.ts --ascii | head -2`).

## Ruling — WHICH EXIT CODE THIS PATH OWES (BA/PM's own pen, and it is reversible)

**Ruled: `0`, with stderr silent on this path.** The brief asked for a decision or an honest open
question; this is decidable from the contract that already exists, so it is decided.

1. **`1` is out on measurement, not on taste.** It is `USAGE_EXIT_CODE`, and a refused command line was
   measured exiting 1 at this same cut. Two unrelated failures sharing one code is the defect.
2. **`70` is out because it would be a false statement.** `INTERNAL_ERROR` reads *"a bug ended this
   session"*. No bug ended it. Printing that line here is the same species of defect `ABC-114` exists to
   repair — a true-sounding sentence that is not true — and it would make every closed pager look like a
   crash in whatever reads exit codes next.
3. **`0` is what the contract's own words give.** *"0 when the session ran."* It ran; the consumer
   stopped consuming, which is the consumer's choice and not the session's failure. The nearest
   delivered precedent is end-of-input: `input ended`, exit **0** (`AGENTS.md` `## Development`, run
   2026-08-19). **And it keeps the contract at exactly three codes** — this ticket invents no new signal.
4. **`141` (`128 + SIGPIPE`), the shell-idiomatic answer, is CONSIDERED AND REJECTED AT THIS HOP —
   because it is not mine to take.** It requires a **fourth** exit code, which amends a contract written
   in `AGENTS.md` and in `src/cli.ts`'s own docblock. That is Architect/Design's ruling and the owner's
   file. **Pre-registered so nobody re-argues it: if Architect/Design amends the contract to give this
   path a SIGPIPE-shaped code, `A2`'s expected value becomes that code, the rest of this page is
   unchanged, and the ticket is NOT re-cut.** `A2`(ii) is written to hold either way.

**The cost of ruling it here rather than escalating, stated: an Architect/Design hop may overrule me at
`In Design`.** That is the ⚠️ in the DoR score below, and `A2` is shaped so an overrule changes one
literal rather than the ticket.

## Design ruling — `ADR-0016`, 2026-08-20 (Architect/Design, task `design-ABC-115-2026-08-20`)

**DoR item 10's ⚠️ is CLOSED and `## Ruling` above is CONFIRMED, not overruled.** `A2`(i)'s literal
`0` stands, `A2`(ii) is unaffected, **the ticket is not re-cut, not re-scored (`S`/`P1` is BA/PM's)
and no criterion is edited.** The authority is
`memory-bank/50-decisions/ADR-0016-closed-stdout-reader-ends-the-session-at-exit-zero.md`; this is a
pointer to it and the reasoning is in `.grugops/context/design-ABC-115-2026-08-20/notes/`, not here.

Four things the repair hop is handed, so it chooses no architecture at the bench:

1. **Exit `0`, three codes, no fourth.** `141` is rejected on four grounds, three of them new at the
   design hop — chiefly that Node ignores `SIGPIPE`, so a truthful `141` needs a signal death, which
   `A2` forbids, and the untruthful one is a hand-set status claiming a signal that never fired.
2. **`A8` IS SATISFIED BY ITS FIRST BRANCH: no edit is owed to `AGENTS.md` and none to
   `src/cli.ts`'s exit-code docblock** — both stay true verbatim under this ruling. Say so in the
   delivery note; do not open `AGENTS.md` (`ABC-109` is live against it under a byte cap).
3. **The seam: the entry point owns the stdout error arm** — one `sink.on("error")` at
   `src/cli.ts:148`, `EPIPE`-only, re-throwing every other code; `frame.ts`, `turn-loop.ts` and
   `line-input.ts` stay byte-unchanged. **Ending the session: PRIMARY `process.stdin.destroy()`
   (the delivered end-of-input transition then carries `exitCode 0` through the one existing
   assignment); FALLBACK `process.exit(0)` only if the primary is measured to fail.** Both measured
   green at the design hop; ≤ 5 production lines.
4. **A FIFTH FORBIDDEN SHAPE, MEASURED, that `A4` does not catch:** a bare swallow — a listener that
   silences `EPIPE` and does nothing else — **passes `A1` and `A2` and lets the session run on
   invisibly into a dead pipe** (8.02 s vs 3.07 s with a live stdin). `A3` asserts the trigger and
   `A2` the status; **nothing on this page asserts that the session ENDS.** A row for it is
   recommended to BA/PM (it would take `N8-SPAWN` to +6, above the derived ceiling, so it is BA/PM's
   word and not the engineer's) and is **not added here**.

**`XS` re-size trigger NOT fired** — the guard does not collapse to one child. **`A1`'s "1196 bytes"
is a base for a red watch, not a constant: it is path-length dependent (1282 measured at this hop in
a longer path) and must be re-measured, never asserted.**

## Scope

- **One production file: `src/cli.ts`.** The sink is acquired exactly once in the entry point
  (`src/cli.ts:148`, and `ABC-043` `A9` pins that acquisition), so the entry point is the one place that
  can install a stdout error arm covering **all five** write sites reachable in a session:
  `src/frame.ts:238`, `src/frame.ts:244`, `src/turn-loop.ts:313`, `src/cli.ts:172`,
  `src/line-input.ts:239`. **Nothing under `src/` except `src/cli.ts` changes.**
- **One test file, already spawning the real product: `src/cli.test.ts`.** Zero new test files.
- The pinned spawn budget in that file moves by the children this ticket's criteria force, **and only
  those** (see `## NFR / security`).

## Out of scope

- **Any change to what `0`, `1` or `70` mean, and any FOURTH exit code.** The ruling above chooses among
  codes that already exist; amending the contract is Architect/Design's and the owner's.
- **`ABC-050`'s type-valid `exclude` residual and `G-06`.** Both are real, both are open, neither is
  this ticket's. A hop that believes a site belongs to one of them stops and says so.
- **Re-opening, re-scoring, moving or amending `ABC-043`** (or `ABC-042`/`ABC-044`). Its `A3` and its
  exit-code ruling stay exactly as written; `A4`'s guard on this page (`A4` below) proves they still
  hold rather than editing them.
- **stdin-side and stderr-side pipe failures.** Only the **stdout** consumer is in scope; a closed
  stderr is a different Given and nobody has measured it. Named here so a later hop cuts it rather than
  folding it in.
- **Making the game survive a closed reader and keep playing.** The session ENDS — quietly and with the
  right code. Continuing to play into a dead pipe is a different product decision nobody has asked for.

## Acceptance criteria

- **`A1` (no stack trace, and nothing that claims a bug).** **Given** the delivered entry point run as
  `node src/cli.ts --ascii` with stdout piped to a reader that closes after 2 lines, **when** the child
  exits, **then** its stderr contains **zero** occurrences of `write EPIPE`, **zero** occurrences of
  `Unhandled 'error' event`, **zero** lines matching `/^\s+at /` (no stack frames), **zero** occurrences
  of the repository path, and **zero** occurrences of the `internal error:` line — and its stderr is
  **either empty or ≤ 1 line that names no file path**. *Base for the RED watch: the same command on
  `main` @ `414ef75` produced 1196 bytes of stderr containing all of the first three.*
- **`A2` (the exit code, and it survives the ruling being overruled).** **Then** (i) the child's exit
  status is **`0`**; **and** (ii) **independently of (i), and this half binds even if `## Ruling` 4 is
  taken**: the status is **not `1`** (`USAGE_EXIT_CODE`) and **not `70`** (`INTERNAL_ERROR_EXIT_CODE`).
  **Both halves are asserted; (ii) is the half that makes a shell able to tell this from a refused
  command line at all.** The child is **not** killed by a signal (`signal === null`).
- **`A3` (the trigger is the RULE, not one command).** **Then** the guard covers, at minimum, **two
  reader-close points measured on either side of the boundary**: a reader closing at **2 lines**
  (reproduces today) and a reader closing at **23 lines** (the last line before the full 24 — reproduces
  today), plus the **24-line full read** as the control that must stay exit `0` with empty stderr, **on
  both glyph modes** (`--ascii` and the default). *Boundary re-measured at this cut: `head -N` reds for
  `N ≤ 23`, greens for `N ≥ 24`; total output 24 lines.* **The boundary is re-derived at the repair hop
  rather than copied from this page** — the frame height has moved twice this month, and a criterion
  pinned to the literal `23` goes stale silently. **`grep -q` is NOT admissible as the trigger**: it was
  measured 5/5 exit 0 here and would ship a guard that cannot go red.
- **`A4` (the fix does not swallow a real failure — the regression guard on `ABC-043` `A3`).** **Then**
  the delivered build still writes the `internal error:` line and exits **70** for an `InputSeam` that
  throws, and still writes the usage line and exits **1** for a refused command line — **both re-run at
  the repair hop, both from the delivered entry point, and `ABC-043` `A3`'s existing rows stay green
  with zero edits.** A build that reaches `A1`/`A2` by muting stderr or by forcing `process.exitCode = 0`
  globally **fails this criterion**, and that is the cheap wrong fix this row exists to catch.
- **`A5` (watched RED before it ships).** **Then** the new rows are watched failing against the
  **delivered `main` build** (which reds `A1`, `A2`(i) and `A2`(ii) today, measured), and the delivery
  note records the RED output verbatim. A row that has never been seen red is not a guard.
- **`A6` (the fence, checkable from git).** **Then** `git diff --name-only main...HEAD -- src/` lists
  **exactly** `src/cli.ts` and `src/cli.test.ts`; `git diff --numstat main...HEAD -- 'src/' ':!src/cli.ts'
  ':!src/*.test.ts'` is **empty**; and the production diff is **≤ 15 added lines in `src/cli.ts`**. If a
  correct fix cannot fit that, the hop **stops and re-sizes** rather than spreading across modules.
- **`A7` (the lane does not move sideways).** **Then** `npx vitest run --dir src` is green with **40
  test files and 1207 + (new rows) tests, 0 skipped**, and the spawn pin in `src/cli.test.ts:1473` is
  **updated to the exact new count with the derivation written beside it**, exactly as `ABC-043` moved it
  from 10 to 17. *Base measured at this cut on `main` @ `414ef75`: **40 files / 1207 tests / 0 skipped,
  green**, 2.95 s wall / 13.74 s user. **Re-measure at pull time rather than quoting this.***
- **`A8` (the two documents that state the contract are made true again).** **Then** `AGENTS.md`
  `## Development`'s exit-code sentence and `src/cli.ts`'s exit-code docblock **either** still describe
  the delivered behaviour verbatim **or** are amended in the same commit with the change named — and the
  delivery note states which. **Silently leaving a false sentence on `AGENTS.md` is the `ABC-114` defect
  and is a FAIL of this criterion.**

## Dependencies

- **None blocking. Pullable today.** No open ruling gates the work: `## Ruling` decides the code, and
  `A2`(ii) holds if that ruling is later replaced.
- **Ordering, not a block:** `ABC-114` edits comments in `src/cli.test.ts`; this ticket adds rows to the
  same file and moves its spawn pin. **Whichever runs second re-measures** — neither blocks the other.
- **`ABC-108` is open** (`NFR-008` BREACHED on the CPU clause / UNRULED on wall). That does not block
  this ticket; it blocks any honest `N8-LANE` claim on it (see below).

## Risks

- **The cheap wrong fix is available and green.** A global `process.on('uncaughtException')`, a blanket
  `process.exitCode = 0`, or muting stderr all satisfy `A1`+`A2` and destroy the crash path the whole of
  `ABC-043` `A3` and `[D31]` exist to guarantee. **`A4` is the only thing standing between this ticket
  and that build**, and it is why `A4` is a criterion rather than a test note.
- **A `process.stdout.on("error")` arm can swallow a REAL write failure** (a full disk, a closed
  terminal) as well as `EPIPE`. Mitigation is a criterion-shaped one: `A1` demands silence only on the
  `EPIPE`-shaped path; a hop that widens the arm to every stdout error should say so and price it.
- **The harness is the hard part, and it is measured rather than assumed.** `src/cli.test.ts` captures
  children with `spawnSync` and full output capture, which **cannot** close a reader early — so no
  existing child can reproduce this. **Two shapes were proved to reproduce it at this cut**, both
  recorded in the notes: (a) a `/bin/sh -c 'set -o pipefail; … | head -2'` child routed through the
  file's existing `childOf` helper — **it reproduces (exit 1, `write EPIPE` on stderr) and adds ZERO new
  `spawnSync` call sites**, which matters because `src/cli.test.ts:1480-1485` pins the file to exactly
  one call site and to `spawnSync` as its only `node:child_process` import; and (b) an async `spawn` with
  `child.stdout.destroy()` — also reproduces, but it **reds that pin** and needs the pin's derivation
  rewritten. **Shape (a) is the recommendation and is not mandated**; `pipefail` is a bash/zsh feature
  and `/bin/sh` on this host honours it, so a hop that changes platforms re-measures.
- **The symptom is timing-adjacent near the boundary.** `A3` deliberately samples 2 lines (far from the
  boundary) as well as 23; a guard that only samples the boundary is the flaky one.

## Test notes

- Lane is `npx vitest run --dir src` and **never** the repo root (`AGENTS.md` `## Test notes` 5).
- Mandatory gates: `npm run lint`, `npm run typecheck`, `npm run build`, unit.
- **Extend `src/cli.test.ts`'s existing `childOf` helper; do not add a second `spawnSync` call site** —
  `src/cli.test.ts:1480-1485` asserts that textually and must stay green (`ABC-043` `## Test notes` 5-6,
  inherited).
- Every child keeps a `timeout:` bound. A hung child must be a red row, not a stalled lane.
- **Test integrity:** `.grugops/test-skips.md` is human-owned; `quality.test_integrity` is `warn`. Its
  absence is `UNKNOWN - verify` and must not be read as a pass.

## NFR / security

- **NO `N8-LANE` LINE IS CLAIMED, deliberately** — `ABC-108` is open and `NFR-008` is **BREACHED on the
  CPU clause / UNRULED on wall** (re-measured at this cut: **13.74 s user against the 13 s clause**), so
  a 5% slice of a spent total is not a slice. Same posture as `ABC-110`, `ABC-113` and `ABC-114`.
- **`N8-SPAWN`: this ticket's criteria force children, and they are derived rather than estimated** —
  `A3` names **five** (2-line and 23-line close on `--ascii`, the same two on the default glyph mode, and
  the 24-line control), `A4` names **two** (the throwing `InputSeam` and the refused command line) **only
  if `ABC-043`'s existing children cannot be reused — they can, so `A4` should add ZERO**. `A1`, `A2`,
  `A5`–`A8` add none. **Ceiling: +5, i.e. the pin moves 17 → 22, and a child no criterion names is a
  finding against the ticket, not a charge on the account.** At the 64-72 ms per child `ABC-043`
  measured, +5 ≈ 0.35 s wall. **`N8-SPAWN`'s balance is NOT claimed met here** — see the line above.
- **`NFR-002` NOT triggered** — no frame is composed and `src/frame.ts` is untouched. This is an exit
  path, not a latency one.
- **Security: one real, small surface.** The delivered stack trace discloses the **absolute filesystem
  path of the checkout** to whatever captures stderr; `A1` closes that as a side effect and asserts it
  explicitly (*zero occurrences of the repository path*). No input path, no network, no filesystem write,
  no new dependency. ASVS L1: nothing above informational.
- **Falsifiable zeroes:** 0 new test files, 0 new production modules, 0 new dependencies, 0 changes to
  any file under `src/` other than `src/cli.ts` and `src/cli.test.ts`, ≤ 15 added production lines.

## Definition of Ready — 9/10, ⚠️x1

| # | check | verdict |
|---|---|---|
| 1 | problem clear (user, pain, value) | ✅ user = anyone piping stdout, incl. every agent that samples this product; pain re-measured today |
| 2 | scope / out-of-scope clear | ✅ one production file named, five write sites named, four exclusions named |
| 3 | INVEST | ✅ independent of every open ticket, one file, one hop, testable at `A1`–`A8` |
| 4 | acceptance testable and measurable | ✅ every criterion is a count, a status, a file list or a byte — `A1` counts stderr occurrences, `A2` asserts a status twice, `A6` is a `git diff` |
| 5 | dependencies known | ✅ none blocking; the `ABC-114` file overlap is named as ordering |
| 6 | security/NFR triggers with measurable targets | ✅ `N8-SPAWN` derived to a **+5 ceiling**, `NFR-002` explicitly not triggered, `N8-LANE` explicitly NOT claimed with the reason, path-disclosure closed by `A1` |
| 7 | test notes present | ✅ lane, gates, helper constraint, timeout rule, integrity posture |
| 8 | size assigned | ✅ `S` — argued below |
| 9 | priority assigned | ✅ `P1` — argued below |
| 10 | no major unresolved blocker | ⚠️ **the exit-code ruling is BA/PM's and Architect/Design may overrule it at `In Design`.** It is not an *open question* — it is decided, on this page, from the product's own contract — but it is reversible, and `A2` is deliberately shaped in two halves so an overrule changes **one literal** and re-argues nothing. **This does not stop the ticket being pulled today.** |

## Sizing — `S`, and the comparables are named

**Not `XS`.** `ABC-112` is the `XS` on this board: one message, one existing test file, no new harness
shape. This ticket needs a **harness shape the file does not have** (a child whose reader closes early —
proved necessary here, because `spawnSync` with full capture cannot reproduce it), a **pinned spawn count
re-derived**, a **watched-RED round**, and **production lines in the entry point**.

**Not `M`.** One production file, one test file, ≤ 15 added production lines, no design ruling owed (the
ruling is on this page), no owner escalation, no coverage re-homing, no new module. `ABC-107` is the `M`
comparable and it is unruled by construction; this one is not.

**`S`, against `ABC-114` (`S`) as the nearest neighbour**: comparable measurement burden, smaller edit
surface, but it carries production lines where `ABC-114` carries none.

**Re-size trigger:** `XS` if Architect/Design rules the arm's shape at `In Design` and the guard collapses
to one child. **`SPLIT_REQUIRED` is NOT raised** — nothing here is `XL`.

## Priority — `P1`, and QE recommended `P2`

**The QE/E2E note recommends `P2`. I am moving it to `P1` and the argument is here rather than in a
note**, so a later hop can overturn it on the same terms:

1. **It is a REGRESSION on `main` today, not a never-worked gap.** `54cbb23` exits 0 on the same command
   line; `414ef75` exits 1 with a stack. Re-measured at this cut, not cited.
2. **It breaks a contract this project WROTE DOWN in two places** — `AGENTS.md` `## Development` and
   `src/cli.ts:109-115` — and the collision it creates was measured today: a refused command line and a
   crashed pipe both exit `1`, which is precisely what `70` exists to prevent.
3. **The board's own `P1` precedent is `ABC-112`: *the product tells the player something false*.** This
   path tells the player two false things at once — a stack trace claiming a crash where no bug occurred,
   and an exit code claiming a refused command line where nothing was refused.

**NOT `P0`:** nothing is blocked, no gate is wrong, no test is lying, and the ordinary terminal path is
unaffected — the player who never pipes never sees it.
**NOT `P2`:** it is on `main`, it is a regression, and the wrong exit code is the kind of defect that gets
built on (any script or agent branching on this product's exit status is already reading a false answer).

**`P0` promotion trigger, pre-registered:** any hop, gate or script measured taking a wrong routing
decision off this exit code, or the same unhandled-`error` shape found on a second stream.
**`P2` demotion trigger:** Architect/Design ruling the closed-reader path an **accepted risk** with a named
owner and a dated word — never on an agent deciding it is moot.
