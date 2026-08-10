---
id: ABC-019
title: Turn loop skeleton — ply dispatch, both seams stubbed, clean termination
status: ready
column: Ready
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

- **The render cadence is `1 + plies + non-advancing prompt outcomes` frames**, not "one render per
  ply". The initial position is rendered **before** the first act, every ply is followed by exactly
  one frame, and **every non-advancing outcome re-emits a frame** — it has to, because the rejection
  line and the ambiguity candidate list live in the frame's own message region (`src/frame.ts:172-185`)
  and there is no second output channel.

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
  | 15 | `game-over` → `exiting` | the terminal frame has been shown; exit 0 |

  **Transitions 7, 8 and 9 reach `rendering` WITHOUT passing through `evaluating-terminal`, and that
  is the structural reason `A5` and `A6`'s "`gameStatus` is not re-evaluated" is satisfiable at all** —
  it is a property of the machine, not only of a spy. The **sixteenth** transition,
  `awaiting-human` → `game-over` (the `claim` outcome), is **`ABC-021`'s** — see `## Out of scope`
  (`[D12]`).
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
- **`--ascii` / `--unicode` and the human's colour are parameters**, supplied by `EPIC-006`. The loop
  discovers neither and defaults neither. **The colour parameter is a resolved `"white" | "black"`**:
  `EPIC-006`'s startup scope offers **white / black / random** (`EPIC-006` § Scope; `EPIC-002`
  § Dependencies) and resolves `random` before the loop sees it. `[D24]`
- **The loop supplies the render seam everything it draws, and the render seam derives nothing.**
  Per frame the loop hands over the `GameHistory`, the `GameStatus` **it evaluated for this ply**, and
  the `thinking` flag — the three inputs `ABC-016`'s panel takes, in that ticket's own words *"supplied
  by the caller, never derived here"*. This is the line `ABC-016` was owed (its `## Dependencies`
  entry for this ticket) and it is **not decorative: it is what makes `A5` and `A6` satisfiable.**
  Until `ABC-016`'s refinement deleted the panel's per-frame `gameStatusOf` call, both were **false**,
  and `ABC-016`'s `A13` now spies `gameStatusOf` / `repetitionCounts` / `keyHistory` / `gameStatus` at
  **exactly 0** inside the panel. It is also what keeps `NFR-002`'s `O(window)` statement standing:
  that row voids itself *"if a renderer ever pulls the repetition derive into a frame"*, and this loop
  is the only place the derive belongs.
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

## Out of scope

- **The real parser** (`EPIC-003`) and **the real engine** (`EPIC-004`). The stubs are **test seams,
  not designs** for those epics.
- **`undo` / `resign` / `new` / `quit` and the result screen** — `EPIC-006`. The loop provides the
  transitions those commands drive; it does not implement the commands.
- **The opening book.** `EPIC-005` sits *behind* the engine seam. If the loop can tell a book move
  from a searched move, `EPIC-005`'s *"no discontinuity visible to the player"* has already been
  broken.
- **Frame content and writing** — `ABC-014`, `ABC-016`, `ABC-017`, `ABC-018`.
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
  **`1 + plies + non-advancing prompt outcomes`**. *(**[REPAIRED 2026-08-11 — `[D5]`, `[D6]`.]** This
  read *"exactly **two** frames … one per ply"*. Under render-before-act — this ticket's own shape and
  `EPIC-002` `[A3]`'s — an N-ply game renders N + 1 frames. Built and run: a **correct** build renders
  3 and therefore failed this criterion; the only build that renders 2 skips the initial frame and
  **prompts the human before any board is shown**; one rejected input plus one full move renders 4.
  `A6` already demanded a re-emit, so the ticket held both halves of the contradiction.)*
- **`A3` — Given** a ply is applied, **when** the loop proceeds, **then** the calls occur in the order
  *append to history → derive counts → evaluate → render*, and **every** evaluation in the whole run
  goes through **`gameStatusOf(history)`** (`src/history.ts:152`) — the `ADR-0002` clause-4 single
  supplier — so no `gameStatus` call is ever bare **and none is ever handed a map that is not this
  game's**. *(**[REPAIRED 2026-08-11 — `[D7]`.]** This read *"every `gameStatus` call … carries a
  counts map"*, which an **empty** `Map` satisfies. Built and run: that build passes the old clause at
  every call site and reports `in-progress` on the fifth occurrence of a position where `gameStatusOf`
  reports `{draw, fivefold-repetition}`. Naming the supplier closes it.)*
- **`A3b` — Given** any complete run, **when** `repetitionCounts` and `gameStatus` are **spied**,
  **then** each is called **exactly once per ply** and **exactly zero** times on a non-advancing
  prompt outcome. *(**[ADDED 2026-08-11 — `[D19]`.]** This is the clause that binds the derive rule,
  and it is a **count, not a clock**, for the reason `plans/nfr-catalog.md` has now moved a bar onto a
  count five times: measured at 120 plies, one derive per ply is 48.34 µs and **two derives is
  93.58 µs — MET against the ≤ 100 µs bar at 0.94x.** The timing bar cannot see the wrong build; the
  spy cannot miss it.)*
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
- **`A6` — Given** the input seam returns a non-mutating command (`board`), **when** the loop
  continues, **then** a frame is re-emitted, the ply is not advanced and no evaluation is re-run.
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
- **`A9` — Given** the engine seam throws **from inside a `makeMove`/`unmakeMove` bracket**, so that
  the live object is left one ply ahead, **when** the loop recovers via `takeBack(history, 0)`,
  **then** `toFen(position)` equals `toFen` of the position replayed from `{ initialFen, moves }`,
  `moves.length` is unchanged, and the loop terminates with a named reason from its terminal-reason
  type — it **never** continues on the object in hand. *(**[REPAIRED 2026-08-11 — `[D10]`.]** The
  fixture shape is now part of the criterion because without it the criterion is **unfalsifiable**:
  built and run, a build that repairs **nothing** passes it whenever the stub throws *before* touching
  the board, since the position was never corrupted. Only a mid-bracket throw can fail it — and that
  is also the only shape that resembles a real search.)*
- **`A10` — Given** the engine seam returns a move that is not in `legalMoves(position)`, **when** the
  loop receives it, **then** it does **not** apply it, `moves.length` is unchanged, and it terminates
  with the **engine-failure** value of its terminal-reason type — a value **distinct from every
  `EndReason`**, so a result screen can never present an engine bug as a chess outcome.
  *(**[REPAIRED 2026-08-11 — `[D14]`.]** *"a named engine-failure reason"* named no name, so any
  string passed; and `A14` as written could not even represent one. Failing loudly beats playing a
  corrupt board.)*
- **`A11` — Given** the loop is in the thinking state, **when** a frame renders, **then** the thinking
  flag it passes the render seam is set; **given** any other state, **then** it is clear — and the
  frame's row count is **identical** in both cases, per `EPIC-002` `4a`.
- **`A12` — Given** one fixture per value of the rules core's **automatic** terminal set — `checkmate`,
  `stalemate`, `insufficient-material`, `fivefold-repetition`, `seventy-five-move` — **when** the loop
  evaluates, **then** it stops with that reason and that reason only. *(**[AMENDED 2026-07-31 —
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
  counts hold with them. *(**[REPLACES 2026-08-11 — `[D15]`.]** The old criterion read *"Given the cost
  bar … when measured, then it holds"* — singular, where that section holds three bars, one of which
  (`NFR-004`) it says is not this ticket's, and with no ply count, instrument, statistic or machine.)*

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
- **`ABC-016` and `ABC-017` — added 2026-08-11 (`[D22]`), and `ABC-016` is a CORRECTNESS dependency,
  not merely a render one.** Both are in `Ready`, unmerged. The merge order is
  **`ABC-016` → `ABC-017` → `ABC-019`**, established at this task's scheduling hop
  (`.grugops/context/frame-merge-order-2026-08-11/notes/…-orchestrator-decision-ac72dd8d`) — this
  ticket merges **last**, and a `P0` merging behind a `P1` and a `P2` is a build-edge fact recorded
  there.
  - **`ABC-016` is why `A5` and `A6` are satisfiable at all.** Both require a frame re-emit **without**
    re-evaluating, and a panel that derived its own status per frame made both **false**. `ABC-016`'s
    refinement deleted that `gameStatusOf` call and its `A13` now spies it at exactly 0. This ticket
    supplies the status instead — see the render-seam bullet in `## Scope`, **the line `ABC-016` was
    owed**.
  - **`ABC-017`** supplies `HISTORY_ROWS`; `ABC-016` supplies `STATUS_ROWS`. Neither exists in merged
    `src/` today, which is why this loop is **built** against fixed-height stub arrays for both panels
    (verified at this hop) and **merged** after both.
  - **Build order is not merge order here.** This loop was built end-to-end against merged `src/` plus
    two stub panels at this refinement hop, so nothing is blocked on either ticket to *start*.
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

- `NFR-002` (16 ms frame) — **bar, three clauses, all measured at 40 / 120 / 300 plies with the
  instrument above and recorded with its machine:**
  - **Loop overhead per ply ≤ 45 µs @ 40 plies, ≤ 100 µs @ 120 plies, ≤ 200 µs @ 300 plies**,
    excluding the render, the input wait and the engine call. Today: **0.46x / 0.48x / 0.48x** —
    deliberately uniform, and the 120-ply clause is the ticket's original number untouched.
  - **`A3b`'s spied counts are the clause that BINDS:** `repetitionCounts` and `gameStatus` exactly
    **once per ply**, exactly **zero** on a non-advancing prompt outcome. Derivation of the per-ply
    figure: one `repetitionCounts` + one `gameStatus` + one `playMove` (measured 8.2–8.6 ns at
    `ABC-012`'s gate, ~0.02% of the budget — the ticket's "~10 ns" was `makeMove`'s figure and it
    stands).
  - **The loop is the ONLY place the repetition derive may live.** `NFR-002`'s row voids its own
    `O(window)` statement *"if a renderer ever pulls the repetition derive into a frame"*; `ABC-016`'s
    `A13` spies the panel at 0 derives and this ticket's render-seam contract is the other half.
- **`NFR-008` / `N8-LANE` — inherited, not re-derived (`[D20]`).** The tests this ticket adds may cost
  at most **5% of `NFR-008`'s TOTAL = ≤ 650 ms CPU** while the CPU clause is 13 s — **not** 5% of the
  lane as it stands — CPU (user + sys) of the default lane, median of paired per-round deltas over
  n ≥ 7 interleaved rounds with an identity null control reading ≤ 1.5%, **net of 160 ms CPU per test
  file added**, every figure with its machine. Wording and owner: `plans/nfr-catalog.md`
  § *The standing per-ticket lane bar*; **owner BA/PM at each cut**, which is why it is stated here
  rather than left to be inherited silently. **This ticket is the largest test surface in `EPIC-002`** —
  13 scripted-game table rows plus the spy and NFR tests — and at **159–179 ms CPU per test FILE**
  against a 650 ms allowance the **file count is the whole risk**, not the test count. Today's lane:
  676/676 on 22 files, 1.49 s wall.
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

- **Drive scripted games through the stub seams — thirteen rows, each with an exact expected terminal
  reason (or none) and an exact frame count.** *(**[CORRECTED 2026-08-11 — `[D25]`.]** The list read
  *"a mate line, a **threefold** line, a stalemate line, a **fifty-move** line, an insufficient-material
  line …"*, and after `ABC-020` **two of those terminate nothing** while the two that do were missing.
  A row whose "exact expected terminal reason" does not exist is a row that will be made to pass by
  changing the loop.)*

  | # | Row | Expected |
  |---|---|---|
  | 1 | mate line (Fool's mate) | `black-wins` / `checkmate`, exit 0 |
  | 2 | stalemate line | `draw` / `stalemate` |
  | 3 | insufficient-material line | `draw` / `insufficient-material` |
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

- **Both stubs are buildable from merged code alone and that was verified rather than assumed at the
  2026-08-11 refinement.** The coordinate reader is a `legalMoves` filter on
  `squareName(m.from) + squareName(m.to)` (`src/position.ts:60`, exported) — **11 lines**; the engine
  stub is a seeded LCG index into `legalMoves` — **9 lines**. Measured on
  `7k/4P3/8/8/8/8/8/K7 w - - 0 1`, the token `e7e8` yields **exactly 4** candidates with identical
  `from`/`to` (`addPromotions`, `src/moves.ts:88-98`), so **`ambiguous` is reached for free**; an
  unmatched token yields `rejected`. Both of the ticket's stub claims hold.
- **Rows 4, 6 and 9's fixtures must never set an en-passant square**, for the same reason `ABC-012`'s
  do not — `ABC-011` would otherwise make them fail for a reason that is not this loop's.
  `src/gameend.test.ts`'s knight cycle (`function knightCycles`, lines 26-50) is the shape to reuse:
  each 4-ply cycle returns to the exact start position, so *n* cycles make *n + 1* occurrences.
- **Assert the call *order* inside a ply, not just the outcome.** Append-then-evaluate versus
  evaluate-then-append produces the same result on every position except the one that completes a
  repetition, which is exactly the case a happy-path test does not contain.
- **Assert the frame *count*, not just the final frame** — `1 + plies + non-advancing outcomes`
  (`A2`). A loop that renders twice per ply passes every content assertion.
- **Assert what happens AFTER the terminal status is computed** (`A7b`), by spy. This is the only
  assertion that catches a loop whose exit test is one ply stale, and such a loop passes `A7`.
- **Do not test the real engine's timing here.** `NFR-004` belongs to `EPIC-004`; the stub's delay
  exists to exercise the thinking state and `A15`'s macrotask boundary, and quoting a number from it
  would be a fabricated measurement.
- **Watch the FILE count, not the test count** (`N8-LANE`): at 159–179 ms CPU per file against a
  650 ms allowance, this ticket's thirteen rows belong in **one** table-driven file wherever they can.
- **Do not test the real engine's timing here.** `NFR-004` belongs to `EPIC-004`; the stub's delay
  exists to exercise the thinking state, and quoting a number from it would be a fabricated
  measurement.

## Size and priority rationale

**Size `L` (5) — RE-DERIVED 2026-08-11 and UNMOVED.** Eight states, **fifteen transitions now
enumerated**, two stub seams, a load-bearing intra-ply ordering, exception recovery, and a
terminal-reason type that must be a superset of the core's. It is the only ticket in this epic that
touches every other component. Calibrated against `ABC-004` (special moves, `L`) — comparable in test
surface, and like that ticket it is `L` for the number of distinct cases rather than the volume of
code: **13 table rows, 17 criteria, one module.**

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

**Two things a later reader is owed, both flagged and neither taken:**

1. **`ABC-021` needs the matching half of `[D12]`** — its § Scope and § Size both claim the fifth
   prompt outcome's transition that this ticket also claimed. This hop fixed one side only, because
   `ABC-021` is outside its lane.
2. **`plans/nfr-catalog.md`'s `NFR-002` row is owed a note, for Architect/Design** — its
   boundary-condition block quotes this quantity at *97–102 µs @ 300 plies* while this ticket's bar was
   *≤ 100 µs*, i.e. the row already contained the refutation of the bar it sat beside. This ticket's own
   bar is fixed here; **the catalog row is not this role's and `NFR-002`'s < 16 ms target is untouched
   by any of it.**
