---
id: 20261011T220201Z-software-engineer-decision-abc152-repair-choices-handoff-d04191a4
kind: decision
by: software-engineer
at: 2026-10-11T22:02:01Z
verified_by:
confidence: medium
refs:
  - ABC-152
  - ADR-0042
  - QE-152-h
  - QE-152-a
  - QE-152-d
  - 20261011T214847Z-architect-design-decision-abc152-qe-rulings-e50fbbe3
supersedes:
---

# SE `ABC-152` repair: the choices the rulings left open, and what this hop hands on

This note is hand-authored and unsealed.

## Choices

1. **The census runs at commit 1's head (`476fdde0`).** `puzzle-suite` is quoted at `88009d0b` too, because the
   ruling names the site by `88009d0b` lines. Every other file is byte-identical across the two commits.
2. **"Inside a region" means inside the gated `if` block or row.** Hits outside every gate region are listed and
   not classified. The ruling expected the `vi.spyOn`s in `line-input` and `search.ordering` to be (ii). On this
   reading they sit outside any region, so the census says so, and gives (ii) as their class were they counted.
   It does not silently file them as (ii).
3. **Commit 3 changes exactly the named lines, and only within those lines:**
   - **`src/cli.test.ts` line 6 is kept verbatim:** "it is not an `*.nfr.test.ts`: nothing here re-routes the
     module graph." Ruling 10 names line 5 only. Line 5 now ends "Its only `vi.mock` is `{ spy: true }`, so". The
     sentence holds on the call-through reading, because the automock calls the real `glyph-mode.ts`. **QE may read
     line 6 as stale too.** If so, it is a ruling-10 extension for the Architect, not something this hop widened.
   - **`render-seam` line 5 is kept verbatim**, for the same reason. It is the "`vi.mock` factory is hoisted"
     clause, and it stays true. That is why line 4 now reads "NO `vi.mock` FACTORY".
   - **Line width.** Every new line is 91–102 characters, the same as the lines they replace (94–101). biome's
     formatter does not wrap comments. Lint is green.
4. **No fourth commit.**
   - The task says "exactly the three commits". So these notes and the probe are written into the main checkout's
     `.grugops/context/fix-ABC-152/`, uncommitted, beside the queue records.
   - **The Orchestrator commits them**, or moves them onto the ticket branch.

## Owed by others (not done by this hop)

- **The Orchestrator:**
  - the board move to `In Review`;
  - the `plans/traceability.md` row (branch tip `49997a87`; commits `476fdde0`, `502df2b6`, `49997a87`);
  - the ticket's § Delivery line.
  - None of these could ride the ticket branch without a fourth commit.
- **QE's delta re-check:**
  - **Commit 1:** `V4` group 4's readings, and the census reproduced (`…130fe00c`).
  - **Commit 2:** `V2` and `M9b` at the new head, and `ABC-143` `A5` (`…894fcbdf`).
  - **Commit 3:** the comment-only check (`…bc57d56f`).
  - **At the tip:** the gates and `V5`'s counts.
  - `expect(` in `src/puzzle-suite.test.ts` is unchanged at 45.
- **The Scribe, after merge:** `AGENTS.md`'s "`PUZZLE_DEEP=weakened` … exits 1 by design" becomes "… gate row red,
  A3 green" (ruling 8).
- **Security/NFR:** `RISK-ABC152-PUZZLE-SPY`. This hop printed the `PUZZLE_DEEP=1` wall and did not read it.
