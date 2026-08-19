---
id: 20260820T234500Z-ba-pm-decision-one-xs-ticket-cut-abc113-three-items-refused-as-noise-and-the-two-instruments-ruled-incomparable-9f20a6c4
kind: decision
by: ba-pm
role: ba-pm
task: cut-epic006-instrument-residuals-2026-08-20
at: 2026-08-20T23:45:00Z
verified_by:
confidence: high
refs:
  - ABC-113
  - ABC-043/A1
  - ABC-044/A1
  - ABC-044/A2
  - ABC-044/A3
  - EPIC-006
  - NFR-008
supersedes:
---

# ONE `XS` test-only ticket cut — `ABC-113` — three items refused, and the one thing this cut RULED

## What was cut

**`ABC-113`, `XS`, `P2`, `epic: EPIC-006`**, `plans/tickets/ABC-113-two-instrument-residuals-in-epic-006s-own-test-files.md`, **198 lines** (budget: median of the next ten cut tickets ≤ 300, `AGENTS.md` § Process rules 2). Six criteria, each naming the mutant it kills or the number it pins:

- **`A1`** binder count = 1 — kills `D3` (shadowing-parameter rebind) and `M9` (flat copy), both measured **2** at this cut.
- **`A2`** the two non-substring rows move onto `screen.split("\n")[1]` — kills `M11b`, on which the whole-screen rows are **GREEN** and the headline rows **RED**.
- **`A3`** zero production lines: exactly two test files in `git diff --name-only`, `src/cli.ts` and `src/result-screen.ts` byte-identical.
- **`A4`** lane unchanged: 40 files / 1207 tests / skip 0; 0 new files, 0 new `it`s, 0 new spawns.
- **`A5`** every close **watched RED** on its decoy before it ships, decoys reverted, `git status --porcelain` empty.
- **`A6`** the incomparability sentence lands in the test file, by mutant name.

Measurements are in the sibling `observation` (`4b1c7de2`), not on the page — the prose budget's own rule.

## The one thing this cut RULED rather than relayed

**`ABC-043` `A1`'s pre- and post-repair instruments are INCOMPARABLE, not strictly ordered.** The old
single row was blind to `M10`; the new triple is blind to `D3`. Neither dominates, so a future reader
comparing them will otherwise record a regression that did not happen. **`A1`'s row is what first
makes an ordering honest** — with it the instrument is stronger than both. `A6` puts the sentence
where that reader will be standing.

## What was REFUSED, and on whose measurement

- **`ABC-044` `A1`'s set-row softness — NOT CUT.** QE ruled it noise with measurements: the naming row
  covers the phrase-shared pair whose `result` differs, six of the eight carry `draw`, and combined
  the criterion is fully instrumented.
- **`ABC-044` `A3`'s word-boundary reading — NOT CUT.** The criterion says *words*, the instrument
  tests words, no build in that diff produces `drawn`/`winner`.
- **The zero-ply trailing blank row — NOT CUT.** Reported by QE, not raised; no criterion forbids it.
- **Any re-opening, re-scoring or amendment of `ABC-043` or `ABC-044` — REFUSED.** Two of their
  assertions are edited by this ticket; neither page, neither DoR, neither column. `ABC-044` is in UAT.
- **The three coverage limits QE disclosed** (`resignation` unreachable, the two claimed draws never
  driven end to end, the TTY path) — **not cut here.** They are UAT disclosures and `EPIC-006`'s later
  command set; a test-hygiene ticket is the wrong home and QE said so.

**The discipline was cutting ONE narrow ticket, not four.** Four were available; one is correct.

## Two judgements the page carries that were mine, not QE's

1. **`A2`'s close is sold as non-vacuity, not coverage.** QE recommended the move; I measured that a
   mutant killed by the headline rows *alone* is **unconstructible** while the sibling word rows
   stand, and wrote that into the criterion. A close oversold is the next hop's false confidence.
2. **No `N8-LANE` line is claimed.** `ABC-108` is open and `NFR-008` is BREACHED on CPU / UNRULED on
   wall, so 650 ms is arithmetic over a number nobody has. Falsifiable zeroes instead, in
   `ADR-0014` decision 4's form, so the line cannot read as a pass.

## DoR, and the single ⚠️

**9/10, ⚠️×1 at item 10 — NOT PULLABLE TODAY, and it is a MERGE, not a question:** `ABC-044` is in UAT
and both files this ticket edits exist only on `grugops/abc044-the-result-screen`;
`src/result-screen.test.ts` is not on `main`. Nothing needs deciding. Cancellation condition is
pre-registered: if `ABC-044` returns from UAT and that test file is rewritten, `A2` is re-cut rather
than delivered; `A1` is unaffected.

**`P2` and not `P1`:** no user is affected and nothing is blocked. **Not `P3`:** a merged criterion
cannot fail its own wrong build and today that fact lives only in a context note.

## Board and traceability, and what this hop did NOT touch

**One `Backlog` row appended to `plans/board.md`, one row inserted in `plans/traceability.md` (12 raw
`|`-fields, matching `ABC-112`).** **`plans/uat/` was not opened and the `In UAT` / `Ready for UAT`
columns were not touched** — a UAT agent is working in that file concurrently, and its own column
edits were present in the working tree at this hop and were left **unstaged and uncommitted** rather
than swept into this commit.

**No `finding` and no `§14-gate#<id>` stamp.** No `scripts/context-io.ts`, no
`mcp__grugops__propose_note`, no stamp issuer in this install; hand-authored `decision` in the
folder's convention, and the queue claim was taken by a bare `mkdir`.
