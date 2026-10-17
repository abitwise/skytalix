---
id: 20261017T131000Z-security-nfr-observation-abc096-security-review-clause-b-escape-bar-c1-4b7e2a91
kind: observation
by: security-nfr
task: secnfr-ABC-096
at: 2026-10-17T13:10:00Z
verified_by:
confidence: high
refs:
  - ABC-096
  - ABC-018
  - ABC-095
  - ADR-0036
  - ADR-0037
  - ADR-0043
  - AR-095-L1UNIT
  - AR-096-C1CP
  - QE-096-g
  - G7
  - plans/tickets/ABC-096-show-the-named-opening-when-the-book-knows-it.md
  - src/book.ts
  - src/render-seam.ts
  - src/cli.ts
  - src/frame.ts
  - tools/opening-book/compile.ts
  - 20261017T124700Z-qe-e2e-decision-abc096-verdict-pass-with-gaps-e5a80c37
supersedes:
---

# Security/NFR `ABC-096`: the security review. Clause (b) does not fire, the escape bar holds on emitted frames, and one latent gap is named (`AR-096-C1CP`, LOW)

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). Branch
`grugops/ABC-096-opening-name`, tip `c11bfec8`, code `a48da51c`, base `6edadcf0`. Production bytes are equal at
`a48da51c` and `c11bfec8` (`git diff --quiet` exit 0 on the 3 files). Node v26.11.1, Apple M3 Mac15,13, Darwin 25.5.0.
`security.asvs_level` L1, `block_on` high, `compliance_regime` empty. Raw output is in `../probe/`.

## 1. ADR-0036 clause (b): DOES NOT FIRE on any limb, and Ruling 2 does not fire

Canonical instrument `design-F-072-1/probe/clause-b.mjs` (sha256 `433d0c50…87c4b`, unchanged since `341da4c1`), pair
`6edadcf0..c11bfec8` (the merge-base is `6edadcf0`). Output: `probe/clause-b.out.txt`.

| limb | production files changed | (b1) lines | (b2) new runtime edges | word hits | verdict | baseline at head |
|---|---|---|---|---|---|---|
| 1 non-local import | 3 | 0 | 0 | 0 | does not fire | 40 files, 1 holder (`src/book-file.ts`) |
| 2 global `process` | 3 | 0 | 0 | 0 | does not fire | 3 holders (`cli.ts`, `glyph-mode.ts`, `perft-bench.ts`) |
| 3 capability calls | 3 | 0 | 0 | 0 | does not fire | 0 holders |

- **The import lines the diff changes** are `+import type { BookProbe } from "./book.ts"` (type-only, not an edge) and
  `renderHistory` → `HISTORY_COLS, renderHistory` from `./history-pane.ts`, an edge that already existed.
  The instrument's 0 new edges agrees with this.
- **Ruling 2 by hand (ADR-0036 § S1), holders at BOTH ends.** The limb-1 holders are `{src/book-file.ts}` at
  `<base>` (the instrument run as `6edadcf0 6edadcf0 1`) and at `<head>`. The union is not empty, so the `git diff` IS
  run (the empty-pathspec trap from the S3 reading does not apply).
  `git diff --name-only --no-renames 6edadcf0 c11bfec8 -- src/book-file.ts` prints 0 lines, and `git diff --quiet`
  exits 0. **Ruling 2 does not fire.**
- **`AR-095-L1UNIT` is still open.** `clause-b.mjs` has one commit, `341da4c1`. The fold is still owed by
  Architect/Design, so this hop applied Ruling 2 by hand.
- **No new file read, dependency or spawn.** `package.json` and `package-lock.json` are unchanged (0 files). The probe
  reads through the one injected `read` (`readBookFile`, the holder), once per process (`A8`). No `+` line in the test
  diff adds a spawn, and `N8_SPAWN` (`src/cli.test.ts:1949`, 27) has no changed line.

## 2. The seam's narrowed type

- `makeRenderSeam(mode, orientation, book: Pick<BookProbe, "openingName">)`. `BookProbe` comes in through `import type`
  only (`A8`). The seam's code calls `book.openingName(history.position)` and nothing else. I read every line of the
  `render-seam.ts` diff.
- **The `Pick` is a compile-time control.** At runtime the seam holds the whole probe object, `bookMove` included.
  What keeps the frame path from drawing randomness or running `legalMoves` is `tsc` plus review. QE's Q6 and Q6b
  (the type widened) are killed by `tsc`. Q14 and Q15 (`openingName` calling `legalMoves` or `random`) are killed by
  `A6` and the `A10` guard. **That is adequate for a 3-line call site. No runtime freeze or proxy is warranted.**
- **`openingName` adds no new crash path to the frame.** `loaded()` catches every error from `read` and `parseBook`
  and turns it into the one warning. `keyOf` and `Map.get` do not throw on a legal position.

## 3. The escape bar (`ABC-018` / G7, `A3`) on EMITTED frames: HOLDS in both modes

`probe/a3-escape.ts` runs 14 adversarial names through the REAL seam at H, in both modes. It counts on the frame
encoded as the UTF-8 bytes a terminal receives, and compares against the same frame with no name. Output:
`probe/a3-escape.out.txt`.

- **Every case, both modes:** 23 rows out of 23, **0 ESC bytes, 0 C0 bytes other than the row separators, 0 DEL.**
  The cases include CSI clear, OSC title with BEL, OSC 52 clipboard, all 32 C0, newline and CR, and a 100,000-ESC
  flood.
- **ASCII mode: 0 code points above `U+007F`** in every case. That covers C1, bidi, zero-width, a lone surrogate and an
  accented name.
- **The cut runs before `sanitize`, so control-heavy names can show `...` alone** (all-C0, ESC flood). That is
  `QE-096-g`'s effect on a hostile name. It is harmless and cosmetic. 0 shipped names are affected.

## 4. What reaches the terminal in unicode mode: C1 code points. `AR-096-C1CP`, LOW, accepted

**Measured.** In unicode mode, `sanitize` keeps every code point at or above `U+0080`. A book name carrying `U+009B`
(the 8-bit CSI), `U+009D` (OSC) or `U+009C` (ST) reaches the emitted frame. The counts are 1, 2 and 18 C1 code
points for the three C1 cases, each encoded as `C2 xx`. Bidi `U+202E`, `U+200B` and `U+FEFF` reach it too.

**This is not the C1 ruling in `plans/nfr-catalog.md`'s `NFR-002` section, and it does not re-open it.**
- That ruling is about C1-range BYTES: the 64 continuation bytes of the module's own glyphs, `♛` = `E2 99 9B`.
  Stripping those bytes would be theatre, and that stays true.
- This is about C1 CODE POINTS (`U+0080`–`U+009F`), a different object.
- Whether a UTF-8 terminal acts on a decoded C1 code point depends on the terminal:
  - xterm's control-sequence documentation says a C1 control obtained by decoding UTF-8 is not re-processed as a
    control;
  - GNOME VTE's issue 209 ("Remove C1 support?") records that VTE has processed them, and says this makes filtering
    untrusted output harder.
  - The owner's terminal is `UNKNOWN - verify`. I ran no terminal emulator.
- The ticket's warning, *"do not fix C1 by stripping it"*, refers to the bytes. **No change to `sanitize` is asked
  for here.**

**Why LOW, and not blocking.**
- No ASVS L1 requirement fails as written. V1.2.x names HTML, URL, JS, SQL and OS-command contexts, not a terminal.
  `A3`'s bar is met to the letter: it bars C1 code points only in ASCII mode, by its "above `U+007F`" clause.
- **The shipped book carries 0 C1 code points.** It also carries 0 format (`Cf`), 0 bidi, 0 combining, 0 wide and 0
  astral code points (`probe/names-scan.out.txt`). 2,853 named entries hold 8 distinct code points above `U+007F`,
  all Latin letters (`ö é ü ä á ć ó ø`).
- **The path from a hostile upstream to this terminal needs a human.** Each source file's sha256 is pinned
  (`ABC-145`), so a new upstream name enters only when someone re-pins and recompiles. The artifact is committed and
  reviewed. Anyone who can rewrite `data/opening-book/book.json` locally can also rewrite `src/`.
- **The gap.** The compiler's refusal (`tools/opening-book/compile.ts:64-68`) covers C0, DEL and ESC only. So a re-pin
  to an upstream that adds a C1 or bidi code point would pass the compiler and reach a unicode frame unflagged.

**Accepted risk `AR-096-C1CP`.** Severity LOW. **Owner: the Orchestrator**, who routes the follow-up.
- **Recommended follow-up** (outside this ticket's fence, because `tools/` is on its must-not-change list): widen the
  compiler's defence-in-depth refusal to `U+0080`–`U+009F`, with the bidi controls (`U+202A`–`U+202E`,
  `U+2066`–`U+2069`) as an option. That is one predicate and one plant, an `XS` ticket. The artifact is unchanged,
  because 0 shipped names carry any of these.
- **Trigger** (the latest point to act): the next re-pin of the book source, or the next edit to
  `tools/opening-book/compile.ts`, whichever comes first.

## 5. Other items, checked and not raised

- **Input bounds (V2.2.1, V5.2.1).** The parse bounds the whole file at `BOOK_MAX_BYTES` (1 MiB). A name is kept only
  when `typeof n === "string" && n !== ""` (`A7`). Its length is not bounded at parse; it is bounded at display, before
  `sanitize`. The display cost of the largest name a parse-admitted book could hold (1,048,576 characters) is read in
  the timing note (case `x-max`). That reading settles whether the unbounded parse-side length matters.
- **Pre-existing, not this ticket's, and recorded.** `readBookFile` is `readFileSync` of a fixed path. It reads the
  whole file before the 1 MiB check, and a FIFO at that path would block. That was already so at `ABC-095`. This
  ticket only moves the read from the engine's first ply to just before frame 0, so a hang there now shows no board
  rather than a frozen one. No new input reaches the path (ADR-0036 § S1 Ruling 1 still holds). Not raised.
- **A lone surrogate inside a name** (possible in JSON as `"\ud800"`) survives unicode mode. Node writes it as
  `U+FFFD`. It is harmless and has 0 shipped cases. `A4`'s lone-surrogate clause is about the cut, and it holds.
- **Logging (the failure mode with no log).** A missing or refused book still warns exactly once on stderr (`A8`;
  QE `CLI_DEEP` green). On an in-place TTY frame 0 overdraws it. That is UAT observation 2, which the Orchestrator
  accepted under the owner's delegation, and the stderr record stays intact. Not re-raised.
- **Privacy, authentication, secrets, network:** not touched. 0 personal data, 0 credentials, 0 network calls.
