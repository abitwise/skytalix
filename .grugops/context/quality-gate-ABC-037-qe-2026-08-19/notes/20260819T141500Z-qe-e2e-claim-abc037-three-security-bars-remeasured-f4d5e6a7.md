---
id: 20260819T141500Z-qe-e2e-claim-abc037-three-security-bars-remeasured-f4d5e6a7
kind: claim
by: qe-e2e
at: 2026-08-19T14:15:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - src/line-input.ts
  - src/frame.ts
  - package.json
supersedes:
---

# The three security bars, RE-MEASURED from the delivered bytes — all three MET, and the firing threshold did NOT fire

Nothing below is inherited. Every figure is from a probe I wrote and ran against the delivered
`src/line-input.ts` at `02e5c38`.

## Bar 1 — the read line is data, never code. **MET.**

Token scan of the delivered file with comments stripped. I ran the engineer's fourteen tokens **and
four more of my own** that a lexical guard of this shape invites — the four are exactly what my `A6`
escape used:

```
eval 0   Function 0   require 0   import( 0   child_process 0   exec* 0   spawn* 0
fetch 0  writeSync 0  node: 0     process 0   console 0        globalThis 0  Buffer 0
new Function 0        constructor 0           atob 0           String.raw 0
```

**Eighteen for eighteen at zero.** Import set, extracted from the delivered bytes:
`./command-input.ts`, `./history.ts`, `./move-input.ts`, `./turn-loop.ts` — **exactly four relative
project modules**, and **zero side-effect imports** (I scanned `^\s*import\s+"…"` separately, which is
the hole `M17` was written for). The line is passed to `resolvePromptLine` as a string and is never
interpreted as anything else.

## Bar 2 — unbounded input is bounded at 1024. **MET, and the boundary is exact in BOTH directions.**

The brief asked me to check the boundary is not off by one *in the other direction*. It is not:

| line length | outcome | resolver calls | messages |
|---|---|---|---|
| 1023 | reaches the resolver | **8** | (the dispatcher's own) |
| **1024** | **reaches the resolver** | **8** | (the dispatcher's own) |
| **1025** | **rejected** | **0** | `["line too long", "max 1024 chars"]` |
| 1026 | rejected | **0** | same |
| 4096 | rejected | **0** | same |

`MAX_LINE_LENGTH === 1024`. 1024 is accepted, 1025 is rejected, and the rejection reaches **no**
resolver — `resolverCalls: 0`, not merely "no move produced".

**The rejection messages fit the frame — checked by rendering, not by arithmetic.** The suite asserts
`item.length <= 18`; I drove them through the real `assembleFrame`:

```
board 18 cols -> "line too long     " / "max 1024 chars    "   both present VERBATIM
board 15 cols -> "line too long  "    / "max 1024 chars "      both present VERBATIM
board  2 cols -> "(+2 more)"                                   both ELIDED by the frame
```

Widths are 13 and 14 against the cited `W` of 18 — the engineer's claim, confirmed by rendering. The
elision at a 2-column board is `src/frame.ts`'s own overflow rule doing its job, not this ticket's
concern; recorded so nobody reads it as a fit failure.

**One real finding at this bar — `G3`, LOW.** The cap is applied to `pending` **before** the CRLF
strip, so the `\r` counts against it:

```
"z" x 1024 + "\n"    -> reaches the resolver           (cap = 1024)
"z" x 1024 + "\r\n"  -> REJECTED "line too long"       (cap = 1023 on a Windows pipe)
```

The effective cap is terminator-dependent. The suite cannot see it: the boundary row uses LF with a
1024-char line, the CRLF row uses a short line, and the interaction of the two is untested. Impact is
small — 1023 is still 146x the longest legal SAN and the error is in the *safe* direction — but the
suite's own row is named *"the boundary is not off by one"*, and on one of the two terminators this
module explicitly supports, it is.

**Related, INFO:** `MAX_LINE_LENGTH`'s doc comment says "in CHARACTERS", and `pending.length` counts
**UTF-16 code units**. A line of 513 astral characters (1026 units) is rejected; 512 (1024 units) is
not. Harmless for chess, wrong in the prose.

## Bar 3 — every byte to the terminal goes through the frame's sanitizer. **MET.**

With the hostile line `\x1b[2J\x1b[Hzz\x07`:

```
the seam's writes:                  ["> "]        <- the prompt and nothing else
ESC bytes in the seam's writes:      0
the typed line echoed:               never
rows of the assembled frame carrying [\x00-\x1f\x7f]:  0
```

**I also ran the path the engineer's row does not.** Their hostile line is over nothing and returns
the module's own constant messages. I drove an **under-cap** hostile line, `\x1b[31mQxf7\x07`, so it
actually reaches the resolvers and comes back through the dispatcher:

```
resolvers saw the raw bytes, ten times, verbatim (ESC and BEL intact)  <- correct: it is DATA
outcome messages:  ["unreadable"]                                     <- a fixed constant
frame rows carrying control characters:  0
```

So no player byte reaches the frame on that path either — the dispatcher answers with a constant.
The bar holds on both the over-cap and the under-cap route.

**The one way past this bar is `G2`'s escape**, and it is a malicious-edit path, not an input path.
See that note.

## The firing threshold — **NOT FIRED**, re-measured from git and the manifest

```
git diff --numstat e9a61ae..HEAD -- src/
  771  0  src/line-input.test.ts
  232  0  src/line-input.ts
```

- **No `src/` file beyond the two.** Confirmed by `git diff --name-only`.
- **`src/turn-loop.ts` and `src/frame.ts` byte-identical by blob hash on both sides** —
  `9334daf1d2c2242e2071830c491e3b7f86a16a79` and `6d2a86856baad5a8f5e5c2b4726347a27456e407`, verified
  with `git rev-parse` at `e9a61ae` and at `HEAD`.
- **`package.json` has no `dependencies` key at all** — `"dependencies" in manifest === false`,
  absent rather than `{}`. Re-verified by parsing the manifest from disk.
- **Zero Node builtins imported** — fewer than the one the threshold permits.
- Files touched outside `src/`: `AGENTS.md`, `plans/tickets/ABC-037-…md`, `plans/traceability.md`,
  `.grugops/queue/done/…`, and the six context notes. Nothing else.

`A8`'s figures reproduce exactly, including the `771` the engineer corrected at `02e5c38` — I measured
771 at the tip independently, and `wc -l` agrees.
