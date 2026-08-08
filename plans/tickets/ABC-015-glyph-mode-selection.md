---
id: ABC-015
title: Glyph mode selection — precedence, signal set, and the --unicode override
status: in-security-nfr
column: In Security/NFR
size: S
priority: P1
epic: EPIC-002
feature: —
---

# ABC-015 — Glyph mode selection: precedence, signal set, and the `--unicode` override

## Problem

*User*: the player whose terminal draws `????????` where the pieces should be, and who has no idea
why or what to do about it. Also the player on a modern terminal who should never have to think
about this at all.

*Pain*: `RISK-005` — Unicode chess glyphs behave differently across Windows Terminal, iTerm2, tmux
and CI — and its mitigation is explicitly *"the ASCII fallback being built in from the start rather
than retrofitted"*. Nothing decides which mode a session uses.

*Value*: the majority get figurines with no flag and no prompt; the minority get a readable board
and one documented flag to reach it.

## The ruling this ticket implements, and its honest limit

Wave 1 established that **the original epic acceptance criterion #2 could not be met by any
in-process detection.** A process can read whether stdout is a TTY, what the locale claims, and the
platform. It **cannot** read whether the installed font has glyphs for `U+2654`–`U+265F`, and it
cannot observe what the terminal actually drew. BA/PM ruled the product answer on 2026-07-30 and
amended the criterion in `plans/epics/EPIC-002-terminal-board-and-game-loop.md` (amendment `[A1]`,
criteria `2a` / `2b` / `2c`). **This ticket does not re-decide any of that**; it implements `2b` and
carries the residual named in `2c`.

**Residual, carried openly:** a UTF-8 TTY whose font lacks the figurines still draws tofu, and no
signal in the table below predicts it. The remedy is `--ascii`, documented in `--help`.

## Scope

**One selection function**, called **exactly once at startup**, returning a value the renderer
consumes for the rest of the session.

Precedence: **explicit flag > signal > default**, and the default is **Unicode**.

| # | Input | Mode |
|---|---|---|
| 1 | `--ascii` passed | **ASCII** |
| 2 | `--unicode` passed | **Unicode** |
| 3 | no flag, and `process.stdout.isTTY` is falsy | **ASCII** |
| 4 | no flag, a TTY, and the first **set** of `LC_ALL` / `LC_CTYPE` / `LANG` does **not** match `/utf-?8/i` | **ASCII** |
| 5 | no flag, a TTY, and the locale is unset **or** matches `/utf-?8/i` | **Unicode** |

Four things the table encodes deliberately, each recorded so it is not "improved" later:

- **`process.platform` is NOT a signal.** `win32` is a proxy for "legacy conhost", and Windows
  Terminal — the default on Windows 11 — renders the figurines correctly, so the proxy is wrong on
  the majority of Windows machines today. Defaulting Windows to ASCII would give the largest
  desktop platform the worse board to protect a shrinking tail.
- **Row 4 tests *set and not UTF-8*, never *unset*.** Unset is the normal Windows case and carries
  no information; treating it as a negative signal would smuggle the platform rule back in through
  the side door.
- **Non-TTY means ASCII** because a sink that cannot be seen and cannot be asked should receive the
  portable form. This is also what makes `EPIC-006`'s pipe-driven end-to-end test deterministic.
- **"Set" means set to a NON-EMPTY value — ruled 2026-08-08 (second pass), see the second
  correction block under `## Acceptance`.** A variable set to the empty string — `LC_ALL=`, which CI
  images and shell wrappers really do export — **counts as unset, and precedence falls through to
  the next variable.** This is the POSIX reading (a locale variable is consulted only when it is
  "defined and not null") and it is what the row-4 bullet directly above already requires: an empty
  variable carries no information, and the literal reading would turn a content-free variable into a
  negative signal. It would also freeze the precedence at the first rung, so a perfectly good UTF-8
  `LANG` would never be consulted at all.

**`--unicode` is a new flag** and it exists because under any automatic rule a wrong detection needs
an override, and today only the ASCII direction has one. It and `--ascii` are **mutually
exclusive**.

**Both flags true is an ORDERED-TABLE case, not an error case — ruled 2026-08-08, see the correction
block under `## Acceptance`.** The two flags arrive as two independent booleans, so the tuple is
constructible, and rows 1 and 2 both match it. **The rows are evaluated in order: row 1 wins and the
answer is ASCII** — the fail-safe direction, readable on every terminal, which is what `RISK-005`'s
mitigation is for. **This function does not throw and does not print.** Rejecting `--ascii
--unicode` with a message naming the conflict is `EPIC-006`'s obligation (below), and the same rule
in two places is how two places come to disagree.

## Out of scope

- **argv parsing.** `EPIC-006` owns argv (*"via prompt or CLI flags"*). This ticket owns the
  **rule**; it takes the two flags as already-parsed booleans. See the cross-epic obligation below.
- **Rendering anything** — `ABC-014` consumes the answer.
- **Re-probing per frame.** The result is a session constant. Per-frame probing would be waste
  against a 16 ms budget and a mid-game switch would make the session's own scrollback internally
  inconsistent.
- **Colour mode.** ANSI colour is cut from the MVP by epic amendment `[A4]`; there is no second
  capability decision to make and no `NO_COLOR` handling in this epic.
- **Asking the player.** Rejected on product grounds and recorded in epic criterion `2c` as the one
  choice a human can reverse.
- **Font detection of any kind.** It does not exist. Do not invent a probe.

## Cross-epic obligation this ticket creates (recorded, not assumed)

**`EPIC-006` gains two argv items at its decomposition:** the `--unicode` flag, and rejecting
`--ascii --unicode` together at startup with a message naming the conflict. Written here so it is
picked up rather than discovered. `EPIC-006` is undecomposed; this is a note for that decomposition,
not a change to its scope made by this ticket.

## Acceptance (Given/When/Then)

**Twelve input tuples**, each a pure function call with no terminal attached and each with one exact
output, then **three session criteria** — **fifteen in all**. *(Amended 2026-08-08: the lead-in read
"one criterion per row of the table", which stopped being true at the eighth bullet — the `win32`
guard is not a table row either. Amended again 2026-08-08, second pass: nine tuples plus two session
criteria became twelve plus three. See both correction blocks below.)*

**The bullets are numbered by position, and the whole project record cites them that way** — "the
mutant dies to criterion 11 alone", "criterion 9 is the regression guard". So the four criteria added
on 2026-08-08's second pass are **appended as 12–15 rather than filed next to their kin**: no earlier
bullet changes its number, and every existing citation stays true.

**A locale variable a bullet does not name is UNSET.** Stated once here rather than annotated onto
each bullet. Without it criterion 6 has two readings — under the other one it would silently pin the
`LC_CTYPE` > `LANG` precedence — and criterion 8's other reading is simply false, since a UTF-8
`LC_ALL` beats its `LANG`. Criterion 4 is the one bullet that quantifies over the locale instead of
fixing it, and it says so in its own words ("regardless of locale").

- **Given** `--ascii` passed, a TTY, and `LANG=en_US.UTF-8`, **when** the mode is selected, **then**
  it is `ascii`. *(The flag beats every signal.)*
- **Given** `--unicode` passed, **no** TTY, and `LANG=C`, **when** the mode is selected, **then** it
  is `unicode`. *(The flag beats every signal in the other direction — this is the override that
  did not exist before.)*
- **Given** **both** `--ascii` and `--unicode` passed, a TTY, and `LANG=en_US.UTF-8`, **when** the
  mode is selected, **then** it is `ascii`, and **nothing is thrown and nothing is printed** — the
  rows are evaluated in order and row 1 wins. *(**Added 2026-08-08**: this tuple is constructible
  from two independent booleans and previously had no stated output. Rejecting the conflict with a
  message is `EPIC-006`'s, not this function's.)*
- **Given** no flag and `process.stdout.isTTY` falsy, **when** the mode is selected, **then** it is
  `ascii`, regardless of locale.
- **Given** no flag, a TTY, and `LC_ALL=C` with `LANG=en_US.UTF-8` set as well, **when** the mode is
  selected, **then** it is `ascii` — **`LC_ALL` is consulted first and it wins**.
- **Given** no flag, a TTY, `LC_ALL` unset, `LC_CTYPE=en_US.utf8`, **when** the mode is selected,
  **then** it is `unicode` — the match is case-insensitive and tolerates the hyphen-less spelling.
- **Given** no flag, a TTY, and **none** of `LC_ALL` / `LC_CTYPE` / `LANG` set, **when** the mode is
  selected, **then** it is `unicode`. *(Unset is not a negative signal — this is the Windows case.)*
- **Given** no flag, a TTY, and `LANG=en_US.ISO-8859-1`, **when** the mode is selected, **then** it
  is `ascii`.
- **Given** `process.platform` is `"win32"` with a TTY and a UTF-8 locale, **when** the mode is
  selected, **then** it is `unicode` — **identical to every other platform**. *(A regression guard
  on the deliberate decision not to use the platform as a signal.)*
- **Given** any signal tuple, **when** the selection rule is called twice with that same tuple and
  the ambient `process.env` and `process.stdout.isTTY` are rewritten between the two calls to values
  that would produce the **other** answer, **then** both calls return the same value — the rule
  reads **no** ambient global. *(Falsifiable, and this is the point: an implementation that reads
  `process.env` directly passes every row above and fails only here.)*
- **Given** a session that has begun, **when** the ambient signals are rewritten to values that would
  produce the other answer — **whether or not the mode has been requested even once beforehand** —
  and the session's mode is then requested, **then** the value decided **when the session began** is
  returned, **and** the selection rule, called directly with the **new** signals, returns the
  **other** value. *(The second half is what makes this falsifiable: it proves the value is cached
  rather than coincidentally equal. **Replaces, 2026-08-08, the criterion this ticket carried until
  then**, which no implementation in scope could fail. **Widened 2026-08-08, second pass**, by the
  clause on the request: the rewrite-before-the-first-request window is where epic acceptance `2b`'s
  "decided exactly once, **before the first frame**" actually lives, and the earlier wording could
  not reach it under **any** reading — a lazy accessor that memoises on first call satisfied it while
  moving the decision to whenever the first frame happens to be drawn.)*

- **Given** no flag, a TTY, and `LC_ALL=C` with **both** `LC_CTYPE=en_US.UTF-8` **and**
  `LANG=en_US.UTF-8` also set, **when** the mode is selected, **then** it is `ascii` — **`LC_ALL` is
  consulted before `LC_CTYPE`**, not merely before `LANG`. *(**Added 2026-08-08, second pass.** Kills
  the implementation that promotes `LC_CTYPE` above `LC_ALL`, which passed all nine tuples.)*

- **Given** no flag, a TTY, `LC_ALL` unset, and **`LC_CTYPE=C` against `LANG=en_US.UTF-8`**, **when**
  the mode is selected, **then** it is `ascii` — **`LC_CTYPE` is consulted before `LANG`**.
  *(**Added 2026-08-08, second pass.** Kills the implementation that reorders to `LC_ALL` > `LANG` >
  `LC_CTYPE`. With criterion 5 and criterion 12, all three rungs are now pinned against both their
  neighbours **with conflicting values set at once** — which is what the `## Test notes` have
  demanded in writing since this ticket was cut, and which no criterion did.)*

- **Given** no flag, a TTY, **`LC_ALL` set to the empty string**, `LC_CTYPE` unset and
  `LANG=en_US.UTF-8`, **when** the mode is selected, **then** it is `unicode` — an empty variable
  counts as **unset** and precedence falls through to the next one. *(**Added 2026-08-08, second
  pass**, and it **ratifies** the reading the Software Engineer implemented and flagged at
  `confidence: medium`. The literal reading — empty is "set", so it fails to match `/utf-?8/i` —
  answers `ascii` here, and nothing in this ticket had ever chosen between them.)*

- **Given** a session begun with a given pair of flags in a given ambient, **when** its mode is
  requested, **then** it is the value the selection rule returns for the tuple built from **those
  flags and that ambient** — every signal the session is handed or reads reaches the rule. Measured
  by **six cases, each with exactly one decisive input**, every other input being unset or arguing
  the other way: `LANG=en_US.ISO-8859-1` alone → `ascii`; `LC_ALL=C` over a UTF-8 `LANG` → `ascii`;
  `LC_CTYPE=C` alone → `ascii`; a falsy `process.stdout.isTTY` under a UTF-8 locale → `ascii`;
  `--ascii` under a TTY with a UTF-8 locale → `ascii`; `--unicode` with no TTY and `LANG=C` →
  `unicode`. *(**Added 2026-08-08, second pass.** `unicode` is what this rule answers when a signal
  never arrives, so an `ascii` expectation can only be produced by a signal that actually travelled —
  that is the design of the six, not a coincidence. Kills three sessions that passed all eleven
  earlier criteria and are each a real defect: one that hardcodes `isTTY`, one that forwards only
  `LANG`, and one that drops the flags so `--ascii` is silently ignored.)*

> ### CORRECTED IN PLACE 2026-08-08 by BA/PM (task `ticket-to-pr-ABC-015`, subtask `bapm-abc015-promote`, Workflow 07)
>
> **Two acceptance defects were fixed at the `Backlog → Ready` exit, before promotion, not after.**
> Both are stated so they can be checked rather than inherited. **Nothing else moved**: scope, size
> `S`, priority `P1`, the signal table's five rows, the `RISK-005` mitigation, the merge-order
> constraint and the `## Out of scope` list are all untouched.
>
> **1 — An input tuple had no stated output.** `--ascii` and `--unicode` arrive as **two independent
> booleans** (argv is `EPIC-006`'s; this ticket takes them already parsed), so `(true, true)` is
> constructible, and rows 1 and 2 of the table **both** match it. The ticket declared the flags
> "mutually exclusive" and handed the rejection to `EPIC-006` — which is **undecomposed and merges
> later**, so no merged code holds that precondition at the moment this function gets its first
> caller. An engineer had three defensible guesses (throw · row order · last flag wins) and the
> ticket picked none. **Ruled: row order, ASCII, no throw, no message.** It costs zero code — the
> ordered table already yields it — and it pins the behaviour so a later "improvement" is caught.
>
> **2 — The session criterion could not fail.** The old criterion read *"the mode already handed to
> the renderer is unchanged — the selection is made once, before the first frame, and cached"*. With
> the signals injected as arguments — which the `## Test notes` **require** — the only test that
> criterion admits is `const m = select(...); process.env.LANG = "C"; expect(m).toBe("unicode")`,
> which asserts that a `const` does not mutate. It tests JavaScript, not this ticket. Its one
> failing form, a module-level accessor that re-reads `process.env` on every call, is the thing the
> test notes forbid. **This is exactly the shape QE found in `ABC-014`** (*"not the white frame with
> its rows simply reversed"*, unfalsifiable as written) — caught here **before** an engineer writes
> against it rather than at the gate.
>
> **The ownership seam this exposed, closed rather than noted.** Epic acceptance `2b` requires the
> mode to be *"decided exactly once, before the first frame"* and to not change for the session.
> `ABC-015`'s `## Scope` handed startup to `EPIC-006`; `ABC-018` (its `## Dependencies`) says
> *"`ABC-015` owns that rule and runs it once at startup"*. **Both pointed away, so no ticket owned
> the once-ness and no ticket could test it.** Ruled to **this** ticket: it is the ticket with the
> rule in it, and `ABC-018` already writes that in its own words. **`ABC-018` and `EPIC-006` are not
> edited by this ruling** — nothing in either had to change.
>
> **Where the cache lives is NOT decided here.** A memoised accessor, a closure, a value the caller
> holds — that is structure, and it is the engineer's. What is required is the observable outcome:
> the same value for the rest of the session, and a rule that reads no ambient global so all nine
> table rows stay testable in one run.
>
> **Size re-checked, not assumed: still `S` (2).** The corrections add one cached value and two
> tests. No argv, no I/O, no new module of consequence.

> ### CORRECTED IN PLACE 2026-08-08 (SECOND PASS) by BA/PM (task `ticket-to-pr-ABC-015`, subtask `bapm-abc015-spec-gaps`, Workflow 07)
>
> **Four criteria amended: eleven → fifteen. NO CODE CHANGE IS OWED AND NO QE RE-RUN IS OWED —
> every one of the four ratifies the delivered implementation**, and each is already pinned by a test
> that exists and passes today (mapping at the end of this block). **The ticket did not move**: it
> stays in `In Security/NFR`, and that column's exit is Security/NFR's alone.
>
> **Why this ran BEFORE the Security/NFR gate**: the gate certifies a change **against its acceptance
> criteria**, and three roles had independently reported those criteria incomplete. The Orchestrator
> reversed its own published order for that reason; this block is the discharge.
>
> **Nothing below was taken on trust.** This task has already produced one confirmed miscount and one
> flagged non-defect, so every claim was re-derived by evaluating the criteria **as written** against
> each implementation that has been proposed for this module — the delivered one and the mutants the
> Engineer and QE built. What that measurement says is recorded with each item.
>
> **1 — CRITERIA 10 AND 11 WERE BLIND TO A SINGLE-SIGNAL SESSION. Upheld, and it is worse than it was
> reported. This is the section this role itself corrected seven hours ago, and it is ruled on the
> evidence rather than defended.** Criterion 11 never said **which** ambient values the rewrite uses.
> Measured across all **11,232** instantiations its own wording admits: it excludes a session that
> hardcodes `isTTY` in **2,592** of them and **admits it in 8,640** — so whether the criterion catches
> a real defect depends on which ambient the test author happens to pick. **That is two readings of
> one criterion, which is precisely the defect this role ruled against on this very ticket at the
> `Backlog` exit.** Worse, two real defects are excluded by **no** reading at all: a session that
> **drops the flags** (`--ascii` silently ignored — a straight breach of table rows 1 and 2) and a
> **lazy** session.
> **Ruled: fixed by ADDING criterion 15, not by widening 10 or 11.** Criterion 10's job is that the
> *rule* reads no ambient global and criterion 11's is that the *session value* is decided once;
> loading the *wiring* onto either is how this ticket produced four criteria that passed for reasons
> other than the ones they were written for. Criterion 15 states the session's contract directly and
> is measured by six cases in which exactly one input is decisive. Measured after drafting: the six
> exclude all three wiring defects and the delivered session passes all six.
>
> **2 — THE `LC_CTYPE` RUNG WAS PINNED BY NO CRITERION. Upheld, with QE's characterisation
> sharpened.** Measured: both reordering implementations — `LC_ALL` > `LANG` > `LC_CTYPE`, and
> `LC_CTYPE` promoted above `LC_ALL` — satisfy **all nine** original tuples.
> **But criterion 6 is not itself the fault, and it is not being rewritten.** Its job is the
> case-insensitive, hyphen-less spelling and it does that job; it was carrying a precedence it was
> never asked to carry. The two real faults are that **no criterion ever stated the middle rung**,
> and that the file used its silent variables two different ways — under the other reading criterion
> 6 *would* have pinned `LC_CTYPE` > `LANG`, and criterion 8 would have been false. **Ruled: one
> sentence in the lead-in fixes the convention for every bullet at once, and criteria 12 and 13 state
> the rung against each neighbour with conflicting values set at once — the shape the `## Test notes`
> have demanded in writing since this ticket was cut. Criterion 6's text is untouched.**
>
> **3 — AN EMPTY LOCALE VARIABLE COUNTS AS UNSET. The Software Engineer's ruling is RATIFIED, not
> overturned — this is the one item that could have changed code, and it does not.** It was ruled at
> `confidence: medium` as an inference from an adjacent rationale, and QE concurred without disturbing
> it; neither is why it stands. Three pieces of evidence, in the order they carried weight:
> 1. **This ticket's own row-4 rationale requires it** — *"unset … carries no information; treating it
>    as a negative signal would smuggle the platform rule back in through the side door."* `LC_ALL=`
>    carries no information either.
> 2. **POSIX, checked on this machine rather than recalled.** A locale variable is consulted only when
>    it is "defined and not null". `env -i LC_ALL= LANG=en_US.UTF-8 locale` reports
>    `LC_CTYPE="en_US.UTF-8"` — the empty `LC_ALL` fell through to `LANG` — while
>    `env -i LC_ALL=C LANG=en_US.UTF-8 locale` reports `LC_CTYPE="C"`. The rule this ticket already
>    describes is the one the platform underneath it implements.
> 3. **The product value statement decides the tie.** *"The majority get figurines with no flag."*
>    Under the literal reading, a CI image or shell wrapper exporting `LC_ALL=` freezes the precedence
>    at the first rung and hands ASCII to a player whose `LANG` is UTF-8 — the exact case row 5 exists
>    to serve. The tail that genuinely needs ASCII already has `--ascii`.
>
> **Why this does not contradict the both-flags-true ruling above, which chose the fail-safe
> direction.** That tuple is a **contradiction** between two explicit requests, and the safe direction
> breaks a genuine tie. An empty variable is not a request at all — it is the **absence** of
> information, and reading absence as a negative signal is what row 4's rationale forbids. Different
> inputs, different rule; both rulings stand together.
> **Ruled: SPECIFIED, not merely inferred.** The `## Scope` bullet defines "set", criterion 14 pins
> it, and the behaviour stops being an unmarked judgement call carried in a code comment. **The
> delivered code already implements exactly this, so nothing is owed to the Software Engineer.**
>
> **4 — A FOURTH ITEM, FOUND HERE AND NAMED AS A FOURTH RATHER THAN SMUGGLED INTO THE THREE: NO
> CRITERION COULD EVER EXCLUDE A LAZY SESSION.** QE reported this as a suite hole and closed it in
> tests; measured here at the criteria level, criterion 11 admits a lazy session under **every one**
> of its 11,232 conforming instantiations, because it requests the mode before rewriting anything.
> **This is not a test detail, and this ticket in particular cannot leave it to one.** Epic acceptance
> `2b` is *"decided exactly once, **before the first frame**"*, and on 2026-08-08 this role ruled that
> once-ness **onto this ticket** after finding that `ABC-015` and `ABC-018` each pointed at the other.
> **Owning a promise means stating it.** **Ruled: criterion 11 widened by one clause** — the rewrite
> may happen before the mode has ever been requested. Measured: it excludes the lazy session and
> nothing else, and the delivered session is already eager by construction.
>
> **What did NOT change, checked rather than asserted.** Size **`S` (2)** — no code, no test and no
> implementation effort follows from any of the four. Priority **`P1`**. The five-row signal table's
> rows, `## Out of scope` in full, the `## Dependencies` section and its 2026-08-04 correction, the
> **merge-with-or-before-`ABC-018`** constraint, `RISK-005`'s severity and mitigation, the `NFR-007`
> zero-I/O bar, the first correction block, and the `## Implementation` and `## QE` sections written
> by the other two roles. **No criterion was renumbered and no criterion's text was rewritten except
> criterion 11's, which was widened.** `src/` was not touched by this subtask.
>
> **Every new criterion is already covered by a test that exists and passes — which is why no dev work
> and no QE re-run is owed.** Checked by reading the suite, not assumed:
>
> | Criterion | Already pinned by |
> |---|---|
> | 11 (widened — decided at begin) | `decides EAGERLY when the session begins, not lazily on the first request` |
> | 12 (`LC_ALL` beats `LC_CTYPE`) | `LC_ALL beats LC_CTYPE — LC_ALL=C against a UTF-8 LC_CTYPE and a UTF-8 LANG` |
> | 13 (`LC_CTYPE` beats `LANG`) | `LC_CTYPE beats LANG — LC_CTYPE=C against a UTF-8 LANG, LC_ALL unset` |
> | 14 (empty is unset) | `falls through an empty variable to the next one in precedence order` |
> | 15 (the session's wiring) | `carries EVERY ambient signal to the rule` (4 rows) + `hands the flags through` (2 rows) |
>
> **One consequence for whoever next edits the suite, flagged and NOT acted on here:** those tests
> currently sit under headings that call them *beyond* the acceptance criteria — "QE/E2E adversarial
> coverage" and "the engineer's stated assumption". After this amendment they **are** criteria 11–15's
> tests. Re-labelling them is a one-line-per-heading job in `src/glyph-mode.test.ts` and it belongs to
> QE, not to this role — **this subtask does not touch `src/`, and the labels are cosmetic: the
> assertions already are the criteria.** It is not a gate blocker and must not be treated as one.

## Dependencies

- **`ABC-014`** — declares the `GlyphMode` type this returns. Not a deep dependency; it is why this
  ticket sits behind `ABC-014` in `Backlog` rather than beside it in `Ready`.
- **Sequencing constraint, from `RISK-005`'s own mitigation wording**: this ticket merges **with or
  before `ABC-018`**, never after. `RISK-005` is mitigated by the fallback being *"built in from the
  start rather than retrofitted"*, and a build that puts a board in front of a player with a
  hardcoded glyph mode, and gains selection afterwards, is precisely the retrofit that wording rules
  out. **`ABC-018` is that build** — it is the ticket that makes the frame a display rather than a
  value, and it is the first thing in this epic a player can see.
- No dependency on `ADR-0004`, `ABC-012` or `ABC-013`.

> ### CORRECTED IN PLACE 2026-08-04 by BA/PM (task `refinement-2026-08-04`, Workflow 07)
>
> **This clause previously read "merges with or before `ABC-014` reaches `Done`, never after". That
> wording was wrong and it was a cycle.** Stated so the correction can be checked rather than
> inherited:
>
> - This ticket **needs** `ABC-014` first — `ABC-014` declares the `GlyphMode` type this function
>   returns, which is why the board holds it `blocked-until: ABC-014`. **That is unchanged and
>   correct.**
> - In this project `Done` **means merged** (`mode=lean`, `autonomy=pr`). So the old clause required
>   this ticket to merge no later than the ticket it cannot be written without. The two statements
>   are jointly satisfiable only if both merge in the same act — i.e. only if they are one ticket,
>   which `ABC-014`'s own size rationale deliberately rejects (*"folding all three into one renderer
>   ticket gives an 8-point `XL` and an automatic `SPLIT_REQUIRED`"*).
> - It was **flagged twice by the Orchestrator** (2026-08-02, 2026-08-03), which twice declined to
>   pull `ABC-014` — a `P0` — rather than walk into it. It is a stopped lane, not a documentation
>   nit.
>
> **Which document was wrong, and why this one:** `ABC-014`'s `## Dependencies` already said the
> right thing — *"`ABC-015` … must merge **with or before this ticket's first user-visible use**"* —
> and this ticket's clause is the one that mis-copied it as `ABC-014` reaching `Done`.
> **`ABC-014` reaching `Done` is not a user-visible use of anything.** `ABC-014` is scoped as a pure
> function that *"returns a frame as a value … and writes nothing"*, and it takes the glyph mode as a
> **parameter** it does not choose. So merging `ABC-014` alone cannot realise `RISK-005`: there is no
> player, no terminal, and structurally no hardcoded mode to retrofit. The retrofit becomes possible
> only where a caller must supply a mode to draw something a player sees, and that caller is
> `ABC-018`.
>
> **What did NOT change, deliberately:** `RISK-005`'s severity, its mitigation strategy, this
> ticket's size, priority, scope, acceptance criteria and `Backlog` position, and the board's
> `blocked-until: ABC-014`. Only the event the merge-order constraint binds to moved — from
> `ABC-014`'s merge to `ABC-018`'s. If anyone reads this as changing the *mitigation* rather than its
> sequencing, that is Security/NFR's call and not this one's; BA/PM ruled the sequencing under the
> owner's 2026-08-03 delegation of scope, sizing and priority to this role.
>
> **Consequence for the pull order:** `ABC-014` is unblocked and pullable now. The resulting chain is
> `ABC-014` → `ABC-015` → `ABC-018`, with no cycle anywhere in it.

## Security / NFR triggers

- **No performance trigger.** The function runs once per process. Naming a µs bar for a
  once-per-session call would be ceremony.
- **`NFR-007` (`npx` to first board < 2 s, `EPIC-006`)** — this runs inside that window and must not
  spawn a subprocess, read a file, or perform any I/O to reach its answer. Measurable bar: the
  selection performs **zero** filesystem and **zero** process operations; it reads
  `process.stdout.isTTY` and `process.env` only.
- **No security trigger.** It reads two environment variables and a boolean. It writes nothing and
  interprets no user text.

## Test notes

Every case above is a pure table-driven unit test with the environment injected, **not** read from
the real `process.env` and **not** requiring a TTY. If the function reads globals directly it
cannot be tested for eight cases in one run — take the signals as an argument.

- **Test the `LC_ALL` > `LC_CTYPE` > `LANG` precedence with conflicting values set at once**, not
  one variable at a time. One-at-a-time tests pass on an implementation that reads the wrong one.
- **The `win32` case is a regression guard on a decision, not a platform test.** Label it as such
  in the test name, so a future reader does not "fix" it by adding the platform rule back.
- **Do not test that a terminal renders anything.** That is the thing wave 1 established is not
  observable, and a test claiming to check it would be a fabricated verification.
- **The three session criteria are each written against a named implementation that must fail it**
  (two added 2026-08-08, the third on that day's second pass). Criterion 10 and 11: the implementation
  that reads `process.env` on **every call** passes all twelve table rows and must fail these.
  Criterion 11 also: the **lazy** session that memoises on first request. Criterion 15: the session
  that **hardcodes `isTTY`**, the one that forwards **only `LANG`**, and the one that **drops the
  flags**. If a session test passes on the implementation it names, the test is decoration — rewrite
  it, do not weaken the criterion.
- **Criteria 12 and 13 exist because a criterion can be blind to a rung it never mentions.** The
  precedence note above was obeyed for `LC_ALL` against `LANG` and not for the `LC_CTYPE` rung, and
  two reordered implementations passed every test for it. Do not collapse 12 and 13 back into
  criterion 6.

## Size and priority rationale

**Size `S` (2).** One function, five enumerated rows, one cached value, and a table of **fifteen**
unit tests — **twelve input tuples plus three session criteria; recounted 2026-08-08 (second
pass)**. It read "nine unit tests" against eight tuples before that day's first corrections, and
eleven before its second. **Size is unmoved by either pass**: the second added no implementation work
at all — every one of its four criteria was already satisfied and already tested by delivered code.
No new module of consequence, no chess logic, no I/O. Calibrated against `ABC-011` (one
guarded condition plus two test shapes, `S`) and `ABC-006` (`S`). Not `XS`, because the precedence
between the three locale variables and the deliberate non-use of the platform are real behaviour
with real regression risk, not a one-liner.

**Priority `P1`.** The game runs without it — the default is Unicode and most terminals render it.
It is not `P2` because it is the whole of epic acceptance `2b`, it is `RISK-005`'s named mitigation,
and its sequencing constraint means deferring it past `ABC-018` converts it from a small ticket into
a retrofit. *(Read `ABC-018` here, not `ABC-014` — corrected 2026-08-04, see `## Dependencies`.)*

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ · acceptance measurable ✅ (**twelve** enumerated input
tuples, each with one exact output, **plus three falsifiable session criteria** — see both correction
blocks; it read "nine tuples" against eight until 2026-08-08, and nine plus two until that day's
second pass) · dependencies ✅ (`ABC-014`, with a
sequencing constraint that is **no longer a cycle** — corrected 2026-08-04) · NFR triggers ✅
(zero-I/O bar; no perf bar, with the reason) · test notes ✅ · size `S` ✅ · priority `P1` ✅ · no
blocker ✅

**PROMOTED `Backlog → Ready` 2026-08-08 by BA/PM** (task `ticket-to-pr-ABC-015`, subtask
`bapm-abc015-promote`, Workflow 07) — the `Backlog` exit this role owns. `Ready` 3/8 → 4/8; no limit
approached and no override taken.

**The one check this ticket failed on 2026-08-04 now passes, verified at the source rather than read
off a close-out note:** `ABC-014` merged 2026-08-08 (`ed42d26` → `c1d694f`) and is in `Done`, and
`git show main:src/render.ts` has `export type GlyphMode = "unicode" | "ascii";` at line 61. The
board's own `Ready` test — *"no unbuilt dependency"* — holds, and the `Blocked` column is empty.

**It was not promoted as it stood.** Two acceptance defects were found at this exit and fixed in
place first (an input tuple with no stated output; a criterion no implementation could fail). The
Definition of Ready is met **after** those corrections, which is what refinement is for — see the
correction block under `## Acceptance`.

**This is not the pull gate.** The Definition of Ready is applied again by the Orchestrator at
`Ready → In Development` (Workflow 04 step 1); promotion makes this ticket pullable, nothing more.
The merge-order constraint still binds: it merges **with or before `ABC-018`**.

**PULLED `Ready → In Development` 2026-08-08 by the Orchestrator** (task `ticket-to-pr-ABC-015`,
Workflow 04 step 2), on branch `grugops/ticket-to-pr-ABC-015`. `Ready` 4/8 → 3/8, `In Development`
0/3 → 1/3; no limit approached, no override taken.

**The Definition of Ready was re-applied at the pull, against this ticket as corrected today** —
all ten checks hold. **Two of them hold only because of the corrections above, and the Orchestrator's
own pre-check had ticked both green** off this ticket's self-assessment; it recounted the original
acceptance bullets and confirms BA/PM's finding — **eight input tuples, not nine, plus one session
criterion that could not fail.** Recorded because the fix is procedural, not clerical: a
self-assessment is not evidence, and routing the `Backlog` exit to its owner is what caught it.

## Implementation

**IMPLEMENTED `In Development → In Review` 2026-08-08 by the Software Engineer** (task
`ticket-to-pr-ABC-015`, subtask `engineer-abc015-implement`, Workflow 04), on branch
`grugops/ticket-to-pr-ABC-015`. `In Development` 1/3 → 0/3, `In Review` 0/3 → 1/3; no limit
approached, no override taken. **Nothing merged and nothing deployed — a human holds both.**

**Three new files, and no existing file under `src/` was touched.** Verified rather than asserted:
`git diff --numstat main -- src/` lists only the new module and its two test files, and every
pre-existing `src/` file is byte-identical to merged `main` at `f1743a3`.

- `src/glyph-mode.ts` — 122 lines, **32 of them code**. `selectGlyphMode(signals): GlyphMode` is the
  pure rule; `beginGlyphModeSession(flags): GlyphModeSession` reads the ambient signals once and
  closes over the answer.
- `src/glyph-mode.test.ts` — the eleven acceptance criteria, one test each, plus four that pin what
  the criteria do not reach.
- `src/glyph-mode.nfr.test.ts` — the `NFR-007` zero-I/O bar as a spied guard.

**The one structural choice this ticket left open is decided: the session's cached value lives in the
CLOSURE that `beginGlyphModeSession` returns.** Both stated requirements hold at once — the *rule*
reads no ambient global (criterion 10), while the *session accessor* reads `process.stdout.isTTY` and
`process.env` exactly once (the NFR bar's permitted reads). A module-level memo was rejected because
it needs an exported reset for the tests to run more than one session, and that export is the one
thing able to break the session-constant promise this ticket exists to keep; a plain value the caller
holds was rejected because it pushes the once-ness back to `EPIC-006` — the seam BA/PM closed onto
this ticket — and makes criterion 11 unfalsifiable again.

**Gates, reported as they ran:** `npm run lint` exit 0 (**after one autofix pass** — `biome check`
failed on formatting only, `lint.autofix` is `true`, and this was self-fix attempt 1 of 2),
`npm run typecheck` exit 0, `npm test` **271 passed / 271 on 13 files** (253 on 11 before), `npm run
build` exit 0. **Skipped-test count 0**, captured with the `AGENTS.md` command. `src/glyph-mode.ts`
is at **100% statements / branches / functions / lines**.

**21 MUTANTS WERE RUN AGAINST THE MODULE AND ALL 21 DIED** — including the one the `## Test notes`
name (the session re-probing the environment on every call, killed only by criterion 11) and the
platform rule smuggled back in (killed only by criterion 9's guard). **Two of the 21 survived the
suite as first written and the suite was fixed, not the record:** a session that hardcoded `isTTY`,
and one that forwarded only `LANG`, both passed every acceptance criterion, because criteria 10 and
11 are written over ambients where `isTTY` and the locale agree. A test now isolates each ambient
signal. The tree was restored byte-identically after the campaign (`cmp` against a pre-campaign
copy).

**ONE BEHAVIOUR WAS NOT SPECIFIED BY THE NINE TUPLES AND THE ENGINEER DECIDED IT — flagged here for
QE and Security/NFR rather than buried.** The table says *"the first **set** of `LC_ALL` /
`LC_CTYPE` / `LANG`"*, and none of the nine tuples constructs an **empty** one, so "set" had to be
defined. **Ruled: an empty variable counts as UNSET and precedence falls through to the next.** That
is the POSIX reading, and it is what this ticket's own rationale for row 4 requires — *"unset … carries
no information; treating it as a negative signal would smuggle the platform rule back in through the
side door"* — which is equally true of `LANG=`. Two tests pin it.

**Not done, deliberately.** No argv parsing (`EPIC-006`'s), no caller wired up (`ABC-018` is the
first, and it is unstarted), no edit to `src/render.ts`, `ABC-018`, `EPIC-006` or `plans/nfr-catalog.md`,
and no wall-clock assertion anywhere — this project keeps microseconds in the catalog with the machine
that measured them, and this ticket has no perf bar by design.

## QE

**QE VERDICT: PASS. `In Review → In Security/NFR` 2026-08-08 by QE/E2E** (task
`ticket-to-pr-ABC-015`, subtask `qe-abc015-review`, Workflow 04), on branch
`grugops/ticket-to-pr-ABC-015`. `In Review` 1/3 → 0/3, `In Security/NFR` 0/2 → 1/2; no limit
approached, no override taken. **Nothing merged and nothing deployed — a human holds both.**

**All eleven acceptance criteria are implemented, tested and passing, and NO PRODUCTION DEFECT WAS
FOUND.** `src/glyph-mode.ts` is **byte-identical to the Engineer's** (`md5
9c1f4f4e957d4faf3c9cccc49a545185`) after 58 mutate-and-restore cycles. Everything below is a change
to **tests only**.

**The four mandatory gates were re-run on the tip by this role rather than inherited**, before and
after the added tests: `npm run lint` exit 0, `npm run typecheck` exit 0, `npm run build` exit 0,
`npm test` **271/271 then 277/277 on 13 files**, skip count **0** both times by the `AGENTS.md`
command, `src/glyph-mode.ts` **100% statements / branches / functions / lines** against the `0.8`
threshold. **The Engineer's and the Orchestrator's figures reproduce exactly.** One autofix pass was
needed on QE's own new test code — **formatting only**, `quality.lint.autofix` is `true` — and is
reported rather than smoothed. Five shuffled full-suite runs were clean, so the tests that rewrite
real ambient globals are not order-dependent.

**THE MUTANT THIS TICKET NAMES BY HAND WAS BUILT AND RUN, AND IT DIES.** The `## Test notes` say the
session that re-reads `process.env` on every call "passes all nine table rows and must fail only
these two". Established, not assumed: it dies, and it dies to **criterion 11 alone** — exactly what
BA/PM rewrote that criterion to do at the `Backlog` exit. That correction did the job it was made
for.

**A 29-MUTANT CAMPAIGN FOUND THREE MUTANTS THAT PASSED ALL ELEVEN ACCEPTANCE CRITERIA AND ALL 271
DELIVERED TESTS. All three are real production defects. All three are now dead.**

1. **The `LC_CTYPE` rung of the locale precedence was never pinned against either neighbour.**
   Reordering to `LC_ALL > LANG > LC_CTYPE`, or promoting `LC_CTYPE` above `LC_ALL`, both went
   green. **This ticket's own `## Test notes` forbid the shape that let it through**, in these
   words: *"Test the `LC_ALL` > `LC_CTYPE` > `LANG` precedence with conflicting values set at once,
   not one variable at a time. One-at-a-time tests pass on an implementation that reads the wrong
   one."* Criterion 5 pins `LC_ALL` against `LANG`; **criterion 6 sets `LC_CTYPE` alone — the
   one-at-a-time shape** — so the middle rung was untested. Four rows added, each setting two or
   three variables to conflicting values so exactly one can produce the expected answer.
2. **A missing `isTTY` property was never constructed, and it is the only shape production ever
   presents.** Node leaves `process.stdout.isTTY` **absent** on a pipe, a file or CI — it does not
   set it to `false`. Every session test rewrote it to a real boolean, so a session reading a
   missing property as **a terminal** (`?? true`, or a `typeof` guard) passed everything while
   sending Unicode into a pipe — breaking the determinism this ticket's own row-3 rationale promises
   `EPIC-006`'s pipe-driven end-to-end test. One test added that deletes the property.
3. **The session was never pinned as eager.** A lazy accessor that memoises on **first call** passed
   everything, because criterion 11 requests the mode immediately after beginning the session. Epic
   acceptance `2b` is *"decided exactly once, **before the first frame**"*, and lazy moves that
   decision to whenever the first frame is drawn. One test added that moves the ambient **between**
   begin and the first request.

**A fourth hole was in the `NFR-007` guard itself:** it spied `node:fs` and `node:child_process` but
**not `node:fs/promises`**, a different module specifier — so a mutant reading `/etc/locale.conf`
through `node:fs/promises` went green while the **synchronous twin of the same read died**. The
async half of the same guard is now spied. *(The non-prefixed `fs` specifier was tested and **does**
die — vitest aliases it. That one was not a hole.)*

**ONE MUTANT SURVIVES AND IT IS REPORTED, NOT HIDDEN:** dropping the `Boolean()` coercion on
`process.stdout.isTTY`. It is an **equivalent** mutant, proven rather than argued — with the
property genuinely absent, `Boolean(undefined)` is `false` and `!false` is `true`, while `!undefined`
is also `true`, so row 3 fires identically; the new absent-property test exercises exactly that input
and passes either way. **This is not a coverage gap.** But the module's comment at that line claims
the coercion *"is doing real work and is not decoration"*, and **that claim is false at runtime** —
it is a type-honesty nicety. Flagged as a comment defect, not a code defect; **nothing was edited**
(coding rule 9).

**NO E2E WAS WRITTEN AND NONE COULD BE.** `quality.ui_e2e` is `ui-or-critical-path`, `AGENTS.md` has
the E2E slot at `UNKNOWN - verify`, there is no CLI entry point until `EPIC-006`, and this module has
**zero runtime importers**. Reported as a gap rather than filled with a fake — the first end-to-end
exercise of this rule arrives with `ABC-018`.

**THREE SPEC-LEVEL ITEMS ARE BA/PM's AND ARE NOT DISCHARGED HERE.** The suite now covers all three;
the **criteria** still do not, and amending an acceptance criterion is the `Backlog` exit.

1. **Criteria 10 and 11 are blind to a single-signal session** — the Engineer's, and it holds.
2. **The empty-locale ruling** — the Engineer's, at `confidence: medium`. **QE concurs** with the
   POSIX reading on the Engineer's own ground (this ticket's row-4 rationale forbids turning a
   content-free variable into a negative signal) and **did not disturb it**. It remains a product
   question because it can change code.
3. **NEW from this pass — criterion 6 is itself the one-at-a-time shape the `## Test notes` forbid.**
   The criteria, not just the delivered suite, under-specify the `LC_CTYPE` rung.

**ONE ITEM HANDED FORWARD BY THE ENGINEER DOES NOT EXIST, AND THE ORCHESTRATOR'S DISPROOF IS
CONFIRMED INDEPENDENTLY.** `plans/traceability.md`'s `ABC-015` row was flagged as having eleven cells
against a ten-column header. Counted by machine here, splitting on pipes **not preceded by a
backslash**: the row has 12 raw pipes, **one of them escaped**, so 11 unescaped and **ten cells** —
identical to the header and to every other row checked. **The table is intact and the escape is
correct GFM. Do not "fix" it** — the fix removes a correct escape and breaks the row.
