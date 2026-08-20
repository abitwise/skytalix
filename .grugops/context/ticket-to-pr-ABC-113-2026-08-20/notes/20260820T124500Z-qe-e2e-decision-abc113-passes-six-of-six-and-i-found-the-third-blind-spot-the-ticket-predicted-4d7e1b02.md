---
id: 20260820T124500Z-qe-e2e-decision-abc113-passes-six-of-six-and-i-found-the-third-blind-spot-the-ticket-predicted-4d7e1b02
kind: decision
by: qe-e2e
role: qe-e2e
task: ticket-to-pr-ABC-113-2026-08-20
at: 2026-08-20T12:45:00Z
verified_by:
confidence: high
refs:
  - ABC-113
  - ABC-043
  - ABC-044
  - EPIC-006
  - plans/traceability.md
  - agent-factory/workflows/04-ticket-to-pr.md
  - agent-factory/workflows/16-context-read-write.md
  - agent-factory/workflows/17-task-claim.md
supersedes:
---

# `ABC-113` PASSES 6/6 and leaves `In Review`. I built seven wrong builds; two of them say things nobody has said yet

## Why this is a hand-authored `decision` and not a stamped `finding`

Same reason the two hops before me gave, re-checked rather than inherited: **no `scripts/context-io.ts`,
no `mcp__grugops__propose_note`, no stamp issuer in this install.** Workflow 16 admits a `finding` only
against a live green `§14-gate#<id>` verdict and Workflow 05 says that verdict is minted by `emitVerdict`
and never hand-written. **So: no `finding`, no stamp.** Everything below is a `decision` at
`confidence: high` because I ran every command in it myself.

## VERDICT — per criterion, each one re-measured by attacking it

| | verdict | how I measured it, not what I read |
|---|---|---|
| `A1` | **PASS** | delivered → `["history ="]`, **1**, GREEN. `D3` (shadowing-parameter rebind, `tsc --noEmit` clean) → **2**, RED, 1 failed / 1206 passed. `M9` (`const decoy = { ...history }` / `history: decoy,`, `tsc` clean) → **2**, RED, 1 failed / 1206. Both re-planted by me at the tip, both reverted. |
| `A2` | **PASS — and it buys MORE than the page claims** (see the `M15` section) | `M11b` re-planted by me: **3 lane failures** including `NEITHER STRING IS A SUBSTRING OF THE OTHER`, on *threefold-repetition's headline contains fivefold-repetition's*. **Control: the same mutant against `git show main:src/result-screen.test.ts` → 2 lane failures and that test GREEN.** The dead row is alive. |
| `A3` | **PASS** | `git diff --name-only main...HEAD -- src/` → exactly `src/cli.test.ts`, `src/result-screen.test.ts`. The same with `':!src/*.test.ts'` → **empty**. `git diff --numstat main...HEAD -- src/cli.ts src/result-screen.ts src/frame.ts` → **empty**. |
| `A4` | **PASS** | `npx vitest run --dir src` → **40 files / 1207 tests / 0 skipped**, green. Skip count re-derived independently via `--reporter=json` → `numPendingTests` **0**, `numTodoTests` **0**. |
| `A5` | **PASS** | all three of `D3`, `M9`, `M11b` watched RED by me, at the tip, with the failing test named, each reverted; plus four builds the criterion never asked for (below). `git status --porcelain` carries no decoy residue. |
| `A6` | **PASS** | the comment beside `ABC-043` `A1`'s rows names `M10` and `D3`, states the pre- and post-repair instruments are INCOMPARABLE rather than ordered, and says this row is what makes the instrument stronger than both. Present, in those words. |

**Result: PASS. `In Review` → `Ready for UAT`.** Not merged, no waiver applied — both are the
Orchestrator's, and the waiver stays pre-registered over `git diff --name-only main...HEAD -- src/`.

## `D4` — THE THIRD BLIND SPOT. It is still open, and it is the same class the ticket set out to close

I was told to expect one. There is one.

```ts
  const history = newGame(START_FEN);
  const spare = { ...history };
  for (const history of [spare]) {
  try { const outcome = await runTurnLoop({ history, … }); … } catch { … }
  }
```

**`tsc --noEmit` CLEAN. `npx vitest run --dir src` → 40 files / 1207 tests, ALL GREEN.** The loop and the
result screen are both handed `spare`, not the game the entry point built — the exact property
`ABC-043` `A1` says it holds (*"every option is the merged factory's own return value"*), and the exact
shape of `D3`.

**It survives because a `for…of` binding introduces the name with NEITHER `:` NOR `=` after it.** The
count row's regex is `/\bhistory\s*[:=]/g`; `for (const history of …)` matches nothing, so the count is
still 1. The initializer row is green (the line is untouched), the shorthand row is green (`history,`
is still the option), the `newGame(` count is green.

- Against `ABC-113`'s instrument: **1207/1207 GREEN.**
- Against `main`'s instrument (control): **1207/1207 GREEN.**

**This is NOT a regression and it does NOT fail `A1`.** `A1`'s acceptance text is a count of 1 and two
named decoys at 2; all three measured exactly as written, and the ticket never claimed completeness. But
the page's sentence *"`A1` below closes `D3`"* is true of `D3` the mutant and **not** of `D3` the class.
Every `[:=]`-free binder form is still invisible: `for…of`, `for…in`, `catch (history)`, and a
contextually-typed callback parameter that needs no annotation. **The honest sentence is "closes the
annotated-rebind spelling of the class", and that is the recommendation below.**

This is the same recursion that produced this ticket: QE repaired `ABC-043` `A1`, found a residual in
its own repair, and `ABC-113` exists because of it. `D4` is the next turn of it, and I am not authoring
its close for the reason the page already records — **authoring and adjudicating the same instrument is
a conflict.**

## `M15` — THE MUTANT THE PAGE SAYS IS UNCONSTRUCTIBLE. I constructed it, and `A2` is UNDERsold

The ticket, the board row, the trace row and the delivered comment all carry this sentence:

> *a mutant that the headline rows kill ALONE is unconstructible while those word rows stand — a
> substring relation forces the forbidden word into the other screen.*

**MEASURED FALSE.** The argument only holds while the headline is ONE row. `headline()` already returns
TWO rows on the fault path, so a multi-row headline is not hypothetical in this module. `M15`, in
`src/result-screen.ts`'s `headline()`:

```
fivefold-repetition  → ["Draw by repetition.",
                        "Specifically fivefold repetition, automatic under FIDE 9.6.1."]
threefold-repetition → ["Draw by repetition. Specifically threefold repetition, claimed by the
                        player to move under FIDE 9.2."]
```

- `tsc --noEmit` **clean**.
- Against `ABC-113`'s instrument: **1 failed / 1206 passed**, and the ONE red row in the whole lane is
  the retargeted row — *threefold-repetition's headline contains fivefold-repetition's: expected 'Draw
  by repetition. Specifically thre…' not to contain 'Draw by repetition.'*
- **Against `main`'s instrument (control): 1207 / 1207 GREEN.**
- The four word rows: **GREEN.** The set-of-8 row: **GREEN.** The naming row: **GREEN.** `A3`'s fault
  rows, `A5`'s move-list rows, the CSI row: **GREEN.**

The word rows scan the WHOLE SCREEN; the retargeted rows scan ROW 1. Move the distinguishing word to a
second headline line and the "forced word" argument evaporates while row 1 becomes a strict prefix — the
`M11b` defect, spelled over two lines. **So `A2` does buy new coverage: it has an EXCLUSIVE kill, and it
is the only row in 1207 that sees this build.** The limiting sentence is wrong **in the ticket's favour**,
which is the rarer direction and still a false sentence in a shared record.

## SHAPES I RULED OUT before `M15`, so the negative result is legible

- **Single-row headline, either direction.** The page's argument is CORRECT here and I could not beat it:
  the automatic screen must match `/\bautomatic\b/` and the claimed screen must match `/\bclaimed\b/`,
  the move list is identical and carries neither word, so the word must sit in the headline — and any
  containment drags it into the other screen, where `not.toMatch(/automatic/i)` / `not.toMatch(/claim/i)`
  red it. **Unconstructible, confirmed.**
- **Empty-string containment.** Making one headline `""` satisfies one direction but kills the other
  (`"x".not.toContain("")` fails) and strips the required word. Dead end.
- **Case games.** `/\bautomatic\b/` is case-sensitive but the paired refusal `/automatic/i` is not, so
  a case variant is caught. Dead end.
- **Attacking `screenFor`.** Test code, not a build. Refused.

## `screen.split("\n")[1]` IS AN INDEX INTO A LAYOUT — I broke the layout, and it fails LOUD, not dead

Two probes, because a row that silently starts asserting on a blank line is the thing this ticket exists
to remove and I was not willing to trade one dead row for another:

- **`M12` — leading blank dropped** (`return [...headline, "", ...moveList]`), so `[1]` is the separator:
  **RED, 1 failed / 1206** — *expected '' not to contain ''*. (`"".includes("")` is true, so the row
  fails rather than passing vacuously.)
- **`M14` — one row only** (`return [...headline]`), so `[1]` is `undefined`: **RED, 5 failed / 1202** —
  vitest refuses the assertion outright: *the given combination of arguments (undefined and undefined) is
  invalid for this assertion*.

**No silent death in either direction — the index cannot go dead, it can only go loud.** The residual
cost is a MESSAGE one: on a layout change the criterion row reds with *expected '' not to contain ''*,
which names neither the criterion nor the layout, and the next reader will hunt in the wrong module. That
is a real but small tax, it is cheaper than the dead row it replaced, and I am recording it rather than
cutting it.

## THE ORDERING — count row BEFORE shorthand row: it hides one real thing, and I still call it right

`vitest` aborts an `it` at the first failing `expect`. Placing the count first means **on any build the
count row reds, the shorthand row is never evaluated.** Measured: `M9` on this instrument reports only
*to have a length of 1 but got 2*; `M9` on `main`'s instrument reports *expected 'runTurnLoop({\n
history: decoy,…' to match /\bhistory,/*. Same build, two different rows speaking.

- **Nothing is hidden on a green build** — all rows run when all pass, so no coverage is lost, ever.
- **What IS hidden is the SIBLING ROW'S INDEPENDENT STATUS on a red build.** The engineer had to run
  against `main` to discover that the shorthand row also kills `M9`; that fact is invisible from this
  instrument's own output by construction of the ordering.

**Verdict: correct call.** Message quality on a decoy build is worth more than per-run diagnostic
breadth inside one `it`, and the reason is written in the comment beside it. **The cost is recorded here
because it was not: "the COUNT is the row that speaks first" is stated as a benefit with no mention that
it also SILENCES the row below it.**

## TWO FALSE SENTENCES ARE SHIPPING IN THIS TICKET'S OWN DIFF. I measured both and I did NOT fix either

`ABC-113` exists to remove sentences a next reader wrongly believes. It is adding two.

**(1) `src/cli.test.ts`, the count-row comment — FALSE, measured:**

> *"a shadowing-parameter rebind (`D3`) or a flat copy bound under the same name (`M9`, `history: decoy,`)
> hands the loop a different object **with both of those rows still green**."*

`M9` against `main`'s `src/cli.test.ts`: **RED on the anchored shorthand row** — *the `history` option is
not the shorthand for the game the entry point built: expected 'runTurnLoop({\n      history: decoy,…' to
match /\bhistory,/*, 1 failed / 1206 passed. **The shorthand row is NOT green on `M9`.** The engineer
disclosed this correctly in their note and the Orchestrator verified it — but the file, which is what the
next reader actually opens, still says the opposite. **A note nobody reads does not correct a comment
everybody reads.**

**(2) `src/result-screen.test.ts`, the `A2` comment — FALSE, measured:** the `unconstructible` sentence,
falsified by `M15` above. It is on the ticket page, the board row and the trace row in the same words.

**I did not author either correction and that is deliberate, not laziness.** The `ABC-113` page's own
opening records that QE *declined to author either close* because **authoring and adjudicating the same
instrument is a conflict**, and that refusal is why this ticket exists. I will not spend that principle
on my own hop. Both are named here, in the board row and in the trace row, where the false sentences live.

**RECOMMENDED — the Orchestrator's call, before merge:** three comment sentences and a page sentence, no
assertion changed, `A3` untouched (both files are already in the diff):
1. `src/cli.test.ts` — strike *"with both of those rows still green"* for `M9`; the true statement is
   *`D3` leaves both rows green, `M9` reds the shorthand row and this row simply speaks first*.
2. `src/cli.test.ts` — narrow *"closes `D3`"* to the annotated-rebind spelling, and name `D4`
   (`for…of` / `for…in` / `catch` / contextually-typed parameter) as the open remainder.
3. `src/result-screen.test.ts` — replace *"unconstructible"* with `M15`, which is constructible, is
   killed by these rows alone, and is **evidence for** the retarget.
4. The `ABC-113` page carries (3) too. That page is BA/PM's pen — **I do not amend it**, and neither
   `ABC-043` nor `ABC-044` was opened at this hop.

If the Orchestrator would rather cut `D4` and the two sentences as a follow-up than hold this branch, that
is a defensible call and I say so plainly — **none of it fails a criterion.** What is not defensible is
merging them unnamed, so they are named in three places.

## THE ROW IS MALFORMED NOW, AND IT IS THE CORRECTION THAT BROKE IT

The engineer claimed the `ABC-113` trace row *"arrived carrying eleven columns and no closing pipe"*. The
Orchestrator measured that claim FALSE and corrected it **by appending to the row**. I re-measured at
`eb98c0b`, before touching anything:

- header row: **12 pipe-fields, ends with `|`** → 10 columns.
- `ABC-112` (the row above): **12 pipe-fields, ends with `|`** → 10 columns.
- `ABC-113`: **12 pipe-fields, does NOT end with `|`** → **11 cells, the 11th unterminated.**

**The corrective append introduced exactly the defect it was correcting the false report of.** The
`CORRECTION` text was written after `Status`'s closing pipe as a raw 11th field. Effect on a renderer:
an extra trailing cell. Effect on the record: the third statement about this row's shape in two hops,
and the first one that is true when it is written.

**REPAIRED IN THIS HOP AND DECLARED, not silently:** the `CORRECTION` text is folded back INSIDE `Status`
where it belongs, the closing pipe is restored, and **10 columns are re-asserted by re-splitting the row
from disk after the write (12 fields, ends with `|`)**. No word of the Orchestrator's correction is
deleted — it is moved one pipe to the left. No other row touched.

**The nine genuinely off-shape rows** (`ABC-009`, `ABC-011`, `ABC-015`, `ABC-019`, `ABC-031`, `ABC-062`,
`ABC-065`, `ABC-066`, `ABC-106`) — I re-counted them myself: **nine, exactly, confirmed.** **NOT touched.**
They are unowned and uncut, they are not this ticket's, and repairing nine rows silently would hide nine
decisions. That finding stands.

## THE OWNER LANDED THE LANE-SCOPE CHANGE ON THIS BRANCH WHILE I WAS MEASURING `A4`

At **11:48:59** and **11:49:09** local, mid-hop, `biome.json` and `vitest.config.ts` appeared MODIFIED
in this tree. I did not write them. My first reading was that an unclaimed agent had done it — its queue
at `.grugops/context/cut-lane-scope-exclude-2026-08-20/pending/` is still UNCLAIMED. **That reading was
wrong and I checked it before writing it down as fact.** At **11:52:48** the change was COMMITTED to this
branch by the project owner:

```
2bef492  Olger Oeselg  Thu Aug 20 11:52:48 2026
  Don't run claude workspace and other tests that are not part of this project. Same with linting.
  biome.json | 13 +-   vitest.config.ts | 26 +
```

**It is the human's own commit, on the ticket branch, after delivery.** It is not mine to revert and I
did not touch it — humans hold this branch's contents as much as they hold merge.

**What it does and does not do to this ticket, measured rather than assumed:**

- **`A3` STILL PASSES, as literally written.** `git diff --name-only main...HEAD -- src/` is still
  exactly `src/cli.test.ts` and `src/result-screen.test.ts`; both config files sit outside `src/`.
- **`A4` HOLDS UNDER BOTH CONFIGS.** `npx vitest run --dir src` reads **40 files / 1207 tests / 0
  skipped** at **11:47:49 on the OLD config** (before the first byte landed) and again at **11:54:38 on
  the COMMITTED NEW config**. `--dir src` already restricts the lane and the injected `exclude` only
  names non-`src` directories. **The pin did not move — but it was measured on both sides rather than
  quoted from one.**
- **`npm run lint` NOW EXITS 0.** The owner's `biome.json` change closes the environmental failure that
  three hops have been routing around: `npm run lint` (`biome check .`) → **exit 0, 72 files checked**.
  **I ran the real mandatory-gate command, not only the `src/`-scoped substitution, and both are in the
  command list below.** The standing caveat *"`npm run lint` is a known-environmental exit 1"* is now
  STALE on this branch, and I am correcting it in `plans/metrics.md` rather than repeating it.

**WHAT THE ORCHESTRATOR MUST NOT MISS AT THE `Ready for UAT` EXIT — this is the one thing in my hop that
is genuinely load-bearing for someone else's decision:**

The engineer's delivery note and the trace row both state *"`vitest.config.ts` and every lane
configuration untouched — folding it in here would have destroyed `A4`'s pin."* **That sentence was true
when written and is no longer true of the BRANCH.** The whole-branch diff now carries:

```
git diff --name-only main...HEAD
  … biome.json … vitest.config.ts …
```

**The pre-registered waiver instrument (`git diff --name-only main...HEAD -- src/`) is `src/`-scoped and
so it does NOT see this.** That is correct for the "zero PRODUCTION lines" question and it is exactly why
the instrument was fenced. But an `ABC-113` merge now also merges a lane-configuration change that
`ABC-113`'s own page fenced OUT of scope and that has its own queued ticket. **A right answer from a
right instrument, about a branch that is no longer only this ticket.** Whether that ships as one merge is
the Orchestrator's call and the owner's — **it is not a QE finding and it fails no criterion**, so I am
naming it rather than blocking on it. What I will not do is let it merge unnamed.

**Root cause, unchanged and still unowned: agents and the owner are sharing ONE working tree with no
isolation** — the same defect as the 32 stale in-repo worktrees. A concurrent write into
`vitest.config.ts` during a lane-pin measurement is how a wrong number gets into a trace row honestly.
Reported, not this ticket's.

## COMMANDS, EXACTLY AS RUN

- `npx vitest run --dir src` — the CONTAINED lane, **never the repo root** (`## Test notes` 5). Every
  number above is from it. Skip count re-derived via `npx vitest run --dir src --reporter=json`.
- `npx biome check src/` → **exit 0, 68 files**, AND `npm run lint` (`biome check .`) → **exit 0, 72
  files**. **Both were run and both are reported.** The `src/`-scoped substitution is what three hops
  used because `biome check .` exited 1 over the 32 gitignored worktrees; **the owner's `2bef492` closed
  that, so the real mandatory-gate command passes on this branch and I did not hide behind the
  substitution when the real one had become available.**
- `npm run typecheck` (`tsc --noEmit`) → clean. `npm run build` (`tsc --noEmit`) → clean.
- `git show main:src/cli.test.ts` / `git show main:src/result-screen.test.ts` for every control run.
- Seven builds planted at the tip and reverted with `git checkout --`: **`D3`, `M9`, `M11b`, `D4`, `M15`,
  `M12`, `M14`.** `git diff --stat -- src/` empty after each.

**Test-integrity: skip count 0 measured; `.grugops/test-skips.md` does not exist, so
`tools/grugops/test-skip-integrity.js` has nothing to run against — `UNKNOWN - verify`, human-owned, and
NOT read as a pass. I did not author that registry: an agent writing its own justification to clear its
own gate is the failure mode the rule exists for.**

## WHAT I REFUSED, AND WHY

- **The two false comment sentences.** Named in three places, not authored. Conflict rule, above.
- **`D4`'s close.** Same rule, and the same one that produced this ticket. Measured, reported, unowned.
- **The nine off-shape trace rows.** Not mine, nine separate decisions.
- **`vitest.config.ts`, `biome.json` and every lane configuration.** Untouched, including while they sat
  modified in my tree by another actor. I neither committed nor reverted another actor's live edit.
- **No worktree created.** 32 stale in-repo worktrees are the open defect, not the pattern.
- **`ABC-043` and `ABC-044` not re-opened, re-scored or amended.** Their pages were never opened.
- **NOT MERGED. UAT WAIVER NOT APPLIED** — pre-registered as the Orchestrator's at the `Ready for UAT`
  exit, measured over `git diff --name-only main...HEAD -- src/` and **never** over `<tip>~1`. Nothing in
  this hop touches that.

## COVERAGE AND FLAKE

No new test file, no new `it`, no new spawn, no timing assertion, no TTY, no child process, no clock, no
network. **Flaky risk of this ticket's three expressions: nil** — two are pure string operations over a
file read from disk, one is an index into a pure function's return value. The lane held 40/1207/0 on
seven consecutive contaminated builds and three clean ones. **COVERAGE VERSUS THRESHOLD: `quality.coverage_threshold` is
`0.8`, but `mode` is `lean` — the coverage enforcement my role owes is the enterprise-mode one, and this
project is not in it. I did NOT run a coverage pass, so I claim NO coverage number: `UNKNOWN - verify`.
Inventing one over a three-expression test-only diff would be the cheapest lie available here.
(`quality.test_integrity` is `warn`, not blocking, so the missing `.grugops/test-skips.md` does not gate
this exit either — recorded so the next hop does not read silence as a pass.)**
