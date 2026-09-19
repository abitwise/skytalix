---
id: 20260919T210000Z-security-nfr-observation-the-sink-probed-not-reasoned-zero-escape-bytes-in-120288-prompts-echo-bounded-at-7-by-enumeration-7d2e4a19
kind: observation
by: security-nfr
at: 2026-09-19T21:00:00Z
verified_by:
confidence: high
refs:
  - ABC-034
  - ABC-034/A4
  - ABC-034/A5
  - ABC-018
  - ADR-0004
  - src/rejection.ts
  - src/move-input.ts
  - src/san.ts
  - src/coordinate-move.ts
  - src/frame.ts
  - src/turn-loop.ts
  - src/command-input.ts
  - src/line-input.ts
supersedes:
---

# The sink, probed rather than reasoned: 288 directed + 120,000 fuzzed prompts through the production prompt path, **zero** sentences carrying a C0 / DEL / non-ASCII code point, **zero** off the seven shapes; the SAN echo is bounded at **7 characters by enumerating all 165,888 strings the grammar accepts**, longest sentence **20 columns**; no direct stream write; 192 frames whole

**This is not a stamp.** Hand-authored `observation`; `human_admission` is `off`, no `finding` is
admissible. Probe scripts and raw output sit beside this note (`probe-sink.mjs.txt`,
`raw-sink.txt`). Probes ran against an out-of-tree copy of `src/` (worktree never written; `git
status src/` clean throughout; `git diff --numstat` of this hop under `src/` is empty).

## The path, traced from the typed line to the terminal (static, then confirmed dynamic)

`createLineInputSeam` → `resolvePromptLine(history, line.text, deps)` (`src/line-input.ts:243`,
`deps` undefined in production) → `resolveMoveInput` (`src/command-input.ts:138`) → the rejected
arm builds `[rejectionMessage(classifyRejection(position, tried, legal))]` (`src/move-input.ts:190`)
→ `PromptOutcome.rejected.messages` → `runTurnLoop` assigns `messages = outcome.messages`
(`src/turn-loop.ts:344`) → `render(history, status, thinking, messages)` (`:279`) →
`assembleFrame` maps every message item through `sanitize(item, mode)` (`src/frame.ts:202`; the
sanitizer at `:123` drops `< 0x20` and `0x7f` always, `> 0x7f` in ASCII mode).

- **No direct stream write:** `grep -n 'process\.\|console\.\|\.write(\|stdout\|stderr'` over
  `src/rejection.ts` and `src/move-input.ts` = **0 hits**. Also 0 hits for `eval`, `new Function`,
  `child_process`, `process.env`, dynamic `import(`.
- **No second path to the sink:** the only importers of `src/rejection.ts` in the tree are
  `src/move-input.ts`, `src/move-input.test.ts`, `src/rejection.test.ts`. No renderer imports it
  (`src/render-seam.ts` imports `frame` / `history-pane` / `render` / `status-panel` only).
- **The raw line never reaches a sentence.** The only user-derived bytes in any sentence are (a)
  `text.trim()` on the `no-legal-move-named` arm and (b) two `[a-h][1-8]` tokens from
  `squaresNamed` on the three origin arms. Both are gated by a reader's own accept verdict first.

## The bound, from the regexes themselves — then enumerated, not sampled

`no-such-move` from `parseSan` comes ONLY from `resolve([])` on the `PIECE_MOVE` or `PAWN_MOVE`
path (`src/san.ts:233–266`); the castle path returns `unreadable` at zero matches (`:274`), so a
castle string is never echoed. Both regexes are anchored `^…$` (JS `$` without `m` = end of
input) over ASCII classes; `written = text.trim().replace(CHECK_SUFFIX, "")` strips exactly one
trailing `+`/`#`. So the echo `text.trim()` = `written` + at most one suffix:

| grammar | longest accepted | + suffix |
|---|---|---|
| `PIECE_MOVE` `^([NBRQK])([a-h]?)([1-8]?)(x?)([a-h][1-8])$` | 6 (`Qa1xh8`) | 7 |
| `PAWN_MOVE` `^(?:([a-h])x)?([a-h][1-8])(?:=([NBRQK]))?$` | 6 (`axb8=Q`) | 7 |

**Enumerated every string the two regexes accept × {`""`, `+`, `#`} = 165,888 strings**: longest
sentence `no move Na1xa1+ here` = **20 columns** (echo 7). This is the whole domain, not a sample.
The coordinate referents come from `COORDINATE = /^([a-h][1-8])-?([a-h][1-8])([qrbn])?$/`
(`src/coordinate-move.ts:57`) applied to `text.trim().toLowerCase()`, then `squaresNamed` on
`text.toLowerCase()` — two 2-character lowercase ASCII tokens by construction. Longest fixed
sentence `your king is in check` = 21 = `W` with the history pane (QE's measurement, reproduced).

## Directed adversarial prompts — 48 inputs × 6 positions = 288, production path

ESC sequences (`\x1b[2J`, `\x1b[H`, `\x1b[31mNf3`, `Nf3\x1b[2J`, `e2e4\x1b[A`, `Qh5\x1b[2J\x1b[H`),
C0 (`\x00`, `\x07`, `\n`, `\r\n`, `\t`), DEL, NBSP, U+200B, U+FEFF, U+2028, fullwidth `Ｎｆ３`,
Kelvin sign `Kh5`, double suffix `Qh5+#`, `Qh5!!`, `Qh5 e5`, `0-0-0+`, `O-O\x1b`, and four
1,024-character lines (`x`×1024, `Q`×1024, `Qh5` padded to 1024, `e2e5` padded to 1024):

- sentences carrying a code point `< 0x20`, `== 0x7f` or `> 0x7f`: **0 of 288**
- sentences off the seven shapes (regex over the seven sentence forms with the SAN sub-grammar):
  **0**
- longest sentence: **20** (`no move Qa1xh8# here`, `no move axb8=Q+ here`, `no move bxa1=N# here`)
- `toFen(position)` byte-identical before and after: **288 of 288**
- Every escape-bearing line lands on `type e2e4 or Nf3` (the grammar refuses it before any echo);
  trailing `\n` / `\r\n` are `trim()`ed and `Nf3\n` resolves as the move (`ABC-037` strips the
  terminator before this path anyway); NBSP / BOM padding is `trim()`ed and echoes the clean
  `Qh5`; U+200B is not whitespace and the line is `unreadable`.

## Fuzz — 120,000 random lines, length 1–12, production path

Alphabet: ESC, `[`, NUL, BEL, DEL, `\n`, `\r`, `\t`, space, NBSP, U+200B, U+FEFF, U+2028, the
piece letters, `O`, `0`, `-`, `x`, `=`, `+`, `#`, files, ranks, `qrnkp`, `!`, `?`, fullwidth `Ａ`,
`é`; six positions rotated. **0** sentences with a C0 / DEL / non-ASCII code point, **0** off-shape,
position never mutated (asserted per line). **Honest limit:** random 1–12-character lines almost
never form the grammar, so every fuzzed line classified `unreadable` — the fuzz is breadth for the
"does anything leak past the grammar" question, not the bound; the bound is the enumeration above.

## Through the real frame

The seven fixed sentences + the 20-column echo, through `makeRenderSeam` (the CLI's own seam) in
unicode/ascii × white/black-bottom on six positions: **192 frames, every sentence whole, hidden 0,
23 rows**; ASCII-mode rows all ASCII.

## What this establishes for the `ABC-018` bar

From this ticket's path, user text has **two independent controls** before the terminal: the
grammar's byte-level allow-list (nothing is echoed that a `^…$` ASCII regex did not accept whole)
and the sink's `sanitize`. The first alone makes the second unreachable by an escape byte on this
path; the second alone would still drop C0/DEL. No control was added and none is asked for.
