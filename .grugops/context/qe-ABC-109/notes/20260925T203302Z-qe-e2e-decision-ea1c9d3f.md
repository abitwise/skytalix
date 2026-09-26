---
id: 20260925T203302Z-qe-e2e-decision-ea1c9d3f
kind: decision
by: qe-e2e
at: 2026-09-25T20:33:02Z
verified_by:
confidence: high
refs:
  - ABC-109
  - ABC-109/A1
  - ABC-109/A2
  - ABC-109/A3
  - ABC-109/A4
  - ABC-109/A5
  - ABC-109/A6
  - ABC-109/A7
  - ABC-109/A8
  - AGENTS.md
  - src/cli.test.ts
  - 0e132ee
supersedes:
---

# ABC-109 QE gate — PASS WITH FINDINGS

Hand-authored (same admission-refusal reason as the Scribe/Engineer sibling notes:
`scripts/context-io.ts` / `scripts/claim.js` / `mcp__grugops__propose_note` absent from this repo
and the kit, `context.human_admission` off, no `finding` admissible). `at` is the host clock.
Reviewed `0bf562f...0e132ee` (`diff_under_review`) independently in worktree
`.claude/worktrees/qe-ABC-109`, branch `grugops/qe-ABC-109`, off `0e132ee`
(tip of `grugops/ABC-109-agents-md-cap`).

## Verdict: PASS WITH FINDINGS

`A1`–`A4` and `A6`–`A8` independently reproduced and MET. `A5` is **not met to the letter** of its
own wording (see ruling below) though the shipped assertion is sound and the deviation was
disclosed, not hidden. One extra row (never shipped) closes it — see below. Nothing blocks moving
the ticket forward; the gap is named so the next reader does not treat the deviation as silently
closed.

## `A1` — fits, headroom stated as a number and in edits — MET

Independently re-measured, not taken from any prior note: `git show 0bf562f:AGENTS.md | wc -c` =
**32,565 B** (base, matches the ticket's re-scored figure). `wc -c AGENTS.md` on the reviewed tree
= **21,786 B**. Cut 10,779 B (33.1%). Headroom against the inherited 32,768 B cap: 10,982 B ≈ 9.5
edits at the ticket's own 1,159 B/edit rate. 2,790 B under the ticket's own ≤ 24,576 B `A1` target.
Matches the Scribe's reported figures exactly.

## `A2` — no directive/override loses its pointer — MET

Walked the Scribe's 13-row before/after table
(`.grugops/context/scribe-abc109-restructure/notes/20260926T023100Z-...-5dd1fcd9.md`) and
independently spot-checked 8 of its cited `memory-bank/60-progress.md` line numbers (29, 174, 276,
297, 340, 418, 466, 496) with `sed -n '<n>p'` — every one lands on the exact heading text the row
claims. Kit-override count reads **THREE** before and after (`grep -n "kit override"` /
`"counts four"` on the reviewed `AGENTS.md`); the "reader who counts four is wrong" sentence
survives **verbatim** at line 249. Diffed the six condensed sections (`Process rules`,
`Branching model`, `Test and UAT authority`, `QE validation authority`, `Deployment posture`,
plus `Safety rules`/`Coding rules`/tail — untouched, byte-identical) line-by-line against
`0bf562f:AGENTS.md`: every date, number, named owner, exception clause and "NOT a kit override" /
"IS a kit override" ruling survives; only prose is tightened. `ADR-0007` and `ADR-0008` both exist
on disk; `ADR-0008` was never in `AGENTS.md` before this hop either (confirmed: zero matches in
the pre-restructure file) — its "not present, not this restructure's to add" row is accurate, not
a gap.

**One minor drop, not a directive.** The pre-restructure `## Test and UAT authority` carried a
historical sentence: *"Tickets closed before `ABC-042` all deferred UAT to `EPIC-006` because
nothing was exercisable; `npm run chess` ended that reason."* It does not appear in the
restructured `AGENTS.md`, and no explicit pointer in the condensed text sends a reader to it. The
underlying fact still exists in `memory-bank/60-progress.md:707`, but coincidentally — under a
different heading ("UAT is no longer deferrable"), not one the restructured `AGENTS.md` names. It
carries no condition, exception, number or named owner (it explains *why* UAT stopped being
deferrable, not a rule a role acts on), so `A2`'s own enumerated minimum (the nine-plus items) does
not require it, and this is recorded as an **observation**, not an `A2` finding.

## `A3` — the tail survives, byte offsets stated — MET

Independently measured on the reviewed `AGENTS.md` (21,786 B) with a byte-precise scan:
`Definition of Ready:` at **20,963**, `Definition of Done:` at **21,036**, `## When uncertain` at
**21,695** — exact match to the Scribe's reported offsets. All three sit inside both the ticket's
24,576 B target and the 32,768 B cap.

## `A4` — machine-checked couplings hold, not relaxed — MET

`npm test`: 47/47 files, 1447/1447 tests, exit 0 (1447 because `A5`'s guard added one test to the
1446 pre-restructure baseline — expected and within `A6`'s ≤ 2 ceiling). `git diff --name-only
0bf562f 0e132ee -- 'src/*'` = `src/cli.test.ts` only, and its diff is a pure append after line
2130 (the `ABC-109` `describe` block) — nothing before it moved, so the four named `Dev / run`
assertion sites (`:1043`/`:1044`/`:1971`/etc., confirmed present via `grep -n "Dev / run"`) are
unmodified by construction. `npm run typecheck` and `npm run lint` both exit clean.

## `A5` — the guard, and the deviation ruling — NOT MET TO THE LETTER; shipped assertion is sound

The shipped assertion (`src/cli.test.ts`, `describe("ABC-109 — AGENTS.md stays inside its byte
budget")`) is exactly as specced: one `it`, `readFileSync(...).length <= 24_576`, no new test
file, no hash/line-count/rendering pin. Confirmed independently: `readFileSync` with no encoding
argument returns a `Buffer`, whose `.length` is a byte count, not a character count (verified with
a throwaway 1-char/2-byte UTF-8 fixture: `Buffer.length` 2, `.toString().length` 1) — `A5`'s "pure
function of the byte count" is genuinely byte-based, and criterion 4 of this gate's own scope
(multi-byte character case) is satisfied by this same fact.

**The deviation:** `A5`'s own text reads *"the failing path is exercised on an in-memory number
rather than by writing the real file."* The Engineer's build padded the real `AGENTS.md` to
24,577 B, watched the row red, then restored it byte-for-byte (sha256-verified). That is the
opposite of what the sentence prescribes — not an ambiguous reading, a direct contradiction of it.
The Engineer's own note records this as a disclosed deviation, not a hidden one, and traces it to
the Orchestrator's `ticket-to-pr-ABC-109-a5` queue task, which explicitly instructed "watched red
before it ships (temporarily pad `AGENTS.md` past the constant, show the row red, revert
byte-for-byte)" — the queue task's own prescribed method contradicts the ticket's `A5` wording, and
the Engineer followed the queue task.

**Ruling: `A5` is NOT MET as worded.** The shipped guard itself is correct and safe (byte-based,
one assertion, sha256-verified restore, no working-tree residue left behind), but the letter of
"rather than by writing the real file" was not honoured.

**The one extra row that closes it:** a throwaway, never-shipped in-memory red-path check —
e.g. `expect(AGENTS_MD_BUDGET_BYTES + 1).toBeLessThanOrEqual(AGENTS_MD_BUDGET_BYTES)` (or the same
comparison fed a mutant byte count) — run once locally, observed to fail with the same-shaped
message, then discarded before commit. Confirmed trivially exercisable in this worktree with a
two-line `node -e` check (mutant 24577 → `false`; boundary 24576 → `true`) without touching
`AGENTS.md` on disk at all. This satisfies `A5`'s own ABC-065/ABC-067 pattern (`## Test notes` 4:
"a pure function over a string or a number, so no test writes `AGENTS.md`") and does not conflict
with the Orchestrator's "one assertion may ship" constraint, since the in-memory check need not be
a second shipped assertion — only the real-file proof is.

## `A6` — zero production lines, lane charge — MET

`git diff --name-only 0bf562f 0e132ee -- 'src/*' | grep -v '\.test\.ts$'` — empty (confirmed). 0
new test files (47 → 47). Test count 1446 → 1447 (+1, ≤ 2 allowed). `npm test` wall time on this
run: 12.44 s (includes worktree cold-start/transform overhead on a shared host; not directly
comparable to the Scribe/Engineer's own narrower readings, all within noise for a `readFileSync`
+ comparison row).

## `A7` — nothing moved into a file no role reads, nothing into the kit — MET

Only new destination: `memory-bank/90-agents-md-command-log.md` — confirmed present, confirmed
indexed in `memory-bank/00-index.md` (new row: `| \`90-agents-md-command-log.md\` | ... |`).
Confirmed it holds the full verbatim-substance text of every relocated `<!-- RUN … -->` comment
(spot-checked the `Dev / run` and `Test (all)` sections word-for-word against the
pre-restructure `AGENTS.md` inline comments — identical content, delimiters dropped). Nothing
under `agent-factory/` was touched (`git diff --name-only 0bf562f 0e132ee` names no
`agent-factory/` path).

## `A8` — cap recorded as inherited, with date and source — MET

`AGENTS.md` opens (after `## Mission`) with the budget line naming `24,576 B`, the `32,768`-byte
inherited cap, its source (the Scribe's 2026-08-19 observation), and that it is not measured in
this repository. Confirmed present at the file's own top, well inside budget.

## Criterion 2 — every default-lane command runnable; two deep lanes spot-checked

Ran (this worktree, this hop): `npm test` (47/47, 1447/1447, exit 0), `npm run typecheck` (clean),
`npm run lint` (83 files, clean). Deep-lane spot checks: `INPUT_DEEP=1
NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts` — exit 0, **34 passed**, vs.
`AGENTS.md`/the command log's documented "33 is the whole lane" receipt (recorded 2026-08-19,
`298bb95`) — **a 1-test drift**, pre-existing (the same figure is unchanged text carried from the
old `AGENTS.md`, not introduced by this restructure) and orthogonal to `ABC-109`'s scope; recorded
as an observation, not an `A2`/`A4` finding, since it is a receipt going stale from ordinary
test-suite growth, not a lost directive. `ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts` — exit
0, **33 passed**, matching the documented "33 passed (32 default)" receipt exactly.

## Criterion 4 — byte guard counts bytes, not characters — MET

See `A5` above: `readFileSync` without an encoding argument returns a `Buffer`; `.length` is byte
count. Independently reproduced with a throwaway 1-character (2-byte UTF-8) fixture.

## Gaps

- `A5` not met to the letter — see ruling above; the one-row fix is named and does not require
  touching the shipped assertion.
- One historical sentence dropped from `AGENTS.md`'s condensed UAT section without a designed
  pointer (present elsewhere in `memory-bank/60-progress.md` by coincidence, not a directive).
- The `line-input.test.ts` `INPUT_DEEP` receipt (33) is stale against this hop's measured 34 — a
  pre-existing drift, not introduced by `ABC-109`.

## Fences honoured

Zero lines touched under `src/`, `AGENTS.md`, `memory-bank/` in this QE worktree (`git status`
clean before this note's own commit). No `plans/board.md`, `plans/nfr-catalog.md`, ADR edits.
Own worktree `.claude/worktrees/qe-ABC-109`, `node_modules` symlinked. Never merged, never pushed.
