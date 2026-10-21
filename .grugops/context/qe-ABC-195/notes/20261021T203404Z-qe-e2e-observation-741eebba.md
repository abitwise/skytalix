---
id: 20261021T203404Z-qe-e2e-observation-741eebba
kind: observation
by: qe-e2e
at: 2026-10-21T20:34:04Z
verified_by: 
confidence: high (own scratch clone at fb6d7565 and 5 one-line harness copies, private env; no timing)
refs:
  - ABC-195
  - grugops/ABC-195
  - grugops/qe-ABC-195
  - f9709ed8
  - 0dfd17b3
  - 99d07d32
  - fb6d7565
  - 88b03a37
  - AR-193-HUNKHDR
  - AR-193-SPACEPATH
  - ADR-0036 S1
  - plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md
  - .grugops/context/arch-build-ABC-195/notes/20261021T201014Z-architect-design-observation-1bafd98d.md
  - .grugops/context/arch-build-ABC-195/notes/20261021T201020Z-architect-design-decision-6a068acf.md
  - QE-195-a
  - QE-195-b
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/security-nfr-QE-193/notes/20261021T183616Z-security-nfr-decision-5719a86d.md
supersedes: 
seal: sha256:31dabb58b0174fa4c5961d870ce4cd9e3b54427fa577072d1d2cafafb0814d07
---

# QE own plants for `ABC-195`: 23 by-hand plants and 5 harness drift copies; head reads every plant right; base was wrong on 17 of them. The plant check catches 4 of 5 anchor drifts, but `PP-EDIT`'s in-place edit anchor drifts silently (QE-195-a)

Cites the page's `## Scope` (a)/(b) and Security/NFR `…decision-5719a86d` § 3 (the `## Risks`) as authoritative.

**Setup.** Plants ran in my own `git clone` (its own `.git`) at `fb6d7565`, under the private env (private `HOME`/`TMPDIR`/`GIT_CONFIG_GLOBAL`, `GIT_CONFIG_NOSYSTEM=1`), with fixed commit dates. Each plant was read on limbs 1/2/3 with head's and base's instrument. The capability tail is `leak()` (`process.env.FEN_URL` + `fetch`) unless named otherwise. At the end the clone held no `color.*`/`diff.*` key and no `info/attributes`.

**Head right, base wrong (17):**
- **One `++ ` line, three positions** (inside `src/fen.ts`'s top JSDoc, with a later `leak()` hunk):
  - Q1: the only line of a 1-line hunk (first and last).
  - Q2: the first line of a 3-line hunk.
  - Q3: the last line of a 3-line hunk.
  - Head: limb 2 `src/fen.ts:347/349` FIRES, limb 3 FIRES. Base: blind.
- **Q4, several `++ ` lines in one file over 3 hunks** (`++ b/src/glyph-mode.ts`, then `++ b/src/cli.ts` and `++ "q" x` with an `e2 = () => process.env.E2` line):
  - Head: limb 2 names 2 lines (`:307`, `:353`); limb 3 FIRES.
  - Base: FIRES (disputed) on every limb, naming `src/fen.ts`, `src/glyph-mode.ts` and `src/cli.ts` as changed.
- **Q5, `-- ` first and last of a removed 3-line hunk** in `src/book-file.ts`, plus a removed 2-line tail: Ruling 2 `0 + lines, 5 - lines` at head, `3 - lines` on base.
- **Q6, a minus-side redirect `-- a/src/glyph-mode.ts`** removed from `src/book-file.ts`, plus a removed tail: `2 - lines` at head, `1 - line` on base.
- **Q8, a new file `src/aa-new.ts` holding `++ b/src/glyph-mode.ts`** and `node:fs`: verdicts equal (all FIRE), but base lists `src/glyph-mode.ts` as a changed file, and head does not.
- **Q9, look-alike lines inside a hunk** (`diff --git a/src/glyph-mode.ts b/src/glyph-mode.ts`, `++ b/src/glyph-mode.ts`, `@@ -1 +1 @@` in a `src/fen.ts` template):
  - Head: FIRES limbs 2/3 on `src/fen.ts` only. Base: blind, and lists `glyph-mode.ts`.
  - Every hunk line carries a `+`/`-`/space prefix, so no look-alike can open or close the window.
- **Spaced names (8 plants):** `src/q  t.ts` (two spaces), `src/sp /q.ts` (a directory ending in a space), `src/ q.ts` (a leading space) and `src/qé t.ts` (space plus non-ASCII), each reached (`SP-N5` shape) and new-unreached.
  - Head: FIRES limbs 1/2/3, naming the file whole, Ruling 2 `3 +` (reached) or `4 +` (unreached).
  - Base: silent on all three limbs, changed files 0.

**Head and base equal and right (6):**
- **A6's two plants** (the quoted names and `PM`). Their head-vs-base reads are in the criteria note.
- **Q7, a deleted file `src/aa-del.ts`** holding `-- a/src/glyph-mode.ts` and `++ b/src/glyph-mode.ts`, with a later `src/fen.ts` `leak()`: both read `src/fen.ts:346/347`. A deleted file is one hunk, and the next file's header resets the parse.
- **`src/q<TAB>t.ts` (a real TAB), reached and unreached:** git C-quotes it, and head and base both FIRE (disputed) on every limb with 1 `C-quoted` line. The stand-in prints 0 for it.
- **`src/qt.ts ` (a trailing space after `.ts`), reached and unreached:** both instruments are silent (`isProduction` wants `.ts` at the end; unchanged, out of scope). The stand-in printed 2 lines and 1 line.
  - Node 26.11.1 cannot import `./qt.ts ` (`ERR_MODULE_NOT_FOUND`, because the specifier's trailing space is trimmed), so no reachable production file is lost when the stand-in retires (QE-195-b).
  - A directory ending in a space (`./sp /q.ts`) imports fine, and head reads it (above).

**Drift copies of head's harness** (one line changed each, head instrument, tip `fb6d7565`):
- D1, `pp`'s template anchor (`isSquareAttackedBy` → `…ZZ`): exit 2, `plant PP-TPL failed the plant check: stand-in lines 0 on the plant, 0 on its twin`.
- D3, `SP-N5`'s name `q t.ts` → `q_t.ts`: exit 2, `plant SP-N5 failed …: 0 on the plant, 0 on its twin`.
- D4, `PP-TPL`'s twin keeps `++`: exit 2, `… 1 on the plant, 1 on its twin`.
- D5, `pe`'s template anchor (`\nfunction ` …): exit 2, `plant PP-EDIT failed …: 0 …, 0 …`.
- **D2, `pe`'s in-place edit anchor `resolveOptions\(process\.argv\.slice\(2\)\)` → `slice\(9\)`: exit 0, `25 of 25`.**
  - The `PP-EDIT` row reads `plant check  stand-in lines: 1 on the plant, 0 on its twin`, then `L2 … identical (limb 2: does not fire)`.
  - The template lands, so `mk` (file list) and `pc` pass, and both sides are equally blind.
  - The `TW` rows check limbs 2/3 only by equality with `341da4c1` on the twin. No expected limb 2/3 verdict is asserted, and the plant check guards only the header-shaped anchor.
  - The other four rows' capability lines are written without an anchor (`printf`), so only `PP-EDIT` is exposed. → QE-195-a.
