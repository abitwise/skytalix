---
id: 20260809T232401Z-security-nfr-observation-3434c8ce
kind: observation
by: security-nfr
at: 2026-08-09T23:24:01Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-009
  - ABC-010
  - src/moves.ts
  - src/fen.ts
  - src/legal.ts
  - src/history.ts
  - src/zobrist.ts
supersedes: 
---

# The security classification tested against ASVS L1 rather than repeated — it HOLDS, and the one axis nobody had swept is swept here

The ticket claims **no security trigger** and says *"do not inflate it."* The brief said to **check
that reasoning against ASVS L1 rather than repeat it**. Checked. **The classification is correct**,
and this gate can give it a stronger reason than the ticket has: the module is not merely free of
sinks — **it is unreachable from any input surface that exists.**

## Every sink class grepped at the source, across all thirteen non-test files under `src/`

Not assumed, not sampled — each pattern run over
`apply.ts fen.ts frame.ts gameend.ts glyph-mode.ts history.ts legal.ts moves.ts perft-bench.ts
perft.ts position.ts render.ts zobrist.ts`:

```
eval / new Function / node:vm / require(          NONE     (V1.3.2)
child_process / execSync / spawn                  NONE     (V1.2.5)
node:net|tls|http|https|dgram / fetch             NONE     (V12.x)
node:fs / node:path / any file operation          NONE     (V5.x)
SQL / innerHTML / DOMParser / new URL(            NONE     (V1.2.1-1.2.4, V1.5.1)
node:crypto / password / secret / token / apiKey  NONE     (V11, V13.3)
JSON.parse / structuredClone / deserialize        NONE     (V1.5.2)
process.argv / process.stdin / process.env        only src/glyph-mode.ts (a different module,
                                                  EPIC-002) — NONE in src/moves.ts
any logging at all                                only src/perft-bench.ts's console.log
```

## The call graph closes it

- **`addPawnMoves` is module-private** — not exported; its only caller is `generateMoves`.
- **`generateMoves`' only non-test caller in the entire repository is `src/legal.ts:46`
  (`legalMoves`).** `apply.ts`, `perft.ts` and `history.ts` import only types and flags from
  `src/moves.ts`.
- **`parseFen`'s only non-test callers are `src/history.ts` — which has ZERO non-test importers —
  and `src/perft-bench.ts`, which passes hardcoded FENs.**
- `package.json` has **no `bin`, no `main`, no `exports`, and `dependencies` is `{}`** — no runtime
  dependency at all. There is no CLI entry point until `EPIC-006`.

**No user-supplied string reaches `src/moves.ts`, and no user surface exists at all.** The
consequence of the defect is a wrong chess answer and a corrupted in-memory board: **reliability, not
security.** The 2026-07-29 architecture audit gave `ABC-009` the same classification and nothing
found here overturns it. **Nothing was inflated** — the corrupted-position consequence is a durable
integrity failure and it is still reliability, because there is no attacker, no trust boundary and no
sink; and the fix removes it.

## The trust boundary, named precisely, because that is where the risk actually lives

`parseFen` validates **syntax and structure** and names every rejection: 6 fields, 8 ranks, legal
placement characters, exactly one king of each colour, a `w`/`b` side to move, a castling field of
`K|Q|k|q|-`, non-negative clocks, and an ep field that is `-` or a well-formed square name. It
performs **no consistency check between `epSquare` and the board** — `src/fen.ts` 170-176 simply
assigns the parsed square. That is the gap this defect class needs, and it is **`ABC-010`'s**
(re-checked at the source: `Backlog`, `status: backlog`, `priority: P1`, `epic: EPIC-003`).

`ABC-022` does not close it and does not claim to. What `ABC-022` does is make the module honest
about its own preconditions **without depending on a caller having validated its input** — which is
the assumption that failed here in the first place.

## The one security-shaped question this change actually raises, asked and answered

The fix adds a board read whose index is **derived from `epSquare`**:
`position.board[to - forward]`. Whether a crafted `epSquare` can make that read throw or wander is an
**availability** question, and it is **the one axis nobody on this ticket swept** — BA/PM's
131,072-state sweep varied the two *bytes* the guard reads, and BA/PM's own soft-edge note says
plainly: *"I did not sweep `epSquare` values, off-board targets, kingless boards."*

Swept here, exhaustively, on two base positions x `epSquare` = **-1..255** = **514 states** (128
on-board 0x88-valid, 386 off-board or out of range), each base FEN printed and re-parsed, one OS
process per tree, `tsc --noEmit` exit 0 on both trees first:

```
                        states that THREW    states offering an ep move
t-fix   (branch tip)            0                      2
t-pristine (main)               0                      4
```

- **Zero throws on either tree.** An out-of-range index into the `Uint8Array(128)` board yields
  `undefined`, which fails the `=== capturedPawn` comparison, so **the added guard fails closed** —
  no crash, no out-of-range access, no denial-of-service shape, on any `epSquare` value.
- On the fix the only two emitting states are the genuinely valid ones (`0x53` = d6 white,
  `0x24` = e3 black). On `main` there are **four**: the same two plus `0x55` (f6) and `0x22` (c3) —
  exactly this ticket's over-offers, on the *other* capture side. **The change halves the emitting
  surface over that domain.**

**The one security-adjacent property this change touches comes out in the change's favour.**

Instrument limit, stated rather than glossed: `parseFen` cannot produce an off-board `epSquare`
(`parseSquareName` rejects it), so those states were written **directly** onto the position — a
direct-write limit of the same kind BA/PM's byte sweeps recorded.

## The active ASVS L1 set, counted at the source

**70 active requirements** at `security.asvs_level` `L1`, of the standard's 345 — counted from
`agent-factory/checklists/security-nfr-checklist.md`, not assumed. **V16 (Security Logging and Error
Handling) and V17 (WebRTC) carry NO L1 requirement at all** — 29 rows between them, zero at L1.

- **V2.2.1 — PASS, and this change is the thing that makes it pass.** The requirement is that input
  is validated against "an expected structure and logical limits according to predefined rules". The
  rules were written in `src/moves.ts`'s own comment and enforced by nothing; the fix enforces both
  at the point of use. Measured above: 2 emitting states over the `epSquare` domain where `main` had
  4.
- **V2.1.1 — PASS on the syntactic half, boundary half OWNED.** `src/fen.ts` documents the FEN rules
  and names each rejection; `src/moves.ts` 183-195 now documents the en-passant preconditions **and**
  enforces them. The semantic rules are documented in `ABC-010` and not implemented.
- **V2.2.2, V2.3.1, V5.2.1, V15.3.1 — PASS BY ANALOGUE**, each labelled by analogue and not as a
  literal pass. V2.2.2: validation sits in the rules core, the trusted layer; there is no client.
  V5.2.1: the input is a fixed 128-byte board and the added work is bounded at <= 1 evaluation per
  call, so no input size drives cost. V15.3.1: the change makes the returned set strictly
  **narrower** — it stops emitting a move whose `captured` field claims a piece the board does not
  hold.
- **V1.2.1-1.2.5, V1.3.1, V1.3.2, V1.5.1, V3.x (8 rows), V4.1.1, V4.4.1, V5.2.2, V5.3.1, V5.3.2,
  V6.x (13 rows), V7.x (6 rows), V8.x (4 rows), V9.x (4 rows), V10.4.x (5 rows), V12.1.1, V12.2.1,
  V12.2.2, V14.2.1, V14.3.1 — N/A**, each because the surface does not exist and each grepped rather
  than waved away. **V7 session management is NAMED as N/A rather than skipped.**
- **V11.3.1 / V11.3.2 / V11.4.1 — N/A, and named rather than passed over in silence**, because a
  reader grepping for "hash" will find `src/zobrist.ts`. Its hash is a **Zobrist position key** — a
  non-cryptographic XOR over a fixed random table, for transposition lookup. It is not a "general
  cryptographic use case": no signature, no HMAC, no KDF, no random-bit generation. Untouched by this
  ticket.
- **V13.4.1 — DEFERRED and NOT relaxed.** Owner Architect/Design at `EPIC-006`; this project deploys
  nowhere (`ADR-0007`), and `plans/nfr-catalog.md`'s "Two ASVS deferrals DO depend on packaging"
  section already records it.
- **V15.1.1 and V15.2.1 — NOT MET.** Treated in the `decision` note, because an L1 fail defaults to
  **high** and `block_on` is `high`, so it is the one place the verdict turned on a judgement.

## Logging — looked for, and the honest finding is that there is nothing to log

A failure mode with no log is normally what this gate flags. It does not apply here: the module logs
nothing, the only logging in non-test `src/` is `perft-bench.ts`'s `console.log`, V16 carries **zero**
L1 requirements, and the fix **eliminates** the failure mode rather than instrumenting it. **No
logging was asked for** (rules 5 and 8).
