---
id: 20261017T191606Z-architect-design-decision-abc146-a7-adr0038-headings-accepted-addendum2-route-v-8e87ee71
kind: decision
by: architect-design
at: 2026-10-17T19:16:06Z
verified_by:
confidence: high
refs:
  - ABC-146
  - ABC-085
  - ADR-0038
  - ADR-0040
  - ADR-0041
  - NFR-008
  - memory-bank/50-decisions/ADR-0038-the-ladder-step-is-one-named-constant-per-run-step-4-for-the-verdict-step-120-for-the-short-mode.md
  - .grugops/context/secnfr-ABC-146-a0/notes/20261017T184318Z-security-nfr-decision-abc146-a0-preregistration-workload-n5-route-rule-107ff1bf.md
  - .grugops/context/secnfr-ABC-146-a0/notes/20261017T191132Z-security-nfr-decision-abc146-a0-factor-reading-fhi-1006-route-v-f1558f02.md
supersedes:
---

# `ABC-146` `A7`: `ADR-0038`'s headings no longer say PROPOSED, and addendum 2 (2026-10-17) records route V. The verdict's result is not yet known

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). This hop ran no
test, no vitest, no build and no timing. A verdict run was in progress in the same worktree, and this hop did not
touch it, its log or any process.

## Scope (the ticket's `A7`)

- `ADR-0038`'s addendum headings must not say PROPOSED where § Status records the addendum ACCEPTED.
- On route V, a dated second addendum must say that the verdict runs inside vitest, and cite `A0`'s reading.
- Records only. Owner of the edit: Architect/Design.

## What changed (`memory-bank/50-decisions/ADR-0038-…md`)

1. **The heading at `:196`** (now `:202`) went from "ADDENDUM 2026-10-11 (PROPOSED; owner acceptance owed)" to
   "ADDENDUM 2026-10-11 (ACCEPTED 2026-10-11, § Status; its route is not built, see addendum 2)". The rest of the
   heading is unchanged.
2. **The heading at `:235`** (now `:241`) went from "Decision 5, amended (PROPOSED)" to "Decision 5, amended
   (ACCEPTED 2026-10-11; not built, see addendum 2)".
3. **§ Status gains one paragraph** that points at addendum 2 and says the verdict's result is not yet known.
4. **Addendum 2, 2026-10-17, is appended** as the last section. It has Context, the decision (5 items),
   Alternatives, Consequences and Rollback.

Body text was left alone. `:101` ("The verdict step is 4. This is RECOMMENDED") and `:275` (alternative (c),
"RECOMMENDED") are history. Neither is a heading, and neither says PROPOSED.

## The check (`A7`'s bar)

`grep -nE '^#+ .*PROPOSED' memory-bank/50-decisions/ADR-0038-*.md` prints nothing and exits 1. Before the edit it
printed `:196` and `:235`.

## The decision (addendum 2)

- **The verdict runs inside vitest:** `LADDER_DEEP=verdict npx vitest run src/ladder.test.ts`. It is run directly
  and never through `npm test`, because that script's 60 s bound would end it.
- **Cited:** `A0`'s reading at `c639a220` (`…f1558f02`), graded as pre-registered at `1e2cae9f` (`…107ff1bf`).
  10 of 10 node counts were 29 717. The median `F` is 0.954 and `F_hi` is 1.006 ≤ 1.30, so the route is V.
- **Route N's code move is not built.** It stays the accepted fallback. `A1`–`A4` are cancelled on route V.
- The report names the runner and its version (`npx vitest --version`, `node --version`). Scheduling, the
  serial-run rule and the window rule stand. Decisions 1–4 and 6, step 4 and the 180 games are unchanged.
- **The verdict's result is not yet known.** No verdict number is quoted.

## Assumption stated (coding rule 1)

- **No owner acceptance is owed for addendum 2.** It records his own pre-registered rule (2026-10-12, `…19019ec0`;
  "the worst of five decides", relayed in `…107ff1bf`) applied to a reading. This follows `ADR-0040` addendum 2's
  precedent ("the owner's own pick, so no acceptance is owed"). If the owner or the Orchestrator reads it
  otherwise, the Status paragraph changes to "owner acceptance owed". Nothing else changes.

## NFR impact

- `NFR-008`: unchanged. The default lane plays 0 ladder games, and no file is added.
- `plans/nfr-catalog.md` is not opened.

## Fences, measured

- The commit touches only `memory-bank/50-decisions/ADR-0038-…md` and this note.
- `git diff --name-only eb216351 HEAD -- src/ tools/ vitest.config.ts package.json package-lock.json` is empty.
- `src/ladder.test.ts` md5 is `bba67b75565b4f4a2e8d231e8bcd6b2e` and `vitest.config.ts` md5 is
  `2d2b6379dca047103493ab0bd9b10480`. Both equal `A0`'s staleness inputs.

## Open, for others

- **The Scribe:** the `AGENTS.md` ladder lane comment ("The A1/A2 verdict is not run here (~44 h in vitest): its
  route is ABC-146's (plain node, ADR-0038 addendum)") is stale on route V.
- **BA/PM:** the ticket's header still says it "is built to the ACCEPTED `ADR-0038` addendum", and its title
  describes route N. The page's 2026-10-17 amendment already says the title stands for route N only, so this is
  not wrong. It is left as is.
- `plans/traceability.md` and `plans/board.md` were not touched. The trace row is in the handoff.
