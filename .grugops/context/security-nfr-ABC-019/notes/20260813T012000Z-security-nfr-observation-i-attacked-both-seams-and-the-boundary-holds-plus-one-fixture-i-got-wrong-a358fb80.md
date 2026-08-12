---
id: 20260813T012000Z-security-nfr-observation-i-attacked-both-seams-and-the-boundary-holds-plus-one-fixture-i-got-wrong-a358fb80
kind: observation
by: security-nfr
at: 2026-08-13T01:20:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-018
  - ABC-009
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - src/turn-loop.ts
  - src/frame.ts
  - src/history.ts
supersedes:
---

# I attacked both seams — the trust boundary HOLDS. Plus one fixture I got wrong, said rather than smoothed

The seams are where a value the loop did not produce crosses into a board the loop owns. I built my
own attack harness out of tree, importing the delivered module directly, and wrote nothing into
`src/`.

## `A10b` — the input seam returns a move NO GENERATOR PRODUCED: **HOLDS, on all five clauses**

| clause | measured |
|---|---|
| (i) not applied | `moves.length` **0 → 0**; `toFen` **byte-identical** to before the prompt |
| (ii) exception propagates, no reason invented, no result reported | **threw** `input seam returned a move that is not in \`legalMoves\`` |
| (iii) no `LoopOutcome` at all | **none returned** — cannot be mistaken for `A8`'s end-of-input |
| (iv) `engine-failure` NOT reused, `A14` unchanged | **not reused** — no terminal-reason value is produced on this path at all |
| (v) zero render calls and zero sink writes between receipt and throw | **0 and 0** (the one frame and one write are the legitimate pre-prompt frame, `A2`) |

**The sharp attack the criterion invites, and it also holds.** A real parser that builds its own
`Move` rather than returning a generator-owned one gets a *field* wrong, not a *square*. I fed the
loop a move with the **right `from`/`to`** and exactly **one** wrong field, four times:

| tampered field | applied? | `toFen` unchanged | `moves.length` |
|---|---|---|---|
| `captured` | **NO — threw** | ✅ | 0 |
| `flags` | **NO — threw** | ✅ | 0 |
| `promotion` | **NO — threw** | ✅ | 0 |
| `piece` | **NO — threw** | ✅ | 0 |

**The six-field comparison in `wasGenerated` is real, and it is the right shape.** `playMove` reads
`captured` / `flags` / `promotion` to build the undo record, so a `from`/`to`-only check would have
let a wrong-`captured` move corrupt the board exactly as a foreign move does. It does not.

**And it is ONE shared test for both seams.** The engine path and the input path call the same
`wasGenerated`; what they do not share is the answer to a false — the engine terminates with
`engine-failure`, the input seam throws. That is the correct split and it is the cheapest one.

## `A9b` — the input seam THROWS mid-bracket: **HOLDS, including the identity of the rethrow**

Fixture in the criterion's exact shape: mutate the **live borrowed position** via `makeMove` and
throw, **move list untouched** — which is precisely what `legalMoves` does internally and what a real
parser leaves when it throws mid-filter.

- **Position REPAIRED** — `toFen` after == `toFen` before, `moves.length` **0**.
- **The exception propagates on the ORIGINAL BINDING** — `caught === sentinel` is **true**. Not
  wrapped, not re-created, not a new `Error` carrying the message. The Orchestrator asked me to check
  this specifically; it is exact.
- **No `LoopOutcome`** returned; **no `input ended` notice**; **0 render calls and 0 sink writes**
  after the throw. Nothing reaches the player on this path at all.

## A FIXTURE I GOT WRONG, AND I AM RECORDING IT RATHER THAN DELETING IT

My **first** `A9b` fixture used `playMove` — which appends to the move list **and** mutates the
position — and it came back `fenRepaired: false` with `moves.length` **1**. Read carelessly that is a
loud defect report on a `P0`. **It is not a defect; my fixture was the wrong shape.** `A9b`'s words
are *"throws from inside a `makeMove`/`unmakeMove` bracket"* — position mutated, list not.
`takeBack(history, 0)` rebuilds the position **from the list**, so with a move my own seam had
appended, it faithfully restored the position **to agree with the list**, which is what it promises.

**Re-run in the criterion's shape it is green, and the criterion's own replay clause holds in BOTH
shapes** — measured: with the appended move, `toFen(position)` still equals `toFen` of the position
replayed from `{initialFen, moves}`. **A wrong fixture nearly produced a wrong verdict on the one
ticket that has waited longest, and the correction is on the record instead of in a deleted file.**

**What the wrong fixture did buy is a real and narrower fact — the DOMAIN of the repair primitive.**
`takeBack(history, 0)` repairs the **position** to agree with the **move list**; a corrupted **list**
is outside its domain, and the repair *cements* a phantom ply rather than removing it. `## Scope`'s
promise is *"nobody downstream is ever handed a mid-mutation board"* and a phantom-ply board is not
mid-mutation — it is a consistent board of a different game. **So the criterion is met and this is
outside it**, which is why it is recorded as accepted risk `R-B` with an owner and a trigger, and not
as a required fix.

## The ENGINE seam — both failure modes **HOLD**

| attack | outcome | board |
|---|---|---|
| returns a foreign move (transition 13) | `{result: null, reason: "engine-failure", exitCode: 0}` — **distinct from every `EndReason`**, `result` **null**, **1** frame | not applied, `toFen` unchanged, `moves.length` 0 |
| throws mid-bracket (transition 12) | `{result: null, reason: "engine-threw", exitCode: 0}`, **1** frame, no extra sink write | **repaired**, `moves.length` 0 |

**A result screen can never present an engine bug as a chess outcome** — measured, not read.

## The path NO criterion covers — and it does NOT corrupt

`wasGenerated` runs **outside** the `try`/`catch` that `A9b` installs, so a throw from the comparison
itself gets no `takeBack`. I attacked it four ways with a malformed `move`:

| supplied `move` | threw | `toFen` unchanged | `moves.length` |
|---|---|---|---|
| `null` | `Cannot read properties of null (reading 'from')` | ✅ | 0 |
| `undefined` | `Cannot read properties of undefined (reading 'from')` | ✅ | 0 |
| `7` (a number) | the loop's own membership error | ✅ | 0 |
| a `Proxy` whose getter throws | `getter exploded` | ✅ | 0 |

**No corruption in any of the four.** `legalMoves` completes and unmakes before the comparison runs,
so there is nothing mid-mutation to leave behind. **The structural exposure is real and the measured
consequence is nil** — so it is reported as checked-and-clear, not inflated into a finding. **I am not
requesting a `try` around it: adding a repair for a corruption that cannot occur is exactly coding
rule 8, and the exception reaching the caller unrepaired is the same outcome `A9b` deliberately
chose.**

## The MESSAGE channel — the loop is a pure pass-through, measured

The loop assigns `messages = outcome.messages` and hands them to the render seam **untouched**. I
supplied four hostile items through the input seam — an `ESC`-based `CSI 2J CSI H`, an embedded
newline, a **C1 `U+009B` (CSI)**, and a 300-character item:

- `reachedRenderSeamIdentical`: **true**. `loopSanitizesAnything`: **false**.
- The loop's own sink writes on that run were the frames and the constant `"input ended\n"`.
  **The loop introduces no injection of its own** — it has exactly one literal it ever writes.

**So the entire control lives behind the seam, and `EPIC-006` wires the seam.** `src/turn-loop.ts`'s
`RenderSeam` type records **no** sanitization obligation, and it cannot — a function type cannot carry
one.

**I then measured what the merged sanitizer actually does, because the ticket's justification rests
on it.** `src/frame.ts`'s `sanitize` drops `code < 0x20` and `U+007F` **always**, and everything above
`U+007F` **only in `ascii` glyph mode**:

| code point | `unicode` mode | `ascii` mode |
|---|---|---|
| `U+001B` ESC | **stripped** | stripped |
| `U+007F` DEL | **stripped** | stripped |
| `U+0084`, `U+0085`, `U+008D`, **`U+009B` (CSI)**, `U+009C`, `U+009D` | **SURVIVES** | stripped |
| `U+00A0`, `U+200B`, `U+2028` | **SURVIVES** | stripped |

**So the ticket's sentence — *"No security trigger of its own. The loop places strings; `ABC-018`
sanitizes them"* — is measurably narrower than it reads.** In `ascii` mode it is fully true. In
`unicode` mode the **whole C1 control block survives into the frame**, including `U+009B`, the
single-code-point CSI. Whether a given UTF-8 terminal *acts* on `U+009B` arriving as `C2 9B` is
emulator-dependent — xterm in UTF-8 mode does not, some terminals and multiplexers with 8-bit controls
enabled do — and I cannot test a real terminal from here, so **that half is `UNKNOWN - verify`.**

**This is `ABC-018`'s merged, already-gated code and I did not open it, did not re-open its ticket,
and am not requesting a change to it.** What is `ABC-019`'s is that its own security justification
delegates to a control whose scope is narrower than the sentence claims. Recorded as accepted risk
`R-A`, with the ticket-text half flagged to BA/PM rather than taken.

## Checked and clear — stated so the absence is evidence rather than an oversight

- **No secrets** anywhere in the branch's `src/` diff. The `token` matches a naive grep returns are
  the input stub's coordinate tokens.
- **No dangerous primitive** in `src/turn-loop.ts`: no `eval`, no `new Function`, no `child_process`,
  no `fs`, no `net`/`http`, no `process.*`, no `Math.random`, no `require`. Its **entire** runtime
  import surface is five modules, three of them type-only.
- **No dependency change**: `package.json` and `package-lock.json` diff vs `main` is **0 lines**.
- **No unbounded-resource control is owed.** The loop's only non-terminating path is a seam that
  never advances and never returns `eof`, which is a seam defect in a local single-user CLI with no
  shared resource to exhaust. ASVS anti-automation (`V2.4.1`) is **L2** and this is `L1`. **Inventing
  an iteration cap here would be gold-plating a game loop for looping until the game ends.**
- **`ABC-009`'s phantom-king mutation is carried, not new.** `legalMoves` is called outside any repair
  bracket in both `wasGenerated` and `gameStatusOf`, so a semantically-invalid position would corrupt
  permanently — but that is `ABC-009`'s own named escalation trigger, already recorded in this
  ticket's `## Dependencies` as *carried, not owned*, and no position from outside the rules core can
  reach this loop until `EPIC-003`'s FEN entry ships. **Not re-scoped here.**
