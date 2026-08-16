---
id: 20260816T073000Z-ba-pm-claim-ten-gaps-with-severity-and-owner-including-a-fourth-overlap-3e8c1d52
kind: claim
by: ba-pm
at: 2026-08-16T07:30:00Z
verified_by:
confidence: high
refs:
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - NFR-004
  - NFR-005
  - NFR-008
  - RISK-002
  - RISK-003
  - ADR-0002
  - ADR-0003
  - ADR-0005
  - ADR-0006
  - ADR-0008
  - ABC-074
  - ABC-075
  - ABC-078
  - ABC-081
  - ABC-083
  - ABC-084
  - ABC-085
  - ABC-087
supersedes:
---

# Ten gaps. None resolved by inference. One is a fourth subject overlap my subtask did not name.

**Recorded as `claim` because no `kind: finding` is admissible on this install** (`AGENTS.md`) — no
`§14-gate#<id>` stamp is emittable here. Each is stated as a falsifiable assertion with its source,
a severity and a **named owner who is not me**.

---

## `G1` — HIGH — **there is no non-M3 machine, and one blocker sits under two NFRs.** Owner: **the project owner.**

`NFR-005`'s depth-7 level is **PROVISIONAL** pending non-M3 measurement, and `ADR-0003` calls the
unvalidated 2–3x slow-hardware factor *"the largest single unknown in this ADR"*. **Every
performance figure in `plans/nfr-catalog.md` and every ADR reads Apple M3 (Mac15,13) / Node
v24.12.0 / darwin-arm64.** There is no second machine on this project's record.

**It is worse than one blocked ticket.** `NFR-004` (≤ 3 s, 5 s ceiling) is a **wall-clock** promise,
and `plans/nfr-catalog.md`'s own standing rule forbids wall-clock assertions in the suite because
they *"pass or fail on the machine that runs it"*. So **`ABC-078` `A1` can be run but its result is
`UNKNOWN - verify` off this machine** — the same gap, under a different NFR, that nothing else in
this epic closes. Acquiring hardware is not an agent's to arrange.

## `G2` — HIGH — **`EPIC-004`'s threading decision does not exist.** Owner: **Architect/Design.**

`ADR-0005` marks it **`UNKNOWN - verify`** and records it as its own falsifier `F6`, because
`zobristKey` **transiently mutates** and therefore *"you cannot hash a `Position` from two threads at
once"* — which forecloses one shape of parallel search. The architecture audit is explicit:
**"Whoever decomposes `EPIC-004` should make the threading decision explicitly rather than discover
it."**

**I read that instruction and I am not obeying the literal reading, deliberately.** My stop
conditions send *"the search architecture"* to Architect/Design and tell me to name the owner and
stop. **So I have named it rather than decided it**, and I have made it non-blocking for the tickets
that can proceed without it: `ABC-077` ships single-threaded, which is where every shape of that
decision begins, and forecloses nothing. It **is** a hard precondition for `ABC-075` (whose seam
design it constrains) and for any later parallel work.

## `G3` — HIGH — **the en-passant component cannot be XOR-updated, and that is `ABC-075`'s whole design problem.** Owner: **Architect/Design.**

`ADR-0005` defines the ep component as entering the key **only when a LEGAL ep capture exists**
(`zobrist.ts:28` imports `hasLegalEnPassant`; the conformance audit records *"CONFORMS, clause for
clause"*). **Whether a legal ep capture exists in the resulting position is not a local function of
the move just played** — deciding it requires generation. **An incremental key therefore is not a
plain XOR delta on this codebase.**

This is the sharpest technical finding of the hop and it is exactly what my subtask forbids me from
resolving: *"you may not specify the seam yourself."* `ABC-075` states the problem, both ratified
constraints and the observable definition of done, and is `Blocked` until Architect/Design rules.

## `G4` — HIGH — **the default test lane cannot absorb this epic, and the arithmetic is not close.** Owner: **Architect/Design + Security/NFR.**

`NFR-008` is **MET at 79.9% of its CPU clause** — measured 2026-08-13 at **10.390 s worst median
against a 13 s ceiling**, at **28 test files**. `src/` now has **30**. Remaining headroom is
**~2.6 s CPU**, and `ADR-0008`'s own per-file floor is **~0.1593 s** — but a *real* test file at
`N8-LANE`'s full 650 ms content is far more. The architecture audit already said it before this epic
was cut: *"`EPIC-003` (M) and `EPIC-004` (L) are both file-adding … **the budget does not comfortably
admit both epics** at today's per-file cost."* **That was written when `EPIC-004` was thought to be
`L`. It is `XL` at 37 points, and `EPIC-003` is not built.**

**Three of my tickets are individually far outside the lane and I ruled each one opt-in rather than
leaving it to be discovered** — reusing `PERFT_DEEP`'s established shape rather than inventing a
pattern:

| ticket | cost | lane clause |
|---|---|---|
| `ABC-085` self-play ladder | **~5 hours** (100 games × ~60 plies × 3 s) | 3 s wall / 13 s CPU |
| `ABC-084` puzzle suite | **≤ 60 s** by its own `A5` | 650 ms per ticket |
| `ABC-077`/`ABC-080`/`ABC-081` depth-4/5 sweeps | unmeasured, expected over | 650 ms per ticket |

**Ruling each one opt-in does not close `G4`** — the ordinary unit tests of fourteen tickets still
land in the default lane, and nobody has measured whether they fit. **`ADR-0008`'s `pool: "threads"`
discount is already spent** (`vitest.config.ts:67`), and the audit warned it is *"a one-time
discount, not a change in the slope — anyone treating threads as 'the answer' will be back inside
two epics."* This is that moment.

## `G5` — MEDIUM — **`ABC-084`'s gate has no trigger, and `ABC-085` has no home in the process.** Owner: **the Orchestrator, with the project owner.**

`EPIC-004`'s `## Test notes` require *"a commit that drops puzzle-solve count fails the gate"*. But
`quality.mandatory_gates` is `["lint","typecheck","unit","build"]`, and `.grugops/factory.config.json`
is **not BA/PM's to edit** — a strength gate is a policy change, not a ticket's side effect. **An
opt-in gate is a gate nobody runs**, so `ABC-084` as cut ships a real instrument with no trigger.

`ABC-085` is worse: **a ~5-hour run has no board column, no cadence and no gate that accommodates
it.** Nothing in this process says who runs it or how often. Both are named on their ticket pages at
DoR item 10 rather than quietly assumed away.

## `G6` — MEDIUM — **there is no memory NFR row, and `ABC-081` is the first component that needs one.** Owner: **Architect/Design + Security/NFR.**

`plans/nfr-catalog.md` has eight rows (`NFR-001`–`NFR-008`) and **none is about memory** — reasonably,
since nothing before now held meaningful state. A transposition table is a fixed allocation whose
size trades directly against hit rate. `ABC-081` `A7` binds the ticket to a **stated fixed bound**
that does not grow with search time, so the ticket is not unguarded — **but there is no
project-level bar to check it against.** `plans/nfr-catalog.md` is not mine to edit and a target is
not mine to set.

## `G7` — MEDIUM — **`ADR-0006`'s inherited caveat will be asked by `ABC-081`, and the ADR says so.** Owner: **Architect/Design.**

`ADR-0006` records that the key hashes castling **rights**, not availability, that **`EPIC-004`
inherits it** — *"a transposition table keyed on this hash will treat two placements alike"* — and
that the question *"will be asked again by whoever builds `EPIC-004`'s transposition table."* **I am
asking it and I am not answering it.** If the answer is *unchanged*, `ABC-081` proceeds as written;
if the hash changes, `ABC-075` changes with it. **A ticket does not re-open a ratified ADR.**

## `G8` — MEDIUM — **"beatable by a beginner without being random" is a design constraint with no construction.** Owner: **Architect/Design.**

`EPIC-004`'s scope demands both halves. **A uniform random blunder draw satisfies "beatable" and
violates "without being random"** — it occasionally throws a queen. Picking the *n*-th best move is
more human. Which construction meets the wording is a strength-design decision, not a product one.
`ABC-087` `A4` is written so **either** candidate can satisfy it and the **degenerate** one cannot
(*no played move is ever the worst-scoring move in the list*). **I have not picked one.**

---

## `G9` — **THE FOURTH OVERLAP, which my subtask did not name.** MEDIUM. Owner: **the Orchestrator.** RECORDED AND NOT RESOLVED, as instructed.

My subtask named three boundaries (difficulty selection → `EPIC-006`; opening book → `EPIC-005`;
Zobrist seam → Architect/Design) and said: *"If you find a fourth overlap I have not named, record it
and do not resolve it."*

**I found one. It is not the difficulty boundary itself — it is the difficulty VOCABULARY, and it
runs the opposite way from the boundary that was ruled.**

The ruling was *"You own the mechanism; it owns the choosing."* **That ruling assigns ownership. It
does not create the shared name that the two owners must agree on.** `ABC-087` publishes a level
table with names — `default`, `easiest`, `hardest`, and whatever sits between — and **`EPIC-006`'s
flag, prompt and session persistence must use exactly those names.** The data flows `EPIC-004` →
`EPIC-006`, which is the reverse of the direction the boundary ruling reads in.

**Why it is live right now and not hypothetical:** `EPIC-006` was **decomposed 2026-08-13** into
`ABC-041`…`ABC-046` — *"the RUNNABLE half only. Packaging, difficulty and `undo` NOT cut"* — so the
difficulty half is being cut by a **sibling BA/PM in this same working tree, in this same hop**.
Neither of us can read the other's output. **If that sibling's tickets assume a level vocabulary,
and mine publish a different one, the mismatch is real and neither hop can see it.**

**Three concrete things that could collide, none of which I resolved:**

1. **The names and the count.** I required *≥ 3* levels with named endpoints because `ABC-085` `A1`
   needs *hardest* and *easiest* to exist. A sibling assuming five named levels, or numeric 1–10, is
   not contradicted by anything either of us was given.
2. **Where the default lives.** `ABC-087` `A6` fixes the **default level's budget at 3 s**, because
   `NFR-004` and `NFR-005` are both written *"at default difficulty"* and that phrase needs a
   referent. If `EPIC-006` also defines a default — the natural thing for an argv parser to do —
   **there are two defaults and the NFR rows point at neither.**
3. **The already-merged precedent points the other way and is easy to over-apply.**
   `src/turn-loop.ts:144-147` takes a **resolved** `humanColour` and its comment says *"`EPIC-006`'s
   startup offers white / black / random and **resolves** `random` before the loop sees it."* The
   architecture audit's entry-point table lists *"the resolved colour, difficulty, flags"* together
   as `EPIC-006`'s new work. **Read carelessly that makes difficulty look wholly `EPIC-006`'s, which
   contradicts the ruling I was given.** Colour has no `EPIC-004`-side table; difficulty does.

**What I did instead of resolving it.** `ABC-087` `A8` asserts the boundary at the diff level — **no
change to `src/cli.ts`, `src/cli-options.ts` or `src/turn-loop.ts`, and no argv parsing or prompt
string in the delivered diff** — so my side cannot drift across it even by accident. The
**vocabulary** question is flagged on `ABC-087` `## Dependencies` and at its DoR item 5, with the
Orchestrator named as owner, because **only the role holding both decompositions can see both
halves.**

## `G10` — LOW — **`EPIC-005`'s opening book consumes `EngineSeam`, and a composition point may be owed.** Owner: **whoever holds the `EPIC-004`/`EPIC-005` composition.**

Instructed: *"The opening book is `EPIC-005`'s. It CONSUMES your move interface. If your design would
change what the book consumes, name it as a dependency and stop."*

**My design does not change it, and I checked rather than assumed.** `EngineSeam` is
`(history: GameHistory) => Promise<Move>` at `src/turn-loop.ts:138`, **merged**, and `ABC-078` `A6`
requires `src/turn-loop.ts` **byte-identical**. So the book's consumed interface is untouched.

**What I am naming and stopping on:** if `EPIC-005` needs a *"book first, else search"* composition
point, or a way to ask the engine to skip the book, **that is a contract question about a merged
type and it is not resolved here.** Second-order and recorded on `ABC-085` `## Out of scope`: the
ladder diversifies openings by a **seeded early-move choice, not a book** — and **if a book later
changes what the engine plays from the start position, `ABC-085`'s baselines are invalidated and
must be re-measured.**
