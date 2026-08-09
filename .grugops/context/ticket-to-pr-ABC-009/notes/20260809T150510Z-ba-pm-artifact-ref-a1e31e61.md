---
id: 20260809T150510Z-ba-pm-artifact-ref-a1e31e61
kind: artifact-ref
by: ba-pm
at: 2026-08-09T15:05:10Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - A11
  - EPIC-001
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - plans/traceability.md
  - .grugops/queue/done/ticket-to-pr-ABC-009-bapm3/
supersedes: 
---

# What this hop produced, by reference

**Branch `grugops/ticket-to-pr-ABC-009`.** Two files changed, both delivery artifacts, **zero under `src/`**.

- `plans/tickets/ABC-009-legalmoves-position-mutation.md` — `## Acceptance` and `## Definition of Ready`
  only, **7 hunks**. `A11`'s `⚠️ NOT YET SATISFIED` marker retired; the preamble's "currently-failing /
  today" framing pinned to `main` at `aad6d48` (pre-fix md5 `fb4fa40934e768dffeaeed0b43548842`); the
  preamble's `A11` shortfall sentence replaced; correction-block item 8's stale heading clause **struck**
  (not deleted) and closed with a dated amendment; the Definition-of-Ready amendment given a dated
  successor; `A11`'s enemy-colour exclusion clause corrected on measurement and the **new gap named** in a
  boxed retirement note under `A11`. **No criterion, count, FEN or parenthetical was edited**, no criterion
  was added or renumbered, and the frontmatter is byte-identical (`status: ready-for-uat`,
  `column: Ready for UAT`).
- `plans/traceability.md` — **ONE ROW (`ABC-009`), ONE CELL (`Status`)** plus one `_Updated:` line prepended.
  Edited at **field level**, the added string asserted to contain no unescaped pipe before writing, and **all
  31 table rows verified at ten cells counting UNESCAPED pipes before and after** with exactly one row line
  changed — the counting rule this role established at its second hop, which is why the withdrawn 11-cell
  report stays withdrawn.

**Byte-identical, verified rather than asserted:** everything under `src/` (`git status --short -- src/`
empty; `src/moves.ts` md5 `0e247853ab2c05887c76105ff83d8621`; **0 of 14** pre-existing `*.test.ts` files on
`main` modified, each diffed individually); `plans/board.md`; `plans/nfr-catalog.md`; the tickets `ABC-022`,
`ABC-010`, `ABC-011`, `ABC-018`; and within `ABC-009` itself the sections `## Scope`, `## Out of scope`,
`## Reproduction`, `## Dependencies`, `## Security / NFR triggers`, `## Test notes`,
`## Size and priority rationale`, `## Implementation`, `## QE`, `## QE — second hop` and
`## Security / NFR`.

**Queue:** `.grugops/queue/claimed/ticket-to-pr-ABC-009-bapm3/` → `.grugops/queue/done/`, claimed by hand
(`mkdir` + `claim.md` registry record, `mv` for both transitions) because `scripts/claim.js` does not exist
here.

**Context notes, this hop:**

- `20260809T150110Z-ba-pm-observation-99f3d5f3` — `A11` verified independently: 17 mutants, exhaustiveness
  re-derived from `parseFen`'s domain, the quantifier falsified, harm probed one process per tree.
- `20260809T150210Z-ba-pm-observation-cf01de8b` — the fourth class: the occupant's **colour**, 12 mutants,
  four survivors with live harm, and why the old exclusion claim was wrong.
- `20260809T150310Z-ba-pm-decision-ae3dd4c9` — `A11` MET, what was cleared, what was refused, the rejected
  alternatives.
- `20260809T150410Z-ba-pm-claim-20ace988` — the soft items, `confidence: UNKNOWN - verify` on every one.

**State on the tip, measured by this role:** `npm test` **371 passed (371) on 16 files**, skip count **0** by
the `AGENTS.md` command. `main` still `aad6d48`; **nothing merged, nothing deployed.** `ABC-009` stays in
`Ready for UAT` **1/4** — no board move is this role's.

**Not produced, deliberately:** no test row, no production line, no new criterion, no ticket for
`ABC-018`'s frontmatter drift, no `index.md` / `index.jsonl` (the renderer is absent here), and **no
`finding`** — none is admissible on this task and nothing is self-stamped.

**The scratch instruments lived outside the repository** (session scratchpad, `node_modules` symlinked) and
are not delivery artifacts: the mutation campaign, the exhaustiveness probe, the suite-file corruption
harness, the per-tree harm probe and the enemy-occupant map. `src/moves.ts` was re-hashed to
`0e247853ab2c05887c76105ff83d8621` after every mutant in every one of them.
