---
id: 20260919T121500Z-qe-e2e-observation-probes-every-sentence-in-four-frame-modes-castle-teaching-cost-docblocks-checked-and-what-security-nfr-should-look-at-3a9c7d58
kind: observation
by: qe-e2e
at: 2026-09-19T12:15:00Z
verified_by:
confidence: high
refs:
  - ABC-034
  - ABC-034/A5
  - ABC-034/A6
  - ABC-107
  - ABC-114
  - ADR-0022
  - NFR-003
  - src/rejection.ts
  - src/rejection.test.ts
  - src/move-input.ts
  - src/frame.ts
  - src/san.ts
  - src/moves.ts
supersedes:
---

# Probes against the real build: 44/44 sentences whole in the frame across both glyph modes and both orientations; the castle teaching cost measured; every sentence in the four touched files' comments checked; three pointers for Security/NFR

**This is not a stamp.** Hand-authored `observation`. The probe script and its full output sit
beside this note (`probe.mts.txt`, `raw-probe.txt`); every line below is copied from that output.

## `A5` beyond the suite: unicode × ascii, white-bottom × black-bottom

The suite asserts the nine sentences through `assembleFrame` in unicode / white-bottom. Re-run
through the same pipeline (`renderBoard` / `renderStatusPanel` / `renderHistory`, then
`assembleFrame`) in all four combinations, with two extra inputs — the longest SAN echo the grammar
admits (`Qa1xh8#`, 7 chars → *no move Qa1xh8# here*, **20 columns**) and a padded line
(`"  Qh5  "` → *no move Qh5 here*): **44 of 44 shown whole, hidden 0, frame 23 rows** in every
mode. Column widths: 16 / 14 / 15 / 18 / 17 / **21** / 16 / 17 / 16 / 20 / 16. The width ceiling is
the panels' widest row (`src/frame.ts:201`, computed, not a constant), and *your king is in check*
sits exactly on it — one more character and Mq shows what happens (hidden, `A5` red).

## The SAN bound the docblock leans on — verified in `src/san.ts`

`PIECE_MOVE` admits at most letter + file + rank + `x` + square = 6; `PAWN_MOVE` at most
`axb8=Q` = 6; `CHECK_SUFFIX` strips exactly one trailing `+`/`#` first. So 7 is the ceiling and
`Qh5+#` (two suffixes) → `unreadable` (probed: `Qh5!!` and `Nf3 e5` are also `unreadable`). The
module's "at most 20" for the echo sentence holds.

## "Castles are never in the difference" — verified in `src/moves.ts` and by probe

`addCastlingMoves` (`src/moves.ts:330`) filters the through-check rule at generation
(`kingPath` attacked → no move). Probed: a castle through f1 attacked (`5r1k/…/4K2R w K`) →
`generateMoves` 14, `legalMoves` 12, difference = `e1f1`, `e1f2` only, no castle; a castle INTO
g1 attacked (`k5r1/…/4K2R w K`) → 14 / 14, difference empty, no castle generated; kiwipete →
both castles in `generateMoves` AND in `legalMoves` (flags = 2). So `parseSan`'s castle path
(`toSan` on castle candidates) never runs over the difference — the docblock sentence is true.

**The teaching cost, measured, for BA/PM:** with castling unavailable, `O-O` / `o-o` / `0-0` →
*type e2e4 or Nf3*; coordinate `e1g1` → *e1 cannot reach g1* (through-check and into-check alike);
`Kg1` → *no move Kg1 here*. On the no-castle fixture (king on a1) `e1g1` → *no piece on e1*, which
is correct. A player who types correct castle notation is told the format, not the rule. This is
`ABC-032`'s disclosed castle price landing in this ticket's vocabulary and the ticket fences out
retrograde reasoning; it is the one place the seven-code set teaches less than the position knows.

## Other probes worth keeping

- Promotion by coordinate on `8/4P3/8/8/8/4k3/8/4K3 w`: `e7e8` and `e8` → `ambiguous` listing
  `e8=Q+ e8=R+ e8=B e8=N` (`ABC-033`'s, correct); `e7e8q` / `e7e8Q` / `e8=Q` → move; `e7e8k`,
  `e7e8p`, `e8Q` → `unreadable`; `e8=K` → *no move e8=K here*; `e8=P` → `unreadable`.
- In check (`A1`'s named FEN): `Kf1` / `e1f1` → move; `Nh3`, `Bf1`, `g4g5`, `h2h3` → *your king is
  in check*; `Ke2` → *no move Ke2 here* (e2 holds an own pawn — not pseudo-legal, so not the king
  class: correct by the table); `d1e2` → *d1 cannot reach e2*.
- On the pin: `e8e1` / `e8a8` → *e8 is not yours*; `a1a2` → *no piece on a1*; `e1e2` → *e1 cannot
  reach e2*; `Kd2` → move.
- `A6` on every probe: `toFen` byte-identical before and after (`fenSame=true` on all 50 lines).

## False-sentence check on the four touched files (`ABC-114` standard)

Every checkable claim in the comments of `src/rejection.ts`, `src/rejection.test.ts`, and the
lines `ABC-034` changed in `src/move-input.ts` / `src/move-input.test.ts` was checked against the
tree:

| claim | where | result |
|---|---|---|
| castles never in `generateMoves \ legalMoves` (`src/moves.ts` filters through-check at generation) | `rejection.ts` 125–127 | TRUE (above) |
| the SAN grammar bounds the echo at 7 (`Qa1xh8#`, `axb8=Q+`) | `rejection.ts` 41–42, 160–162 | TRUE (above) |
| longest fixed sentence 21 columns = `W` with the history pane | `rejection.ts` 38–41, 160 | TRUE (measured 21; `W` computed at `frame.ts:201`) |
| "costs one `generateMoves` and, when `legal` is not supplied, one `legalMoves`; the dispatcher supplies it" | `rejection.ts` 116–118 | TRUE of the build (`move-input.ts:190` passes `legal`); UNASSERTED (Me2) — G3 |
| `no-such-move` from the coordinate reader against an empty list means the grammar read it | `rejection.ts` 22–24, 135–138 | TRUE (probed: `e2e5` → `piece-cannot-reach`; `e7e8k` → `unreadable`) |
| `CHECK_FEN`: f2 empty, in check, only legal move `Kf1` | `rejection.test.ts` 28–35 | TRUE (`legalMoves` = [e1f1]) |
| `PIN_FEN`: not in check, every knight move pseudo-legal and none legal | `rejection.test.ts` 22–27 | TRUE (four inputs → `own-king-exposed`) |
| `PERFT_FENS` copied from `src/perft.test.ts`'s `PERFT_SUITE`, a non-exported `const` | `rejection.test.ts` 41–45 | TRUE (six FENs byte-equal to lines 22–52; `const PERFT_SUITE` at line 14, not exported) |
| `MESSAGE_ROWS` = 2, `withMarker` appends `(+N more)` | `rejection.test.ts` 233–239 | TRUE (`frame.ts:45`, `:187`) |
| "WORDING IS NOT HERE … the ambiguity messages ARE this module's" | `move-input.ts` 54–58 | TRUE (`ambiguous()` renders `toSan`; the rejected arm places the classifier's string) |
| the `e2e5` row "reds a classifier that cannot tell read-but-not-a-move from not-read" | `move-input.test.ts` 530–533 | TRUE (Md reds exactly that row in that file) |
| `PromptOutcome.rejected` at `src/turn-loop.ts:127` (ticket) / `:125` (pre-existing `move-input.ts` header) | — | `:127` is the arm; `:125` is the type's first line — the pre-existing cite is one line loose and NOT this ticket's line, left alone |

No false sentence found in the lines this ticket wrote.

## For Security/NFR (their hop, not done here)

1. **The threshold fired on its letter**: `src/move-input.ts` touched (+10/−11). What I measured
   for them: no stream is written in `src/rejection.ts` or the changed lines (no `process.`, no
   `console.`, no `write` — the module returns strings); the only user text that reaches a sentence
   is `text.trim()` of a string the SAN reader ACCEPTED, bounded at 7 characters by the grammar
   above, so the sanitizer at `src/frame.ts:202` never sees an unbounded raw line from this path;
   `package.json` unchanged (no dependency). The ambiguity path is unchanged.
2. **G3**: the `NFR-003` cost claim (one derive) is unasserted — the spy cannot see the
   classifier's own `legalMoves` import. The build is correct; the guard is absent.
3. `NFR-008` was fenced from this hop; the Engineer's reading (over at base and tip, `ADR-0019`
   trigger (a)) stands as handed up. This lane ran at 3.97 s wall here, data only.
