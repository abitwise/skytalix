---
id: 20260807T121000Z-security-nfr-observation-9da8e1c0
kind: observation
by: security-nfr
at: 2026-08-07T12:10:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - ABC-015
  - ABC-018
  - EPIC-002
  - EPIC-006
  - src/render.ts
  - src/position.ts
  - agent-factory/checklists/security-nfr-checklist.md
  - 20260807T101500Z-qe-e2e-decision-1de25b5e
supersedes: 
---

# The "no security trigger" ruling RE-DERIVED: it HOLDS, and its STATED REASON IS INCOMPLETE

The ticket states the ruling and its reason: *"**No security trigger.** No user-supplied string
reaches this module; it renders bytes from `position.board`."* The subtask file was explicit that
neither half is to be taken on the ticket's word. **The ruling holds. The reason as written does
not, and this gate reports that rather than ratifying the ticket's wording.**

## Why the stated reason is incomplete

**Two of `renderBoard`'s three parameters ARE strings.** `GlyphMode` and `Orientation` are
TypeScript unions, and **a TypeScript union is erased at runtime** — it constrains every compiling
caller and constrains nothing at all at the call boundary. `EPIC-006` owns the `--ascii` /
`--unicode` flags and `ABC-015` owns the selection table; a CLI flag value is a user-supplied
string, and the shortest plausible implementation passes it straight through as `mode`.

So "no user-supplied string reaches this module" is a claim about a caller that does not exist yet,
not a property of this module. It is the wrong load-bearing sentence.

## What actually holds the property, and it is stronger

**THE FRAME'S OUTPUT ALPHABET IS CLOSED.** Every byte a frame can contain comes from a module
constant — `DARK_SQUARE`, `LIGHT_SQUARE`, `FILE_LETTERS`, the two `GLYPHS` tables, the literal
spaces, and `${rank + 1}` where `rank` is a loop variable bounded 0..7. **The board bytes and the
mode string are used only as lookup KEYS and are never emitted.** No data-dependent byte exists.

That is a structural property of the code, and it was also measured over a domain wider than the
standing FENs — **32 frames** spanning the 6 standing perft FENs, an empty board and a
fully-occupied 64-piece board, in both modes and both orientations:

- **42 distinct code points observed, 0 outside the fixed tables;**
- **0 control bytes** (no C0, no DEL);
- **0 ESC (`U+001B`) — no ANSI sequence is constructible from this module's output.**

This is the same property QE pinned as epic amendment `[A4]`, re-derived here independently and over
a wider input domain. QE's note correctly called its `[A4]` property test *"the executable form of
this ticket's 'no security trigger' rationale"*; this gate's finding is that the executable form is
**better than the prose it executes**.

## The adversarial campaign

**27 hostile `mode` values** against a full board — prototype keys (`constructor`, `__proto__`,
`prototype`, `toString`, `valueOf`, `hasOwnProperty`), a raw `ESC[31m` sequence, a 10,000-character
string, `<script>alert(1)</script>`, `; rm -rf /`, `'; DROP TABLE--`, `../../etc/passwd`, and
non-strings (numbers, `null`, `undefined`, `true`, `[]`, `{}`, a function, an object with a
`toString`):

- **ZERO injected a byte into a frame.** 26 threw a `TypeError`; 1 returned a clean frame.
- On an **empty board** all 27 returned a frame (the glyph table is never consulted) and **all 27
  frames were clean** — the shading path touches no table.
- **27 hostile `orientation` values injected zero bytes**, and produced exactly one distinct frame:
  anything that is not the literal `"white-bottom"` renders **black-bottom**.

## ONE REAL PROPERTY FOUND — a GADGET, not a vulnerability

Reported plainly, neither inflated nor buried.

`src/render.ts:118` — `const glyphs = GLYPHS[mode];`
`src/render.ts:139` — `const glyph = glyphs[pieceType(piece)] as readonly [string, string];`

Both are **unguarded prototype-chain lookups**. Under an **already-polluted `Object.prototype`**:

| mode | without pollution | with `Object.prototype[1..6]` polluted |
|---|---|---|
| `"unicode"` / `"ascii"` | clean frame | **clean frame — IMMUNE** |
| `"constructor"`, `"__proto__"`, `"toString"`, `"valueOf"` | throws `TypeError` | **INJECTED, ESC present, rows of 98 and 18** |
| `"nonesuch"`, `""` | throws | throws |

And through the second lookup, with a **legitimate** mode: `pieceType(b) = b & 7`, so indices 1..7
are reachable while the real tables hold 1..6 only. A board byte with `(b & 7) === 7` (7, 15, 23, …
255) throws today; with `Object.prototype[7]` polluted, `mode: "ascii"` **injects** — rows of 18
and 28.

**Three things bound it, and each was verified rather than argued:**

1. **Both real modes are immune** — the tables' own properties `1..6` shadow the polluted
   prototype. Verified with a **live-pollution control** in the same run, so the negative result is
   not vacuous.
2. **There is NO prototype-pollution sink anywhere in `src/`.** All production modules scanned with
   comments stripped: no `__proto__` write, no `JSON.parse`-into-merge, no `Object.assign` onto a
   user key, no dynamic `obj[key] = value` on untrusted input. The precondition cannot be created
   from inside this project. `ABC-012`'s gate separately established that `newGame(initialFen)`
   rejects prototype-pollution payloads.
3. **The second lookup needs a board byte no merged module can produce** — the same out-of-domain
   byte QE pinned.

`renderBoard` is a **gadget** in the prototype-pollution sense: it is reachable only *after* an
attacker already controls `Object.prototype`, which in a single-process Node application is a
position from which most of the process is already reachable. It is not a sink and it is not an
entry point. **LOW severity, does not block.** It is recorded because the exposure it would create
is exactly the one `ABC-018` will care about — **ESC into a terminal, and a broken 18-character
geometry** — and because the module's constant geometry is a property `ABC-016`, `ABC-017` and
`ABC-018` all compose against.

## The import closure, re-verified with comments stripped

`render.ts` → `position.ts` → **nothing**. Two files, **114 lines of code**, and **zero sinks**: no
`node:` builtin, `child_process`, `require(`, `eval(`, `new Function`, `process.`, `globalThis`,
`fs.`, `fetch(`, `exec(`, `Buffer`, `import(`, `console.`, `stdout`, `isTTY`, `setTimeout`,
`setInterval`, `crypto`, `JSON.parse`, `decodeURI`, or an escape literal. **The three
`process.` / `stdout` / `isTTY` matches in `src/render.ts` are all inside the doc comment that says
it reads none of them** — checked rather than counted off a grep, which is the exact fault the
Orchestrator's own correction note on this task recorded.

Zero runtime dependencies; `package.json` untouched by this ticket.

## No new data surface, and no information disclosure

The role's own instruction is to trace where a change touches data it did not touch before, because
that is where new exposure hides. **This change touches no new data.** Verified rather than
asserted: `castling`, `epSquare`, `halfmoveClock`, `fullmoveNumber` and `blackToMove` were all
mutated and **influence zero frame bytes** — a frame is a projection of the 64 on-board squares and
nothing else. The 64 off-board 0x88 squares stuffed with `0xFF` **change no frame byte**. All 128
board bytes and every `Position` field are unchanged across all 24 cells after rendering.

There is no secret, credential, token or personal datum anywhere in this project to disclose.

## ASVS L1 — judged, not padded

`security.asvs_level` is `L1`, so the active set is the **70 L1 requirements** of the 345 in
`agent-factory/checklists/security-nfr-checklist.md`. **Four are reachable and pass on evidence;
66 are structurally N/A**, with the reason stated per chapter rather than as a blanket.

| Requirement | Verdict | Evidence |
|---|---|---|
| **V1.3.2** — no `eval()` or dynamic code execution | **PASS** | zero across the closure, comments stripped |
| **V2.1.1** — documentation defines the input validation rules | **PASS** | `src/render.ts`'s header states the input contract, including that it validates nothing and **why** (`ABC-009`/`ABC-010` own validity), and names the consequence of a bad byte |
| **V15.3.1** — return only the required subset of a data object | **PASS** | measured: a frame is a board-only projection; four `Position` fields influence zero bytes |
| **V1.2.1–1.2.5** — output encoding for the target context | **PASS by analogue** | ASVS 5.0 enumerates HTTP/HTML/XML/URL/JS/SQL/OS contexts and **has no terminal-output requirement**. The nearest-in-spirit control is met by the closed alphabet: 0 ESC, 0 control bytes |

**N/A with reasons, by chapter:** V3 (8) and V4 (2) — no HTTP, no browser, no cookie, no header, no
CORS, no Content-Type. V5 (4) — no file is read, written, uploaded or named. V6 (13), V7 (6),
V8 (4), V9 (4), V10 (5) — no authentication, session, authorization, token or OAuth surface exists
anywhere in this project. V11 (3) — no cryptography in this closure. V12 (3) — nothing connects to
anything. V13 (1) and V15.1.1/V15.2.1 — distribution-dependent, already recorded as deferrals in
`plans/nfr-catalog.md` and **not relaxed and not touched** by this ticket. V14 (2) — no sensitive
data exists. **V16 and V17 carry NO L1 requirements at all** — checked, not assumed.

**V2.2.1 (input validated to business expectations) is NOT ENGAGED rather than failed**, and the
distinction is the one `ABC-012`'s gate drew for `takeBack(NaN)`: an L1 fail defaults to HIGH and
would block under `security.block_on: high`. It is not a failure today because **the input surface
does not exist** — `src/render.ts` has zero importers, there is no CLI entry point, and every
compiling caller is constrained by the union. **The counterfactual is stated rather than banked:
the moment `EPIC-006` wires an unvalidated flag string to `mode`, V2.2.1 IS engaged.** Owner
`ABC-015`/`EPIC-006`, which owns the value.

## Logging and observability

`src/render.ts` logs nothing, and **nothing is owed**: it is a pure function that returns a value,
and a caller that receives a frame has the whole result in hand. The one failure mode — the
out-of-domain byte — surfaces as an **uncaught `TypeError` with no context about which square or
which byte**. That is carried as an accepted risk for `ABC-018` rather than as a required fix here,
because at this layer there is no logger, no sink, and inventing one would be the unrequested
flexibility AGENTS.md rule 7 forbids.
