---
id: 20260919T120500Z-qe-e2e-observation-eighteen-mutants-twelve-die-six-survive-the-two-sentence-swaps-are-the-ones-that-matter-8b3d5f27
kind: observation
by: qe-e2e
at: 2026-09-19T12:05:00Z
verified_by:
confidence: high
refs:
  - ABC-034
  - ABC-034/A1
  - ABC-034/A2
  - ABC-034/A3
  - ABC-034/A4
  - ABC-034/A5
  - ABC-034/A8
  - ABC-033
  - ABC-033/A5
  - src/rejection.ts
  - src/rejection.test.ts
  - src/move-input.ts
  - src/move-input.test.ts
supersedes:
---

# Eighteen mutants through the full lane (`npx vitest run --dir src --reporter=json`, 1291 tests each): **twelve die, six survive** — and two of the survivors swap what the player is TOLD without a single row noticing

**This is not a stamp.** Hand-authored `observation`. Each mutant was applied as an exact-anchor text
replacement (anchor asserted to match once), the whole lane run, the failing rows collected from the
JSON reporter, the file reverted with `git checkout --` and byte-compared to the original, and
`git status --short -- src/` checked empty. The runner's full log (per-mutant counts, every red
row, revert and status check) and the runner script sit beside this note (`raw-mutants.log.txt`,
`run-mutants.mjs.txt`); the per-mutant JSON reporter dumps (512 KB each, all-green for the
survivors) were not committed — re-run the script to regenerate them.

The subtask asked for six ((a)–(f)); (f) is a behaviour question and is answered in the sibling
`decision`. The others were run in more than one form each, plus the mutants a classifier of this
shape invites. Rows are `file :: describe > it`, abbreviated.

| id | mutant | rows RED |
|---|---|---|
| **Ma1** | (a) swap the two KING sentences: `own-king-exposed` → *your king is in check*, `must-address-check` → *exposes your king* | **NONE** — 1291 pass |
| **Ma2** | (a) swap the two ORIGIN sentences: `empty-square` → *\<sq\> is not yours*, `not-your-piece` → *no piece on \<sq\>* | **NONE** — 1291 pass |
| Ma3 | (a) swap the two origin CODES at classification | 2 — `A3` "e3e4" is empty-square; `A3` "e7e5" is not-your-piece |
| Ma4 | (a) swap the two king CODES (`exposed()` ternary inverted) | 8 — `A1` ×5 (four pin lines + the named FEN), `A2` set-difference, `A3` Nc3, `A3` Nh3 |
| Mb | (b) set difference on the wrong side: `legal \ generateMoves` (always empty) | 9 — `A1` ×5, `A2` set-difference, `A3` Nc3, `A3` Nh3, texts-handoff "nc3" |
| Mb2 | (b′) `sameMove` ignores `promotion` | **NONE** — see below: equivalent mutant, not a gap |
| Mc | (c) dispatcher hands the classifier the RAW line only (`tried = [line]`) | 2 — texts-handoff "nc3" on the pin; texts-handoff echo "qh5" → `Qh5` |
| **Mc2** | (c′) dispatcher hands the variants FIRST and the raw line LAST | **NONE** — see below |
| Md | (d) classifier returns `unreadable` for everything | 19 — `A1` ×5, `A2`, `A3` ×6, `A4` ×2 (distinct / exhaustive), `A8` e8=K, texts-handoff ×3, `move-input.test.ts` "e2e5" row |
| Me | (e) call site broken: `messages: ["no-such-move"]` (the old placeholder) | 21 — all 7 `ABC-033 A6` rows in `move-input.test.ts`, `A1` ×5, `A3` ×7, texts-handoff ×2 |
| **Me2** | (e′) call site drops the `legal` argument — the classifier derives `legalMoves` a SECOND time | **NONE** — see below |
| Mg | origin/destination swapped (second square taken as origin) | 7 — `A3` e7e5, `A3` e2e5, `A4` ×2, texts-handoff ordered, `move-input.test.ts` ×2 |
| Mh | colour test inverted (`===`) | 4 — `A3` e7e5, `A3` e2e5, texts-handoff ordered, `move-input.test.ts` e2e5 |
| Ml | `no-legal-move-named` arm dropped (falls through to `unreadable`) | 5 — `A3` Qh5, `A4` ×2, `A8` e8=K, texts-handoff echo |
| **Mn** | echo is the RAW text, not `text.trim()` | **NONE** — see below |
| Mo | king classes read against `legal` instead of `exposing` | 3 — `A1` e2c3, `A1` e2g1, `A2` set-difference |
| Mp | `unreadable` sentence loses its referent (*invalid move*) | 2 — `A4` referent row, `A8` O-O |
| Mq | a king sentence padded to 23 columns (> `W` = 21) | 1 — `A5` "the pinned knight" row: the sentence is hidden |

Every criterion has at least one killing mutant: `A1` (Ma4, Mb, Mo), `A2` (Ma4, Mb, Mo), `A3`
(Ma3, Mg, Mh, Ml), `A4` (Mg, Ml, Mp), `A5` (Mq), `A8` (Ml, Mp), the wiring (Me, Mc). `A2` is the
discriminating criterion the ticket said it was: Mo — a build that asks the readers the wrong
question — is caught by `A2` and by exactly two `A1` rows, nothing else.

## The six survivors, each read for what it means

**Ma1 and Ma2 are real gaps and the same gap.** The suite pins the CODE for every fixture and pins
the SENTENCE SET as a set (`A4`), but no row binds a code to ITS sentence beyond "contains `king`" /
"contains a square". So a build that tells a player in check *exposes your king* and a player with a
pinned knight *your king is in check* is green — which is precisely the distinction ticket test note
5 says *"the player needs"*. The cause is honest: test note 6 forbids typing a sentence in two
places, so nothing types them at all. The property is nonetheless assertable WITHOUT a second copy of
the string — e.g. the `must-address-check` rendering, and only it, contains the word for check; the
`empty-square` rendering, and only it, contains *no piece*; the `not-your-piece` one contains
*yours* — semantic anchors of the same kind as `A4`'s `/[a-h][1-8]|king/`. **Not fixed here (subtask:
do not touch the build); routed as gap G1 in the `decision`.** No acceptance criterion as written
fails on Ma1/Ma2: `A1` says "names the player's own king" and both swapped sentences do; `A4` still
sees seven distinct strings.

**Mb2 is an equivalent mutant, not a gap.** Two `Move`s that differ only in promotion piece share
`from` and `to`, and the legality of a promotion does not depend on the piece chosen (the pawn
leaves the same square, a piece appears on the same square, and the own-king attack test in
`src/legal.ts` sees the same occupancy). So on both lists every promotion flavour of one `from`/`to`
is legal or none is, and ignoring `promotion` changes no membership answer. Recorded so the next hop
does not re-run it as a gap.

**Mc2 survives and the difference is observable, narrowly.** Order matters only when two different
texts BOTH yield a decision with different content. The coordinate reader is case-insensitive, so
raw-vs-variant never differs for it; for SAN the case is a raw line and a variant that are both
well-formed and both name nothing — `Bxc4` and its variant `bxc4` on the start position. Probed
directly: `classifyRejection(start, ["Bxc4","bxc4"])` → echo `Bxc4`; reversed → echo `bxc4`. So the
reversed dispatcher tells a player who typed `Bxc4` *no move bxc4 here*. The suite's "classification
is ordered" row pins the order through the classifier with `["hello","e2e5","e3e4"]` (coordinate
codes), never through `resolveMoveInput` with a SAN echo. **Gap G2, minor.**

**Me2 survives and is the more interesting one for Security/NFR.** With `legal` dropped, the
classifier derives `legalMoves` itself — a second derive per rejection. `ABC-033 A5`'s one-derive spy
watches `deps.legalMoves`, and `src/rejection.ts` imports `legalMoves` from `src/legal.ts` directly,
so the spy is structurally blind to a derive inside the classifier — the same shape as `ABC-033`'s
own M11 lesson ("spying the ARGUMENT is what makes the sharing assertable"). The Engineer's note 6
says the spy "still reads 1 on every rejection row"; that sentence is TRUE and it is not evidence
that the classifier derives once — the real build does pass `legal` (line 190) and this mutant is
what a regression of that line looks like. The ticket's `NFR-003` cost claim (*one `generateMoves`
and one `legalMoves`*) is therefore asserted by nothing. **Gap G3, for the NFR half to weigh**; the
cost is single-digit microseconds either way.

**Mn survives because no padded well-formed SAN row exists.** `"  Qh5  "` reaches the SAN reader
(which trims) and comes back `no-such-move`; the real build echoes `text.trim()` → *no move Qh5
here* (probed, 16 columns, hidden 0). Under Mn the sentence is *no move   Qh5   here*. The module
docblock's "never the raw line" and "at most 20" both rest on this `.trim()`, and only the
case-fold row (`qh5` → `Qh5`) guards it, from a different direction. **Gap G4, minor.**

## What was NOT mutated, and why

`src/legal.ts`, `src/moves.ts`, `src/san.ts`, `src/coordinate-move.ts`: not this ticket's (`A7`),
hash-pinned unchanged. `src/search.ts` / `src/engine.ts`: `ABC-079` live, fenced. `src/turn-loop.ts`:
`ADR-0021`, fenced. The test files themselves were not mutated (the point was to break the code
under them).
