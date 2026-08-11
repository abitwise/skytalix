---
id: ABC-019
title: Turn loop skeleton — ply dispatch, both seams stubbed, clean termination
status: in-review
column: In Review
size: L
priority: P0
epic: EPIC-002
feature: —
---

# ABC-019 — Turn loop skeleton: ply dispatch, both seams stubbed, clean termination

> **REFINED 2026-08-11 by BA/PM at the `Backlog` → `Ready` exit** (task `frame-merge-order-2026-08-11`,
> subtask `refinement-ABC-019`, Workflow 07). **The Definition-of-Ready block at the foot of this file
> read every item ✅ and 25 defects were found; five of them were witnessed by wrong builds
> constructed from merged `src/` and RUN against this ticket's criteria, and one more by
> `tsc --noEmit`.** Every fix is marked `[Dn]` in place. Nothing under `src/` was written — the tree is
> byte-identical (aggregate md5 of all 36 files `df71fb29…` before and after) and the default lane is
> 676/676 on 22 files.
>
> **The three that matter most, because each one is a criterion a WRONG build satisfies:**
>
> 1. **`A4` was UNSATISFIABLE.** It demanded `result: "draw", reason: "threefold-repetition"`.
>    `ABC-020` merged 2026-08-02 and made `threefold-repetition` a `ClaimableDraw`, **disjoint from
>    `EndReason` by construction** (`src/gameend.ts:47-48`). Measured: the third occurrence returns
>    `{result:"in-progress", reason:null, claimable:{by:"white",draws:["threefold-repetition"]}}`, and
>    `const r: EndReason = "threefold-repetition"` is a type error. It also **contradicted `A13`**, the
>    criterion the same amendment added. **The 2026-07-31 amendment said "three things and no more"
>    changed and it missed three: this criterion, and both `src/gameend.ts` citations.**
> 2. **`A2`'s frame count is arithmetically wrong for the loop this ticket specifies, and the only
>    build that satisfies it prompts the human before showing a board.** Under render-before-act an
>    N-ply game renders **N + 1** frames. A correct build renders **3** for one full move; `A2` demanded
>    exactly 2. Both directions were built and run.
> 3. **The `NFR-002` bar is simultaneously too loose to catch the wrong build it names and too tight
>    for the correct one.** Measured at 120 plies: one derive per ply **48.34 µs (0.48x)**, **two
>    derives 93.58 µs — MET at 0.94x**, three derives 137.13 µs (1.37x). The bar exists to forbid
>    deriving "once per call site" and it cannot see a double derive. And at **300 plies the CORRECT
>    build reads 96.88 µs = 0.97x** — the catalog's own independently-gated figure for the same
>    quantity is 97–102 µs, i.e. at or over. **The ≤ 100 µs @ 120 plies clause is UNCHANGED; two ply
>    counts were added and a SPIED CALL COUNT is now the clause that binds.**
>
> **Size `L` (5) and priority `P0` both re-derived and both UNMOVED.** The ticket's own re-sizing
> condition — *"re-size at the design hop if the stubs turn out to need more than merged `src/`
> provides"* — is **DISCHARGED in the other direction**: both stubs were built from merged code alone
> at this hop, the coordinate reader in 11 lines over `legalMoves` + `squareName` and the engine stub
> in 9 over `legalMoves`. **Not `XL`, no `SPLIT_REQUIRED`.**

> **AMENDED 2026-08-11 (second hop) by BA/PM — `ADR-0009` clause 9, which landed AFTER the promotion
> above** (task `frame-merge-order-2026-08-11`, subtask `refinement-ABC-019-clause9`, Workflow 07).
> **This is a targeted amendment and NOT a re-refinement:** the 25 defects above stay fixed, `A1`–`A17`
> are not re-opened, and size `L` (5) / priority `P0` are re-derived once more and **UNMOVED**.
>
> `memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md`'s amendment rules the **consumer**
> side the original ADR was not scoped to, and it named **two acceptance criteria owed on this ticket
> and deliberately not written there** — clause **9d** (the stub row counts) and clause **9e** (the
> session-height invariant). They are `A18` and `A19` below. **Five things changed and this list is
> checkable, unlike the 2026-07-31 amendment's *"three things and no more"* which was wrong by three:**
>
> 1. `A18` and `A19` **added** (`[C9-1]`, `[C9-2]`). Nothing existing was edited to make room.
> 2. **`## Scope` gains the seam bullet clause 9 turns on** — the seam returns rows, the loop writes
>    them, the session height is `firstFrame.length` (`[D27]`).
> 3. **`## Out of scope`'s *"Frame content and writing"* line is disambiguated** — as written it is
>    satisfied by a build that puts the write BEHIND the render seam, and such a loop never holds a
>    frame's rows, which makes `A19` unassertable and clause 9 unbuildable (`[D26]`).
> 4. `## Dependencies`, `## Test notes`, `## Security / NFR triggers`, `## Size and priority rationale`
>    and `## Definition of Ready` each carry the consequence, marked in place.
> 5. **Nothing under `src/` was written** — 36-file aggregate md5 `59d99f28…` before and after.
>
> **The whole point of the amendment, in one sentence measured rather than asserted: a stub seam at the
> reference layout's 3 and 8 makes a loop that hardcodes its height GREEN at this ticket's own gate and
> breaks only at the rebase onto the real panels** — and with the two shapes `A18` requires, **every
> hardcoded height is RED here and only the derived form ships** (matrix in `## Acceptance`, `A18`).

> **AMENDED 2026-08-11 (THIRD hop) by BA/PM — the defects the BUILD exposed** (task
> `abc019-review-2026-08-11`, subtask `refinement-ABC-019-seam`, Workflow 07). **This is a targeted
> amendment and NOT a re-refinement:** the 25 + 2 fixes above stay fixed, and size `L` (5) / priority
> `P0` are re-derived a third time and **UNMOVED**.
>
> **What is new about this hop is WHO found the defects.** The two hops above found them by reading and
> by building wrong builds on purpose. **These were found by the ticket being BUILT for real, gated
> green — lint/typecheck/build 0, 715/715 on 24 files, skip 0, re-verified independently at this hop —
> and then read back against its own text.** A ticket that produces a green build and is still wrong is
> the case a gate cannot catch, which is why the engineer flagged three of them rather than amending
> them: amendments are BA/PM's.
>
> **NINE rulings, and the count is checkable — the table is in `## Definition of Ready` § *DoR
> re-check (THIRD hop)*, which also says of each one whether it changes the code:**
>
> 1. **`[D28]` — the render seam takes a FOURTH argument.** `## Scope` and `ADR-0009` cl. 9b both wrote
>    `(GameHistory, GameStatus, thinking) => readonly string[]`, and **that form cannot satisfy `A5`**:
>    the ambiguity candidate list has to reach the frame's message region and `## Scope` says there is
>    no second output channel. **Every escape is closed by a sentence already in this ticket** — the
>    loop composes no frame, the seam derives nothing, there is no second channel — so the fourth
>    argument is *forced*, not chosen. **Measured here: it moves no clause of `ADR-0009` clause 9,**
>    because a `messages` argument cannot carry a row count.
> 2. **`[D32]` — `A3b` was wrong about BOTH counts it names**, and the second error made it satisfiable
>    only by a build `A3` forbids. `gameStatus` is **`plies + 1`**; `repetitionCounts` at the module
>    boundary is **0**.
> 3. **`[D31]` — `## Scope`'s *"either seam"* and `A14`'s ten values were not a contradiction: one
>    sentence was carrying two promises.** Repair is symmetric; termination with a named reason is the
>    engine's alone. **`A9b` is added and THIS ONE CHANGES THE CODE.**
>
> **Six more the review did not name and this hop found by checking the other criteria** — `[D29]`
> (`A2`'s cadence formula over-counts on every end-of-input run), `[D30]` (the glyph mode is not a loop
> parameter), `[D36]` (the `NFR-002` derivation was missing `A10`'s `legalMoves` term; **no bar moves**),
> `[D33]` and `[D34]` (`A12` and `A17` are met in **FULL**, and now say where each half is asserted),
> and `[D35]` (test-note row 3's obvious fixture is a trap that loses the ply). **Three known defects
> was not evidence the other sixteen were sound, and it was not.**
>
> **Nothing under `src/` was written by this hop** — code changes are the Engineer's, and `A9b` is
> handed back for exactly that reason. **`plans/board.md` was not opened** — the move is requested in
> `## Definition of Ready` and is the Orchestrator's. **`memory-bank/50-decisions/` was not edited**, and
> the `ADR-0009` follow-up this hop decided IS owed is flagged there for routing, not taken.
> **Front matter is deliberately left at `in-review`**, on the delivering engineer's own precedent: the
> board is the authority and moving the ticket first would put the two out of step.

> **AMENDED 2026-08-11 (FOURTH hop) by BA/PM — QE's EIGHT criterion gaps and `ADR-0010`'s owed
> criterion, ruled TOGETHER** (task `abc019-qe-gaps-2026-08-11`, subtask
> `refinement-ABC-019-qe-gaps`, Workflow 07). **This is a targeted amendment and NOT a
> re-refinement:** the 25 + 2 + 9 fixes above stay fixed, **no criterion `A1`–`A19` is renumbered or
> deleted**, and size `L` (5) / priority `P0` are re-derived a **fourth** time and **UNMOVED**.
>
> **What is new about this hop is, once again, WHO found the defects.** Hop one and hop two found them
> by reading. Hop three found them by reading a green build back against its own text. **This hop rules
> on nine survivors QE produced by writing thirteen WRONG BUILDS into `src/turn-loop.ts` and running
> them** — every one typecheck-clean, every one green on 717/717. **All twenty-three criteria hold as
> written and there is ZERO code defect.** What the survivors measure is not this build: it is where a
> *future* correct-looking build would also be green, and nothing would catch it.
>
> **Every one of the eight was RE-VERIFIED at this hop by an out-of-tree probe of my own against the
> delivered build, not accepted from the report** — and one of them came back with a different residue
> than QE recorded, which is written down in place rather than smoothed over (`[D42]`).
>
> **WHY THE `ADR-0010` CRITERION IS IN THIS HOP AND NOT ITS OWN.** `[D38]` (G-6) and `A20` both touch
> `## Scope`'s transitions and the frame the loop emits. Split across two hops, each would have been
> self-consistent and the pair would not — **which is exactly `[D43]`'s defect, a contradiction inside
> a single amendment, and it is the one this ticket has now committed twice.** Ruling them together is
> the fix for the shape, not a convenience.
>
> **ELEVEN rulings, `[D38]`–`[D48]`. The count is checkable — the table is in `## Definition of Ready`
> § *DoR re-check (FOURTH hop)*, which says of each one whether it changes the code.** Four criteria
> are ADDED (`A5b`, `A8b`, `A10b`, `A20`), four are amended in place (`A2`, `A6`, `A9b`, `A19`), and
> **the criterion count goes 23 → 27**.
>
> **TEN of the eleven are text-or-test-only and the delivered build already satisfies them. ONE
> CHANGES THE CODE — `[D42]` / `A10b`:** `A10` guards the **engine** seam's move and nothing guards the
> **input** seam's, so the delivered loop plays a move no generator produced and **corrupts the board**.
> Measured at this hop against the delivered build. **`ABC-019` therefore returns to `In Development`,
> and the board move is the Orchestrator's — requested in `## Definition of Ready`, not taken.**
>
> **`ADR-0010`'s two owed items are written and neither re-opens it:** `A20` (clause 7's `F3` form) and
> **the PROHIBITION under it** (clause 7's second half — no constant-frame-width criterion, because `W`
> varies by design and such a criterion fails the *correct* build). **`A20` cannot be SATISFIED until
> `ABC-027` merges**, and it says so in its own words; the merge order is now
> **`ABC-016` → `ABC-027` → `ABC-017` → `ABC-019`** (`[D48]`).
>
> **Nothing under `src/` was written by this hop** — `A10b` is handed to the Engineer for exactly the
> reason `A9b` was. **`plans/board.md` was not opened**; its `blocked-until`/`merge-order` text was
> fixed by the Orchestrator this hop and is **no longer flagged**. **`memory-bank/50-decisions/` was not
> edited: `ADR-0009` and `ADR-0010` were read only and neither is re-opened.**

> **AMENDED 2026-08-12 (FIFTH hop) by BA/PM — one sentence in `[D27]`, and what `ABC-016`'s MERGE
> invalidated in the same block** (task `adr-done-2026-08-12`, subtask `refinement-ABC-019-d27`,
> Workflow 07). **Targeted, TEXT-ONLY, and it adds NO production scope:** no criterion `A1`–`A20` is
> added, amended, renumbered or deleted, the count stays **27**, the table stays **18 rows**, and size
> `L` (5) / priority `P0` are re-derived a **fifth** time and **UNMOVED**.
>
> **THE DEFECT THIS HOP WAS SENT TO FIX WAS ALREADY FIXED ON THIS BRANCH, AND SAYING SO IS THE POINT.**
> The brief named `[D27]`'s *"the seam is not new and its arguments do not change"* as falsified by the
> fourth argument. **It is — on `main`.** On this branch the **THIRD** hop repaired it to *"…its RETURN
> does not change"* in the same commit that added `[D28]` (added `4977d86`, repaired `a2bfd7e`), and
> flag 8 of that hop's DoR block already says so in writing. **`main` still carries the false sentence
> at `:242` because this ticket merges LAST**; this branch's merge is what discharges it, and no other
> artifact consumes it — `ADR-0009` cl. 9b's quote of it is now dated as *the ticket as it then read*.
> **Both tips were read at source at this hop. Nothing was inferred from the brief.**
>
> **What WAS left is a repair whose own baseline was never stated, and that is a real defect —
> `[D49]`.** *"Its RETURN does not change"* is unanchored: `[D27]`'s own first sentence says
> `readonly string[]` *"appears nowhere in this ticket's previous text"*, so there is no earlier value
> **in this ticket** for the return to be unchanged FROM. Read against the ticket the sentence is
> vacuous; read against the delivered BUILD and cl. 9b it is true and checkable. **It now says which,
> and it carries the fourth argument's qualifier in its own words — because this is the sentence that
> was lifted out of context into an ADR once already, and a sentence that has been quoted alone must
> survive being quoted alone.**
>
> **`ABC-016` MERGED, and that invalidated a MEASURED claim in the same block — `[D50]`.** `[D27]`'s
> IMPORTED bullet rests on *"`TS2307` × 2, exit 2 … that is self-enforcing and needs no criterion of
> its own"*. **Re-measured at this hop against merged `src/`: `TS2307` × 1, and importing `STATUS_ROWS`
> ALONE now typechecks clean at exit 0.** The self-enforcement is decaying and is **GONE the moment
> `ABC-017` merges — which is BEFORE this ticket merges.** What actually kills the IMPORTED form is
> `A18`(i) + `A19`(b), and that is measured rather than argued. **No criterion changes, none is added,
> and `A19` still carries no import clause.**
>
> **`ADR-0009` cl. 9f's re-gate is CONFIRMED recorded in the two places a rebase hop will look, and it
> is now sharper — `[D51]`.** A **partial** swap is possible today; **full discharge still needs
> `ABC-017`.** And the re-gate **ADDS** a real-panel run — it never **REPLACES** `A18`'s two stub
> shapes. Measured at this hop: the real pair is `3/8` → `H` = **23**, in-place, so a suite that swapped
> the stubs out would retain **no run of the append branch at all**, which is the exact landmine clause
> 9d exists to disarm.
>
> **Nothing under `src/` was written** — `git status --porcelain src/` = **0 lines** before and after,
> and every measurement ran on an out-of-tree copy verified byte-identical to the worktree. **`ABC-017`,
> `ABC-027`, `plans/board.md` and `memory-bank/50-decisions/` were not opened for edit; no ADR is
> re-opened.** Baseline re-verified here after the rebase: **758/758 on 26 files**, and it moved from
> 723/723 **because `ABC-016` merged**, not because anything here changed.

## Problem

*User*: everyone. Without this there is no game — there are a renderer and a rules library.

*Pain*: the epic specified the loop in **one line** — *"render → prompt human → apply → render →
engine moves → repeat"* — against two epics that do not exist (`EPIC-003` input, `EPIC-004` engine).
Wave 1 expanded that line into 8 states and 15 transitions and found that the line **hardcodes
human-plays-white**, which is wrong for half the sessions this product promises, and that it does
not contain the loop's **most-travelled edge** at all: the four ways a prompt returns without
advancing a ply.

*Value*: the component that sequences all seven actors. It is the only thing in the product that
touches the renderer, the rules core, the history, the input seam and the engine seam at once.

## Scope

**A ply loop that dispatches on side-to-move**, not a human-turn loop with an engine tail:

```
initialise (human colour, glyph mode) → evaluate
loop:
    render                      # the frame the player sees, including the terminal one
    if terminal: exit 0         # <-- THE EXIT TEST SITS HERE, between render and act
    act                         # human prompt, or engine seam
    if the outcome advanced a ply: append → derive counts → evaluate
    otherwise: back to render, WITHOUT re-evaluating
```

> **[D9 — the pseudocode this block replaced was WRONG, and a build that follows it literally passes
> `A7`.]** It read `while not terminal: append → derive counts → gameStatus(position, counts) → render
> → act`. With the test at the top of the loop, `terminal` can only be the status computed in the
> **previous** iteration — i.e. before the previous act — so it is **one ply stale**: the mated frame
> renders, the reason is recorded, and the loop then **acts**. Built and run: on the Fool's-mate line
> the loop invoked the engine seam **once on a checkmated position**, where `legalMoves` returns `[]`,
> and `A7` was green throughout. The exit test's position is normative and is now written down. The
> cycle order itself (…→ apply → evaluate → render → act →…) is unchanged and still matches `EPIC-002`
> `[A3]`.

- **The first actor is a function of `position.blackToMove` versus the human's colour**, fixed at
  startup. `EPIC-006`'s acceptance requires that under `--colour black` the **engine opens as white
  and no prompt appears first** — and, symmetrically, under `--colour white` the human is asked
  first. **Both directions are criteria (`A1`, `A1b`), because one alone is passed by a loop that
  always opens with the engine.** *(`[D4]` — built and run.)*
- **The order inside a ply is load-bearing and cannot be reordered.** The move is appended to the
  history **before** the counts are derived and evaluated, because `repetitionCounts` counts each
  position **INCLUDING THE CURRENT ONE** (`src/history.ts:128-135`, and `src/gameend.ts:124-125` says
  the same from the other side) — evaluate before the append and the *n*th occurrence reads as *n−1*,
  so the **automatic fivefold draw** (`src/gameend.ts:157`) and the **threefold claim**
  (`src/gameend.ts:162`) both arrive one ply late, silently. And the frame renders **after** the
  evaluation, so the last board a player sees is the mated one.

  > **[D2 — the citation this bullet carried was wrong in file, line and code.]** It read *"`src/gameend.ts:106` tests `counts.get(zobristKey(position)) >= 3` and its doc comment states the
  > count includes the current occurrence"*. That string appears **nowhere in `src/gameend.ts`** — it
  > is `src/history.ts:130`. `gameend.ts:106` is inside `isInsufficientMaterial`'s board scan; the
  > real test is `occurrences >= THREEFOLD_OCCURRENCES` at `:162` and **after `ABC-020` it no longer
  > ends a game** — it pushes a claimable draw. The bullet's *substance* survives; its evidence did
  > not, and the rule is now anchored on the test that does end a game.

- **`gameStatus` is never called bare, and the loop calls it through `gameStatusOf(history)`** —
  `src/history.ts:152`, which exists precisely to make `ADR-0002` clause 4's *"`positionCounts` gets
  exactly one supplier"* a call-site default rather than a convention someone must remember.

  > **[D7 — "carries a counts map" is satisfied by an EMPTY map.]** Built and run: a loop passing
  > `gameStatus(position, new Map())` at every call site satisfies the old criterion word for word
  > (a counts map is present, two arguments, every time) and **reports `in-progress` on the fifth
  > occurrence of a position where `gameStatusOf` reports `{draw, fivefold-repetition}`** — measured.
  > The same build passes `A13` for the wrong reason. Naming the supplier closes it; the spied call
  > count in *Security / NFR triggers* pins it.

- **The render cadence is `1 + plies + RE-EMITTING non-advancing outcomes` frames**, not "one render
  per ply". The initial position is rendered **before** the first act, every ply is followed by exactly
  one frame, and **the three non-advancing outcomes that carry a message re-emit a frame** —
  `rejected`, `ambiguous` and the non-mutating command — because the rejection line and the ambiguity
  candidate list live in the frame's own message region (`src/frame.ts:172-185`) and there is no second
  output channel. **`eof` re-emits NOTHING** (transition 10 goes to `exiting`, not to `rendering`; its
  notice is a `sink.write`, not a frame), and neither does the prompt-driven `game-over`.

  > **[D29 — the cadence formula counted FOUR non-advancing outcomes and only THREE of them emit a
  > frame, so it over-counted by one on every run that ends at end-of-input. Found 2026-08-11 (third
  > hop) by checking the formula against this ticket's own `## Test notes` table.]** It read
  > *"`1 + plies + non-advancing prompt outcomes`"* and *"every non-advancing outcome re-emits a
  > frame"*, while `## Problem` calls out *"the four ways a prompt returns without advancing a ply"*
  > and the transition table sends **7, 8, 9** to `rendering` and **10 (EOF)** to `exiting`. Measured
  > against the delivered suite: **row 11 (EOF, empty script) renders 1 frame; the old formula predicts
  > 2**. Rows 8, 9 and 10 each end at EOF too after their one re-emitting outcome — actual **2**, old
  > formula **3**. **Five of the thirteen rows disagreed with the sentence that is supposed to generate
  > them**, and the table was green only because its counts were written from runs rather than from the
  > formula. **This is not bookkeeping: the old formula is SATISFIED by a build that emits a frame on
  > end-of-input, and `A8` does not forbid one** — so the ticket admitted a build its own state machine
  > forbids. `A2` now carries the exclusion as a clause.

  > **[D5, D6 — "one render per ply. A full move produces two frames" was false in this ticket's own
  > terms, and so was the criterion built on it.]** Built and run, three ways: a **correct** build
  > renders **3** frames for one full move (initial, after White, after Black) and therefore FAILED
  > `A2` as written; the only build that renders **2** is one that skips the initial frame, which
  > **prompts the human before any board has been shown**; and a run with one rejected input plus one
  > full move renders **4**. `A6` already required a re-emit for `board`, so the ticket contained
  > both halves of the contradiction.

- **Eight states and fifteen transitions, enumerated** — the count was asserted three times in this
  ticket and written down nowhere, which is not testable and is what the size rationale rests on
  (`[D11]`). `initialising`, `evaluating-terminal`, `rendering`, `awaiting-human`, `engine-thinking`,
  `applying`, `game-over`, `exiting`:

  | # | From → To | Trigger |
  |---|---|---|
  | 1 | `initialising` → `evaluating-terminal` | startup complete; the human's colour and the glyph mode are in hand |
  | 2 | `evaluating-terminal` → `rendering` | the status is computed — **always**, terminal or not |
  | 3 | `rendering` → `game-over` | the status was terminal; the frame just shown is the final one |
  | 4 | `rendering` → `awaiting-human` | not terminal, and the side to move is the human's colour |
  | 5 | `rendering` → `engine-thinking` | not terminal, and it is not |
  | 6 | `awaiting-human` → `applying` | a legal move was read |
  | 7 | `awaiting-human` → `rendering` | **rejected** — message, no ply, **no re-evaluation** |
  | 8 | `awaiting-human` → `rendering` | **ambiguous** — candidate list, no ply, **no re-evaluation** |
  | 9 | `awaiting-human` → `rendering` | **non-mutating command (`board`)** — no ply, **no re-evaluation** |
  | 10 | `awaiting-human` → `exiting` | **input unavailable** (stdin EOF) — notice, exit 0, no terminal result |
  | 11 | `engine-thinking` → `applying` | a legal move was returned |
  | 12 | `engine-thinking` → `game-over` | the seam threw; the position is repaired first, then a named reason |
  | 13 | `engine-thinking` → `game-over` | the seam returned a move not in `legalMoves`; named engine-failure reason |
  | 14 | `applying` → `evaluating-terminal` | the move is appended and the counts derived |
  | 15 | `game-over` → `exiting` | the state has been entered — from 3, from 12, from 13 or from the prompt-driven outcome — and **no frame is emitted on this edge, ever**; exit 0. On **3** the terminal frame was already shown by `rendering`, which is that transition's own trigger. On **12**, **13** and the prompt-driven outcome **there is no terminal frame to show**, and that is a type-level fact, not a choice (`[D38]`) |

  **Transitions 7, 8 and 9 reach `rendering` WITHOUT passing through `evaluating-terminal`, and that
  is the structural reason `A5` and `A6`'s "`gameStatus` is not re-evaluated" is satisfiable at all** —
  it is a property of the machine, not only of a spy. The **sixteenth** transition,
  `awaiting-human` → `game-over` (the `claim` outcome), is **`ABC-021`'s** — see `## Out of scope`
  (`[D12]`).

  > **[D38 — transition 15's trigger required what `A2` and `## Test notes` rows 12/13 FORBID, and the
  > two halves of the contradiction were written by different hops, each self-consistent. Ruled
  > 2026-08-11 (fourth hop), from QE's `G-6`.]** The trigger read ***"the terminal frame has been
  > shown; exit 0."*** **Four edges reach `game-over`: 3, 12, 13 and the prompt-driven outcome. On
  > three of the four no frame is emitted after entry**, so on three of the four the trigger's own
  > precondition is false. QE's mutant `Q6` — emit the frame transition 15 names — is **KILLED**, and
  > killed by row 12's `frameCount: 1`, i.e. **by a table cell rather than by any criterion about
  > frames after termination**. The ticket forbade in one section what it required in another.
  >
  > **RULED ONE WAY, AND THE WAY IS FORCED BY A TYPE RATHER THAN PREFERRED.** `A2`'s formula and rows
  > 12/13's counts **STAND**; transition 15's trigger is reworded, and `A2` gains the exclusion as an
  > explicit clause so the property is carried by a criterion and not by a cell.
  >
  > **The render seam takes a `GameStatus` (`## Scope`'s render-seam bullet, and `A11`/`A16` assert on
  > it), and a terminal `GameStatus` requires `reason: EndReason`** — read at source at this hop,
  > `src/gameend.ts:57-69`, where the terminal arm of the union is
  > `{ result: "white-wins" | "black-wins" | "draw"; reason: EndReason }`. **`EndReason` is exactly the
  > five automatic values (`:40-45`).** `engine-threw`, `engine-failure` and `resignation` are members
  > of *this loop's* `TerminalReason` and **of no `GameStatus`**. So on 12, 13 and the prompt-driven
  > outcome the loop has **no terminal `GameStatus` in hand and cannot construct one** without editing
  > `src/gameend.ts` — which `A14` forbids in its own words. **A "terminal frame" on those three edges
  > is not undesirable, it is not constructible.**
  >
  > **Measured at this hop on the delivered build, transition 13** (engine returns a foreign move,
  > human black): outcome `{result: null, reason: "engine-failure", exitCode: 0}`, **1 frame**, and
  > that frame reads `status in-progress ... thinking true`. **QE's reading of the player-visible
  > consequence is CORRECT and is not disputed: the game ends and nothing on screen says so.** What is
  > ruled is **where that is owed**, and it is not owed here — **`EPIC-006`'s result screen is
  > `## Out of scope` by name**, and `A10`'s own rationale (*"a result screen can never present an
  > engine bug as a chess outcome"*) presumes it exists elsewhere. **What this loop owes is a
  > `LoopOutcome` carrying a reason distinct from every `EndReason`, and it delivers one.** Emitting a
  > second frame here would repeat an `in-progress` board with the thinking flag cleared — it would
  > **not** make the screen say the game ended, and it would cost `A2` its arithmetic.
  >
  > **This does NOT change the code**, and the residue is named rather than buried: **on 12 and 13 the
  > last frame the player sees has the thinking indicator lit.** In the shipped product `EPIC-006`
  > draws the result screen the moment `runTurnLoop` returns, so that frame is transient — **and there
  > is no CLI entry point today, so "transient" is a design expectation and not a measurement.**
  > **Handed to `EPIC-006` as a named input, not left as a defect here** (`## Definition of Ready`,
  > flag 12).
- **The loop's terminal reason is a superset of `EndReason`, and the whole admitted set is now
  enumerated.** `src/gameend.ts:40-45` has exactly five values plus `null`, and they are
  `checkmate` · `stalemate` · `insufficient-material` · `fivefold-repetition` · `seventy-five-move`.
  The loop's type must additionally admit **`resignation`** (`EPIC-006`), **an engine-failure reason**
  and **an engine-threw reason** (this ticket's own `A10` and `A9`), and **the two claimed reasons**
  `ABC-021` introduces — all **without `src/gameend.ts` being edited by this ticket**.

  > **[D3 — both facts in the sentence this bullet replaced were stale, and the deferral was too.]**
  > It cited `src/gameend.ts:28-34`, which are **import specifiers**; `EndReason` is at `:40-45`. It
  > described the five values as the pre-`ABC-020` set. And it said *"the exact value names are
  > `ABC-020`'s to settle at its design hop"* — **`ABC-020` merged on 2026-08-02 and the names are
  > settled in merged code**, so nothing here is open. `threefold-repetition` and `fifty-move` are now
  > `ClaimableDraw` (`:48`), **disjoint from `EndReason` by construction** (`:47`).
  >
  > **[D13 — the old superset criterion was passed by a type that cannot do the job.]** Verified with
  > `tsc --noEmit` (exit 0 with six `@ts-expect-error` markers, i.e. every one of them is a real type
  > error): `type X = EndReason | "resignation"` satisfies *"admits `resignation` in addition to the
  > five core values"* **word for word**, and cannot represent `A10`'s engine-failure reason, `A9`'s
  > reason after a throw, or either of `ABC-021`'s claimed reasons. A criterion that names a count
  > cannot pin a set. `A14` now enumerates it.
- **Two stub seams**, built here and replaced later:
  - **Input stub** — a coordinate-only reader built from merged code alone: match
    `squareName(move.from) + squareName(move.to)` (`src/position.ts:60`, already exported) across
    `legalMoves(position)`. It returns a **generator-owned** `Move`, so it cannot get `captured`,
    `flags` or `promotion` wrong. It reaches the `ambiguous` outcome for free — `addPromotions`
    pushes **four** moves with identical `from`/`to` (`src/moves.ts:88-98`) — and the `rejected`
    outcome for any unmatched input.
  - **Engine stub** — returns a move from `legalMoves(position)`, seeded-deterministic, with an
    optional artificial delay so the thinking state is exercised.
- **The human's colour is a LOOP parameter; the glyph mode is not — it is bound into the render seam.**
  Both are supplied by `EPIC-006` and **the loop discovers neither and defaults neither** — it reads no
  `process.env` and no `process.stdout`. **The colour parameter is a resolved `"white" | "black"`**:
  `EPIC-006`'s startup scope offers **white / black / random** (`EPIC-006` § Scope; `EPIC-002`
  § Dependencies) and resolves `random` before the loop sees it. `[D24]`

  > **[D30 — this bullet made `--ascii` / `--unicode` a parameter of the LOOP, which clause 9 had
  > already made impossible. Ruled 2026-08-11 (third hop).]** It read *"`--ascii` / `--unicode` and the
  > human's colour are parameters"*. Under `ADR-0009` clause 9b frame composition lives **entirely
  > behind the render seam**, and `## Out of scope` says the loop composes no frame — so the only
  > consumer of the mode is `assembleFrame(parts, mode)`, on the far side of the seam. A `mode`
  > parameter the loop never reads is **dead code the day it is written** (coding rules 5 and 7), and
  > passing it through would make the seam five arguments to carry a value neither the loop nor the
  > panels use. `EPIC-006` binds the mode into the seam closure exactly as it binds it into
  > `renderBoard` and `assembleFrame` today. **The half of the sentence that binds — discovers neither,
  > defaults neither — is unchanged and is now stated as the assertion it always was.** No criterion
  > named the glyph mode, which is why this survived two refinements: it is the one `## Scope` sentence
  > with no acceptance criterion under it, and it is text-only — the delivered build is already right.
- **The loop supplies the render seam everything it draws, and the render seam derives nothing.**
  Per frame the loop hands over the `GameHistory`, the `GameStatus` **it evaluated for this ply**, and
  the `thinking` flag — the three inputs `ABC-016`'s panel takes, in that ticket's own words *"supplied
  by the caller, never derived here"* — **and the message-region items for that frame** (`[D28]`).
  **The panel's three inputs are unchanged and the fourth is not the panel's:** the items go to
  `assembleFrame`'s message region (`src/frame.ts:172-185`), which is `ABC-018`'s, so nothing here
  adds an input to `ABC-016` or `ABC-017`. This is the line `ABC-016` was owed (its `## Dependencies`
  entry for this ticket) and it is **not decorative: it is what makes `A5` and `A6` satisfiable.**
  Until `ABC-016`'s refinement deleted the panel's per-frame `gameStatusOf` call, both were **false**,
  and that ticket's **derive-at-0 clause** — `gameStatusOf` / `repetitionCounts` / `keyHistory` /
  `gameStatus` at **exactly 0** inside the panel, carried by its `A13` today (`[D37]`) — now pins it. It is also what keeps `NFR-002`'s `O(window)` statement standing:
  that row voids itself *"if a renderer ever pulls the repetition derive into a frame"*, and this loop
  is the only place the derive belongs.
- **The render seam RETURNS the frame's rows and the LOOP writes them — and the loop never names a row
  count.** The seam's signature is
  **`(GameHistory, GameStatus, thinking, messages: readonly string[]) => readonly string[]`**: the
  three **panel** inputs of the bullet above, **the message-region items**, and **a frame's rows
  back**. The loop takes its session height as
  **the first frame's `.length`**, calls **`beginFrameSession(sink, height)` exactly once** with it
  (`src/frame.ts:211`, merged), and hands the writer every frame **exactly as the seam returned it** —
  no padding, no truncation, no re-composition. It declares no row count, imports neither panel, and
  does **not** import `frameHeight`: it does not need the arithmetic when it has the rows.

  > **[D27 — the seam's RETURN was never stated, and without it clause 9 has nothing to stand on.]**
  > `readonly string[]` appears nowhere in this ticket's previous text — the bullet above states the
  > seam's arguments and stops. `ADR-0009` clause 9b reads the return off *"the seam this ticket
  > already specifies"*, so it is recorded here rather than left to be inferred: **a seam that writes
  > instead of returning leaves the loop holding no rows, and then the session height cannot be
  > derived and `A19` cannot be asserted at all.** **The seam is not new — cl. 9b says so in its own
  > words, *"it is the seam that ticket already specifies"* — and recording its return moves nothing,
  > because `readonly string[]` is what the delivered seam ALREADY returns (`RenderSeam`,
  > `src/turn-loop.ts:97-102`) and what cl. 9b reads off this ticket. The return is stated here for the
  > FIRST time, not restated, so "moves nothing" is measured against the BUILD and the ADR and never
  > against this ticket's previous text, which named no return at all. Its ARGUMENT LIST is a separate
  > question and it DID change: `[D28]` below adds a fourth argument.** *(**[REPAIRED AGAIN 2026-08-12
  > (fifth hop) — `[D49]`.]** This sentence read *"the seam is not new and its arguments do not
  > change"*, which the fourth argument falsified; the third hop repaired it to *"…its RETURN does not
  > change"*, which is true but has no stated baseline. **`main` still carries the FIRST version at
  > `:242` — this branch's merge is what discharges it.**)*
  >
  > **[D28 — the three-argument form was UNSATISFIABLE against `A5`, and the fourth argument is FORCED
  > by this ticket's own sentences rather than chosen. Ruled 2026-08-11 (third hop).]** The signature
  > read `(GameHistory, GameStatus, thinking) => readonly string[]` in this bullet and `[D27]`'s
  > closing sentence read *"its arguments do not change"*. **`A5` requires the ambiguity candidate list
  > to reach the frame's message region and `## Scope` states there is no second output channel**, so
  > three arguments could not carry it. Every other way out is closed by a sentence already in this
  > ticket: the loop **composes no frame** (`## Out of scope`), so it cannot place the items itself;
  > **the render seam derives nothing** (the bullet above), so it cannot invent them; and there is **no
  > second channel**, so they cannot go around the frame. What is left is a fourth argument, and the
  > engineer built it before this hop ruled — the build is right and the TEXT was wrong.
  >
  > **This moves no clause of `ADR-0009` clause 9, and that was MEASURED at this hop rather than
  > argued.** Clause 9's ruling is that the **row count** must not cross the seam. A `messages`
  > argument cannot carry one: `layoutMessageRegion` returns exactly `MESSAGE_ROWS` rows in **every**
  > branch (`src/frame.ts:160-165`, and `packRegion` fills a fixed `MESSAGE_ROWS` array or returns
  > `null`), and `frameHeight` adds `MESSAGE_ROWS + PROMPT_ROWS` as constants. Re-measured here across
  > **0 items, 1 item, `A5`'s own 4 promotion candidates, 200 items and one 100 000-character item**,
  > at geometries **2/5, 4/9, 3/8 and 3/10**: the assembled height is a **single distinct value** in
  > every cell and equals `frameHeight` in every cell — 19 / 25 / 23 / 25. **The seam's argument list
  > is this ticket's; the row count is the ADR's; and they do not touch.**
  >
  > **`ADR-0009` clause 9 (9a/9b/9c), and every reason below is a measurement against merged `src/`,
  > not a style preference:**
  > - **DECLARED** (the loop states its height, however it spells it) **fails five of six row-count
  >   mutants, and on two of them it is a live `4b` breach** — told 23, `beginFrameSession` chooses
  >   in-place and the loop emits **25 rows into a 24-row viewport**, so the frame origin scrolls off
  >   the top and epic acceptance `4b` becomes unreachable. Re-measured at this hop, not transcribed.
  > - **IMPORTED** (the loop imports `STATUS_ROWS` / `HISTORY_ROWS`) **was mechanically impossible while
  >   BOTH panels were unbuilt** — `TS2307` × 2, **exit 2**, and an unrelated file in the same program is
  >   red with it because `npm run typecheck` is project-wide and `typecheck` is in
  >   `quality.mandatory_gates` under `gate_enforcement: blocking`. It also means a stub that EXPORTS the
  >   two constants is the third declaration site in person — forbidden by 9c.
  >   **This bullet previously added *"that is self-enforcing and needs no criterion of its own, which is
  >   why `A19` does not carry an import clause"*, and THAT half is now WRONG — the enforcement is
  >   expiring on the merge order** (`[D50]`, fifth hop, re-measured rather than re-read). With `ABC-016`
  >   merged the count is **`TS2307` × 1**, and importing `STATUS_ROWS` **alone** typechecks clean at
  >   **exit 0**; when `ABC-017` merges it is **× 0**, and both merge **before this ticket does**. **What
  >   kills the IMPORTED form at this ticket's gate is `A18`(i) + `A19`(b), not the compiler:** the
  >   imported arithmetic yields `frameHeight({board 9, status 3, history 8})` = **23** while `A18`'s
  >   shapes give first frames of **19** and **25**, so `A19`(b) is RED under both — measured at the fifth
  >   hop. **That is why `A19` still needs no import clause, and the reason is now a criterion rather than
  >   a build accident. `A19` is NOT amended.**
  > - **DERIVED is the only form both buildable against stubs and correct at the swap.** The identity
  >   `assembleFrame(parts, mode).length` == `frameHeight({...the three lengths})` holds over **560
  >   shapes with 0 mismatches** — **Architect/Design's measurement** at `design-stub-seam-and-nfr002`,
  >   attributed rather than re-claimed; spot-checked here at 2/5, 2/6, 3/8 and 4/9. The frame's row
  >   count is **invariant under the message region** — re-measured at this hop: 0 items, 1 item, 200
  >   items and one 100 000-character item all give the same `H` — so deriving from the *first* frame is
  >   safe whatever that frame happens to carry.
  > - **The two panels enter as stub seams in a TEST file, never as a `src/` module** (9c). Merged
  >   `src/frame.test.ts` is the precedent — `statusStub` / `historyStub` are local functions there
  >   (`:55-78`, line range **re-verified exact at the fifth hop**) and its header comment reads
  >   *"THE TWO UNBUILT PANELS ENTER AS FIXED-HEIGHT STUBS"* (`:11`, quoted at source). A `src/` stub
  >   module would be production code that is dead the day the real panels land, and coding rule 12 would
  >   then have it flagged rather than removed, so it would linger.
  >
  > > **[D49 / D50 — THE REST OF THIS BLOCK WAS RE-AUDITED SENTENCE BY SENTENCE AT THE FIFTH HOP, AND
  > > WHAT SURVIVED IS RECORDED SO THE NEXT HOP DOES NOT RE-DERIVE IT.]** Two claims here have now been
  > > falsified by two DIFFERENT events — the fourth argument (`[D28]`) and `ABC-016`'s merge — so
  > > "checked once" was not enough and the check is written down.
  > >
  > > **Falsified and repaired:** `[D27]`'s closing sentence (`[D49]`, twice now) and the IMPORTED
  > > bullet's self-enforcement half (`[D50]`).
  > >
  > > **Checked and STILL TRUE, each re-verified rather than assumed:**
  > > - *"the bullet above states the seam's arguments and stops"* — **true today**: the bullet above
  > >   lists four inputs and states no return. The third hop struck the word *"three"* from it and that
  > >   was the right edit; no further one is owed.
  > > - *"`readonly string[]` appears nowhere in this ticket's previous text"* — a claim about the text
  > >   **before** `[D27]`, unaffected by anything after it.
  > > - **DECLARED** and **DERIVED** — both are row-count arguments and a `messages` argument carries no
  > >   row count (`[D28]`, measured). `frameHeight` still takes **exactly three lengths**
  > >   (`{board, status, history}`, `src/frame.ts:84-88`, read at source here), so *"the three lengths"*
  > >   is still the right phrase — **the fourth argument went to `assembleFrame`'s message region, not
  > >   to `frameHeight`.** Re-measured at this hop: a `3/8` frame assembles to **23 rows with 0 message
  > >   items and 23 with 4**.
  > > - **9c's stub-in-a-test-file rule** — unaffected by both events. Its `:55-78` citation is exact.
  > > - **`[D26]`** (`## Out of scope`) — re-read in full and untouched by either event: it is about
  > >   where the WRITE lives, and neither the fourth argument nor a merged panel moves it.
  > >
  > > **Flagged, NOT taken — it is `src/` and it is another ticket's file.** Merged `src/frame.test.ts`
  > > says *"`ABC-016` is unbuilt"* (`:54`), *"stubs for the two unbuilt panels"* (`:51`), *"`ABC-016`
  > > and `ABC-017` are unbuilt"* (`:671`) and *"`ABC-016` (status, 3 rows) … do not exist"* (`:11`).
  > > **`ABC-016` merged, so four comments in `ABC-018`'s merged file are now stale.** This ticket does
  > > not open `src/frame.test.ts` and an Engineer is live in it for `ABC-027`. **Owner: whoever next
  > > has a mandate in that file. Non-blocking, comment-only, no assertion depends on it.**
- **Stdin EOF terminates the loop cleanly**: the loop stops, a one-line *input ended* notice is
  emitted, and the process exits **0**.
- **On any exception thrown by either seam, the position is rebuilt by replay — and the primitive
  already exists: `takeBack(history, 0)`** (`src/history.ts:99-105`). It splices nothing off the move
  list (`Math.max(0, len - 0)` = `len`), resets the borrowed object to `initialFen` and replays every
  move, which is exactly *"rebuilt by replay from `{ initialFen, moves }`"*. Verified by running it at
  this hop against a stub that throws inside a `makeMove` bracket: the live object was one ply ahead
  and `takeBack(history, 0)` returned it byte-identical by `toFen`, with `moves.length` unchanged.
  `[D23]` — the ticket described a mechanism it did not have to invent. `legalMoves`, the search and
  `gameStatus` all play moves and take them back, so a throw mid-operation can leave the live object
  mid-mutation; nothing else in `src/` clones a `Position` and no clone function exists.

  **REPAIR is symmetric across both seams. TERMINATING WITH A NAMED REASON is the ENGINE seam's
  alone.** After the repair the two seams part company, and this is the whole of the split:
  - **engine seam** — repair, then **stop** with `engine-threw` (`A9`), a value `A14` enumerates;
  - **input seam** — repair, then **RETHROW**. The loop invents no reason, reports no result and does
    **not** exit 0 down the end-of-input path. The exception is `EPIC-003`'s to own and `EPIC-006`'s to
    catch; what this loop owes is that **nobody downstream is ever handed a mid-mutation board**
    (`A9b`).

  > **[D31 — *"either seam"* and `A14`'s ten values looked like a contradiction, and neither is wrong:
  > one sentence was carrying two different promises. Ruled 2026-08-11 (third hop).]** The engineer
  > built the engine handler only and flagged that a symmetric handler *"would need a tenth `A14` value
  > that does not exist"*. **That is true of symmetric TERMINATION and not of symmetric REPAIR**, and
  > this bullet only ever promised repair — `A9`, which adds the named reason, names the engine seam
  > and nothing else. So the fix is neither *"narrow the sentence"* nor *"add a tenth value"*: it is to
  > stop the one sentence promising two things.
  >
  > **The input-side corruption is real and was verified at source at this hop, not assumed.** The
  > input seam calls `legalMoves(history.position)` — the delivered coordinate stub does it at
  > `src/turn-loop.test.ts:136`, and `EPIC-003`'s parser must do the same to reject an illegal move —
  > and `legalMoves` runs `makeMove` / `unmakeMove` **on the live borrowed object**
  > (`src/legal.ts:47-51`; `GameHistory.position` is *"BORROWED, never a snapshot"*,
  > `src/history.ts:39-44`). **The mechanism is identical to the engine's and this ticket's own
  > `## Security / NFR triggers` already states it in writing** — *"the loop suspends at exactly two
  > places … and both bracket a mutation"*. A throwing parser is a bug, not a path; so is a throwing
  > search, and that one already gets a handler.
  >
  > **Why RETHROW rather than a tenth reason** — the cheaper option is also the more honest one.
  > `[D13]` fought to make `A14` an exact enumeration, and a tenth value would additionally decide a
  > question no epic has answered: *does a parser bug end the game?* That belongs to `EPIC-003` and
  > `EPIC-006`, not to a skeleton. **And terminating QUIETLY is the one option that is definitely
  > wrong:** with no result and no reason the outcome is byte-identical to `A8`'s end-of-input, which
  > would present a crashed parser as a clean exit — the exact failure `A10`'s *"a result screen can
  > never present an engine bug as a chess outcome"* exists to forbid.
  >
  > **This one changes the CODE.** The delivered loop wraps the engine `await` and not the input
  > `await`, so the ticket returns to `In Development` for `A9b`. Cost: one `try`/`catch` around the
  > input call that repairs and re-`throw`s, plus one test row. **No new terminal-reason value, so
  > `A14` is untouched.**

## Out of scope

- **The real parser** (`EPIC-003`) and **the real engine** (`EPIC-004`). The stubs are **test seams,
  not designs** for those epics.
- **`undo` / `resign` / `new` / `quit` and the result screen** — `EPIC-006`. The loop provides the
  transitions those commands drive; it does not implement the commands.
- **The opening book.** `EPIC-005` sits *behind* the engine seam. If the loop can tell a book move
  from a searched move, `EPIC-005`'s *"no discontinuity visible to the player"* has already been
  broken.
- **Frame CONTENT, and the WRITE STRATEGY** — `ABC-014`, `ABC-016`, `ABC-017`, `ABC-018`. The loop
  composes no frame and chooses no strategy: it calls merged `beginFrameSession` **once** and calls the
  writer it returns. **Driving that writer IS this ticket's** — see the render-seam bullet in `## Scope`.
  **`ABC-027` is added to that list 2026-08-11 (`[D48]`): the in-place writer's per-row clearing is
  `ADR-0010` clause 1's ONE production change and it lives in `src/frame.ts`, which this ticket does
  not open. What IS this ticket's is `A20` — the assertion that nothing stale reaches the screen over
  a played game — and the PROHIBITION beneath it, which forbids a constant-frame-width criterion here
  because `W` varies by design and such a criterion would fail the correct build (`ADR-0010` cl. 7).**

  > **[D26 — this line read *"Frame content and writing"*, and *writing* is satisfied by a build that
  > puts the write behind the render seam.]** That build is not a style variant: the loop then never
  > holds a frame's rows, so it cannot take `firstFrame.length` and **`A19` has nothing to assert on**.
  > It also hides the frame count `A2` measures behind a seam this ticket does not own. `ADR-0009`
  > clause 9a settles the direction — the loop *"may import `beginFrameSession`, which is merged"* —
  > and the frames-rendered criterion (`A2`) only ever made sense on that reading. **Nothing moved
  > between tickets here; an ambiguity that admitted a wrong build was closed.**
- **An animating thinking indicator.** The loop owns the flag; the indicator is static.
- ~~**A "claim draw" interaction.** All five terminal conditions are automatic in this product:
  `gameStatus` returns the draw without being asked, and `EPIC-006`'s result screen lists repetition
  and fifty-move among the reasons it must name. FIDE treats threefold and fifty-move as claimable;
  this product does not. Settled by merged code plus `EPIC-006`'s acceptance, not open.~~
  **REVERSED 2026-07-31. See the amendment below.**
- **The claim interaction itself — `ABC-021`.** It is out of scope *as a ticket boundary*, not as a
  product decision. Folding it back in makes this ticket `XL` (8) and an automatic `SPLIT_REQUIRED`.

  > **[D12 — the boundary was owned twice, and the ticket that owed a criterion had none.]** This
  > block previously read *"this loop provides the fifth prompt outcome's transition and `ABC-021`
  > specifies it"*, while `ABC-021` § Scope reads *"A fifth prompt outcome, `claim`, alongside
  > `ABC-019`'s four non-advancing outcomes"* and its § Size rationale reads *"one new prompt outcome,
  > **one terminal transition**"*. Two tickets claimed one transition, and this one had no acceptance
  > criterion for it. **The split, stated once and in one direction: this ticket owns that
  > `game-over` is REACHABLE FROM `awaiting-human` at all** — the machine admits a prompt outcome that
  > terminates, and the terminal-reason type admits the two claimed values (`A14`). **`ABC-021` owns
  > the `claim` outcome itself**: transition 16, its rejection message, its fixtures and its criteria.
  > Nothing about the `claim` verb, its availability or its wording is decided here.
  > **`ABC-021`'s side of this sentence is FLAGGED for the Orchestrator, not edited** — that ticket is
  > outside this hop's lane.

### AMENDMENT 2026-07-31 by BA/PM — the claim-draw ruling is REVERSED

The struck block above said *"Settled … not open"*. **It is now open and it has been answered the
other way.** The reversal is recorded here rather than left as a silent edit, because a reader who
finds that sentence quoted elsewhere is entitled to know what overturned it.

**What overturned it.** The project owner **Olger Oeselg**, 2026-07-31: *"The most important thing is
that chess moves are legal according to game rules, everything else comes after that. Game has to be
played according to it's rules."* The struck ruling and `ABC-007`'s matching one both predate that
directive. Neither was wrong when made; both were made under a priority that no longer applies.

**What it is replaced by.** `ABC-020` (rules core — threefold and fifty-move become claimable under
FIDE 9.2/9.3, fivefold and 75-move become automatic under FIDE 9.6) and `ABC-021` (this loop's claim
path). QE's reproduction is in `20260731T151500Z-qe-e2e-observation-36373ca4`, gap G-1: a position
where this code declares ½-½ and FIDE says the player to move mates instead, with the deviation
running systematically against the human because the engine is the side that repeats when losing.

**What this changes in THIS ticket, precisely — three things and no more:**

1. The `## Out of scope` sentence above, struck.
2. The **acceptance criterion on the five `EndReason` values**, amended in place below.
3. The **terminal-reason superset** bullet in `## Scope`, amended in place below.

**Size, priority, the eight states, the fifteen transitions, both stub seams, the intra-ply ordering,
the EOF ruling and every NFR bar are UNCHANGED.** The claim outcome is `ABC-021`'s two points, not
this ticket's, and this ticket stays `L` (5).

**Merge order is load-bearing: `ABC-020` merges before this ticket.** Built against today's automatic
semantics, this loop's own tests would encode the deviation and it would stop being a bug and become
an assumption — the same failure `ABC-011`'s escalation trigger exists to prevent.

> **CORRECTION 2026-08-11 by BA/PM — "three things and no more" was wrong by three, and this is
> recorded here rather than in the fixes alone, because the sentence above is the kind a later reader
> trusts.** The amendment reached the two bullets it named and **missed** three more places the same
> ruling had already invalidated, all of them found nine days later:
>
> - **`A4`** — the *threefold* acceptance criterion, which still demanded `reason: "threefold-repetition"`
>   and became **UNSATISFIABLE** the moment `ABC-020` merged. It **contradicted `A13`**, the criterion
>   this very amendment added, three bullets away. `[D1]`
> - **Both `src/gameend.ts` citations** in `## Scope` — `:106` and `:28-34` — which the same ruling
>   moved. `[D2]`, `[D3]`
> - **The deferral** *"the exact value names are `ABC-020`'s to settle at its design hop"*, which
>   `ABC-020`'s merge on 2026-08-02 discharged and nobody came back for. `[D3]`
>
> **The merge order this block calls load-bearing HELD:** `ABC-020` merged 2026-08-02 and this ticket is
> still unbuilt, so no test of this loop ever encoded the deviation. What did not hold is the amendment's
> claim to be complete. **An amendment that lists what it changed is auditable, which is why this one
> was auditable at all** — the sentence is kept, and its error is written under it.

## Acceptance (Given/When/Then)

> **Numbered `A1`…`A17` at the 2026-08-11 refinement so later hops can cite one criterion instead of
> quoting it.** `A1b`, `A3b`, `A7b` and `A17` are new; `A2`, `A3`, `A4`, `A7`, `A9`, `A10`, `A14` and
> `A16` were repaired in place with the reason and the witness recorded. **Every fixture named below
> was run at this hop against merged `src/`.**
>
> **`A18` and `A19` ADDED 2026-08-11 (second hop) for `ADR-0009` clause 9d and 9e** — `[C9-1]`,
> `[C9-2]`. They are the two criteria that ADR's amendment recorded as **owed on this ticket and not
> written there**. No criterion `A1`–`A17` is edited, re-worded or renumbered by that hop.

- **`A1` — Given** the human's colour is **black** and the game starts from the standard position,
  **when** the loop runs, **then** the **first** actor invoked is the engine seam and **zero** prompts
  are issued before the first engine move.
- **`A1b` — Given** the human's colour is **white**, **when** the loop runs, **then** the **first**
  actor invoked is the **input seam** and **zero** engine calls are issued before the human's first
  move. *(**[ADDED 2026-08-11 — `[D4]`.]** `A1` alone is passed by a loop that dispatches
  `humanToMove = ply % 2 === 1` — engine first, always, whatever the colour. Built and run: it
  satisfies `A1` verbatim and hands the human's own **White** opening move to the engine, and `A2`
  never asks who acted. Assert the actor sequence, not only the prompt count.)*
- **`A2` — Given** the human's colour is white, **when** the loop runs one full move and no input is
  rejected, **then** exactly **three** frames are rendered — the initial position, the position after
  White's ply, and the position after Black's ply — and in general the frame count is
  **`1 + plies + RE-EMITTING non-advancing outcomes`**, where the re-emitting outcomes are exactly
  `rejected`, `ambiguous` and the non-mutating command. **Given** a run that ends at **end-of-input**,
  **then** that outcome adds **no** frame — the count is `1 + plies + re-emitting outcomes` and not one
  more — and the same holds for a prompt-driven `game-over`. **Given** a run that ends at an
  **engine-side termination** — the seam threw (transition 12) or returned a move not in `legalMoves`
  (transition 13) — **then** that outcome adds **no** frame either, and in general **NO frame is
  emitted after `game-over` is entered, on any of the four edges that reach it**: on transition 3 the
  frame that entered it *is* the terminal one and is already counted, and on 12, 13 and the
  prompt-driven outcome there is no terminal `GameStatus` to render at all.
  *(**[CLAUSE ADDED 2026-08-11 (fourth hop) — `[D38]`, from QE's `G-6`.]** `## Scope` transition 15
  required the opposite — *"the terminal frame has been shown"* — while `A2`'s formula and rows 12/13's
  `frameCount: 1` forbade it, and the two were written by different hops. QE's mutant `Q6` (emit that
  frame) is **KILLED, but only by row 12's count cell**, so the property lived in the table and in no
  criterion. It now lives here. **The rewording is transition 15's; this clause is its assertable
  half. No code changes** — the delivered build was already on this side, measured at this hop:
  transition 13 renders **1** frame and returns `{null, "engine-failure", 0}`.)*
  *(**[REPAIRED AGAIN 2026-08-11 (third hop) — `[D29]`.]** The formula read
  *"`1 + plies + non-advancing prompt outcomes`"*, and **four** outcomes are non-advancing while only
  **three** emit a frame. Checked against this ticket's own `## Test notes` table and the delivered
  suite: **row 11 (EOF) renders 1 and the old formula predicts 2**, and rows 8, 9 and 10 render 2
  against a predicted 3 because each ends at EOF after its one re-emitting outcome — **five of thirteen
  rows**. The end-of-input clause is now explicit and negative because the old formula was **satisfied
  by a build that emits a frame on EOF**, which transition 10 forbids and `A8` does not catch.)*
  *(**[REPAIRED 2026-08-11 — `[D5]`, `[D6]`.]** This
  read *"exactly **two** frames … one per ply"*. Under render-before-act — this ticket's own shape and
  `EPIC-002` `[A3]`'s — an N-ply game renders N + 1 frames. Built and run: a **correct** build renders
  3 and therefore failed this criterion; the only build that renders 2 skips the initial frame and
  **prompts the human before any board is shown**; one rejected input plus one full move renders 4.
  `A6` already demanded a re-emit, so the ticket held both halves of the contradiction.)*
- **`A3` — Given** a ply is applied, **when** the loop proceeds, **then** the calls occur in the order
  *append to history → derive counts → evaluate → render*, and **every** evaluation in the whole run
  goes through **`gameStatusOf(history)`** (`src/history.ts:152`) — the `ADR-0002` clause-4 single
  supplier — so no `gameStatus` call is ever bare **and none is ever handed a map that is not this
  game's**. **The *derive* and *evaluate* steps are asserted as ONE**, because `gameStatusOf` performs
  both in one call and a module-boundary spy cannot separate them (`[D32]`) — what is assertable, and
  what this criterion means, is that the **append** precedes that call and the **render** follows it,
  plus the map handed to `gameStatus` being this game's. *(**[ORDER CLAUSE CLARIFIED 2026-08-11 (third
  hop) — `[D32]`.]** The three-arrow order named a middle step no spy can see on a correct build, which
  is the same observability gap that made `A3b` demand an impossible count. No code changes.)*
  *(**[REPAIRED 2026-08-11 — `[D7]`.]** This read *"every `gameStatus` call … carries a
  counts map"*, which an **empty** `Map` satisfies. Built and run: that build passes the old clause at
  every call site and reports `in-progress` on the fifth occurrence of a position where `gameStatusOf`
  reports `{draw, fivefold-repetition}`. Naming the supplier closes it.)*
- **`A3b` — Given** any complete run of `N` plies, **when** `gameStatus` and `repetitionCounts` are
  **spied at the module boundary**, **then** both of these hold:
  **(a)** `gameStatus` is called **exactly `N + 1`** times — **one** evaluation before the first frame
  (transition 1 → 2, which the machine mandates *"always, terminal or not"*) and **exactly one after
  each applied ply** — and **exactly zero** additional times on any non-advancing prompt outcome, so a
  run with `k` non-advancing outcomes still reads `N + 1`; and
  **(b)** `repetitionCounts` is called **exactly 0** times.
  *(**[ADDED 2026-08-11 — `[D19]`; BOTH COUNTS REPAIRED 2026-08-11 (third hop) — `[D32]`.]** This is
  the clause that binds the derive rule, and it is a **count, not a clock**, for the reason
  `plans/nfr-catalog.md` has now moved a bar onto a count five times: measured at 120 plies, one derive
  per ply is 48.34 µs and **two derives is 93.58 µs — MET against the ≤ 100 µs bar at 0.94x.** The
  timing bar cannot see the wrong build; the spy cannot miss it.)*

  > **[D32 — this criterion was wrong about BOTH of the two counts it names, and the second error made
  > it satisfiable only by a build `A3` forbids. Found 2026-08-11 (third hop).]** It read
  > *"`repetitionCounts` and `gameStatus` are spied, then **each** is called exactly once per ply"*.
  >
  > - **`gameStatus` is `N + 1`, not `N`, and the extra one is LOAD-BEARING — verified, not accepted.**
  >   The engineer reported the off-by-one; an off-by-one in a spy count is also how a real double
  >   derive hides, so it was re-derived at source. The loop has **exactly two** `gameStatusOf` call
  >   sites — one before the loop and one at the tail of an advancing iteration — so the count is
  >   `1 + N` by construction and a two-derives build reads `2(N + 1)`, which the corrected clause still
  >   catches. **The `+ 1` is not bookkeeping:** it is transition 2, and a build that skips it never
  >   evaluates the STARTING position, so a game begun from an already-dead position plays a ply that
  >   does not exist. ~~`## Test notes` row 3 is exactly that fixture~~ **— see the correction
  >   immediately below; the witness is `## Test notes` ROW 16 —** and it is the reason the clause is
  >   stated as `N + 1` rather than relaxed to *"at least once per ply"*.
  >
  > **[D43 — `[D32]` AND `[D35]` LANDED IN THE SAME AMENDMENT AND CONTRADICT EACH OTHER, so `A3b`'s
  > `+ 1` had NO WITNESS. Corrected 2026-08-11 (fourth hop), from QE's `G-5`.]** `[D32]` justified the
  > `+ 1` by naming *"`## Test notes` row 3"* as *"exactly that fixture"* — a game begun from an
  > already-dead position. **`[D35]`, ruled in the SAME third hop, found row 3's already-dead start to
  > be a TRAP that loses the ply and replaced it with `1k6/8/8/8/8/8/1K6/2n4n w - - 0 1`, whose start
  > is IN PROGRESS.** Both rulings are individually right. Together they left **no row of the fourteen
  > starting from a terminal position**, so `[D32]`'s named witness did not exist. QE's mutant **`Q11`**
  > — the exit test does not run on the first pass, initial evaluation untouched, so `A3b` still reads
  > `N + 1` — is typecheck-clean and **717/717 green**.
  >
  > **This is the second time this ticket has contradicted itself INSIDE one amendment** (the first was
  > the 2026-07-31 *"three things and no more"*, wrong by three), and it is why this hop rules `[D38]`
  > and `A20` together rather than in two.
  >
  > **The delivered build is CORRECT here and `A3b`'s count is correct; what was missing is the
  > fixture its justification claimed to have.** Fixed by **adding `## Test notes` row 16** — an
  > already-terminal start — rather than by weakening the clause. **Re-measured at this hop on the
  > delivered build from `1k6/8/8/8/8/8/1K6/2n5 w - - 0 1`** (K+N vs K, `gameStatusOf` at the start
  > returns `{result: "draw", reason: "insufficient-material"}`, **and six legal moves are available**,
  > so the position is dead but not stuck): **1 frame, 0 plies, 0 input calls, 0 engine calls**,
  > outcome `{draw, insufficient-material, 0}`. Under `Q11` the human is prompted and **moves**, in a
  > game the rules core has already ended — `[D32]`'s own sentence, reproduced. **The row is what makes
  > `A3b`(a) assertable at `N = 0` and `A7b` assertable at ply 0, which is the strongest form of both.
  > No code changes, and no criterion is edited.**
  > - **`repetitionCounts` reads 0, and demanding *"once per ply"* of it contradicted `A3`.**
  >   `gameStatusOf` calls it **inside** `src/history.ts:152`, where a module-boundary spy cannot see
  >   it. **The only build that would make that spy read once per ply is one that hand-rolls
  >   `gameStatus(position, repetitionCounts(history))` at the call site — which is precisely what `A3`
  >   forbids.** As written, `A3b` and `A3` could not both be satisfied. **0 is not a weakened
  >   assertion, it is the stronger one:** it is the proof that every derive went through the
  >   `ADR-0002` clause-4 single supplier. Reading it as *"the per-ply derive count"* would be wrong,
  >   and the derive the bar is about is counted by `gameStatus`.
  >
  > **This one does NOT change the code.** The delivered loop and both delivered suites already assert
  > `plies + 1` and `repetitionCounts` at 0; it is the criterion that was behind the build.
- **`A4` — Given** a repeated line that reaches the same position a **third** time, **when** the loop
  evaluates on the ply completing that occurrence, **then** it reports
  `{ result: "in-progress", reason: null, claimable: { by: <side to move>, draws: ["threefold-repetition"] } }`
  — **on that ply, not one later** — and the loop **continues**. **Given** the **fifth** occurrence,
  **then** it stops with `{ result: "draw", reason: "fivefold-repetition" }` **on that ply**.
  *(**[REPAIRED 2026-08-11 — `[D1]`. This criterion was UNSATISFIABLE.]** It demanded
  `result: "draw", reason: "threefold-repetition"`. `ABC-020` merged 2026-08-02 and made
  `threefold-repetition` a `ClaimableDraw`, **disjoint from `EndReason` by construction**
  (`src/gameend.ts:47-48`): `const r: EndReason = "threefold-repetition"` is a **type error**, so no
  loop could satisfy it without editing `src/gameend.ts`, which this ticket forbids. It also
  **contradicted `A13`**, added by the same amendment. Measured on the knight cycle: 3 occurrences →
  `in-progress` + claimable; 5 → `{draw, fivefold-repetition}`. **The append-before-evaluate rule this
  criterion exists to protect is unchanged — it now hangs on the fivefold clause, which is the one
  that ends a game.**)*
- **`A5` — Given** the input seam returns `rejected`, **when** the loop continues, **then** the ply is
  **not** advanced, the position is byte-identical by `toFen`, **no** evaluation is re-run (`A3b`'s
  spy reads 0), and the prompt is re-issued after the frame carrying the rejection message. **Given**
  `ambiguous`, **then** the same holds and the candidate list reaches the frame's message region.
- **`A5b` — Given** any of the three non-advancing outcomes that carry message items — `rejected`,
  `ambiguous`, or the non-mutating command — **when** the frame carrying those items has been
  emitted, **then** the message items the loop hands the render seam for **every** subsequent frame of
  that game are **empty**, until another such outcome supplies new ones. The items belong to **one**
  frame: the one that re-emits for that outcome. **Assert over a run with at least two further frames
  after the carrying one**, so a build that never clears is red on the whole tail rather than on a
  single frame.
  *(**[ADDED 2026-08-11 (fourth hop) — `[D39]`, from QE's `G-1`.]** `A5` asserts only that the item
  **ARRIVES**; nothing in twenty-three criteria said it **LEAVES**, and `## Scope` says only that the
  rejection line and the candidate list *"live in the frame's own message region"* and that there is
  no second channel. QE's mutant `Q3` — delete `messages = []` (`src/turn-loop.ts:205`) — is
  typecheck-clean and **717/717 green**, and in it a rejection the player has already fixed is
  repeated on **every remaining frame of the game**. **Re-measured at this hop on the delivered build,
  script `["zzzz", "g1f3", "g8f6"]`: message regions `[] / [not a move: zzzz] / [] / [] /
  [not a move: g8f6]` — the delivered loop is CORRECT and no criterion protects it. No code
  changes.** **This is a CONTENT clause and touches nothing `ADR-0010` rules on**: the region's row
  count is fixed (`layoutMessageRegion` returns exactly `MESSAGE_ROWS` in every branch) and **no width
  is asserted, measured or implied here.**)*
- **`A6` — Given** the input seam returns a non-mutating command (`board`), **when** the loop
  continues, **then** a frame is re-emitted, the ply is not advanced, no evaluation is re-run, **and
  the outcome's message items reach that frame's message region — exactly as `A5` requires of the
  ambiguity candidate list. They are NOT optional.**
  *(**[CLAUSE ADDED 2026-08-11 (fourth hop) — `[D44]`, from QE's `G-8`.]** QE's mutant `Q8` — drop
  `messages` for `kind === "command"` only — is **41/41 green**: `A5` names `rejected` and `ambiguous`
  and stops, `A6` asserted no message at all, and row 10's Expected cell is *"as row 8"*, which
  carries no message clause either. **`## Scope` already groups `board` with *"the three non-advancing
  outcomes that CARRY A MESSAGE"***, so "optional" was the reading the ticket did not take anywhere
  else, and taking it here would have made that sentence false. **Ruled NOT optional. No code
  changes** — the delivered loop assigns `messages = outcome.messages` for all three kinds
  identically; this is one assertion the suite never made.)*
- **`A7` — Given** a scripted game driven to **checkmate**, **when** the loop ends, **then** the
  **final frame shows the mated position**, the terminal reason is `checkmate`, **the reported winner
  is `gameStatus`'s own `result`** — `"white-wins"` when Black is mated and `"black-wins"` when White
  is (`src/gameend.ts:139`) — and the process exits **0**. *(**[REPAIRED 2026-08-11 — `[D8]`.]** This
  read *"the winner is derived from `position.blackToMove`"*, which names a **source and not a value**.
  Built and run on the Fool's-mate line (`rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2`,
  then `d8h4`): a build computing `blackToMove ? "black-wins" : "white-wins"` satisfied every clause
  word for word — terminal `black-wins/checkmate`, final frame the mated position, exit 0 — while
  **reporting the LOSER as the winner**. The loop must not re-derive a value the rules core already
  returned.)*
- **`A7b` — Given** the status computed for a ply is terminal, **when** the loop finishes, **then**
  the input seam and the engine seam are each called **exactly zero** times after that status was
  computed — assert by spy. *(**[ADDED 2026-08-11 — `[D9]`.]** The `## Scope` pseudocode this ticket
  carried until today puts the exit test at the top of the loop, where `terminal` is one ply stale.
  Built and run: that build renders the mated frame, records `checkmate`, **then invokes the engine
  seam on a checkmated position** — and `A7` stayed green. Nothing in the ticket caught it.)*
- **`A8` — Given** a scripted game whose stdin **ends before any terminal condition**, **when** the
  loop reaches end-of-input, **then** it emits a one-line *input ended* notice, issues **no** further
  prompt and **no** engine call, exits **0**, and **reports no terminal result**. *(A truncated script
  must fail a test on the missing result screen, not pass on the exit code. See the ruling note below.
  *"terminates within one ply"* replaced by the spy count it was reaching for.)*
- **`A8b` — Given** the input seam returns the prompt-driven **`game-over`** outcome — the transition
  `EPIC-006`'s `resign` and `ABC-021`'s `claim` both drive, and the one this ticket owns **only** to
  the extent that it is reachable from `awaiting-human` at all (`[D12]`) — **when** the loop receives
  it, **then** all four hold: **(i)** the loop returns the seam's **own** `result` and its **own**
  `reason`, **unaltered and un-substituted**, with `exitCode: 0`; **(ii)** it emits **no** further
  frame, per `A2`; **(iii)** it calls **neither seam** afterwards — assert by spy, `A7b`'s form on the
  edge `A7b` does not reach, because no terminal `GameStatus` was ever computed here; and **(iv)** it
  writes **no** `input ended` notice and returns **no** `{ result: null, reason: null }`, so the
  outcome can **never** be byte-identical to `A8`'s end-of-input. **Clause (i) is asserted with at
  least two distinct `(result, reason)` pairs**, so a build substituting a constant is red rather than
  lucky.
  *(**[ADDED 2026-08-11 (fourth hop) — `[D40]`, from QE's `G-2`, which THREE independent instruments
  found and which is the survivor QE would close first.]** `[D12]` settled the `ABC-021` boundary
  one-directionally and then cited only `A14`, **which is about the TYPE**. No row of the fourteen and
  no criterion drove this outcome: `grep` for `game-over` in `src/turn-loop.test.ts` returns
  **nothing** — re-run at this hop, still nothing. The three instruments: mutant **`Q5`** (the seam's
  `reason` discarded and the constant `"resignation"` substituted — a player who claims a draw is told
  they resigned) at 41/41; mutant **`Q5b`** (the outcome reported as end-of-input) at **717/717**; and
  a **v8 coverage run whose only uncovered lines in the entire module are `src/turn-loop.ts:240-241`**
  — this branch, and nothing else. **`Q5b` is the sharp one: it is byte-identical to `A8`, the exact
  failure `A9b`(iii) was written to forbid, arriving through the one door nobody had looked at.**
  Clause (iv) is that forbiddance moved onto this path. `A2`'s own clause *"the same holds for a
  prompt-driven `game-over`"* was likewise unasserted, and clause (ii) is what asserts it.
  **Re-measured at this hop on the delivered build: a seam returning `{draw, resignation}` yields
  `{result: "draw", reason: "resignation", exitCode: 0}`, 1 frame, 1 input call, 0 engine calls — the
  delivered loop is CORRECT on all four clauses. No code changes; what is owed is a fixture, and it is
  `## Test notes` row 15.**)*
- **`A9` — Given** the engine seam throws **from inside a `makeMove`/`unmakeMove` bracket**, so that
  the live object is left one ply ahead, **when** the loop recovers via `takeBack(history, 0)`,
  **then** `toFen(position)` equals `toFen` of the position replayed from `{ initialFen, moves }`,
  `moves.length` is unchanged, and the loop terminates with a named reason from its terminal-reason
  type — it **never** continues on the object in hand. *(**[REPAIRED 2026-08-11 — `[D10]`.]** The
  fixture shape is now part of the criterion because without it the criterion is **unfalsifiable**:
  built and run, a build that repairs **nothing** passes it whenever the stub throws *before* touching
  the board, since the position was never corrupted. Only a mid-bracket throw can fail it — and that
  is also the only shape that resembles a real search.)*
- **`A9b` — Given** the **input** seam throws **from inside a `makeMove`/`unmakeMove` bracket** — the
  shape `legalMoves` produces, and the shape a real parser produces when it filters candidates — so
  that the live object is left one ply ahead, **when** the loop recovers, **then** all **four** hold:
  **(i)** `toFen(position)` equals `toFen` of the position replayed from `{ initialFen, moves }` and
  `moves.length` is unchanged, exactly as `A9` requires of the engine side; **(ii)** the exception
  **propagates out of the loop** — the caller sees it thrown; **(iii)** the loop returns **no**
  `LoopOutcome` at all, so it can never be mistaken for `A8`'s end-of-input (which returns
  `{ result: null, reason: null, exitCode: 0 }`) and **no new terminal-reason value is introduced**
  — `A14`'s enumeration is unchanged and is asserted unchanged; and **(iv)** between the seam's throw
  and the rethrow the loop makes **zero** render-seam calls and **zero** `sink` writes, so **nothing
  reaches the PLAYER on this path at all** — not a frame of the mid-mutation board, and not an
  *input ended* notice.
  *(**[CLAUSE (iv) ADDED 2026-08-11 (fourth hop) — `[D41]`, from QE's `G-3`.]** Clauses (i)–(iii)
  bound what the **CALLER** sees — `history`, the thrown value's identity, and the absent
  `LoopOutcome` — and **nothing bounded the output channels**, which is the engineer's honest
  non-claim #2 (*"row 14 carries no frame-count assertion"*) extended to its real width. Two mutants,
  both typecheck-clean and both **717/717**: **`Q4`** hands the **mid-mutation** position to the
  render seam and writes that frame, *then* repairs and rethrows — **the last board the player sees
  contains a ply that never happened**; **`Q4b`** repairs, writes `A8`'s *input ended* notice to the
  sink, then rethrows — the caller gets the exception and the **player is shown a clean exit for a
  crashed parser**, which is the same confusion (iii) exists to forbid, one channel over.
  **`## Scope` already states the property in words — *"nobody downstream is ever handed a
  mid-mutation board"* — and the render seam IS downstream.** No code changes: the delivered handler
  is `takeBack(history, 0);` immediately followed by `throw error;` with nothing between them
  (`src/turn-loop.ts:230-231`, read at source at this hop and cited by line rather than by memory —
  `[D2]` is why).)*
  *(**[ADDED 2026-08-11 (third hop) — `[D31]`.]** `## Scope` promised repair on *"either seam"* and
  only the engine seam ever had a criterion, so the promise was unassertable and the delivered build
  is one handler short. The fixture shape is part of the criterion for `[D10]`'s reason: **a stub that
  throws before touching the board corrupts nothing, so a loop that repairs nothing passes.** Clause
  (iii) is what keeps this from becoming a tenth `A14` value — a crashed parser is not a chess outcome
  and must not be reported as one, and whether it ends the game is `EPIC-003`'s and `EPIC-006`'s
  question, not this skeleton's.)*
- **`A10` — Given** the engine seam returns a move that is not in `legalMoves(position)`, **when** the
  loop receives it, **then** it does **not** apply it, `moves.length` is unchanged, and it terminates
  with the **engine-failure** value of its terminal-reason type — a value **distinct from every
  `EndReason`**, so a result screen can never present an engine bug as a chess outcome.
  *(**[REPAIRED 2026-08-11 — `[D14]`.]** *"a named engine-failure reason"* named no name, so any
  string passed; and `A14` as written could not even represent one. Failing loudly beats playing a
  corrupt board.)*
- **`A10b` — Given** the **INPUT** seam returns a `{ kind: "move" }` outcome whose `Move` is **not in
  `legalMoves(history.position)`** — the same membership test `A10` applies to the engine seam, on all
  six fields — **when** the loop receives it, **then** all five hold: **(i)** it does **not** apply it
  — `moves.length` is unchanged and `toFen(position)` is byte-identical to the position before the
  prompt; **(ii)** an exception **propagates out of the loop**, the caller sees it thrown, and the
  loop **invents no reason and reports no result**; **(iii)** the loop returns **no** `LoopOutcome` at
  all, so this can never be mistaken for `A8`'s end-of-input; **(iv)** **no new terminal-reason value
  is introduced** — `A14`'s enumeration is unchanged and is asserted unchanged, and in particular the
  **`engine-failure` value is NOT reused for an input-side fault**; and **(v)** between receiving the
  move and the throw the loop makes **zero** render-seam calls and **zero** `sink` writes, exactly as
  `A9b`(iv) requires of the throw path.
  *(**[ADDED 2026-08-11 (fourth hop) — `[D42]`, from QE's `G-4`. THIS ONE CHANGES THE CODE.]**
  **`A10` names the engine seam and nothing else, so nothing guards the input seam, and the delivered
  loop plays the foreign move onto the board.** QE classed it a criterion gap rather than a code
  defect for the right reason — **no criterion asked the loop to guard that seam** — and said plainly
  that it did not pick the answer, because the ticket said **neither**. **Ruled: the loop guards BOTH
  seams. It is not `EPIC-003`'s alone.** Four reasons, in the order they bind:*
  >
  > **1. The owner's standing directive is directly on point and outranks the convenience.** *"The
  > most important thing is that chess moves are legal according to game rules, everything else comes
  > after that. Game has to be played according to it's rules."* (Olger Oeselg, 2026-07-31 — the
  > directive recorded in `## Out of scope`'s amendment, which **already overturned one BA/PM ruling
  > on this ticket**). A loop that plays a move no generator produced is that directive's exact
  > negation, and "a later epic will validate it" is the *"everything else"* the directive puts
  > second.
  >
  > **2. Measured at this hop against the DELIVERED build, and the residue differs from QE's — said
  > rather than smoothed.** With the input seam handed `{from: a1, to: a8, ...}` at the start position:
  > `legalMoves` membership **false**, the move **applied anyway**, `moves.length` **1**, and the FEN
  > `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1` — **the white a1 rook is gone from the
  > board, White has lost queenside castling, and the halfmove clock advanced.** QE recorded
  > `Rnbqkbnr/… /1NBQKBNR b Kk - 0 1` — the rook *arriving* on a8 and capturing Black's. **Both are
  > corruption and the difference is ours, not the loop's:** QE built its `Move` from the named piece
  > constants and I hand-coded the six fields, so `piece` / `captured` / `to` differ. **What both
  > instruments agree on is every load-bearing fact** — not generated, applied regardless, ply
  > counted, and a resulting position **no legal move can reach**.
  >
  > **3. `[D31]` already ruled that this loop must not assume that seam is well-behaved**, and it ruled
  > the *shape* of the answer too. `## Scope` justifies the missing guard only by a property of the
  > **STUB** — *"It returns a generator-owned `Move`, so it cannot get `captured`, `flags` or
  > `promotion` wrong"* — which is a statement about the test double, **not about the `InputSeam`
  > contract `EPIC-003` replaces it under**. `playMove`'s documented precondition is a generator-owned
  > move; the loop enforced it on one of the two seams that can violate it.
  >
  > **4. THROW, not terminate, and not `rejected` — and the choice is `A9b`'s, not a new one.** A
  > `{kind: "move"}` that is not legal is a **PARSER BUG**, not a user typo: a real parser reports a
  > user's illegal move as `rejected` itself. **Converting it to `rejected` would present a broken
  > parser as a typo, forever and invisibly** — the failure `A10`'s own rationale exists to forbid,
  > with the roles swapped. **Terminating with a named reason is worse:** it would invent a tenth
  > `A14` value and decide *does a parser bug end the game?*, which `[D31]` handed to `EPIC-003` and
  > `EPIC-006` on this very seam. **Reusing `engine-failure` would report an input fault as an engine
  > fault.** What is left is `A9b`'s answer, and the two paths are now symmetric: **on the input seam
  > the loop repairs what it must, invents nothing, and throws.**
  >
  > **COST, stated because it moves the board.** Production: **one membership check over the existing
  > six-field comparison at `src/turn-loop.ts:264-272`, plus a throw** — zero new modules, zero new
  > imports, **zero new terminal-reason values, `A14` untouched, no signature change**. Test: **one
  > row** (`## Test notes` row 17) in the existing table-driven file — **no new test FILE**, so
  > `N8-LANE` does not move. Whether the comparison is shared between the two call sites or written
  > twice is the **Engineer's** call and this ticket does not design it. QE's mutant **`Q7`** — the
  > check applied to the input side — is **41/41 green**, i.e. the suite cannot tell the two builds
  > apart **in either direction**, which is why the criterion and the row are both owed.
  >
  > **`ABC-019` returns to `In Development` for this ruling alone.** Every other ruling of this hop is
  > text-or-test-only.)*
- **`A11` — Given** the loop is in the thinking state, **when** a frame renders, **then** the thinking
  flag it passes the render seam is set; **given** any other state, **then** it is clear — and the
  frame's row count is **identical** in both cases, per `EPIC-002` `4a`.
- **`A12` — Given** one fixture per value of the rules core's **automatic** terminal set — `checkmate`,
  `stalemate`, `insufficient-material`, `fivefold-repetition`, `seventy-five-move` — **when** the loop
  evaluates, **then** it stops with that reason and that reason only. **And given** the scripted-game
  table itself, **when** it is inspected, **then** it declares a row for **each** of those five values —
  an assertion **over the table's declarations, not a sixth run**, which is `[D25]`'s requirement that
  a table whose rows are not enumerated can be one row short and still green. **Both halves are this
  criterion and neither is a partial pass:** the five runs are what make it true, the enumeration is
  what stops a deleted row from making it vacuously true. *(**[CLAUSE MADE EXPLICIT 2026-08-11 (third
  hop) — `[D33]`.]** The build reported `A12` *"met in part"* because the enumeration assertion reads
  declarations rather than running a game. It is met in FULL: `[D25]` asked for exactly that guard and
  the criterion did not say so, which is why a correct build had to hedge. Nothing about the five runs
  changes and no code changes.)* *(**[AMENDED 2026-07-31 —
  `ABC-020`.]** As originally written this read "each of the five `EndReason` values … including
  `fifty-move`", which after `ABC-020` asserts a draw FIDE does not impose. Because mate is tested
  first, a mate delivered on the 150th halfmove is correctly **mate**, not a draw — the same precedence
  the original parenthetical made at 100, and FIDE 9.6.2 states it in words. **[2026-08-11 — `[D25]`]**
  "each" is now one named fixture per value, because a table whose rows are not enumerated is a table
  that can be one row short and still green.)*
- **`A13` — Given** a line that reaches a **third** repetition or a halfmove clock of **100**, **when**
  the loop evaluates, **then** it does **not** stop, the `claimable` set it passes the render seam
  names the article and the side to move, and the loop continues. *(**[ADDED 2026-07-31 — `ABC-020`;
  strengthened 2026-08-11.]** The negative half of `A12`, and the one that fails if `ABC-020` is merged
  after this ticket instead of before it — it merged 2026-08-02, so the order held. **The `claimable`
  clause is new and it is what stops this criterion passing for the wrong reason:** built and run, a
  loop that supplies an **empty** counts map also "does not stop" at the third repetition, because it
  never saw the repetition at all. Taking the claim is `ABC-021`.)*
- **`A14` — Given** the loop's terminal-reason type, **when** it is inspected, **then** it admits, and
  is assignable from, **every** one of: the five `EndReason` values, **`resignation`**, an
  **engine-failure** value, an **engine-threw** value, and **`ABC-021`'s two claimed values** — and
  `src/gameend.ts` is **not changed by this ticket**. *(**[REPAIRED 2026-08-11 — `[D13]`.]** This read
  *"admits `resignation` in addition to the five core values"*. Verified with `tsc --noEmit`:
  `EndReason | "resignation"` satisfies that sentence word for word and **cannot represent `A10`'s
  reason, `A9`'s reason, or either claimed reason**. A criterion that names a count cannot pin a set,
  so the set is enumerated. The two claimed values' exact spelling is `ABC-021`'s; what binds here is
  that the type has room for them without a change to the rules core.)*
- **`A15` — Given** the **engine seam resolves on a later macrotask** (asynchronous by contract, per
  *Security / NFR triggers*), **when** the loop runs a ply through it, **then** the frame sequence and
  the terminal verdict are identical to a synchronously-resolving seam, and the loop never reads the
  seam's result before it settles. *(**[ADDED 2026-08-11 — `[D17]`.]** "asynchronous by contract" was a
  scope statement with no assertion, and it is the one constraint in this ticket that cannot be
  retrofitted later without a rewrite.)*
- **`A16` — Given** the loop suspends on the engine seam and the seam **mutates the live position while
  suspended** (as a real search does), **when** the next frame renders, **then** every value in it
  matches the position **as it is at that moment**, and no value matches a pre-suspension snapshot.
  *(**[REPAIRED 2026-08-11 — `[D16]`.]** The bar read *"after any suspension, every rendered value is
  re-read from the live object at that moment"*, which is a code-review property and not a test. This
  is the same property with a fixture that can fail. The only value-snapshot primitive that exists is
  `toFen(position)`.)*
- **`A17` — Given** the per-ply overhead bars in *Security / NFR triggers*, **when** measured at
  **40 / 120 / 300 plies** by the instrument that section names, **then** each holds, and `A3b`'s spied
  counts hold with them. **The two halves are asserted in two different places and that is the
  criterion, not a shortfall:** `A3b`'s counts are asserted **in the default lane** at all three ply
  counts, and the **timing** figures are produced **out of tree** by the named instrument and recorded
  **with their machine** as evidence for Security/NFR — **they are NOT asserted in the suite**, because
  a number produced inside `vitest` would be a different measurement wearing this one's name. Merged
  `src/gameend.nfr.test.ts:16-17` states the same rule for its own bars — *"wall-clock cost is not
  asserted anywhere in this suite"* — and this criterion follows it rather than contradicting it.
  **`MET`/`MISS` against the three bars is Security/NFR's at the gate, never the build's.**
  *(**[SPLIT MADE EXPLICIT 2026-08-11 (third hop) — `[D34]`.]** The build reported `A17` *"met in
  part"* because the timing half is out of tree. As written the criterion did not say where each half
  lives, so a correct build could only either hedge or fabricate an in-suite timing assertion — and
  this project has ruled six times that a clock in the lane is the wrong instrument. **It is met in
  FULL, in the two places it names.** Text only; nothing about the measurement or the bars changes and
  no bar moves.)*
  *(**[REPLACES 2026-08-11 — `[D15]`.]** The old criterion read *"Given the cost
  bar … when measured, then it holds"* — singular, where that section holds three bars, one of which
  (`NFR-004`) it says is not this ticket's, and with no ply count, instrument, statistic or machine.)*
- **`A18` — Given** the stub render seams this loop's own suite drives it through, **when** they are
  inspected, **then** there are **two**, and all four of these hold: **(i)** neither seam's status row
  count is **3** and neither's history row count is **8** — the reference layout's numbers; **(ii)** one
  seam assembles to `H` **≤ 24**; **(iii)** the other assembles to `H` **≥ 25**; **(iv)** on a sink
  reporting `isTTY` and **24** rows, `beginFrameSession` therefore chooses **in-place** for the first
  and **append** for the second, and both choices are observed on the emitted stream (an in-place write
  begins with `\x1b[H`; an append write does not). **The reference pair, measured at this hop: shape
  `A` = status 2 / history 5 → `H` = 19, in-place; shape `B` = status 4 / history 9 → `H` = 25,
  append.** Any pair satisfying (i)–(iv) satisfies this criterion.
  *(**[ADDED 2026-08-11 — `[C9-1]`, `ADR-0009` clause 9d.]** This is not tidiness — **a 3/8 stub arms a
  landmine and this ticket's own gate cannot see it.** Built and run at this hop, the same loop under
  four height modes × three stub shapes × three real-panel geometries:*
  >
  > | build | stub A 2/5 | stub B 4/9 | at THIS ticket's gate | real 3/8 | real 3/10 (`M3`) |
  > |---|---|---|---|---|---|
  > | hardcoded `H` = 23 | RED | RED + **`4b` BREACH** | **caught here** | GREEN | RED + **`4b` BREACH** |
  > | hardcoded `H` = 19 | GREEN | RED + **`4b` BREACH** | **caught here** | RED | RED + **`4b` BREACH** |
  > | hardcoded `H` = 25 | RED | GREEN | **caught here** | RED | GREEN |
  > | **derived** (`firstFrame.length`) | GREEN | GREEN | **SHIPS** | GREEN | GREEN |
  >
  > *With a **3/8** stub instead, `hardcoded H = 23` is **GREEN on every clause** and the breach arrives
  > at the rebase, at the one moment nothing in the tree re-checks it — and a 3/8 stub **never exercises
  > the append path at all**, so the loop's first append run would happen in production.*
  >
  > ***Why TWO shapes and not one, which is stronger than the reason the ADR gives:** one shape is
  > defeated by a **tuned literal** — `hardcoded H = 19` is green on every clause of `A19` under shape
  > A alone. Two shapes whose heights differ cannot both be satisfied by any literal, so the derived
  > form is the only build that passes. **That is measured in the table above, row by row.** Clause (i)
  > is separately load-bearing: a stub that kept status at 3 would let a loop that declares the status
  > term alone be right by accident.*
  >
  > ***A stub already written at 3/8 is a DEFECT to fix, not a preference*** *— `ADR-0009` clause 9d's
  > own words. Nothing in merged `src/` has such a stub today: there is no loop module, and
  > `src/frame.test.ts`'s 3/8 stubs are `ABC-018`'s own fixtures, are not this seam, and are not touched
  > by this ticket. Frame count is unaffected by the shape — 14 frames for 12 plies + 1 non-advancing
  > outcome under **every** shape and mode in the matrix — so `A2` holds under both.)*
- **`A19` — Given** any complete run under either shape of `A18`, **when** the session is instrumented,
  **then** all four hold: **(a)** `beginFrameSession` is called **exactly once** in the whole run;
  **(b)** the `height` it is given **equals the first frame's `.length`**; **(c)** every frame the
  writer receives is **deep-equal to the rows the render seam returned** — same count, same rows, same
  order, so the loop pads, truncates and re-composes nothing; and **(d)** **every** frame's `.length`
  equals that one session height.
  *(**[ADDED 2026-08-11 — `[C9-2]`, `ADR-0009` clause 9e, whose words are clauses (b) and (d).]*
  ***Real and falsifiable, not a tautology:** `assembleFrame` does not normalise height — measured
  2/5 → 19 and 2/6 → 20 — so a seam whose panel height moves mid-session fails (d). Built and run:
  a stub whose status panel grows a row while `thinking` returns heights `[19, 20]` and **fails (d)**,
  which is the only place `EPIC-002` `4a`'s session-constant geometry is checked across a whole run.
  `A11` is the thinking-state instance of the same property and is unchanged.*
  >
  > ***Each of the four clauses is witnessed by a wrong build that the other three admit, which is why
  > the criterion is not shorter:***
  >
  > | wrong build (all at stub `A`, 2/5) | (a) once | (b) `= frame1.length` | (c) unmodified | (d) `= H` |
  > |---|---|---|---|---|
  > | hardcodes `H` = 23 | GREEN | **RED** | GREEN | **RED** |
  > | calls `beginFrameSession` **per frame** | **RED** | GREEN | GREEN | GREEN |
  > | hardcodes 23 **and pads/truncates every frame to it** | GREEN | **RED** | **RED** | GREEN |
  > | derives `H`, then pads/truncates every frame to it — **against a variable-height seam** | GREEN | GREEN | **RED** | GREEN |
  >
  > *Row 3 is why (c) exists and it was the surprise of this hop: **clause 9e's literal words are GREEN
  > on a normalising loop even at a 2/5 stub**, because the loop pads 19 rows out to its declared 23 and
  > (d) then passes. **9d does not save 9e on its own; (c) does.** Row 2 is why (a) exists: a per-frame
  > session re-chooses the strategy `src/frame.ts`'s header rests on choosing once, and passes (b), (c)
  > and (d).*
  >
  > ***Row 4 is stated honestly and it is the narrowest of the four.*** *Against a fixed-height stub the
  > padding is a **no-op** and all four clauses are GREEN — measured, and not claimed otherwise. It is
  > only detectable against a seam whose height moves, where the loop truncated a 20-row frame to 19 and
  > **(d) passed while a row of the player's frame was silently dropped**. So (c)'s job on this row is
  > not to catch a live defect at this gate: it is to stop (d) from becoming a tautology, which is the
  > whole reason clause 9e is worth asserting.*
  >
  > > **[D45 — the declaration above is CONFIRMED by an independent instrument and the disposition is
  > > UNCHANGED. 2026-08-11 (fourth hop), from QE's `G-9`.]** QE re-found it from the other side —
  > > mutant `Q12` (derive `H` from frame 1, then pad/truncate every frame to it) is **41/41 green**
  > > against both `A18` shapes — and **reported it as a confirmation of this paragraph rather than as
  > > a new gap, which is the correct reading.** **Nothing is owed and nothing is added.** Closing it
  > > would need a **variable-height** stub, and a variable-height seam makes the *correct* loop fail
  > > clause **(d)** by construction — so the only run that exercises (c) is one that must also assert
  > > a failure. **That is a test of this criterion rather than of the loop, and it is deliberately not
  > > bought**: (c)'s stated job is to stop (d) becoming a tautology, and it does that by existing.
  > > **Recorded so this is not rediscovered as new a fourth time.**
  >
  > ***The instrument, so the criterion is not asserted into an unavailable mechanism:*** *a sink whose
  > `rows` accessor counts reads gives clause (a) with **no mocking at all** — `beginFrameSession`
  > reads `sink.isTTY` then `sink.rows` exactly once per call (`src/frame.ts:212`), so one session on a
  > TTY sink reads `rows` once and three writes do not read it again; verified, including the honest
  > limit that the `&&` short-circuits on a non-TTY sink so the counter reads 0 there. Clause (b) needs
  > the argument itself: `vi.mock("./frame.ts", importOriginal)` + `vi.fn(actual.beginFrameSession)`,
  > the exact form merged `src/gameend.nfr.test.ts:22-30` already uses. See `## Test notes` for why
  > that costs no new test FILE.)*
- **`A20` — Given** a played game driven through this loop whose frames contain at least one
  **NARROWING** — a frame whose width is **strictly less** than the immediately preceding frame's,
  where a frame's width is the length of its padded rows (`W`, `src/frame.ts:179`) — **when** the
  bytes the loop wrote are replayed into a terminal model that implements every escape this writer
  emits and **throws on any escape it does not**, **then** after **EVERY** redraw of the run — not the
  last, and not only the narrowing one — the **screen equals the frame the loop handed the writer**:
  the same number of rows, and each screen row equal to the corresponding frame row **once both are
  right-trimmed**. **Given** the same run replayed at a screen width **wider than every frame in it**
  (assert at 80 columns), **then** the same holds.
  *(**[ADDED 2026-08-11 (fourth hop) — `[D46]`, `ADR-0010` clause 7, which recorded this criterion as
  **owed on this ticket and deliberately not written there**. `ADR-0010` is accepted and is NOT
  re-opened by this ticket.]** It is the **width** counterpart of `ADR-0009` clause 9e, and like 9e
  **this is the only place the property is checked at all** — no criterion anywhere asserts what
  reaches the SCREEN between two frames of a played game.)*
  >
  > **THIS CRITERION CANNOT BE *SATISFIED* UNTIL `ABC-027` MERGES, AND THAT IS STATED HERE SO IT IS
  > NEVER READ AS A BUILD FAILURE.** `ADR-0010` clause 1 puts the fix in the **consumer**:
  > `src/frame.ts`'s in-place writer must clear each row as it writes it, and **that production change
  > is `ABC-027`'s, not this ticket's.** Until it lands, `\x1b[0J` erases downward from the end of the
  > new frame and **never rightward**, so a narrowed frame leaves stale columns that survive — measured
  > in `ADR-0010` at up to **17 consecutive frames**, rendering `material: 0` as `material: 01` and
  > leaving an **expired draw claim** on screen. **`A20` is therefore RED by design before `ABC-027`
  > and GREEN after it, at ZERO production lines in this module.** Merge order is
  > **`ABC-016` → `ABC-027` → `ABC-017` → `ABC-019`** (`[D48]`), so `ABC-027` lands well before this
  > ticket and **the assertion is written at the rebase, riding with `ADR-0009` clause 9f's real-panel
  > re-gate** (`## Dependencies`, `[C9-4]`) rather than before it. **Writing it earlier turns this
  > branch's own gate red for a defect in another ticket's module, which is not this ticket's to
  > carry.**
  >
  > **The FORM is `F3` and the three forms it is not were each scored by measurement in `ADR-0010`, so
  > the trimming is not a stylistic choice:**
  >
  > | form | narrowing @ `W`(frame 1) | narrowing @ 80 cols | steady @ 80 cols |
  > |---|---|---|---|
  > | **F1** epic `4b`'s *"zero ROWS from frame N"* | CATCHES | **BLIND** | PASS |
  > | **F2** screen equals frame, **untrimmed** | CATCHES | CATCHES | **FALSE POSITIVE** |
  > | **F3** screen equals frame, **trimmed** — *this criterion* | CATCHES | CATCHES | PASS |
  > | **F4** every frame's `W` equals the session `W` | CATCHES | CATCHES | PASS — **and see the prohibition below** |
  >
  > **Epic `4b` as worded is BLIND to this at a real terminal width** (F1) — it only fires at the
  > artificial width `W`(frame 1) — which is why the ADR covers it at the ticket level, and **`4b` is
  > neither breached nor amended by any of this.** The **untrimmed** comparison (F2) false-positives on
  > any screen wider than the frame, i.e. on every real terminal, which is why the second Given exists
  > at 80 columns.
  >
  > **Two things the fixture must do, both measured facts rather than preferences.** **(1) The
  > narrowing must come from a PANEL row, not a message item**: `W` is the max over the **panel** rows
  > only and the message region is bounded by it (`src/frame.ts:176-179`, read at source at this hop —
  > *"a long rejection would then widen the frame"*), so a fixture that tries to narrow via `messages`
  > narrows nothing and the criterion passes vacuously. **(2) The screen model is LOCAL to this ticket's
  > test file** — merged `src/frame.test.ts`'s `createScreen` is **not exported** (`:190`, verified at
  > this hop), and `ADR-0009` clause 9c's precedent is that this ticket's fixtures live in its own test
  > file and never under `src/`. **`src/frame.test.ts` is not touched by this ticket**, and the
  > `\x1b[K` case that file's model must learn is **`ABC-027`'s**, named in `ADR-0010`'s
  > `## Consequences`.
  >
  > **This criterion does NOT constrain `A18` or `A19`.** Those govern **row counts**; this governs
  > **width**, and `ADR-0010` clause 3 is the rule that separates them — *a frame quantity that
  > composes by SUM is owned by its PRODUCER; one that composes by MAX is owned by its CONSUMER*. A
  > stub whose panel rows vary in **width** varies no row **count**, so `A18`'s two shapes and `A19`'s
  > four clauses are untouched and are asserted unchanged.

> ### PROHIBITION — **`ABC-019` MUST NOT BE GIVEN A CONSTANT-FRAME-WIDTH CRITERION**
>
> **[`[D47]`, `ADR-0010` clause 7's second half, written into this ticket 2026-08-11 (fourth hop) so
> that the next reader cannot re-invent it.]**
>
> **No criterion of this ticket may assert that the frame's width is constant, that every frame's `W`
> equals the session's `W`, that `W` equals the first frame's width, or that any panel reserves or
> pads to a fixed width.** That is form **`F4`** in the table above, and **it would fail the CORRECT
> build.**
>
> **The reason is measured, not stylistic.** Under `ADR-0010` clause 1 the consumer clears and **`W`
> varies BY DESIGN**: it is `panels.reduce((widest, row) => Math.max(widest, row.length), 0)`
> (`src/frame.ts:179`) — a **max**, recomputed per frame. `ADR-0010` measured it at **four distinct
> values over a 510-shape sweep**, and **{24, 50} over a real played game**. The three alternatives
> were run and rejected there: reserving the widest case makes the frame **67 columns with 49
> permanently blank** and costs **+152% bytes per frame**; freezing `W` at the first frame **destroys
> 8 panel rows** across one 20-ply game, including a live draw-claim offer.
>
> **This is NOT the row-count rule and must not be reasoned about as one.** `ADR-0009` clause 9's
> `firstFrame.length` derivation is sound **because `H` is invariant** (0 mismatches over 510 shapes);
> `W` is **not** invariant over the identical sweep. **`A19`(b)/(d) are the height clauses and they
> stand exactly as written** — the width analogue of them is the thing this prohibition forbids.
>
> **What replaces it is `A20`**, which asserts the property that actually matters — *nothing stale
> reaches the screen* — instead of a proxy for it. **The honest cost of rejecting `F4`, stated because
> `ADR-0010` states it:** the frame's width is no longer a stated constant anywhere, and a reader who
> wants to know how wide the frame is must run it.
>
> **QE held this boundary unprompted at the 2026-08-11 QE hop** — nine survivors and **not one**
> proposes a width criterion, and its `G-1` note says in its own words that the message region's row
> count is fixed and **no width is asserted anywhere in it.** The prohibition is written down so that
> holding it stops depending on each role remembering why.

## The EOF ruling, recorded because the record did not contain it

No epic said what happens when stdin ends. Both answers are defensible: *treat as quit, exit 0* (it
is what `EPIC-006`'s *"exits cleanly with code 0"* suggests) or *treat as an error* (a scripted game
whose input runs out before mate arguably failed). **BA/PM ruled on 2026-07-30: exit 0, with a
notice, and the safety lives in the test's assertion rather than in the exit code** — `EPIC-006`'s
end-to-end test asserts the **checkmate result screen**, so a truncated script fails on the missing
screen. Putting the safety in the exit code would make the game report a failure for a situation in
which nothing is broken. Undecided, this is the shape of bug that manifests as a test that hangs in
CI.

## Dependencies

> **[D21 — this block was stale on FOUR entries, verified against ticket front matter and the board
> rather than assumed.]** `ABC-012` (`status: done`, merged 2026-08-06), `ABC-014` (2026-08-08),
> `ABC-018` (2026-08-09) and `ABC-020` (2026-08-02) are **all merged on `main`**. **Not one hard
> dependency of this ticket is unbuilt.** The board row's own
> `blocked-until: ABC-012, ABC-014, ABC-018` and `merge-order: after ABC-020` are stale on all four —
> **the fourth stale `blocked-until` row on this board** — and board hygiene is the Orchestrator's:
> **flagged, not edited.**

- **`ABC-012`** (history and the counts supplier) — hard, **MERGED 2026-08-06**. It supplies
  `newGame` / `playMove` / `repetitionCounts` / `gameStatusOf` / `takeBack`, which is every primitive
  this loop needs; `gameStatusOf` (`src/history.ts:152`) is `A3`'s named supplier and
  `takeBack(history, 0)` is `A9`'s repair.
- **`ABC-014`** (`renderBoard`) and **`ABC-018`** (`assembleFrame`, `frameHeight`, `beginFrameSession`,
  message-region sanitizing) — **both MERGED**, 2026-08-08 and 2026-08-09.
- `ABC-005`, `ABC-003`, `ABC-007` — merged on `main`.
- **`ABC-020`** — **MERGED 2026-08-02, so the merge-order constraint is DISCHARGED.** *(This entry
  previously read "`ABC-020` is `P0` and already in `Ready` with no unbuilt dependency, so the order is
  available." It merged nine days ago and its reason set is settled in merged code — see `[D3]`.)*
  `ABC-021` (the claim path) sits behind this ticket.
- **`ABC-016`, `ABC-027` and `ABC-017` — `ABC-016`/`ABC-017` added 2026-08-11 (`[D22]`), `ABC-027`
  added 2026-08-11 at the fourth hop (`[D48]`); `ABC-016` is a CORRECTNESS dependency, not merely a
  render one, and `ABC-027` is a CORRECTNESS dependency of `A20` specifically.** *(This read **"All
  three are unmerged"** until the fifth hop, when it became false — `[D51]`. **It is not replaced with
  today's status, because a status copied into a ticket is exactly `[D21]`'s defect and it would be
  stale again by the next merge.** It is replaced with the CHECK: **a panel is unmerged for this
  ticket's purposes exactly while its module is absent from merged `src/` — test it, do not trust this
  sentence.** At the fifth hop `src/status-panel.ts` was present and exported `STATUS_ROWS` and the
  history-pane module was absent.)* The merge order is **`ABC-016` → `ABC-027` → `ABC-017` → `ABC-019`** — three of four
  established at this task's scheduling hop
  (`.grugops/context/frame-merge-order-2026-08-11/notes/…-orchestrator-decision-ac72dd8d`) and
  `ABC-027` inserted **second** when it was cut from `ADR-0010`. **This ticket merges LAST in all
  versions of the order**, and a `P0` merging behind a `P1`, a `P1` and a `P2` is a build-edge fact
  recorded there. **Their live columns are deliberately NOT restated here — `plans/board.md` is the
  authority for status, and four of this ticket's own defects were stale status text copied into a
  ticket** (`[D21]`).
  - **`ABC-027` (the in-place writer clears each row as it writes it) — added 2026-08-11, and it is
    what makes `A20` SATISFIABLE rather than merely assertable.** `ADR-0010` clause 1 puts the fix in
    the consumer, and its **one production change is a single expression in `src/frame.ts`'s in-place
    branch of `beginFrameSession`** — `ABC-018`'s merged module, which this ticket does not open.
    Until it merges, `\x1b[0J` never erases rightward and a narrowed frame leaves stale columns, so
    **`A20` is RED before it and GREEN after it at zero production lines here.** `A20`'s assertion is
    therefore written **at the rebase**, riding with `ADR-0009` clause 9f's real-panel re-gate
    (`[C9-4]`) — not before. **`ABC-027`'s ticket was NOT read or edited by this hop** (an Engineer is
    live on it); everything above comes from `ADR-0010` and from this ticket's own boundary. `[D48]`
  - **`ABC-016` is why `A5` and `A6` are satisfiable at all.** Both require a frame re-emit **without**
    re-evaluating, and a panel that derived its own status per frame made both **false**. `ABC-016`'s
    refinement deleted that `gameStatusOf` call and **its derive-at-0 clause** — `gameStatusOf`,
    `repetitionCounts`, `keyHistory` and `gameStatus` each spied at exactly 0 inside the panel, carried
    by `ABC-016`'s `A13` as that criterion stands today — now pins it. This ticket
    supplies the status instead — see the render-seam bullet in `## Scope`, **the line `ABC-016` was
    owed**.

    > **[D37 — this ticket cited that criterion BY NUMBER, and a concurrent hop is ruling on it.
    > Hardened 2026-08-11 (third hop).]** A separate BA/PM subtask (`refinement-ABC-016-a13`) is ruling
    > on `ABC-016`'s `A13` because its `isInCheck` / `toSan` **call-count** clauses are reported
    > unsatisfiable — `toSan`'s `suffix()` calls `isInCheck` itself. **The clause THIS ticket depends on
    > is a different clause of that same criterion** — the four derive spies at 0 — and nothing in the
    > other hop's brief touches it. But `A13` may be split or renumbered, so the dependency is now
    > stated **by content** and the number is given as a locator rather than as the reference. **Nothing
    > in `ABC-016` was read for a ruling, inferred, or edited by this hop, and no message passed between
    > the two: this is a flag for the Orchestrator to re-check after both hops land, not a claim about
    > what the other hop will decide.**
  - **`ABC-017`** supplies `HISTORY_ROWS`; `ABC-016` supplies `STATUS_ROWS`. *(This read **"Neither
    exists in merged `src/` today"** and it is **half false since `ABC-016` merged** — `[D51]`, fifth
    hop, measured: `STATUS_ROWS = 3` is exported from `src/status-panel.ts:71` and the history-pane
    module is still absent. `HISTORY_ROWS = 8` is **`UNKNOWN - verify` at the rebase** — the board
    records that value for `ABC-017` and this hop did not open that ticket to confirm it.)* This loop is
    **built** against fixed-height stub arrays for both panels and **merged** after both. **This loop
    reads neither constant, and after
    `ADR-0009` clause 9 that is a rule and not an accident: there is NO import edge to either panel in
    production or in test, so the project-wide blocking `typecheck` gate stays free of the merge order
    for this ticket too, and the owner's parallel-build directive is structurally supported rather than
    merely intended.** The stub arrays' row counts are constrained by `A18` — **not 3 and not 8**.
    `[C9-3]`
  - **Build order is not merge order here.** This loop was built end-to-end against merged `src/` plus
    two stub panels at this refinement hop, so nothing is blocked on either ticket to *start*.
  - **At the rebase onto the real panels, the re-gate must run this loop's tests against the REAL
    panels — not rebase and re-run against the stubs** (`ADR-0009` clause 9f). Under clause 9 the loop's
    own code is **swap-invariant** — measured: the identical loop passes `A19` unchanged at stub 2/5,
    stub 4/9, real 3/8, real 4/8 and real 3/10 — so what a re-gate is actually testing is the **seam
    wiring**, and only a real-panel run tests that. **Sequencing, and the re-gate itself, is the
    Orchestrator's and QE's: flagged here, not owned here.** `[C9-4]`

    > **[D51 — cl. 9f's re-gate is PARTIALLY DISCHARGEABLE NOW, and the sentence above admits a build
    > that would delete this ticket's only append run. Ruled 2026-08-12 (fifth hop).]**
    >
    > **(1) The swap is now PARTIAL, and partial is not discharge.** The real **status** panel is in
    > merged `src/` (`src/status-panel.ts`, `STATUS_ROWS = 3` at `:71`, read at source at this hop); the
    > **history** pane is not. So the status half of the wiring can be re-gated at the next rebase and
    > **the obligation is NOT closed until `ABC-017` is merged too.** A re-gate that swaps one panel and
    > reports cl. 9f discharged has tested half the seam. **Whoever runs it states WHICH panels were
    > real.**
    >
    > **(2) The re-gate ADDS a real-panel run; it never REPLACES `A18`'s two stub shapes — and this is
    > measured, not a preference.** Read literally, *"not rebase and re-run against the stubs"* invites
    > deleting the stubs, and **that build cannot satisfy `A18` at all**: clause (i) forbids a status
    > count of **3** and a history count of **8**, which is exactly what the real pair is. Worse, it is
    > the landmine clause 9d exists to disarm — **measured here against merged `src/`: the real `3/8`
    > pair assembles to `H` = 23 (≤ 24 → in-place), so a suite with only real panels never exercises the
    > append branch once**, while `A18`'s shape `B` (4/9 → 25) is the only run in the tree that does.
    > **`A18` and `A19` are NOT amended by this note.** Clause 9f asks for a real-panel run **in
    > addition**; the stub shapes are what make the criteria falsifiable and they stay.
    >
    > **(3) The typecheck gate is no longer the thing that stops the loop importing the panels** — see
    > `[D50]`. At the re-gate BOTH panels exist and importing them is exit 0, so the protection is
    > `A18`(i) + `A19`(b), which is precisely why the stub runs must survive the swap. **Nothing is owed
    > to the code by this note; it is an instruction to the re-gate.**
- **`ABC-029` — NEW AND BLOCKING, added 2026-08-11 at the sixth hop (`[D52]`). This ticket cannot go
  GREEN until `ABC-029` lands, and this ticket does NOT own the repair.** The rebase onto merged
  `ABC-017` turned that ticket's two structural instruments in `src/history-pane.nfr.test.ts` RED
  (`:228`, `:275`), because this loop is `src/history.ts`'s first production runtime importer. The
  instruments assert a **whole-tree** invariant that `ABC-029` was already cut to re-scope: its `A1`
  owns *"both derive the set of files they consider from ONE expression"* and *"a **production
  module** is defined, once, in this ticket and at that site"*, and its `## Scope` item 1 is
  literally **define "production module"**. **The turn loop is the same undefinedness arriving from
  the other side**, and it is recorded there rather than half-solved here.
  - **Three measured reasons this repair may NOT be split into this ticket**, so the ordering is an
    argument and not a preference:
    1. **A per-ticket exclusion is the exact defect `ABC-029` exists to remove.** Excluding
       `turn-loop.ts` here writes a **third** hand-maintained filename into the two places `A1`
       forbids literal filenames, and leaves `ABC-029` a partly-done job to finish.
    2. **Narrowing the regex guard's file set here would silently destroy a measured kill.**
       `ABC-029` records `WPERFT-STATIC` as dying on **the regex alone**; its `## Out of scope`
       forbids deleting, replacing or weakening that guard by name. A frame-path narrowing applied
       to the regex removes `perft-bench.ts` from its reach and nothing else catches that form.
    3. **The correct repair is indivisible from `ABC-029`'s `A2`/`A3`.** `A1` demands ONE expression
       for both guards; the regex needs `perft-bench.ts` **in** and the probe needs it **out** until
       the stdout channel is made private. That channel is `A2`, and this ticket cannot satisfy `A1`
       without it.
  - **`ABC-028` should be scheduled BEFORE or WITH `ABC-029`, and that ordering is now load-bearing
    for a reason this ticket created.** Both open `src/history-pane.nfr.test.ts`. `ABC-028`'s `A2`
    makes the false *"may be rebuilt per test freely"* sentence at `src/history-pane.nfr.test.ts:106-112`
    **TRUE** instead of correcting it, so if it lands first **no merged text is edited at all**. If
    `ABC-029` opens that file first, `ABC-028`'s own row records the consequence: the correction
    falls due at three sites and it is **BA/PM's**, not the Engineer's.
  - **This hop OPENED that file and declined the instruction in it.** `RISK-ABC017-01`'s trap was read
    and not acted on: no fixture was rebuilt, no line of `src/history-pane.nfr.test.ts` was written,
    and **this ruling requires nobody to touch those fixtures.** The trigger the risk names is the
    **EDIT**, not the read — a comment that says *"these may be rebuilt freely"* is only dangerous to
    someone who acts on it — so the correction falls due at `ABC-029`'s BUILD hop and not here.
- **`EPIC-006`** supplies the human's colour and the glyph flags. The loop takes them as parameters;
  it is not blocked on `EPIC-006`, because a test supplies them directly.
- **Carried, not owned — `ABC-009`.** The loop calls `legalMoves` **once per ply** through
  `gameStatusOf`, and **twice more per prompt** through the coordinate stub's own `legalMoves` filter
  and the engine seam's legality check — but **zero** times on a non-advancing outcome's re-emitted
  frame. *(Corrected 2026-08-11: this read "once per frame", which the cadence correction `[D5]` makes
  wrong in both directions — frames outnumber plies, and the stub seams add call sites the sentence
  never counted.)* On a well-formed position that is safe; on a semantically-invalid one `legalMoves`
  permanently mutates the board (phantom king). `ABC-009`'s own escalation trigger names this
  exactly: it *"rises to P1 ... if any epic begins accepting a position from outside the rules core
  before `ABC-010` lands"*. **This loop is the runtime that will be executing when `EPIC-003`'s FEN
  entry ships.** Sequencing input for `EPIC-003`'s decomposition; not a new defect and not re-scoped
  here.
- **Carried, not owned — `ABC-011`.** Every repetition verdict this loop renders inherits the
  en-passant hashing defect. Under-detects only: a legitimate draw is missed, a false draw is never
  declared. **After `ABC-020` this now reaches two verdicts and not one:** the automatic
  `fivefold-repetition` (`A12` row 4) *and* the `threefold-repetition` **claim** (`A13`) — a missed
  claim is a right the player silently never gets offered. Still under-detection only, still not this
  ticket's to fix, and it is why `A12`/`A13`'s fixtures must be en-passant-free.

## Security / NFR triggers

> **[RE-DERIVED 2026-08-11 — `[D18]`, `[D19]`. The old bar is quoted and refuted with measurement, not
> replaced quietly. Its ≤ 100 µs @ 120 plies clause is UNCHANGED and is still the number below.]** It
> read: *"loop overhead per ply **≤ 100 µs at 120 plies**, excluding the render, the input wait and the
> engine call … Derivation: one `repetitionCounts` (measured 46–50 µs at 120 plies) plus one
> `gameStatus` (2.52 µs) plus one `playMove` (~10 ns)."* **Two things are wrong with it and both were
> measured at this hop** (own harness outside the repository, its own process, warm-up round discarded,
> 8 usable rounds × 400 iterations, cell order rotated every round, medians of per-round means, the
> game built by `src/history.test.ts:81-89`'s LCG so a ply count means the same thing here and in the
> suite; **Apple M3 / Node v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere**):
>
> | plies | 1 derive/ply | 2 derives/ply | 3 derives/ply | `gameStatusOf` | `repetitionCounts` |
> |---|---|---|---|---|---|
> | 40 | 20.71 µs | 38.81 µs | 56.19 µs | 20.62 µs | 17.67 µs |
> | 120 | **48.34 µs** | **93.58 µs** | 137.13 µs | 48.06 µs | 44.89 µs |
> | 300 | **96.88 µs** | 187.43 µs | 277.56 µs | 94.43 µs | 91.42 µs |
>
> 1. **It cannot catch the wrong build it exists to forbid.** Its own rule is *derive once per ply, not
>    once per call site*. At 120 plies a **two-derives-per-ply** build reads **93.58 µs — MET at
>    0.94x**. The bar only bites at three derives (1.37x). **A timing bar with 2x headroom cannot
>    resolve a 2x error**, which is why the clause that binds is now the spied count in `A3b` — the
>    sixth bar on this project to move off a clock and onto a count.
> 2. **It had ONE ply count for a quantity that is `O(plies)` by construction, and the catalog says so
>    on its own row.** `NFR-002`'s boundary block records `gameStatus + repetitionCounts` at
>    *46–50 µs @ 120 and **97–102 µs @ 300***, and states the quantity *"belongs to the LOOP
>    (`ABC-019`), not to a frame"*. With `gameStatus`'s 2.52 µs that is **99.5–104.5 µs against a
>    ≤ 100 µs bar** — **the CORRECT build is at or over its own bar** at the ply count every other frame
>    ticket on this board measures. This hop's own reading, 96.88 µs = **0.97x**, is inside the **±22%
>    thermal drift on one machine within one hour** that `NFR-008`'s row documents. **The bar was not
>    loosened at the point it was set; two points were added because one point cannot describe a line.**
>    Corroboration that the instrument is sane: `gameStatusOf` reads 20.62 / 48.06 / 94.43 µs here
>    against `ABC-016`'s hop's independently-measured 21.06 / 47.93 / 95.64 — agreement within 1.3%.
>
> **CORRECTION 2026-08-11 (second hop) by BA/PM — point 2's clause *"the CORRECT build is at or over its
> own bar"* is REFUTED, and it was this role's own sentence.** Architect/Design re-measured it at
> `design-stub-seam-and-nfr002` (`20260810T221500Z-architect-design-decision-b40ecd8e`, ruling 2) and
> found two faults, both measured: **(a)** the arithmetic *"with `gameStatus`'s 2.52 µs that is
> 99.5–104.5 µs"* **double-counts `gameStatus`** — `gameStatusOf(history)` **is**
> `gameStatus(history.position, repetitionCounts(history))` (`src/history.ts:152`, read at source), so
> nothing is owed on top of the composite; **(b)** the `97–102 µs @ 300` band it quotes is a **superseded
> wave-1 prototype band** whose 300-ply end is ~7% high — three independent harnesses read 94.43 / 95.29
> / 95.64, all **below** its lower bound. Measured: **95.29 µs @ 300 = 0.95x, MET with 4.7% margin.**
>
> **What survives, which is the half that mattered: point 1.** A two-derives-per-ply build reads
> 93.58 µs @ 120 = **0.94x and MEETS the bar**, so the timing clause cannot catch the wrong build it
> exists to forbid and **`A3b`'s spied count is what binds.** The `O(plies)` point also survives and was
> re-measured (2.33x from 40→120, 1.97x from 120→300), so three ply counts stand. **No bar moves: `≤ 45
> @ 40`, `≤ 100 @ 120`, `≤ 200 @ 300` are all unchanged, and `MET`/`MISS` is Security/NFR's at the gate.**
> The flagged catalog item below is **discharged** by that same hop, and its premise was the part that
> was wrong: the `≤ 100 µs` bar **was never in `plans/nfr-catalog.md`** — that hop's `grep` for `100 µs`
> returned **zero** matches there, so the disagreement was between a ticket and a row and never inside
> the row. **Re-checked at this hop rather than transcribed, and the transcription would have been
> wrong:** that grep now returns **five** matches, and every one of them is that hop's own prose *about*
> the bar (the file's `_Updated:` header, the `NFR-002` row's `Applies to` cell, and the ruling block at
> `plans/nfr-catalog.md:293-298`) — **none is a bar of the row**, which the cell now says in its own
> words: *"THIS IS THE `O(window)` FALSIFIER'S EVIDENCE AND IT IS NOT A BAR OF THIS ROW."* The cell also
> now carries the composite fact (*"`gameStatusOf`, which already contains the `gameStatus` call"*) and
> the measured triple 20.8 / 48.3 / 95.3 µs, so the row and this ticket agree.

- `NFR-002` (16 ms frame) — **bar, three clauses, all measured at 40 / 120 / 300 plies with the
  instrument above and recorded with its machine:**
  - **Loop overhead per ply ≤ 45 µs @ 40 plies, ≤ 100 µs @ 120 plies, ≤ 200 µs @ 300 plies**,
    excluding the render, the input wait and the engine call. Today: **0.46x / 0.48x / 0.48x** —
    deliberately uniform, and the 120-ply clause is the ticket's original number untouched.
  - **`A3b`'s spied counts are the clause that BINDS:** `gameStatus` exactly **`plies + 1`** times,
    `repetitionCounts` exactly **0** at the module boundary, and exactly **zero** additional evaluations
    on a non-advancing prompt outcome — see `[D32]`, which repaired both counts. Derivation of the
    per-ply figure: one `repetitionCounts` + one `gameStatus` + one `playMove` (measured 8.2–8.6 ns at
    `ABC-012`'s gate, ~0.02% of the budget — the ticket's "~10 ns" was `makeMove`'s figure and it
    stands) **+ one `legalMoves(history.position)` on every ENGINE ply, which `A10`'s legality check
    forces and which this derivation omitted until 2026-08-11 (third hop), `[D36]`.** The engineer's
    out-of-tree run reads **27.23 / 58.79 / 112.86 µs** marginal at 40 / 120 / 300 plies against this
    hop's one-derive-per-ply figures of 20.71 / 48.34 / 96.88, and the gap — roughly 6.5 / 10.5 / 16 µs,
    about half a ply's worth amortised — **has that missing term as its named cause.** **NO BAR MOVES
    AND NONE IS PROPOSED:** the marginal readings are **0.61x / 0.59x / 0.56x** of `≤ 45 / ≤ 100 /
    ≤ 200`, and `MET`/`MISS` is Security/NFR's at the gate. What was wrong was the derivation's
    completeness, not its conclusion.
  - **The loop is the ONLY place the repetition derive may live.** `NFR-002`'s row voids its own
    `O(window)` statement *"if a renderer ever pulls the repetition derive into a frame"*; `ABC-016`'s
    `A13` spies the panel at 0 derives and this ticket's render-seam contract is the other half.

    > **[D52 — 2026-08-11 by BA/PM at task `abc019-rebase-2026-08-12`, subtask `refinement-ABC-019-a11`
    > (Workflow 07). THE REBASE MADE THIS BULLET COLLIDE WITH A MERGED TICKET'S CRITERION, AND THE
    > COLLISION IS RULED IN THIS BULLET'S FAVOUR. NO CRITERION OF THIS TICKET MOVES, NO PRODUCTION LINE
    > IS OWED, AND `src/turn-loop.ts` IS NOT TO BE CHANGED.]**
    >
    > `src/turn-loop.ts:52` imports `./history.ts` at runtime, so **`ABC-019` is this project's FIRST
    > production runtime importer of `src/history.ts`** — re-derived at this hop with `A11`'s own regex
    > over the 17 non-test `.ts` files in `src/`: **exactly one match, `src/turn-loop.ts`.** That turns
    > `ABC-017`'s two structural instruments in `src/history-pane.nfr.test.ts` RED (`:228` and `:275`),
    > and the full suite reads **2 failed / 789 passed on 28 files, skip 0**, re-run here and identical
    > to the figures the rebase hop recorded.
    >
    > **`NFR-002`'s premise is NOT dead, and that is a MEASUREMENT rather than a reading of this
    > bullet.** The premise this row states in its own words is scoped to **a renderer** and **a
    > frame** — *"the quantity belongs to the LOOP (`ABC-019`), not to a frame"*. Probed at this hop
    > with the same `module.registerHooks` technique the merged probe uses, rooted at the five
    > renderer modules (`frame.ts`, `render.ts`, `history-pane.ts`, `status-panel.ts`,
    > `glyph-mode.ts`): the render closure is **11 modules** — `apply`, `fen`, `frame`, `glyph-mode`,
    > `history-pane`, `legal`, `moves`, `position`, `render`, `san`, `status-panel` — and
    > **`history.ts` is NOT among them.** **The zero is not a blind zero:** the same probe rooted at
    > `turn-loop.ts` DOES report `history.ts`, so the instrument sees what it should. And
    > **nothing in `src/` imports `turn-loop.ts`** (`grep` = 0), so the loop is not reachable from a
    > frame's assembly by any path. `NFR-002`'s `O(window)` statement stands, unweakened.
    >
    > **What died is `A11`'s PROXY for that premise, not the premise.** *"Zero runtime importers among
    > the production modules"* was a sound stand-in for *"no renderer pulls the derive into a frame"*
    > only while every production module in `src/` was either the rules core or a renderer. This ticket
    > adds the first that is neither: a driver that **`ADR-0002` clause 4 requires** to hold the single
    > `positionCounts` supplier (`gameStatusOf`, `src/history.ts:152`), which is `A3`'s own named
    > contract. **A reading of `A11` that forbids this import forbids the build the architecture
    > mandates**, so it is not a live reading.
    >
    > **Six of `A11`'s eight tests still PASS**, including the whole spied-call-count table the merged
    > ticket calls *"the clause that binds"*. Only the two whole-tree structural instruments are red.
    >
    > **Ownership: the instruments are `ABC-029`'s and NOT this ticket's** — see `## Dependencies`.
    > **`ABC-017` is `Done`, `A11` was MET at its gate and is not re-opened, not moved and not
    > edited**; `ABC-029`'s own `## Out of scope` already rules it *"discharged and does not move"*.
  - **`ADR-0009` clause 9 moves NOTHING on this row and that is explicit** (`[C9-5]`). The frame's row
    count is unchanged, the write half's *"23-row frame at `W = 18`, 418 characters serialized"*
    denominator is untouched, the `< 16 ms` target does not move, and none of the three ply-count
    clauses above is edited. What clause 9 adds is a **second place a row-count change becomes
    discoverable** — this loop's own gate, via `A18`/`A19`, alongside `ADR-0009` clause 5's fit-check in
    `src/frame.test.ts`. The two prove different propositions and neither substitutes for the other:
    clause 5 proves the real panels compose to a frame that fits; `A19` proves the loop's session height
    is the frame the loop actually assembles.
- **`NFR-008` / `N8-LANE` — inherited, not re-derived (`[D20]`).** The tests this ticket adds may cost
  at most **5% of `NFR-008`'s TOTAL = ≤ 650 ms CPU** while the CPU clause is 13 s — **not** 5% of the
  lane as it stands — CPU (user + sys) of the default lane, median of paired per-round deltas over
  n ≥ 7 interleaved rounds with an identity null control reading ≤ 1.5%, **net of 160 ms CPU per test
  file added**, every figure with its machine. Wording and owner: `plans/nfr-catalog.md`
  § *The standing per-ticket lane bar*; **owner BA/PM at each cut**, which is why it is stated here
  rather than left to be inherited silently. **This ticket is the largest test surface in `EPIC-002`** —
  13 scripted-game table rows plus the spy and NFR tests — and at **159–179 ms CPU per test FILE**
  against a 650 ms allowance the **file count is the whole risk**, not the test count. Today's lane:
  676/676 on 22 files, 1.49 s wall. **`A18` and `A19` add no test FILE** — the `vi.mock` clause (b)
  needs belongs in the file `A3b`/`A7b`'s spies already require, for the reason merged
  `src/gameend.nfr.test.ts:12-14` states in its own words (*"a `vi.mock` factory is hoisted to file
  scope"*), and the second stub shape is **two integer literals** over the harness shape `A` already
  builds. **The inherited allowance is unchanged and nothing here re-derives it.** `[C9-5]`
- `NFR-004` (engine ≤ 3 s, hard ceiling 5 s) — **`EPIC-004`'s target, not this ticket's, and therefore
  NOT a bar this ticket is measured against.** What binds here: **the engine seam is asynchronous by
  contract**, not because the engine is I/O-bound (it is pure CPU) but because a loop shaped around a
  synchronous call cannot later accept a yielding or worker-based engine without being rewritten, and
  `NFR-004` permits a 3-second occupancy. **Assertion: `A15`** — the contract had no criterion until
  2026-08-11 (`[D17]`), and it is the one constraint here that cannot be retrofitted.
- **No `Position` reference is held across a suspension.** The loop suspends at exactly two places —
  waiting on stdin and waiting up to 3 s on the engine — and **both bracket a mutation**: the search
  descends with `makeMove`/`unmakeMove` on the live object, and `GameHistory.position` is documented
  **BORROWED, never a snapshot** (`src/history.ts:39-44`). Anything captured before a suspension and
  read after it is a bug. The only value-snapshot primitive that exists is `toFen(position)`.
  **Bar: `A16`** — a seam that mutates while suspended, and a frame that must match the position at
  that moment rather than a pre-suspension capture. *(`[D16]` — the previous wording, "every rendered
  value is re-read from the live object at that moment", is a code-review property and cannot fail a
  test.)*
- **No security trigger of its own.** The loop places strings; `ABC-018` sanitizes them.

## Test notes

The loop is testable end-to-end **today**, with no parser and no engine, because both stubs are
built from merged code. That is the point of the stubs.

- **Drive scripted games through the stub seams — EIGHTEEN rows, each with an exact expected terminal
  reason (or none) and an exact frame count.** *(Thirteen until `[D31]` added row 14 at the third
  2026-08-11 hop; **fourteen until the fourth hop added rows 15–18** for `[D40]`, `[D43]`, `[D42]` and
  `[D46]`.)* **Row 18 is the one row whose Expected is a SCREEN property rather than a terminal
  reason, and it is the only one blocked on another ticket.** *(**[CORRECTED 2026-08-11 — `[D25]`.]** The list read
  *"a mate line, a **threefold** line, a stalemate line, a **fifty-move** line, an insufficient-material
  line …"*, and after `ABC-020` **two of those terminate nothing** while the two that do were missing.
  A row whose "exact expected terminal reason" does not exist is a row that will be made to pass by
  changing the loop.)*

  | # | Row | Expected |
  |---|---|---|
  | 1 | mate line (Fool's mate) | `black-wins` / `checkmate`, exit 0 |
  | 2 | stalemate line | `draw` / `stalemate` |
  | 3 | insufficient-material line — **the capture must be the ply that makes it dead; see the fixture rule below** | `draw` / `insufficient-material` |
  | 4 | **fivefold** repetition line | `draw` / `fivefold-repetition` — **on the fifth occurrence** |
  | 5 | **75-move** line | `draw` / `seventy-five-move` |
  | 6 | **third** repetition, play on | **no terminal state**; `claimable.draws` = `["threefold-repetition"]` |
  | 7 | halfmove clock **100**, play on | **no terminal state**; `claimable.draws` contains `fifty-move` |
  | 8 | rejected input | no ply, `toFen` byte-identical, 0 evaluations, +1 frame |
  | 9 | ambiguous input (any promotion) | as row 8, plus the candidate list in the message region |
  | 10 | `board` redraw | as row 8 |
  | 11 | EOF | *input ended* notice, exit 0, **no** terminal result |
  | 12 | engine throw **inside a `makeMove` bracket** | position repaired by `takeBack(history, 0)`, named reason |
  | 13 | engine returns a foreign move | not applied, `moves.length` unchanged, engine-failure reason |
  | 14 | **input** seam throws **inside a `makeMove` bracket** (`[D31]`, `A9b`) | position repaired by `takeBack(history, 0)`, **the exception propagates** — no `LoopOutcome`, no reason, no exit-0 path, **and zero render calls and zero sink writes between the throw and the rethrow** (`[D41]`, `A9b`(iv)) |
  | 15 | **prompt-driven `game-over`** (`[D40]`, `A8b`) — run **twice**, with two distinct `(result, reason)` pairs | the seam's own `result` and `reason` returned **unaltered**, exit 0; **1 frame**; both seams called **0** times afterwards; **no** *input ended* notice and never `{null, null}` |
  | 16 | **already-terminal START** — `1k6/8/8/8/8/8/1K6/2n5 w - - 0 1`, K+N vs K, **six legal moves available** (`[D43]`, the witness `A3b`'s `+ 1` claimed and did not have) | `draw` / `insufficient-material` **on the INITIAL evaluation**; **1 frame, 0 plies, 0 input calls, 0 engine calls**; `gameStatus` spied at **exactly 1** = `N + 1` at `N = 0` |
  | 17 | **input** seam returns a move **not in `legalMoves`** (`[D42]`, `A10b`) | **not applied** — `moves.length` unchanged and `toFen` byte-identical — **the exception propagates**: no `LoopOutcome`, no reason, **`engine-failure` NOT reused**, `A14` unchanged, zero render calls and zero sink writes |
  | 18 | **a played game containing a NARROWING**, replayed into a local screen model at 80 columns **and** at `W`(frame 1) (`[D46]`, `A20`) | after **every** redraw the **screen equals the frame**, trimmed. **BLOCKED on `ABC-027`: RED until it merges, and written at the rebase with `ADR-0009` cl. 9f's real-panel re-gate — not before** |

- **Both stubs are buildable from merged code alone and that was verified rather than assumed at the
  2026-08-11 refinement.** The coordinate reader is a `legalMoves` filter on
  `squareName(m.from) + squareName(m.to)` (`src/position.ts:60`, exported) — **11 lines**; the engine
  stub is a seeded LCG index into `legalMoves` — **9 lines**. Measured on
  `7k/4P3/8/8/8/8/8/K7 w - - 0 1`, the token `e7e8` yields **exactly 4** candidates with identical
  `from`/`to` (`addPromotions`, `src/moves.ts:88-98`), so **`ambiguous` is reached for free**; an
  unmatched token yields `rejected`. Both of the ticket's stub claims hold.
- **Two panel stub shapes, and the fourteen rows above run under shape `A` only** (`A18`, `[C9-1]`).
  Shape `A` (status 2 / history 5 → `H` 19) is the default for every scripted-game row, because any
  hardcoded height is then RED on the whole table rather than in one test. Shape `B` (status 4 /
  history 9 → `H` 25) is needed **once**, for `A19` plus the append-path clause — the 14 rows are not
  re-run under it, since the frame count and the terminal verdict were measured **identical under every
  shape** (14 frames for 12 plies + 1 non-advancing outcome) and re-running them would buy nothing and
  spend `N8-LANE` budget. **Neither shape is 3/8, and that is `A18`'s clause (i), not a preference.**
- **The stub panels live in the test file, never under `src/`** (`ADR-0009` clause 9c). Merged
  `src/frame.test.ts:55-78` is the shape to copy — `statusStub` / `historyStub` as local functions.
  Those two are `ABC-018`'s own fixtures at 3/8 and stay exactly as they are; this ticket adds its own
  and does not touch that file.
- **Row 3's obvious fixture is a TRAP and loses the ply — the position before the capture must still be
  in progress.** *(**[ADDED 2026-08-11 (third hop) — `[D35]`, from the build, and re-verified at source
  here rather than transcribed.]** The obvious line is *"White captures the last black piece, leaving
  K vs K"* — but then the position **before** the capture is K+N vs K, which is **already** a dead
  position: `isInsufficientMaterial` returns true at `minors <= 1` (`src/gameend.ts:98-119`, and one
  knight is one minor). Built and run: the loop stopped on the **initial** evaluation with the right
  result and the right reason, rendered **one** frame, and **never played the ply** — a row that passes
  its reason assertion while testing nothing. Give Black **two** knights (the delivered fixture is
  `1k6/8/8/8/8/8/1K6/2n4n w - - 0 1`) so the capture is the ply that makes the position dead. **The
  frame count is the clause that tells the two apart — 2, not 1** — which is this ticket's own argument
  for asserting counts rather than final frames, and it is why `A3b`'s `+ 1` initial evaluation is
  load-bearing rather than bookkeeping. **This is a trap under the ticket, not a defect in it; it is
  written down so the next person to touch that fixture does not walk into it.**)*
- **Row 16 is the position row 3 STOPPED being, and BOTH rows are needed — this is `[D43]`, and two
  rows are why it will not recur.** `[D35]` was right to take the already-dead start **out** of row 3,
  whose job is to prove the **capture is the ply that kills the game** (frame count **2**). `[D32]`
  was right that the `+ 1` needs an already-dead start as its witness. **The mistake was believing one
  row could be both**, and the fix is two rows that differ by one knight:
  `1k6/8/8/8/8/8/1K6/2n4n w - - 0 1` (row 3 — **two** knights, starts in progress, 2 frames) and
  `1k6/8/8/8/8/8/1K6/2n5 w - - 0 1` (row 16 — **one** knight, already `{draw,
  insufficient-material}` because `isInsufficientMaterial` returns true at `minors <= 1`, 1 frame).
  **Both measured at this hop against the delivered build.** Row 16 must keep **legal moves
  available** (the named fixture has six) — a fixture with none is a stalemate fixture and tests a
  different branch.
- **Adding rows 15–18 does NOT disturb `A12`'s enumeration guard, and that was checked rather than
  assumed.** `A12`'s second half asserts the table **declares a row for each** of the five automatic
  terminal values — an **existence** check over declarations, **not a uniqueness check and not a row
  count**. Rows 1–5 stay the five named fixtures; row 16 is a **second** `insufficient-material` row
  and takes nothing from row 3. **A later hop that rewrites that guard as "exactly one row per value"
  would break this, and must not.**
- **Row 18's narrowing must come from a PANEL row, and the screen model is LOCAL to this file.** `W`
  is the max over the **panel** rows only — the message region is bounded by `W` and cannot widen it
  (`src/frame.ts:176-179`) — so a fixture that varies `messages` narrows **nothing** and `A20` would
  pass vacuously. A stub whose status panel's widest row **shrinks** between two frames is the shape.
  Merged `src/frame.test.ts`'s `createScreen` (`:190`) is **not exported**, and **this ticket does not
  touch that file**, so the model is written locally here on `ADR-0009` clause 9c's precedent — and it
  must **throw on any escape it does not implement**, which is the property that makes it evidence
  rather than decoration.
- **`N8-LANE` does not move on any of this, and the reason is the FILE count.** Rows 15–18 are four
  rows in the **existing** table-driven file, and `A20`'s screen model rides in the file `A19`'s
  `vi.mock` already requires. **ZERO new test FILES.** At 159–179 ms CPU per file against a 650 ms
  allowance, with the delivered lane chargeable at **420 ms = 0.65x**, **a fifth file is what would
  breach the allowance — not a fifth hundred assertions.** Inherited, not re-derived (`[D20]`).
- **Rows 4, 6 and 9's fixtures must never set an en-passant square**, for the same reason `ABC-012`'s
  do not — `ABC-011` would otherwise make them fail for a reason that is not this loop's.
  `src/gameend.test.ts`'s knight cycle (`function knightCycles`, lines 26-50) is the shape to reuse:
  each 4-ply cycle returns to the exact start position, so *n* cycles make *n + 1* occurrences.
- **Assert the call *order* inside a ply, not just the outcome.** Append-then-evaluate versus
  evaluate-then-append produces the same result on every position except the one that completes a
  repetition, which is exactly the case a happy-path test does not contain.
- **Assert the frame *count*, not just the final frame** — `1 + plies + re-emitting non-advancing
  outcomes`, and **end-of-input adds none** (`A2`, `[D29]`). A loop that renders twice per ply passes
  every content assertion; so does one that emits a frame on EOF, until the count is exact.
- **Assert what happens AFTER the terminal status is computed** (`A7b`), by spy. This is the only
  assertion that catches a loop whose exit test is one ply stale, and such a loop passes `A7`.
- **Do not test the real engine's timing here.** `NFR-004` belongs to `EPIC-004`; the stub's delay
  exists to exercise the thinking state and `A15`'s macrotask boundary, and quoting a number from it
  would be a fabricated measurement.
- **Watch the FILE count, not the test count** (`N8-LANE`): at 159–179 ms CPU per file against a
  650 ms allowance, this ticket's fourteen rows belong in **one** table-driven file wherever they can.
- **Do not test the real engine's timing here.** `NFR-004` belongs to `EPIC-004`; the stub's delay
  exists to exercise the thinking state, and quoting a number from it would be a fabricated
  measurement.

## Size and priority rationale

**Size `L` (5) — RE-DERIVED 2026-08-11 and UNMOVED.** Eight states, **fifteen transitions now
enumerated**, two stub seams, a load-bearing intra-ply ordering, exception recovery, and a
terminal-reason type that must be a superset of the core's. It is the only ticket in this epic that
touches every other component. Calibrated against `ABC-004` (special moves, `L`) — comparable in test
surface, and like that ticket it is `L` for the number of distinct cases rather than the volume of
code: **18 table rows, 27 labelled criteria (`A1`–`A20`, SEVEN of them sub-lettered), one module.**
*(Counts refreshed at the fourth hop — 14/23 with four sub-letters before it. The calibration
argument against `ABC-004` is unchanged; only the counts moved.)*

**What the refinement added and removed, so the unmoved size is an argument and not an assertion:**

- **Added:** four criteria (`A1b`, `A3b`, `A7b`, `A15`) — three of them **spied call counts**, which
  cost a shared harness and not new production code — plus two more ply counts on the NFR bar.
- **Removed:** `A4`'s terminal threefold path, which **cannot be built at all** (there is no such
  `EndReason`); the terminal-reason type's open design question, **settled by merged `ABC-020`** rather
  than deferred to a design hop; and the invented replay recovery, now **one existing call**,
  `takeBack(history, 0)`.
- **Net: those cancel**, and the direct evidence is that the whole loop plus both stubs plus a
  wrong-build matrix was built against merged `src/` **in one pass at this refinement hop** — the
  volume is not the driver, the case count is.

**Not `XL`, and here is what was kept out to hold that line:** frame output and the redraw model
(`ABC-018`, 2 points) and the history module (`ABC-012`, 3 points) are separate tickets — both now
merged. `ABC-021`'s claim outcome (2 points) is out. Folding any of them back in makes this `XL` (8)
and an automatic `SPLIT_REQUIRED`.

**The re-sizing condition is DISCHARGED, in the direction that keeps the size.** It read *"re-size at
the design hop if the stubs turn out to need more than merged `src/` provides"*. Both stubs were built
from merged code alone at this hop — the coordinate reader in **11 lines** over `legalMoves` +
`squareName`, the seeded engine in **9** over `legalMoves` — and the recovery primitive turned out to
be merged too. Wave 1's claim is confirmed by construction, not carried forward.

**Priority `P0`, unmoved.** There is no game without it, it is the last unbuilt ticket in `EPIC-002`'s
loop lane, and it is the only component that touches the renderer, the rules core, the history, the
input seam and the engine seam at once. **It merges last, behind a `P1` and a `P2`** — a build-edge
consequence recorded at this task's scheduling hop, not a change in value.

**RE-DERIVED AGAIN 2026-08-11 for `ADR-0009` clause 9: `L` (5) HOLDS, still not `XL`, still no
`SPLIT_REQUIRED`.** The amendment is costed rather than waved through, and it is small in three
directions at once:

- **Production:** the height line the loop was always going to need becomes `firstFrame.length` instead
  of a literal, and `beginFrameSession` is called once. **Zero new modules, zero new call sites** — the
  loop had to write frames to satisfy `A2` at all. Clause 9 makes the loop *smaller*: it removes an
  arithmetic call (`frameHeight`) and two would-be imports.
- **Test:** two integer literals for shape `B`, four assertions in `A19`, and **no new test FILE** — the
  one clause needing `vi.mock` belongs where `A3b`/`A7b`'s spies already are. `N8-LANE`'s binding risk
  is the file count and the file count does not move.
- **Risk:** it *reduces* the unestimated risk an `L` is allowed to carry, because the failure it forces
  into this ticket's own gate was otherwise deferred to a rebase where nothing re-checks it.

**`XL` (8) is still exactly one thing away and that has not changed:** folding in `ABC-021`'s claim
outcome, `ABC-018`'s frame output or `ABC-012`'s history module. Two criteria over an existing harness
is not that.

**RE-DERIVED A THIRD TIME 2026-08-11 for the seam ruling: `L` (5) HOLDS, still not `XL`, still no
`SPLIT_REQUIRED` — and `P0` HOLDS.** This hop ruled on nine items and costed them rather than waving
them through. **Eight are text-only and cost nothing.** The one that touches code is `A9b`:

- **Production: one `try`/`catch` around the existing input `await`, repairing with the same
  `takeBack(history, 0)` call the engine path already makes and re-`throw`ing.** Zero new modules, zero
  new imports, zero new terminal-reason values, **no new seam and no signature change** — `A9b` was
  always inside the sentence `## Scope` already carried. `[D28]`'s fourth seam argument costs **nothing
  at all**: it is already built, and the amendment moves the ticket to the code rather than the code to
  the ticket.
- **Test: one row in the existing table-driven file** (row 14) over the fixture shape `A9`'s
  mid-bracket throwing stub already provides. **No new test FILE**, so `N8-LANE`'s binding risk — the
  file count, measured at 159–179 ms CPU per file against a 650 ms allowance — **does not move**. The
  delivered lane's chargeable figure is **420 ms against 650 ms = 0.65x** with two files added, and
  this hop adds none.
- **Risk: it goes DOWN.** `A9b` closes a corruption path the ticket had promised in prose and never
  asserted, which is the kind of unestimated risk an `L` is not supposed to carry.

**Nothing was folded in.** `ABC-021`'s claim outcome, `EPIC-003`'s parser and `EPIC-004`'s engine are
all still out, and `A9b` deliberately does **not** decide whether a parser crash ends the game — that
question is handed on rather than answered here, which is what keeps this a skeleton. **Priority `P0`
is unmoved for the reasons above: the value did not change, only the text's fidelity to it.**

**RE-DERIVED A FOURTH TIME 2026-08-11 for QE's eight gaps and `ADR-0010`'s two owed items: `L` (5)
HOLDS, still not `XL`, still no `SPLIT_REQUIRED` — and `P0` HOLDS.** Eleven rulings, costed rather
than waved through. **Ten are text-or-test-only. One touches production, `[D42]`/`A10b`:**

- **Production: one `legalMoves` membership check on the input path, over the six-field comparison
  the engine path already runs at `src/turn-loop.ts:264-272`, plus a throw.** Zero new modules, zero
  new imports, **zero new terminal-reason values — `A14` untouched** — no new seam and no signature
  change. It is the same shape and the same size as `A9b` at the previous hop, and it lands beside it
  in the same `try` block's neighbourhood.
- **Test: FOUR rows in the existing table-driven file (15–18) and one local screen model. NO new test
  FILE**, so `N8-LANE`'s binding risk — the file count, 159–179 ms CPU per file against a 650 ms
  allowance, delivered lane chargeable at **420 ms = 0.65x** — **does not move.** The added assertions
  for `A5b`, `A6`'s message clause, `A9b`(iv) and `G-7`'s `A11` half are all one `expect` each on
  fixtures already in the file.
- **Risk: it goes DOWN, and by more than at any previous hop.** `A10b` closes a **board-corrupting**
  path — measured, not hypothesised — that no criterion mentioned; `A8b` closes the only branch in the
  module with no test coverage at all; `A5b`, `A9b`(iv) and `A6`'s clause each close a
  player-visible failure that shipped green. **Nine places where a wrong build was indistinguishable
  from the right one are now distinguishable.**

**The criterion count grew 23 → 27 and the table 14 → 18, and that is NOT what `XL` measures here.**
This ticket's `XL` trigger has been the same at all four hops and is unchanged: **folding in
`ABC-021`'s claim outcome, `ABC-018`'s frame output or `ABC-012`'s history module.** None of them is
folded in. `A20` explicitly does **not** fold in `ABC-027` — the production line stays in that
ticket, and what lands here is an assertion. **`A10b` deliberately does NOT decide whether a parser
bug ends the game**, which is the same line `A9b` drew and the same reason this stays a skeleton.

**And splitting was considered rather than dismissed, because `A20` is the one plausible candidate.**
It is blocked on `ABC-027`, so a reader could argue it belongs in a follow-up ticket that merges
after. **Rejected: `ADR-0010` clause 7 assigns it here and says why — like `ADR-0009` clause 9e, this
is THE ONLY PLACE THE PROPERTY IS CHECKED AT ALL.** Splitting it out would defer the only check of a
defect the ADR measured surviving **17 consecutive frames**, and would make it the sole content of a
ticket that cannot start until two others merge — *"a ticket only a long chain delivers is two tickets
hiding"*, in the direction that creates the chain rather than removing it. **`ABC-019` already
rebases onto `ABC-027` before its final gate**, so the criterion costs no extra sequencing.

**One honest caution, recorded because four amendments is a lot.** This ticket has now been amended
four times and returns to `In Development` a second time. Every hop's added scope has been an
assertion over an existing harness plus, twice, a single guard around an existing call — and the size
has held for that reason each time. **A FIFTH hop that adds production scope beyond one guard should
re-derive size against `SPLIT_REQUIRED` seriously rather than by precedent.** The trigger is named so
the next reader does not have to infer it.

**RE-DERIVED A FIFTH TIME 2026-08-12 for the `[D27]` sentence repair and what `ABC-016`'s merge
invalidated: `L` (5) HOLDS, still not `XL`, still no `SPLIT_REQUIRED` — and `P0` HOLDS.**

**The tripwire above was armed and is answered directly rather than stepped around. It did not fire,
because this hop adds ZERO production scope — not "one guard", none:**

- **Production: nothing.** No criterion is added, amended, renumbered or deleted; the count stays
  **27** and the table stays **18 rows**. Three defects (`[D49]`, `[D50]`, `[D51]`) are all text, and
  the delivered build satisfies every criterion it satisfied before this hop opened. `src/` is
  byte-untouched.
- **Test: nothing.** No new file, no new row, no new assertion. `N8-LANE`'s binding risk is the file
  count and the file count does not move — **the delivered lane is 758/758 on 26 files, and it grew
  from 723/723 because `ABC-016` MERGED, not because this ticket added anything.**
- **Risk: DOWN, slightly, and in one specific place.** `[D50]` and `[D51]` remove a protection this
  ticket believed it had for free. The IMPORTED form was being held out by a compiler error that
  **expires before this ticket merges**, and the re-gate sentence admitted a swap that would have
  dropped the only append-branch run in the tree. Both are now named, so neither is discovered at the
  rebase — which is the one hop where nothing re-checks it.

**`XL` (8) is still exactly one thing away and this hop moved nothing toward it:** folding in
`ABC-021`'s claim outcome, `ABC-018`'s frame output or `ABC-012`'s history module. **`SPLIT_REQUIRED`
was tested against the real question rather than the precedent** — *is there a second ticket hiding
here?* The candidate would be *"re-gate against the real panels"*, and it is **not** a ticket: it has
no criterion of its own, produces no artifact, and is a **gate step on this ticket's own criteria**
(`A18`/`A19`/`A20`) that `ADR-0009` cl. 9f already assigns here. Cutting it out would create exactly
the chain the `INVEST` rule warns about — a ticket that cannot start until three others merge and
whose whole content is re-running someone else's suite.

**Priority `P0`, unmoved, and for once the argument is not merely repeated.** This hop changed the
text's fidelity, not the value. The one thing that could move priority — `ABC-016` merging — moves
**readiness**, not value: it shortens the chain in front of this ticket without changing that there is
no game without the loop.

**RE-DERIVED A SIXTH TIME 2026-08-11 for the `A11` collision (`[D52]`): `L` (5) HOLDS, `P0` HOLDS, and
`SPLIT_REQUIRED` was tested against the real question rather than against the precedent — because the
standing tripwire named at the fourth hop was ARMED for exactly this shape of hop.**

**The tripwire's own words are** *"a FIFTH hop that adds production scope beyond one guard should
re-derive size against `SPLIT_REQUIRED` seriously rather than by precedent"*. **This is the sixth hop
and the tripwire is answered on its own terms, not stepped around:**

- **Production scope added: ZERO, and this is the strong form of zero.** No criterion is added,
  amended, renumbered or deleted — the count stays **27** and the table stays **18 rows**. No guard,
  no `try`/`catch`, no membership check, no import. **`src/turn-loop.ts` is byte-identical across the
  rebase and this hop** (md5 `bd793612…`, asserted here against the rebase hop's own record). **The
  ruling's whole content is that the delivered loop is CORRECT and must not be changed** — the
  opposite of adding scope.
- **Test scope added: ZERO.** No new file, no new row, no new assertion. `N8-LANE`'s binding risk is
  the file count and the file count does not move. The suite grew 758 → 791 on 26 → 28 files because
  **`ABC-017` and `ABC-027` merged**, not because this ticket added anything.
- **Risk: DOWN in one place and UP in another, and both are stated.** DOWN, because a criterion
  collision that would otherwise have been discovered at the merge is now named with an owner. UP,
  because this ticket is **RED and cannot merge until a ticket it does not own lands** — which is a
  scheduling exposure, recorded in `## Dependencies` rather than smoothed.

**`SPLIT_REQUIRED` — the verdict, and the candidate was real this time.** The `XL` trigger has been
the same at six hops and none of it moved: folding in `ABC-021`'s claim outcome, `ABC-018`'s frame
output or `ABC-012`'s history module. But the honest test is not the number — **it is whether a second
ticket is hiding here**, and at this hop **one was, and it was found, and it is NOT this ticket.** The
candidate is *"re-scope `NFR-002`'s structural guards so they measure the frame path rather than every
non-test file"*. It has its own user (`NFR-002`), its own value independent of this loop, its own file
(`src/history-pane.nfr.test.ts`, which this ticket does not otherwise touch), and its own open design
question. **It is already a ticket — `ABC-029` — cut 2026-08-12 before this collision was visible.**
So `SPLIT_REQUIRED` does **not** fire on `ABC-019`: the split already happened, and this hop's job was
to route to it rather than to absorb it. **Absorbing it is what would have made this ticket bigger,
and it was refused for three measured reasons** (`## Dependencies`, `ABC-029` bullet).

**Priority `P0` HOLDS, and the uncomfortable consequence is stated rather than hidden.** This `P0` now
merges behind a `P1`, a `P1` and a `P2`-promoted-to-`P1` — that is one more than the previous hop
recorded, and it is a **build-edge fact, not a value change**: there is still no game without the
loop. **What DOES move is `ABC-029`'s priority, and that is BA/PM's to move and is done at this hop:
`P2` → `P1`**, because its own `P2` derivation rests on the sentence *"Production runtime importers
are zero, measured"* and that figure is now **ONE**, measured here.

## Definition of Ready

> **The block below is the 2026-08-11 re-check. The version it replaced read every item ✅ and 25
> defects were found behind it — five witnessed by wrong builds and one by `tsc`. The lesson is
> recorded rather than the ticks re-typed: a ✅ on "acceptance measurable" means the criteria were
> RUN, against a build built to break them, and not that they contain numbers.**

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 1 | problem clear | ✅ | user, pain and value stated; unchanged at this hop |
| 2 | scope + out-of-scope | ✅ | pseudocode corrected (`[D9]`), cadence corrected (`[D5]`/`[D6]`), 15 transitions enumerated (`[D11]`), `ABC-021` boundary settled one-directionally (`[D12]`) |
| 3 | INVEST | ✅ | **built end-to-end at this hop** against merged `src/` plus two stub panels — independent, estimable and testable by construction |
| 4 | acceptance testable + measurable | ✅ | 17 criteria; **8 repaired, 4 added**; `A4` was UNSATISFIABLE and is now satisfiable; every fixture run |
| 5 | dependencies known | ✅ | four stale entries corrected (`[D21]`); `ABC-016`/`ABC-017` added, `ABC-016` as a **correctness** dependency (`[D22]`); merge order recorded |
| 6 | NFR triggers, each measurable | ✅ | `NFR-002` re-derived at 40/120/300 with a spied count as the binding clause (`[D18]`/`[D19]`); `N8-LANE` inherited (`[D20]`); `A15`/`A16` now assertions |
| 7 | test notes | ✅ | 13 enumerated rows replacing a list with two impossible entries (`[D25]`) |
| 8 | size | ✅ | `L` (5), re-derived, re-sizing condition discharged |
| 9 | priority | ✅ | `P0`, re-derived |
| 10 | no major unresolved blocker | ✅ | **every hard dependency is MERGED** — `ABC-012`, `ABC-014`, `ABC-018`, `ABC-020`. The `ABC-016` → `ABC-017` → `ABC-019` constraint is a **merge** order, not a start blocker, and both sit in `Ready` |

**PROMOTED `Backlog` → `Ready` on 2026-08-11 by BA/PM** (task `frame-merge-order-2026-08-11`, subtask
`refinement-ABC-019`). The board move itself is the Orchestrator's; this is the DoR exit that
authorises it.

### DoR re-check 2026-08-11 (second hop) — the `ADR-0009` clause 9 amendment only

The table above is not re-typed: **six items were untouched by clause 9 and are not re-claimed on their
behalf.** Four items were re-checked because the amendment reaches them, and only those four:

| # | Item | Verdict | What changed, and the evidence |
|---|---|---|---|
| 2 | scope + out-of-scope | ✅ | one bullet added (the seam returns rows, the loop writes them, `H` = `firstFrame.length`, `[D27]`); the *"Frame content and writing"* out-of-scope line disambiguated (`[D26]`) — both witnessed by builds that satisfied the old text and could not satisfy clause 9 |
| 4 | acceptance testable + measurable | ✅ | **19 criteria** (was 17). `A18` and `A19` added; **each of `A19`'s four clauses is witnessed by a wrong build the other three admit**, and `A18`'s two shapes were shown to defeat *every* hardcoded height, including a literal tuned to one stub |
| 6 | NFR triggers, each measurable | ✅ | **no bar moved, created or loosened** — stated explicitly on the `NFR-002` bullet (`[C9-5]`); `N8-LANE` inherited unchanged, and the added tests add **no test FILE** |
| 7 | test notes | ✅ | the two stub shapes, which rows run under which, and the `src/frame.test.ts` precedent for keeping the stubs in a test file |

**Items 1, 3, 5, 8, 9 and 10 are unchanged by this amendment.** Item 5 gains one line (no import edge to
either panel, and clause 9f's real-panel re-gate) but no dependency is added or removed; items 8 and 9
were re-derived and both hold — see `## Size and priority rationale`.

**THE `Ready` → `Ready for Dev` GATE IS CLEAR OF THIS TICKET'S SIDE.** The only reason `ABC-019` was
HELD in `Ready` was clause 9's two owed criteria; they are written. **The gate itself is the
Orchestrator's** — this is the DoR statement it needs, not the move.

**Two things a later reader is owed at the promotion hop, both flagged and neither taken — items 1–2.
The clause-9 hop's three are listed under them and are dated separately:**

1. **`ABC-021` needs the matching half of `[D12]`** — its § Scope and § Size both claim the fifth
   prompt outcome's transition that this ticket also claimed. This hop fixed one side only, because
   `ABC-021` is outside its lane.
2. **`plans/nfr-catalog.md`'s `NFR-002` row is owed a note, for Architect/Design** — its
   boundary-condition block quotes this quantity at *97–102 µs @ 300 plies* while this ticket's bar was
   *≤ 100 µs*, i.e. the row already contained the refutation of the bar it sat beside. This ticket's own
   bar is fixed here; **the catalog row is not this role's and `NFR-002`'s < 16 ms target is untouched
   by any of it.**
   > **DISCHARGED 2026-08-11 by Architect/Design** at `design-stub-seam-and-nfr002` — and the flag's own
   > premise was refuted while being answered. The row's `Applies to` cell is re-scoped, the prototype
   > band is struck and labelled *not a bar of this row*, and the `< 16 ms` target did not move. **What
   > was wrong on this side is corrected under `[D19]` above.** Verified by reading the row at this hop,
   > not from the note.

**Three more, from the 2026-08-11 clause-9 hop — flagged, not taken. The count is checkable and the
lesson of the 2026-07-31 amendment is why it is stated as one:**

3. **`ADR-0009` clause 9e's own wording is one measurement short, for Architect/Design.** The clause
   reads *"every frame's `length` equals the session height"*, and **built and run at this hop, a loop
   that derives its height and then pads or truncates every frame to it satisfies those words while
   silently eating a row** — it turned a 20-row frame into 19. `A19`'s clause (c) closes it on this
   ticket (*the frames written are the seam's frames, unmodified*), which is what the ticket owes. The
   ADR text is **not edited — `memory-bank/50-decisions/` is outside this hop's lane** — and clause 9e's
   ruling is unaffected: it is a wording gap, not a wrong ruling, and (vi)'s falsifiability claim was
   re-measured and **holds** (2/5 → 19, 2/6 → 20; a variable-height stub returns `[19, 20]` and fails).
4. **`plans/board.md`'s `ABC-019` row, for the Orchestrator — the HELD reason is now discharged.** The
   row was already flagged stale at the previous hop (`blocked-until: ABC-012, ABC-014, ABC-018` and
   `merge-order: after ABC-020`, stale on all four). What is new: the clause-9 gap that held this ticket
   in `Ready` is closed. **No board edit was made here; board moves are the Orchestrator's.**
5. **A pre-existing duplicate bullet in `## Test notes`, flagged and NOT deleted** (coding rule 12).
   *"Do not test the real engine's timing here. `NFR-004` belongs to `EPIC-004`…"* appears **twice**, as
   the fourth-from-last and the last bullet of that section; the two differ only in that one names
   `A15`'s macrotask boundary. It predates this hop, harms nothing, and removing it is an unrelated edit
   this hop has no mandate for.

### DoR re-check 2026-08-11 (THIRD hop) — the seam ruling and what the BUILD exposed

**This hop is not a re-refinement.** `ABC-019` was built, gated green and reviewed, and the build
exposed defects **in the ticket** that two refinements and a DoR table reading all-✅ did not.
**Nine items were ruled on. The count is checkable, and it is stated as one because the 2026-07-31
amendment said "three things and no more" and was wrong by three:**

| # | Ruling | Changes code? |
|---|---|---|
| 1 | `[D28]` — the render seam takes a **fourth `messages` argument**; the three-argument form could not satisfy `A5` | **no** — the build is already right; the TEXT moved to it |
| 2 | `[D32]` — `A3b`'s **`gameStatus` count is `plies + 1`**, and its **`repetitionCounts` count is `0`**, not "once per ply" | **no** |
| 3 | `[D31]` — `## Scope`'s *"either seam"* promised **repair**, `A9` supplies **termination**, and only the engine had a handler → **`A9b` added** | **YES** |
| 4 | `[D29]` — `A2`'s cadence formula **over-counted by one on every EOF run**; five of thirteen rows disagreed with it | **no** |
| 5 | `[D30]` — the **glyph mode is not a loop parameter**; clause 9b put it behind the seam | **no** |
| 6 | `[D36]` — the `NFR-002` per-ply derivation was **missing `A10`'s `legalMoves` term**; **no bar moves** | **no** |
| 7 | `[D33]` — `A12` is met in **FULL**; the enumeration guard is now a stated clause | **no** |
| 8 | `[D34]` — `A17` is met in **FULL**; the lane half and the out-of-tree half are now stated separately | **no** |
| 9 | `[D35]` — `## Test notes` row 3's obvious fixture is a **trap** (K+N vs K is already dead) and now says so | **no** |

| # | Item | Verdict | What changed, and the evidence |
|---|---|---|---|
| 2 | scope + out-of-scope | ✅ | four bullets repaired: the seam signature (`[D28]`), the cadence formula (`[D29]`), the glyph-mode parameter (`[D30]`), and the throw-recovery promise split into repair-vs-terminate (`[D31]`) |
| 4 | acceptance testable + measurable | ✅ | **23 labelled criteria** (`A1`–`A19`, four sub-lettered). `A9b` **added**; `A2`, `A3`, `A3b`, `A12`, `A17` **repaired**. `A3b` was satisfiable only by a build `A3` forbids; `A2`'s formula was satisfied by a build transition 10 forbids; `A3`'s order clause named a step no spy can see |
| 6 | NFR triggers, each measurable | ✅ | **no bar moved, created or loosened** — the derivation gained its missing term (`[D36]`) and the marginal readings are 0.61x / 0.59x / 0.56x; `N8-LANE` unchanged and **no test FILE added** |
| 7 | test notes | ✅ | **14 rows** (row 14 for `A9b`), row 3's fixture trap written down (`[D35]`), the frame-count bullet corrected to match `A2` |
| 8 | size | ✅ | `L` (5), **re-derived a third time and unmoved**; the one code change is a `try`/`catch` over an existing call — see `## Size and priority rationale` |
| 9 | priority | ✅ | `P0`, re-derived and unmoved |

**Items 1, 3, 5 and 10 are unchanged by this hop** — item 5 gains `[D37]` (the `ABC-016` dependency is
now cited **by clause content**, not only by criterion number, because a concurrent hop is ruling on
that criterion), but no dependency is added or removed.

> **THIS TICKET DOES NOT EXIT `In Review` CLEAN, AND THAT IS THE HONEST OUTCOME.** Ruling 3 changes what
> the code must do, so **`ABC-019` returns to `In Development` for `A9b` and row 14** — one `try`/`catch`
> and one test row. **The other eight rulings are text-only and the delivered build already satisfies
> them.** A ticket returning to `In Development` on a ruling is a working board, not a failed one; this
> board did it on `ABC-009` and was right to. **The board move is the Orchestrator's — requested here,
> not taken.**

**Flags after this hop. Two carried items are RESTATED with what was verified at source rather than
left to decay, and one is new:**

6. **`ABC-021` still needs the matching half of `[D12]` — RESTATED, NOT discharged, and now cheaper
   than when it was raised.** Verified at source at this hop rather than transcribed:
   `plans/tickets/ABC-021-*.md` is still `status: backlog` / `column: Backlog`, its `## Scope:67` still
   reads *"A fifth prompt outcome, `claim`, alongside `ABC-019`'s four non-advancing outcomes"* and its
   size rationale`:192` still reads *"One new prompt outcome, **one terminal transition**"*. **Those
   sentences are not wrong under the settled split** — `ABC-021` owns transition 16 and this ticket owns
   only that `game-over` is reachable from `awaiting-human` at all — **but `ABC-021` does not say so in
   its own words, so a reader of that ticket alone cannot tell which of the two owns the transition it
   names.** What is owed there is one sentence recording the split, and an acceptance criterion for
   transition 16. **`ABC-021` is outside this hop's lane and was READ ONLY; nothing in it was edited.**
   It is in `Backlog`, so the fix costs nothing today and gets more expensive the moment it is pulled.
7. **`ADR-0009` clause 9e's wording is still one measurement short, for Architect/Design — RESTATED,
   unchanged** (item 3 above). Not re-verified at this hop and not claimed to be.
8. **NEW — `ADR-0009` clause 9b and evidence (vii) now QUOTE a seam signature this ticket no longer has,
   and Architect/Design IS owed a follow-up. This hop was asked to decide that either way, so it is
   stated either way.**
   - **The ruling itself was correctly routed here and NOT to the ADR, and that was checked rather than
     inherited.** Clause 9b says in its own words *"this is not a new seam: it is the seam that ticket
     already specifies, and clause 9 is the ruling that the count must not cross it"* — it **quotes** the
     signature from this ticket instead of deciding it, so the signature's home is `plans/tickets/` and
     the ruling was mine to make. **Clause 9's actual ruling is untouched, and that is measured, not
     asserted:** a `messages` argument cannot carry a row count, because the assembled height is a single
     distinct value across 0 / 1 / 4 / 200 items and a 100 000-character item at geometries 2/5, 4/9, 3/8
     and 3/10, agreeing with `frameHeight` in every cell (`[D28]`).
   - **The follow-up is owed anyway, and it is a TRANSCRIPTION correction, not a re-opening.** The ADR
     records at (vii) an experiment it *ran* — *"one render seam of the exact signature `ABC-019`'s
     `## Scope` already states — `(GameHistory, GameStatus, thinking) => readonly string[]`"* — and cl.
     9b quotes the same form. A later reader who compares the two documents can only conclude either
     *"the ticket drifted from the ADR"* or *"the ADR's experiment is invalid"*, and **both conclusions
     are wrong**; distinguishing them requires re-running the invariance measurement above. **One
     sentence in the ADR prevents that; nothing else in clause 9 moves, and no clause is re-opened.**
   - **`memory-bank/50-decisions/` was NOT edited by this hop.** Routing is the Orchestrator's.
   - **One attribution corrected while here:** the sentence *"the seam is not new and its arguments do
     not change"* was reported during the build as the ADR's. It is **not** — it is this ticket's own
     `[D27]` closing sentence, and it is fixed above. `grep` for *"argument"* in `ADR-0009` returns two
     hits and neither is that sentence.
9. **`plans/board.md`'s `ABC-019` row, for the Orchestrator — RESTATED, and the requested move has
   changed.** The row's `blocked-until: ABC-012, ABC-014, ABC-018` and `merge-order: after ABC-020` were
   flagged stale on all four at two previous hops and are still owed. **Requested now:
   `In Review` → `In Development`**, for `A9b` only. **No board edit was made here.**
   > **CLOSED 2026-08-11 (fourth hop). The stale `blocked-until` / `merge-order` text was FIXED by the
   > Orchestrator at task `abc019-qe-gaps-2026-08-11`** — verified by reading the row at this hop, not
   > taken from a report. It had been raised by **three separate roles across five hops** and no role
   > but the Orchestrator could fix it, because board text is the Orchestrator's alone. **It is not
   > re-flagged, and this note exists so the next reader does not re-raise it a sixth time.**

### DoR re-check 2026-08-11 (FOURTH hop) — QE's eight criterion gaps and `ADR-0010`'s two owed items

**This hop is not a re-refinement either.** `ABC-019` was built, gated green, ruled on, rebuilt, gated
green again and then **attacked with thirteen wrong builds**. All twenty-three criteria held and there
was **zero code defect** — and nine places were found where a *future* correct-looking build is green
too. **Eleven items were ruled on. The count is checkable, and it is stated as one for the reason the
2026-07-31 amendment's "three things and no more" is stated as one: it was wrong by three, and
`[D43]` is this ticket committing the same error a second time.**

| # | Ruling | From | Changes code? |
|---|---|---|---|
| 1 | `[D38]` — transition 15's trigger reworded; **`A2` gains the no-frame-after-`game-over` clause**. A terminal frame on edges 12/13/prompt is **not constructible** — the render seam takes a `GameStatus` and a terminal one requires `reason: EndReason` | `G-6` | **no** |
| 2 | `[D39]` — **`A5b` ADDED**: a non-advancing outcome's message items belong to **one** frame; every later frame carries none | `G-1` | **no** |
| 3 | `[D40]` — **`A8b` ADDED**: the prompt-driven `game-over` returns the seam's own `result`/`reason` unaltered, adds no frame, calls neither seam after, and can never be `A8`'s `{null, null}` | `G-2` | **no** |
| 4 | `[D41]` — **`A9b` gains clause (iv)**: zero render calls and zero sink writes between the throw and the rethrow | `G-3` | **no** |
| 5 | `[D42]` — **`A10b` ADDED**: the loop guards the **INPUT** seam's move too, and **throws** rather than terminating | `G-4` | **YES** |
| 6 | `[D43]` — `[D32]`'s witness corrected: the `+ 1`'s fixture is **row 16**, not row 3, which `[D35]` replaced in the same amendment | `G-5` | **no** |
| 7 | `[D44]` — **`A6` gains the message clause**: the `board` command's items are **not optional** | `G-8` | **no** |
| 8 | `[D45]` — `A19`(c)'s declared limit **CONFIRMED** by an independent instrument; disposition unchanged, nothing added | `G-9` | **no** |
| 9 | `[D46]` — **`A20` ADDED**, `ADR-0010` cl. 7's `F3` form; **cannot be SATISFIED until `ABC-027` merges** and says so | `ADR-0010` | **no** |
| 10 | `[D47]` — **the PROHIBITION written in**: no constant-frame-width criterion, because `W` varies by design and `F4` fails the *correct* build | `ADR-0010` | **no** |
| 11 | `[D48]` — `ABC-027` added to `## Dependencies`; merge order is now **`ABC-016` → `ABC-027` → `ABC-017` → `ABC-019`** | `ADR-0010` | **no** |

**`G-7` is NOT in that table and that is deliberate: it is not mine.** QE classed it a **test gap** —
`A11` forbids a lit thinking indicator on the terminal frame **in its own words** (*"given any other
state, then it is clear"*), and no assertion reaches that state. **Confirmed at this hop: `A11` needs
no change, and none is made.** It is one `expect` on `A7`'s existing mate fixture and it is the
**Engineer's**, riding with the `A10b` hop.

| # | Item | Verdict | What changed, and the evidence |
|---|---|---|---|
| 2 | scope + out-of-scope | ✅ | transition 15's trigger reworded (`[D38]`) — a **type-level** argument read at source, not a preference; `## Out of scope` gains `ABC-027` and points at the prohibition |
| 4 | acceptance testable + measurable | ✅ | **27 labelled criteria** (was 23), `A1`–`A20` with seven sub-lettered. `A5b`, `A8b`, `A10b`, `A20` **added**; `A2`, `A6`, `A9b`, `A19` amended in place; **nothing renumbered or deleted.** Every one of the eight gaps was **re-verified at this hop by BA/PM's own out-of-tree probe against the delivered build**, and where the residue differed from QE's it is written down (`[D42]`) |
| 5 | dependencies known | ✅ | `ABC-027` added as a **correctness dependency of `A20`** (`[D48]`); merge order now four tickets; live columns deliberately **not** restated, because `[D21]` was four stale status statements copied into a ticket |
| 6 | NFR triggers, each measurable | ✅ | **no bar moved, created or loosened.** `A17`'s figures unchanged — QE re-ran the out-of-tree timing half at **0.47x / 0.51x / 0.43x** and **left the engineer's more conservative 27.23 / 58.79 / 112.86 µs as the record**, which is the right call and is not overridden here. `N8-LANE` inherited, **ZERO new test FILES** |
| 7 | test notes | ✅ | **18 rows** (15–18 added); row 16 explained against row 3's trap; `A12`'s enumeration guard checked as unaffected; row 18's narrowing must come from a **panel** row and its screen model is local |
| 8 | size | ✅ | `L` (5), **re-derived a fourth time and unmoved**; the one code change is a membership check over an existing comparison; splitting `A20` out was **considered and rejected with a reason** |
| 9 | priority | ✅ | `P0`, re-derived and unmoved. `A20`'s dependency on `ABC-027` is **readiness, not value** |
| 10 | no major unresolved blocker | ✅ | **and this was the one item worth arguing.** `A20` cannot be **satisfied** until `ABC-027` merges — but `ABC-027` is **2nd of four in the merge order and this ticket is 4th**, so it is a **merge-order constraint, not a start blocker**, exactly as `ABC-016`/`ABC-017` already are. Nothing waits on it to begin; `A20`'s assertion is written at the rebase that was already owed for `ADR-0009` cl. 9f |

**Items 1 and 3 are unchanged by this hop.**

> **THIS TICKET DOES NOT EXIT `In Review` CLEAN, AND AGAIN THAT IS THE HONEST OUTCOME.** Ruling 5
> (`[D42]` / `A10b`) changes what the code must do: **the delivered loop plays a move from the input
> seam that no generator produced and corrupts the board** — measured at this hop, and the owner's
> 2026-07-31 directive (*"chess moves are legal according to game rules … everything else comes after
> that"*) is directly on it. **`ABC-019` returns to `In Development`.** The other ten rulings are
> text-or-test-only and the delivered build already satisfies every one of them.
>
> **REQUESTED: `In Review` → `In Development`**, for **`A10b` + row 17** (production), and carrying
> with it the test-only work the same hop should land: **`G-7`'s `A11` assertion**, **`A5b`**,
> **`A6`'s message clause**, **`A9b`(iv)**, **`A8b` + row 15**, and **row 16**. **`A20` + row 18 do
> NOT ride with that hop** — they are written at the rebase, after `ABC-027` merges. **No board edit
> was made here; board moves are the Orchestrator's.** **Front matter is deliberately left at
> `in-review`**, on the same precedent as the previous two hops: the board is the authority.

**Flags after this hop. Two are carried, one is closed above, and two are new:**

10. **`ABC-021` still needs the matching half of `[D12]` — RESTATED, NOT discharged, and NOT
    re-verified at this hop.** The last verification at source was the third hop's. It was in `Backlog`
    then, which is where the fix is free. **`ABC-021` was not opened by this hop.**
11. **`ADR-0009` is owed two narrow items by Architect/Design — RESTATED, unchanged, neither
    re-verified here.** Clause 9e's wording is one measurement short (third-hop flag 3 / item 7), and
    clause 9b + evidence (vii) quote a seam signature this ticket no longer has (third-hop flag 8) —
    the board records the latter as **QUEUED**. **`memory-bank/50-decisions/` was not edited by this
    hop and neither `ADR-0009` nor `ADR-0010` is re-opened.**
12. **NEW — `EPIC-006` inherits one player-visible residue from `[D38]`, and it is handed on rather
    than left as a defect.** On transitions 12 and 13 the last frame the player sees carries
    `status in-progress` **with the thinking indicator lit**, because no terminal `GameStatus` exists
    on those edges and this loop must not fabricate one. **`EPIC-006`'s result screen is what says the
    game ended**, and it draws the moment `runTurnLoop` returns. **There is no CLI entry point today,
    so "the residue is transient" is a design expectation and NOT a measurement** — which is exactly
    why it is written down here instead of assumed.
13. **NEW — the duplicate `## Test notes` bullet flagged at the second hop (flag 5) is STILL PRESENT
    and is STILL not deleted.** *"Do not test the real engine's timing here. `NFR-004` belongs to
    `EPIC-004`…"* appears twice, differing only in that one names `A15`'s macrotask boundary. Verified
    still present at this hop. **Coding rule 12: flagged, not removed** — it predates every hop that
    has seen it and removing it is an unrelated edit no hop has had a mandate for. **If a future hop
    wants it gone, that is a one-line mandate to give.**

### DoR re-check 2026-08-12 (FIFTH hop) — one sentence, and what a MERGE invalidated around it

**This hop is not a re-refinement and it is the smallest of the five.** It was sent to repair one
sentence. **That sentence was already repaired on this branch two hops earlier**, so the hop's real
work became auditing the repair — *a repair is an untested claim* — and re-checking the block against
an event no previous hop could have accounted for: **`ABC-016` merged.** **Three items ruled on. NONE
changes code, and none adds a criterion.**

| # | Ruling | Falsified by | Changes code? |
|---|---|---|---|
| 1 | `[D49]` — `[D27]`'s closing sentence had **no stated baseline**. *"Its RETURN does not change"* is vacuous against this ticket's own text (which named no return) and true against the BUILD and cl. 9b; it now says which, and carries the fourth argument's qualifier | its own first sentence | **no** |
| 2 | `[D50]` — the IMPORTED bullet's *"self-enforcing … needs no criterion of its own"* is **expiring**. Re-measured: `TS2307` **× 1** today, **exit 0** for `STATUS_ROWS` alone, **× 0** once `ABC-017` merges — all **before** this ticket merges. What kills the IMPORTED form is `A18`(i) + `A19`(b) | **`ABC-016`'s merge** | **no** |
| 3 | `[D51]` — cl. 9f's re-gate is **partially dischargeable now** and its sentence admitted a swap that **deletes the only append-branch run in the tree** (real `3/8` → `H` = 23, in-place). The swap **ADDS** a real-panel run; it never **REPLACES** `A18`'s stubs | **`ABC-016`'s merge** | **no** |

**The item this hop was briefed on is CLOSED as already-done, and that is written down rather than
quietly re-fixed.** `[D27]`'s *"…its arguments do not change"* was falsified by `[D28]`'s fourth
argument and was repaired **at the third hop, in the same commit that created the falsifying
amendment** (`a2bfd7e`), with third-hop flag 8 recording it. **`main` still carries the false sentence
at `:242`, and will until this ticket merges — it merges LAST.** Nothing consumes it: `ADR-0009`
cl. 9b's quote of it is dated as *the ticket as it then read*. **Non-blocking, discharged by this
branch's merge, no action owed to anyone.**

| # | Item | Verdict | What changed, and the evidence |
|---|---|---|---|
| 2 | scope + out-of-scope | ✅ | `[D27]`'s closing sentence repaired (`[D49]`) and its IMPORTED bullet corrected against measurement (`[D50]`); the rest of the `[D26]`/`[D27]` block re-audited sentence by sentence and **what survived is recorded in place**, so the next hop does not re-derive it |
| 4 | acceptance testable + measurable | ✅ | **27 criteria, UNCHANGED** — none added, amended, renumbered or deleted. `A18` and `A19` were re-read against the merge and are **explicitly not amended**; `[D51]` protects them rather than editing them |
| 5 | dependencies known | ✅ | two sentences that `ABC-016`'s merge made false are repaired **as a CHECK, not as a status** (`[D51]`) — *"a panel is unmerged for this ticket's purposes exactly while its module is absent from merged `src/`"* — because a status copied into a ticket is `[D21]`'s defect and would be stale again at the next merge. `HISTORY_ROWS = 8` is marked **`UNKNOWN - verify`**: this hop did not open `ABC-017` |
| 6 | NFR triggers, each measurable | ✅ | **no bar moved, created or loosened; nothing re-measured and nothing claimed to be.** `N8-LANE` unchanged — **zero test files added.** The lane figure moved 723 → **758/758 on 26 files** purely because `ABC-016` merged |
| 7 | test notes | ✅ | **18 rows, unchanged.** No row added, none edited |
| 8 | size | ✅ | `L` (5), **re-derived a fifth time and unmoved** — and the standing tripwire is **answered rather than stepped around**: it asks a fifth hop *adding production scope* to test `SPLIT_REQUIRED`, and **this hop adds none at all.** `SPLIT_REQUIRED` was still tested against the one plausible candidate (*"re-gate against the real panels"*) and rejected with a reason |
| 9 | priority | ✅ | `P0`, re-derived and unmoved. `ABC-016`'s merge moves **readiness, not value** |
| 10 | no major unresolved blocker | ✅ | unchanged. `A20` still waits on `ABC-027`; cl. 9f still waits on `ABC-017`. **Both are merge-order constraints, not start blockers**, and `[D51]` now says what "discharged" requires |

**Items 1 and 3 are unchanged by this hop.**

> **NO BOARD MOVE IS REQUESTED, AND THAT IS THE FINDING, NOT AN OMISSION.** This hop changes no code,
> adds no criterion and closes no hold. **`ABC-019` stays in `In Review`, held for `ADR-0009` cl. 9f** —
> and the hold is now **narrower and checkable**: the real status panel is merged so the status half of
> the seam wiring can be re-gated at the next rebase, while **full discharge still needs `ABC-017`**,
> and `A20` still needs `ABC-027`. **Front matter is deliberately left at `in-review`**, on the same
> precedent as the previous three hops. **`plans/board.md` was not opened.**

**Flags after this hop. Two are carried unchanged, one is closed, and two are new:**

14. **`ABC-021` (flag 10) and `ADR-0009`'s clause 9e wording (flag 11) — CARRIED, unchanged, and
    **NOT re-verified at this hop**. The last verification at source was the third hop's for `ABC-021`.
    Neither ticket nor ADR was opened here.
15. **CLOSED — flag 11's other half.** `ADR-0009` cl. 9b + evidence (vii) quoting a signature this
    ticket no longer has **has been fixed by Architect/Design and is merged on `main`.** **Verified at
    source at this hop, not taken from a report:** the correction blocks are at `ADR-0009:416-438`
    (9b) and `:383-393` ((vii)), and the change was **+39/−0 — additions only, no clause edited**
    (measured by `git show --numstat`, not quoted). The `[D27]` attribution was kept **split** at
    `:432-438`, which is correct and is precisely why this hop had a ticket sentence to repair and no
    ADR sentence to touch.
    > **One consequence of THIS branch merging, for Architect/Design — non-blocking and optional.**
    > That block cites the falsified sentence at *"`…ABC-019-turn-loop-skeleton.md:242` as `main` reads
    > today"*. **It is self-dating, so it does not become FALSE when this branch merges** — but the
    > `:242` locator will then point at a line that no longer carries the sentence, which is the stale-
    > citation shape this project keeps catching. **Owner: Architect/Design; `memory-bank/50-decisions/`
    > was NOT edited by this hop and no ADR is re-opened.**
16. **NEW — four stale comments in merged `src/frame.test.ts`, for whoever next has a mandate in that
    file.** `:11`, `:51`, `:54` and `:671` all say the two panels are unbuilt; `ABC-016` is merged.
    **Comment-only, no assertion depends on them, and this ticket does not open that file** — an
    Engineer is live in it for `ABC-027`. **Flagged, not taken.**
17. **NEW — the re-gate itself now has a stated completion test, and it is not this ticket's to run.**
    `[D51]` says what a cl. 9f re-gate must report: **which panels were real.** **Owner: the
    Orchestrator and QE.** Recorded here because the rebase hop is where it will be read.

### DoR re-check 2026-08-11 (SIXTH hop) — the rebase turned a MERGED ticket's instrument RED, and the ruling is that this ticket is right

**This hop wrote no criterion and changed no code. It ruled one collision and routed it.** The rebase
onto merged `main` is done; the branch is 0 behind; `lint` / `typecheck` / `build` are 0; and
**`npm test` is RED at 2 failed / 789 passed on 28 files, skip 0** — re-run at this hop and identical
to the rebase hop's figures. **Both failures are in `src/history-pane.nfr.test.ts`, a MERGED file.
Neither is in this ticket's own tests, and no test of this ticket fails.**

| # | Ruling | Falsified by / evidence | Changes code? |
|---|---|---|---|
| 1 | **`[D52]` — `NFR-002`'s premise is INTACT and the loop is RIGHT.** The premise the catalog row states is scoped to *a renderer* and *a frame*; probed here, the five renderer roots' closure is **11 modules with `history.ts` NOT among them**, the same probe rooted at `turn-loop.ts` **does** report it (so the zero is not blind), and **nothing imports `turn-loop.ts`**. What died is `A11`'s whole-tree PROXY, not the premise | measured at this hop with `module.registerHooks`; `A11`'s own regex re-run over the 17 non-test files gives **exactly one** match, `src/turn-loop.ts` | **no** |
| 2 | **The two RED instruments are `ABC-029`'s, not this ticket's** — its `A1` and `## Scope` item 1 already own *"define production module"* and *"one expression"*. Refused here for three measured reasons, not by preference | `ABC-029` `## Scope`/`A1`/`## Out of scope`, read at source | **no** |
| 3 | **No merged TICKET text moves.** `ABC-017` is `Done` and `A11` was MET at its gate; `ABC-029` already rules it *"discharged and does not move"*. The board's own correction stands — `ABC-016`'s `R1`/`D27` is a precedent about a merged **TEST FILE**, not a merged **TICKET** — and this hop creates no new precedent | `ABC-029` `## Out of scope`; board row for `ABC-028` | **no** |
| 4 | **`ABC-029` `P2` → `P1`**, re-derived because its stated `P2` premise — *"Production runtime importers are zero, measured"* — is now **ONE**, and its `A1` blocks a `P0`'s gate | measured at this hop | **no** |

| # | Item | Verdict | What changed, and the evidence |
|---|---|---|---|
| 4 | acceptance testable + measurable | ✅ | **27 criteria, UNCHANGED** — none added, amended, renumbered or deleted; the table stays **18 rows**. **`A3`/`A3b` are re-read and explicitly NOT amended**: the loop's own half of `NFR-002` is already a criterion (`gameStatus` exactly `plies + 1`, `repetitionCounts` **0** at the module boundary), so nothing new is owed here. **A criterion asserting *"nothing imports `turn-loop.ts`"* was considered and REFUSED as bloat** — once `ABC-029`'s guard measures the frame path as a closure, importing the loop from a renderer pulls `history.ts` into that closure and the guard catches it **without a second criterion** |
| 5 | dependencies known | ⚠️ | **NEW BLOCKING DEPENDENCY: `ABC-029`, with `ABC-028` ordered before or with it.** This is the first time this ticket cannot go green on its own hop, and the `⚠️` is recorded rather than smoothed. It is **not** a start blocker — the loop is built, delivered and correct — it is a **merge blocker**, and it stacks on the two already carried (`A20` on merged `ABC-027`, cl. 9f's real-panel run) |
| 6 | NFR triggers, each measurable | ✅ | **no bar, target or level moves**, on this ticket or anywhere. `NFR-002`'s three ply-count clauses, `A3b`'s spied counts and the `< 16 ms` target are untouched. `N8-LANE` unmoved — zero files added. **`plans/nfr-catalog.md` was NOT edited** (flag 19) |
| 8 | size | ✅ | `L` (5), **re-derived a sixth time and unmoved.** The tripwire was armed for this shape of hop and is answered on its own terms: **zero production scope, zero test scope.** `SPLIT_REQUIRED` tested against the real question — a second ticket WAS hiding here, it was found, and **it is already `ABC-029`** |
| 9 | priority | ✅ | `P0`, unmoved. What moved is `ABC-029` `P2` → `P1` |
| 10 | no major unresolved blocker | ❌ | **The suite is RED and the repair belongs to another ticket.** This is a genuine `❌` and it is written as one. Route to green: `ABC-028` → `ABC-029` → rebase → then `A20` + cl. 9f's real-panel run |

**Items 1, 2, 3 and 7 are unchanged by this hop.**

> **REQUESTED: NO FORWARD MOVE. `ABC-019` stays in `In Development`, now BLOCKED on `ABC-029`.** The
> Orchestrator may prefer the `Blocked` column, which is visible and time-tracked and is the honest
> home for *"cannot merge until another ticket lands"*; **the choice is the Orchestrator's and the
> reason is recorded either way.** What must NOT happen is a move to `In Review` or forward: the suite
> is RED and `quality.gate_enforcement` is `blocking`. **`plans/board.md` was not opened or edited by
> this hop.**

**Flags after this hop. Two are carried, and three are new:**

18. **CARRIED — flags 14, 16 and 17 are unchanged and none was re-verified here.** `ABC-021`,
    `ADR-0009` cl. 9e's wording, the four stale comments in `src/frame.test.ts`, and cl. 9f's
    completion test. **No ticket, ADR or `src/` file was opened for a ruling by this hop.**
19. **NEW — `plans/nfr-catalog.md`'s `NFR-002` row is owed ONE note, and it is NOT BA/PM's.** The row
    already scopes its own void-condition to *a renderer* and already says *"the quantity belongs to
    the LOOP (`ABC-019`), not to a frame"* — **so this ruling needs no catalog edit and none was
    made.** What the row does not yet record is that the first non-renderer production importer of
    `src/history.ts` now exists, which is the fact that makes the scoping load-bearing rather than
    incidental. **Owner: Architect/Design seeds the row; Security/NFR still owns `NFR-002`'s
    `MET`/`MISS`, and this ticket has never been through a Security/NFR gate.** Flagged, not taken.
20. **NEW — `ABC-029`'s `A3` contradicts itself and it is flagged at its own site, not fixed here.**
    Form (b) excludes `perft-bench.ts` from **both** guards, while `A3`'s closing sentence says
    *"Either way, `WPERFT-STATIC` must still die, and it must die on the regex"* — which form (b)
    makes impossible. **Recorded in `ABC-029` for its design hop.**
21. **NEW — the ticket front matter reads `in-review` / `In Review` and the live column is
    `In Development`.** The move is committed on `grugops/abc019-rebase-2026-08-12` and is **not
    merged**, so this branch's `plans/board.md` is one hop stale and the front matter agrees with the
    stale board rather than with the truth. **Deliberately NOT edited**, on the same precedent as the
    previous four hops and on `[D21]`'s lesson — board hygiene is the Orchestrator's, and editing one
    half of a two-file contract on a branch carrying a stale other half creates a third state.
    **Owner: the Orchestrator.**
22. **NEW — a date defect, carried forward and NOT smoothed.** This machine's clock reads
    **2026-08-11T20:37Z** (local 23:37) while the board, the traceability headers and `ABC-017`'s
    merge record are dated **2026-08-12**. This hop used the true clock in its own text rather than
    matching the record, and edited nothing to make the two agree. **The rebase hop recorded the same
    defect independently; two roles have now seen it.**
