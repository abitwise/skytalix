---
task: wave-2026-09-25
subtask: design-ABC-101-glyphs
role: frontend-ui
ticket: plans/tickets/ABC-101-difficulty-selection.md
ref: .grugops/context/design-ABC-101-glyphs/
enqueued_by: orchestrator
enqueued_at: 2026-10-13T00:00:00Z
branch: grugops/design-ABC-101-glyphs
base: main (after the board commit that enqueues this)
---

# Subtask: the UI contract for "my pieces look the wrong colour on a dark terminal", now IN ABC-101's scope. You are the ONLY hop running (width 1).

**Owner word** (note `.grugops/context/wave-2026-09-25/notes/…owner-word-abc101-uat-glyph-fix-in-scope-*`, read it whole): at ABC-101's UAT, playing `--colour black`, "My pieces still look white … This seems to be just pieces color issue. Fix it in ABC-101". The Orchestrator's reading: rules and orientation are correct; the human's (Black) pieces are drawn with the filled Unicode black glyphs (♟♜♞♝♛♚), which a dark terminal renders in its light foreground colour, so Black looks white and White's outline glyphs look dark. `--ascii` reads correctly. Pre-existing on main.

Author the design contract the SE builds to and QE verifies:
1. **Read the contracts first:** `src/render.ts` header (EPIC-002 amendment `[A4]`: shading by CHARACTER, never by ANSI background colour; the frame is a VALUE, reads no `isTTY`/env/terminal size; constant geometry 9×18); `[A1]`/acceptance `2b` (glyph mode is a parameter; `ABC-015` owns the five-row selection table in `src/glyph-mode.ts`; `EPIC-006` owns the flags); `ABC-014`, `ABC-015`, `ABC-016`, `ABC-027` pages; ADR-0009/0010/0029; `src/__snapshots__`; any NFR test that pins glyph bytes or frame width (`glyph-mode.nfr.test.ts`, frame width/overflow tests).
2. **Lay out the options** with their cost against those contracts, at least: (a) swap the Unicode glyph pairs (White drawn filled) — right on dark terminals, wrong on light ones; (b) a foreground-colour SGR on piece glyphs only (not background) — what it does to `[A4]`, pipes, snapshots, `NO_COLOR`, frame width counting; (c) a user flag / env selecting a dark or light glyph set, and its default; (d) a filled glyph for BOTH sides distinguished another way; (e) anything better you find (e.g. what common CLI chess programs do). For each: what a player sees on a dark AND a light terminal, which merged criteria/tests it reds, and whether it contradicts a merged contract (name it — a contradiction is the Architect's or owner's, not yours to override).
3. **Recommend one**, and write it as testable Given/When/Then the BA/PM can paste into ABC-101 (byte-level where the frame is concerned). If every viable option contradicts a merged contract, say so and name the decision the owner must make, phrased as a single question with options.
4. Say whether the fix keeps ABC-101 at `M` or should be split (it is the owner's word that it lives in ABC-101; you may still recommend a split line inside it).

## Fences
Own worktree: `git worktree add ../wt-design-ABC-101-glyphs -b grugops/design-ABC-101-glyphs main`. Edit only your notes and probe under `ref:`, a design contract file if your role keeps one (under `memory-bank/` or `plans/`, new file or dated append-only), and one trace row at the END of `plans/traceability.md`. Do not touch `src/`, tests, `AGENTS.md` (24,576 B, at budget), `plans/board.md`, ticket pages, ADRs. Probes (e.g. rendering a frame) only in scratch copies outside the repo, removed by exact path. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`, rebase. Never merge or push. No timing readings. End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/design-ABC-101-glyphs` in the main checkout, then FLAT `.grugops/queue/done/design-ABC-101-glyphs.md` and `.claim.md`, uncommitted; `rmdir` the claim dir.

Report: branch tip; the options table; the recommendation with its Given/When/Then; contracts and tests it moves; any owner or Architect decision needed; size view.
