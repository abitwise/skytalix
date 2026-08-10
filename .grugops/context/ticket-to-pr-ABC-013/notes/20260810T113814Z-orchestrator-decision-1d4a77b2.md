---
id: 20260810T113814Z-orchestrator-decision-1d4a77b2
kind: decision
by: orchestrator
at: 2026-08-10T11:38:14Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - ABC-009
  - ABC-022
  - ABC-023
  - ADR-0004
  - EPIC-002
  - EPIC-003
  - src/san.ts
  - src/moves.ts
  - src/apply.ts
  - plans/board.md
  - plans/tickets/ABC-013-san-rendering.md
supersedes: 
---

# `ABC-013` opened; nothing is unsatisfiable, but its acceptance net has holes and its NFR bars were set against a tree that no longer exists — Definition of Ready comes back **AMBER**, no board move taken

This note opens task `ticket-to-pr-ABC-013` on branch `grugops/ticket-to-pr-ABC-013`. **No board move
is taken by it.** `ABC-013` stays in `Ready`. The `Ready → Ready for Dev` exit is BA/PM's per
`plans/board.md` § Columns, and I do not take another role's exit.

## What the owner asked for, and what that does and does not authorise

> "go forward with ABC-013"

That names a ticket and nothing else. It is **not** a merge instruction: the last four hops on this
board each carried an explicit merge sentence and this one does not. The owner's standing merge
directive of 2026-08-06 (`memory-bank/60-progress.md` § "Standing directive") still exists and still
applies to work that PASSED — but nothing has passed yet, and I will return to the owner at the merge
point rather than assume it forward. Deploy is not included and nothing is deployed.

## Baseline re-measured on `main` at this hop, so nothing downstream inherits a number

```
npm test           625 passed / 625 on 18 files
skip count         0            (by the AGENTS.md `### Test integrity` command)
npm run lint       exit 0       (biome, 35 files, 2 infos, no fixes applied)
npm run typecheck  exit 0       (tsc --noEmit)
git HEAD           eb706f9      (main, clean tree)
```

## The dependencies are satisfied — verified, not assumed

- **`ADR-0004` is `accepted`** (ratified 2026-07-31). It blocked *"the merge of the first line of
  `src/san.ts`"*, never the cutting. Block lifted. Read its Status section before citing it: it was
  ratified by the **Orchestrator under a named, quoted delegation from Olger Oeselg**, is the first
  such ADR here, and is explicitly **not precedent**.
- **`ABC-003` and `ABC-005` are merged on `main`** — `makeMove`/`unmakeMove` and
  `legalMoves`/`isInCheck`, the four functions `toSan` is built on.
- **No merge-order constraint exists on this ticket.** `EPIC-002` names `ABC-013` only in its ticket
  list and in the `ADR-0004` history. It blocks `ABC-016` and `ABC-017`; nothing blocks it.
- **The green field is genuinely green.** `src/san.ts` does not exist and `toSan`/`parseSan` return
  **0 symbol matches** across `src/`. The two textual hits are comments in `src/frame.test.ts:65` and
  `src/perft.ts:44` that both say SAN is unbuilt and `ABC-013`/`EPIC-003` own it. My first grep for
  this was case-insensitive and matched substrings like "same"/"means"; it proved nothing and was
  re-run precisely. Recording that because an instrument that answers the wrong question is this
  Orchestrator's documented failure mode on this board.

## Six line references checked — all six still resolve. This came back CLEAN.

The ticket and `ADR-0004` clause 2b both hang their most load-bearing argument on exact line numbers
in merged code, and seven tickets have merged since they were written. Read at this hop:

```
src/moves.ts:46    export interface Move {                                          ✅
src/apply.ts:109   position.board[enPassantCaptureSquare(move)] = move.captured;    ✅
src/apply.ts:124   captured: position.board[move.to] as number,                     ✅
src/apply.ts:157   position.board[move.from] = move.piece;                          ✅
src/apply.ts:158   position.board[move.to] = undo.captured;                         ✅
src/apply.ts:160   if (move.flags !== FLAG_NONE) undoSpecial(position, move);       ✅
```

Stated positively because the precedent on this board would predict rot and there is none. The
move-identity invariant's mechanism is accurately described against today's tree.

## Definition of Ready — **AMBER**. The pull is NOT taken.

Checked against `agent-factory/checklists/definition-of-ready.md`. **Nothing here is unsatisfiable**
— this is not `ABC-023`, where `A4` pinned a dead hash and no correct implementation could have
passed. `ABC-013` is buildable today. What it is not is *pullable to dev*, on one checklist row:
**"acceptance criteria clear, testable and measurable"**.

### Defect 1 — the acceptance section breaks its own opening promise. 4 of 13 criteria carry no FEN.

`## Acceptance` opens: *"Every criterion is a hand-built FEN with an exact expected string."* The
castling criterion honours that (`r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1`). The four that decide the
hardest part of the grammar do not — they describe positions in prose:

- *"a position with white knights on `b1` and `d1` both able to reach `c3`"*
- *"a position with white knights on `c3` and `c5` both able to reach `e4`"*
- *"three white queens able to reach one square, two sharing a file and two sharing a rank"* — and
  its expected string is hedged **`(e.g. Qh4e1)`**, which is not an exact expected string
- the check / mate / promotion-mate criteria name no position at all

The geometry checks out where I could check it by hand (b1→c3 and d1→c3; c3→e4 and c5→e4), but
*"able to reach"* is not the test. **Disambiguation is decided against the LEGAL moves of the same
piece type** — the ticket's own Scope says so — so each of these needs a FEN in which both movers are
genuinely legal, neither is pinned, and no third piece of the same type joins the set. The three-queen
position additionally has to be constructible and legal at all. A prose criterion cannot be run, and
the ticket's Test notes forbid the obvious shortcut: *"Do not test against a generated expectation."*

### Defect 2 — the base case has no criterion at all, and that is a hole a wrong build fits through.

Thirteen criteria cover castling, three disambiguation levels, pawn capture, promotion, check, mate,
promotion-mate, purity, the `legal`-argument equivalence, the NFR bars and the suite. **None covers a
quiet pawn push (`e4`) or an unambiguous quiet piece move (`Nf3`)** — the two most common strings the
grammar will ever emit. *"Pawns implicit"* and *"no qualifier when the piece is unique"* appear in
`## Scope` and are asserted by no criterion.

**The candidate consequence, and it is a LEAD, not a finding:** a build that emitted `Pe4` for a quiet
pawn push appears to satisfy all thirteen criteria as written — the pawn-capture criterion pins
`exd5` and would kill a `Pexd5`, but nothing pins a quiet push. **I ran no mutant. I did not build
this. BA/PM must measure it rather than inherit my reading of it.**

This is **this board's recurring defect shape — a criterion narrower than its own `## Scope`** — which
was defect 1 on `ABC-022` and has now appeared on four consecutive tickets. Sweep for that shape
specifically; do not stop at the one instance I happened to see.

### Defect 3 — the two NFR bars are 1.5x figures measured against a tree that no longer exists.

`## Security / NFR triggers` sets `toSan(position, move, legal)` ≤ **0.20 µs** and
`toSan(position, move)` ≤ **6.5 µs**, both *"~1.5x wave 1's measured figures"* — measured **2026-07-30**
(Apple M3, Node v24.12.0, darwin/arm64). Since that date **`ABC-009` added two guard conditions to
`addCastlingMoves` and `ABC-022` added guards to `addPawnMoves`**, both inside the move generator.

By `ADR-0004`'s own ratio — **SAN is ~97% `legalMoves` and ~3% string work** — a change to that path
propagates almost undiluted into both bars. The direction of travel is reassuring and I will not
pretend otherwise: `ABC-009`'s own gate measured its two lines at **+1.30/+1.73 ns per call** against
a ±0.22 ns null floor, which is nothing against a 1.5x margin. **But that is an inherited number about
a different function, and "probably still fine" is not a measurement.** The bar is the engineer's
build target and the Security/NFR gate's pass condition; it must be re-derived at this hop, not
carried.

Related and cheaper: `NFR-003`'s *"~41 moves … ~25,000x under budget"* parenthetical rests on the same
stale figure.

### Defect 4 — a Test-notes sentence has become false, the same way `ABC-023`'s defect 3 was false.

`## Test notes` reads: *"it says nothing about `ABC-009` (malformed positions), which is out of scope
here."* **`ABC-009` merged 2026-08-09.** The sentence is written as though it were open. Low severity
and no code rides on it — but the purity criterion sitting three lines above it (*`toFen(position)`
byte-identical across the call*) is **directly downstream of what `ABC-009` fixed**: that ticket was
literally *"`legalMoves` mutates the position it documents as unchanged"*. Written on 2026-07-30 that
criterion asserted something the tree did not yet honour; today it should pass on merged code. Decide
whether it now cites `ABC-009`'s guarantee — and leaving a merged ticket teaching a false rule is
exactly what `ABC-023`'s defect 3 was about.

### The other nine checklist rows are clean

Problem ✅ (user, pain, and a named silent-failure value) · scope + out-of-scope ✅ (the cross-epic
`parseSan` boundary is named, fenced and carries the amended contract) · INVEST ✅ · dependencies ✅
(verified above) · NFR triggers marked ✅ (two numeric bars with a machine — their *values* are
defect 3, their *presence* is not in question) · test notes ✅ (and unusually good: they state their
own honest limit up front) · size `M` ✅ · priority `P1` ✅ · no major unresolved blocker ✅.

**Not XL.** `M` (3) is sound — one module, one function, a large case table — so no `SPLIT_REQUIRED`.

## What this note does NOT establish — re-derive, do not inherit

**Four is the floor, not the ceiling.** The precedent runs one way only: `ABC-018` five defects where
the pre-check named three; `ABC-009` seven where it named four, three seen by no pre-check and one
blocking; `ABC-022` seven where the pre-check named two; `ABC-023` six where the pre-check named
three, three named by no pre-check.

I did **not**:

- construct or validate a **single FEN**, or type a single expected SAN string. Every geometric claim
  above is hand-reasoning off a board in my head, not a parsed position.
- check that the three-queen position is legal, reachable, or that `Qh4e1` is the right answer for it.
- **run one mutant.** Defect 2's `Pe4` build is a reading, not a result.
- re-measure either NFR bar, or run `npm run perft`.
- verify that the disambiguation precedence in `## Scope` matches the FIDE/PGN rule in every corner —
  in particular the case where file-disambiguation is ambiguous but rank is not, which is what the
  `c3`/`c5` criterion is for and which implementations get wrong in both directions.
- check whether `toSan` needs anything from `ABC-023`'s castling hardening, or whether the `O-O`/`O-O-O`
  criterion interacts with the `+`/`#` suffix (a castle CAN give check; no criterion covers `O-O+`).
  That last one is a fifth candidate defect I am naming but not asserting.

## Routing, width, and why this hop runs alone

One subtask enqueued: **`ticket-to-pr-ABC-013-bapm` → BA/PM (Workflow 07)**.

Width **1**, and by dependency rather than by caution. Nothing downstream can start yet: the engineer
would build against an acceptance table with four unrunnable criteria and a stale performance target,
and the Security/NFR gate would later score the result against that same stale bar. `queue.wip_limit`
is 3 and `In Development` is 0/3 — **the room exists and is deliberately unused.**

No other role is activated. Architect is **not** — `ADR-0004` is ratified and the ticket says it
*"implements the seam; it does not re-decide it"*. System Analyst is **not** — no new flows. QE and
Security/NFR come after dev, per Workflow 04.

## Board state after this note

**Unchanged.** `Ready` 1/8 holds `ABC-013`; `In Development` 0/3; `Blocked` empty. Every WIP limit
respected. BA/PM owns the `Ready → Ready for Dev` exit and takes it only if the corrected ticket
earns it.

## One honest deviation, recorded rather than hidden

Workflow 16 names `scripts/context-io.ts` as the only sanctioned writer of this context, and
**that script does not exist in this repo** — there is no `scripts/` directory, and no note in any of
the 27 task folders here was ever written through it. This note is hand-authored markdown into the
same layout, which is this project's established and only available path. Flagged so the gap between
the kit's protocol and this repo's practice is on the record and not mistaken for compliance.
