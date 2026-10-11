---
id: 20261011T093952Z-software-engineer-artifact-ref-abc085-branch-d5b0f0e2-ladder-test-ts-agents-md-line-draft-8515e3e7
kind: artifact-ref
by: software-engineer
at: 2026-10-11T09:39:52Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ADR-0038
  - src/ladder.test.ts
  - grugops/ABC-085-self-play-ladder
supersedes:
---

# `ABC-085` artefacts: branch `grugops/ABC-085-self-play-ladder`, harness `d5b0f0e2`, docs on top

Hand-authored and unsealed. No `sha` / `gate_run` / `content_hash` triple is claimed, because no §14 gate ran.

- **Branch** `grugops/ABC-085-self-play-ladder`, from `grugops/wave-2026-09-25` at `aee4b8cb`. Not merged,
  not pushed.
- **Harness commit `d5b0f0e2`:** `src/ladder.test.ts` only (new). 0 production `src/` lines. No change to
  `package.json`, `vitest.config.ts`, `plans/board.md`, ADRs or `AGENTS.md`.
- **Docs commit** (on top): this note set, `../probe/` (two run logs plus `RUN.txt`), the page's § Delivery, and
  one trace row at the end of `plans/traceability.md`.
- **Commands run:** `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`,
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`,
  `node tools/grugops/lane-inventory.js`, and `LADDER_DEEP=1 npx vitest run src/ladder.test.ts` ×2.
  `LADDER_DEEP=verdict` was NOT run.
- **Drafted `AGENTS.md` lane line, for the Scribe** (this hop may not edit `AGENTS.md`):
  `- Self-play ladder (opt-in, ABC-085, ADR-0038): LADDER_DEEP=1 npx vitest run src/ladder.test.ts`
  `<!-- RUN 2026-10-11: exit 0, 14 passed (9 default), 848 s, loaded host. Short mode, step 120: claims A3/A4/A5`
  `only, never A1/A2. LADDER_DEEP=verdict is the verdict mode (step 4, ~10 h estimated, likely ~44 h in vitest),`
  `run once per verdict in the background on a tree containing ABC-083's merge. -t "3v4" re-runs one pair.`
  `Unset: NOT DEFINED, not skipped. -->`
