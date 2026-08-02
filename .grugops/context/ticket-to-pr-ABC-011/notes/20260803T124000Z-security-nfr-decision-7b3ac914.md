---
id: 20260803T124000Z-security-nfr-decision-7b3ac914
kind: decision
by: security-nfr
at: 2026-08-03T12:40:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - ABC-012
  - ABC-020
  - EPIC-001
  - EPIC-004
  - EPIC-006
  - NFR-005
  - NFR-001
  - ADR-0002
  - ADR-0005
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - src/zobrist.ts
  - src/legal.ts
  - src/zobrist.nfr.test.ts
  - src/gameend.nfr.test.ts
supersedes: 
---

# VERDICT: PASS. `In Security/NFR` → `Ready for UAT`, with the handed-forward gap PINNED and three risks accepted

The exit this role owns, taken on a **PASS**. Gate run against `security.asvs_level: L1` and
`security.block_on: high`. **No security finding at any severity and nothing at or near `high`, so
nothing blocks.** `NFR-005` — acceptance criterion 7, and the whole of what this column adjudicates —
is **MET on both halves**, re-measured independently. **No production code was changed at this gate.**

## The result in the role's own vocabulary

`PASS_WITH_RISKS`: the gate returns **PASS**, and three accepted risks ride with it, each carrying a
named owner. None is at `high`. Nothing was merged and nothing was deployed — a human holds both.

## Why PASS and not FAIL, stated so it can be argued with

Everything the ticket makes this column responsible for holds, and I checked each rather than
inherited it. The `NFR-005` numeric ceiling is met with room at both anchor positions. The sub-bar is
met **structurally**, which is the only way it can honestly be met. The one gap that was genuinely
open — rule 1's short-circuit held by nothing in the repository — is now closed rather than passed
along a fourth time. The two defects on my desk are both real, both named in full, and both sit in
the invalid-FEN class this ticket's `## Out of scope` explicitly carries and that `ABC-010` exists to
close; neither is reachable by play and neither has a security consequence.

A FAIL here would send a ticket back to `In Development` for a change no one in dev is authorised to
make — the predicate-vs-oracle divergence is a *definition* question the design hop ratified, not an
implementation slip — and would spend the sequencing win (`ABC-012` unblocked) that this P1 was
pulled ahead of two P0s to buy.

## Acceptance criterion 7 — measured independently, nothing accepted from the two prior roles

Own scripts, own baseline (`4c6ed7d` extracted with `git archive`), both trees imported in **one**
process, 300,000 iterations per cell after a 50,000 warm-up, every cell interleaved forward **and**
backward so drift hits both variants equally, two samples. **Apple M3 (Mac15,13) / Node v24.12.0 /
darwin-arm64 — `UNKNOWN - verify` on any other hardware.** The machine-independent quantity is the
ratio to the baseline tree in the same process, never the absolute nanoseconds.

| position | merged (`4c6ed7d`) | ABC-011 | ratio | bar |
|---|---|---|---|---|
| **startpos — no ep square** | 296.8–340.7 ns | **297.2–298.4 ns** | 0.872–1.006 | ≤ ~450 ns — **MET** |
| **kiwipete — no ep square** | 318.4–334.0 ns | **323.5–330.9 ns** | 0.969–1.039 | ≤ 432–459 ns — **MET** |
| position-3 — no ep square | 165.8 ns | 166.2–166.8 ns | 1.003–1.007 | not a bar position |
| ep set, no capture at all | 309.1–310.1 ns | 307.4–378.2 ns | 0.991–1.224 | not a bar position |
| ep set, capture available | 300.6–301.6 ns | 417.6–420.8 ns | **1.385–1.400** | worst case, **under 1.5x** |
| the divergence FEN (sparse) | 147.8–148.2 ns | 260.6–261.0 ns | 1.759–1.766 | not a bar position |

**How mine cross-check theirs — the spread this column was asked to adjudicate is resolved.** My
worst-case per-call shape (**1.385–1.400x**) lands **between** the dev hop's 1.357–1.383x and the
design hop's 1.45–1.48x. Three independently written runs therefore agree that the shape is real, is
the worst on the table, and is comfortably inside the 1.5x bar — the two prior figures were not in
conflict, they bracketed the truth. My divergence-FEN ratio (1.759–1.766x) sits just under the dev
hop's 1.771–1.858x and **confirms their reading of it**: an artefact of a five-piece board where the
base key costs half the normal amount, not a bar position, and its absolute cost (261 ns) is *below*
the bar's own anchor value.

**One cell of mine is noisy and is reported as measured rather than smoothed:** "ep set, no capture
at all" sampled 307.4 ns and 378.2 ns across the two runs. It is not a bar position and both samples
sit far under any ceiling, but a range that wide is a fact about my measurement and belongs on the
record rather than in a footnote.

## The sub-bar, and why wall clock is the wrong instrument for it

The bar's second half reads *"the no-ep-square path, which is the overwhelming majority of nodes, is
not made slower at all."* **My own timings put the shipped tree at 1.003–1.007x of baseline at
position-3.** That is inside noise — and that is exactly the point: **no wall-clock run can settle
"at all"** at that resolution, and quoting a sub-1% delta either way would be pretending to a
precision I do not have.

The claim is **structural**, and that is how I verified it. On a no-ep node
`position.epSquare !== NO_SQUARE` evaluates false, the `&&` short-circuits, and the executed work is
byte-for-byte what the pre-`ABC-011` tree executed. Re-spied with my own counting shim through a copy
of `zobrist.ts` whose body I `cmp`-verified identical to the shipped file apart from its two import
specifiers, over a depth-3 walk of all six perft roots:

```
nodes hashed                 277,955
nodes carrying an ep square   17,663
hasLegalEnPassant calls       17,663
  ... on the 260,292 NO-EP nodes:  0      <- the sub-bar
max predicate calls per zobristKey call: 1
```

**Identical to the Engineer's counts to the node**, on a script that did not exist when theirs ran.

## The judgment both prior roles handed me: PINNED, and I own the call

**I pin it.** `src/zobrist.nfr.test.ts`, suite **189 → 193**, skip count still 0.

Both roles argued it was mine and both were right, for the reason QE reached independently: there is
nothing here for a behavioural test to grab. `Z1` (reorder), `Z4` (drop the guard) and `L11` (delete
the predicate's own `NO_SQUARE` early return) are behaviour-**equivalent** — they change no key on
any input — so only cost moves, and only on the majority path, which is this ticket's `NFR-005`
sub-bar verbatim. The instrument is a spied call count. That is the `src/gameend.nfr.test.ts` shape
this column wrote for `NFR-001` on `ABC-020`, and the precedent that column set was not merely "add a
test": it was **"a measurement is not a guard."** Leaving this measured-but-unpinned would reproduce
the exact condition `ABC-020` found and named — three bars held by nothing in the repository.

**Weighed rather than repeated by reflex**, since the task asks that of me: the ABC-020 precedent is
about instrument *and* placement, and both carry over intact. Separate file, for the reason that file
states in its own header — a `vi.mock` factory is hoisted to file scope, so putting these assertions
in `src/zobrist.test.ts` would re-route the module graph for all 13 tests there to buy four
assertions. Here it re-routes nothing else. What does **not** carry over is ABC-020's assertion
*shape*: that file pins three bars on one function's call counts; mine needs a byte-identity
assertion as well, because the mutant this ticket actually fears damages state rather than counts.

**Each assertion was proven to fail rather than assumed to**, by applying each mutant to `src/` in
turn and running it:

| assertion | kills | previously |
|---|---|---|
| zero `hasLegalEnPassant` calls across four no-ep positions | `Z1`, `Z4` | survived 189 tests |
| exactly one call on each of three ep-set positions | over-suppression / recomputation | — |
| returns `false` **and** touches no board byte, on two no-ep probe FENs | `L11` | survived 189 tests |

**The second probe FEN is my own contribution and it is why the byte assertion is not redundant.**
On `4K3/8/8/8/8/k7/p7/R7 b - - 0 1` the a2 pawn's departure discovers the a1 rook on the a3 king, so
under `L11` the predicate still returns the **correct** `false` — and still leaves a stray pawn on
off-board square 15. There the board-identity assertion is the only one that bites. I built that
position precisely because the first FEN's return-value assertion fires first and would have let me
ship a byte assertion I had never seen fail.

**What I deliberately did NOT pin.** No wall-clock assertion, anywhere — it would be a test that
passes or fails on the machine that runs it. The nanoseconds live in `plans/nfr-catalog.md` with
their machine, which is the discipline `src/gameend.nfr.test.ts` states and I am not weakening it.

## The off-board write: a CORRECTNESS defect, not a memory-safety one

QE asked this column to judge it without inflating it or waving it off. Measured rather than
asserted:

- `Position.board` is a **`Uint8Array(128)`**, and the stray write lands on **index 15 — inside the
  allocation.** "Off-board" here is the 0x88 encoding's *logical* predicate (`(sq & 0x88) !== 0`),
  **not a memory bound.**
- This runtime **discards** out-of-allocation typed-array writes outright. Probed directly:
  `probe[-1] = 9` and `probe[999] = 9` both read back `undefined`, with `length` and `byteLength`
  unchanged. There is no pointer arithmetic, no adjacent memory and no overflow reachable here.

**So it is not a memory-safety concern in this runtime.** ASVS **V1.4.1** (memory-safe copies,
buffer/heap overflow) is **not-applicable** — and it is an L2 row in any case, outside this project's
L1 tier. Saying otherwise would be the inflation the task warned against.

**What it *is*, and why it still earned a guard rather than a shrug:** it breaks an invariant a
**live consumer** leans on. `kingSquareOf` locates the king with `position.board.indexOf(KING |
colour)` across all 128 bytes, and its own doc comment cites *"off-board squares are EMPTY"* as the
reason that scan is sound. This mutant writes a PAWN byte, so it does not fool that scan — but it is
the invariant the scan depends on, and the tidy-up that produces it left 189/189 green. A latent
correctness hazard that no test in the repository can see is worth four assertions.

## QE's new defect: ruled MEDIUM, does not block

Reproduced by me on all three of QE's FENs against the shipped tree, and against the `4c6ed7d`
baseline for contrast — **unchanged on all three there**, so the property is genuinely new since
`ABC-011`. QE's fairness to the Engineer was checked and holds: on the first two FENs the ruled
oracle `legalMoves(p).some(...)` corrupts **identically**, so that pair is pre-existing in
`generateMoves` + `apply`; on the third, `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1`, `generateMoves` does
**not** offer the ep move, the oracle returns `false` and leaves the position clean, while
`hasLegalEnPassant` returns `true` and corrupts — a genuine predicate-vs-oracle divergence, confirmed
here.

**Reachability verified independently rather than accepted.** The only two writes to `epSquare` in
`src/` are `fen.ts:175` (`parseFen`, which validates the field is a square *name* and nothing about
the board) and `apply.ts:139`, which sets it to `(move.from + move.to) / 2` **only** on a pawn double
push — geometry that guarantees both the capturable pawn and the empty target. **No position
reachable by play can trigger it.**

**MEDIUM**, not LOW: a function whose header promises the position comes back *"as they found it"*
now silently and **permanently** mutates a caller's data on that input class, and a maintainer will
read that header as a guarantee. **Not HIGH**: unreachable by play, no untrusted-input path exists in
a library with no entry point until `EPIC-006`, and no security consequence. **It does not block.**
Owners: **BA/PM** to cut it or fold it into `ABC-010`; **Architect/Design** to rule the
predicate-vs-oracle divergence, which is a definition question and not an implementation one.

I did not re-litigate QE's settled LOW calls, and I did not add a test asserting the current
behaviour — that would enshrine the defect as intended, which is QE's reasoning and it is correct.

## Security review: no finding at any severity

The ticket's "No security trigger" line is **upheld on inspection rather than quoted**. `src/` has no
`eval`, `new Function`, `vm`, `child_process` or `require`; no `fs`, no `http`/`https`, no `fetch`,
no `process.env`, no `os` — grepped, all absent. Zero runtime dependencies, `package.json` and the
lockfile byte-untouched by this ticket, so no new supply-chain surface. No secret-shaped string in
the `4c6ed7d..HEAD` diff. No auth, no session, no privilege, no personal data, no logging (and none
is required at L1). `compliance_regime` is empty, so no Compliance Officer hop is owed.

**Where the change touches data it did not touch before** — the one genuinely new exposure, and what
I looked hardest at: `zobristKey` used to **read** the board and nothing else; it now **writes** it
transiently through `makeMove`/`unmakeMove` on the ~1–2% of nodes carrying a legal ep capture. Both
defects on this desk are instances of exactly that, which is the honest reading of the risk this
design took on. Purity on the reachable population is intact and pinned by QE's 277,949-node walk; I
re-verified byte purity across all six of my own benchmark positions (board bytes and `toFen` both
identical).

The ASVS L1 tier and the four rows worth naming are in the `observation` note beside this one.

## Three accepted risks, each with a named owner

1. **Every timing figure on this ticket is one machine** (Apple M3 / Node v24.12.0 / darwin-arm64)
   and `UNKNOWN - verify` anywhere else. **Owner: `EPIC-004`'s non-M3 spike**, which already carries
   the identical obligation for `NFR-005`'s depth-7 PROVISIONAL marker.
2. **`zobristKey` permanently corrupts a semantically-inconsistent ep position** (MEDIUM,
   invalid-FEN class only, unreachable by play). **Owners: BA/PM** (cut or fold into `ABC-010`) and
   **Architect/Design** (the oracle divergence).
3. **The amortized per-node figure is measured on a perft-table population, not a search's node
   distribution**, which stays `UNKNOWN - verify` until a search exists. I did **not** re-measure the
   amortized row — the two prior runs agree and re-deriving it a third time buys nothing this gate
   needs. **Owner: `EPIC-004`.**

## Board move I own

`plans/board.md`: **ABC-011 `In Security/NFR` → `Ready for UAT`**. In Security/NFR 1/2 → 0/2, Ready
for UAT 0/4 → 1/4. **No limit approached, no override taken, no written reason owed.** UAT is
recorded as **DEFERRED to `EPIC-006`, not passed** — the `ABC-020` and `ABC-004..007` precedent, for
the same unchanged reason: no runnable game exists, so there is no surface a human can exercise and
marking one passed would be a fabrication.

`ADR-0005` is still `proposed`; **no agent may mark it `accepted` and this gate did not.** Nothing
was merged and nothing was deployed.
