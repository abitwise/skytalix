---
subtask: secnfr-ABC-173
role: security-nfr
ticket: ABC-173
branch: grugops/ABC-173 @ 9c97dd23 (from 68bbf33f)
ref: .grugops/context/secnfr-ABC-173/
---

# Security/NFR gate on ABC-173 (vitest heap ceiling), lean

## Read first
- The ticket page.
- ADR-0008 § ADDENDUM 2026-10-19 (ACCEPTED, `…9f3b6e20`).
- ADR-0035.
- `qe-ABC-173` (`…e81b5c27`) and the fix done file `ticket-to-pr-ABC-173-fix.md`.

## What to rule

1. **Triggers.** This change touches tooling (`tools/grugops/heap-guard.js`, `run-bounded.js`), `package.json` scripts, `vitest.config.ts` and `AGENTS.md`, with 0 production lines. Check two things:
   - the guard adds no capability limb a test or tool did not already have;
   - `NODE_OPTIONS` handling cannot be turned into code injection. For example, can the CLI_DEEP heap token copy anything other than `--max-old-space-size=<digits>`?
2. **The catalog.** Write the text of the proposed **NFR-010 "Test-lane V8 heap ceiling"** row and the heap clause for NFR-008's stack declaration, as the addendum describes them. **Do not edit `plans/nfr-catalog.md`.** Put the exact text in your notes; I route the edit.
3. **A9 and N8-LANE.** Before merge the addendum needs:
   - the N8-LANE narrow-set charge: base arm on the old command, head arm on the new one;
   - A9 `npm test` wall ≤ 10 s, read with a twin.

   Both are timing readings. Take them **only** in a foreground-verified quiet window: 180 s with no foreign vitest, no `oeselg-labs/platform` process, and no hop of ours running.
   - At 18:03Z, two `oeselg-labs/platform/repos/product-template/template/dist/main…` node processes were running, as they have been all day. **Do not touch them.**
   - If no window opens, record A9 and N8-LANE as **OWED**, and say whether merge can carry them on an owner word (as R-167-2 did).
   - **Never estimate either reading.**
4. **Accepted risks.** Restate RISK-ABC173-TEARDOWN, -STATE and -PUZZLE, and decide whether each is acceptable.

## Fences
- Work in a scratch detached worktree, `../wt-secnfr-ABC-173`, and remove it at the end.
- Do not touch:
  - `src/`
  - `plans/board.md`
  - `plans/traceability.md`
  - `plans/nfr-catalog.md`
  - `../wt-ABC-173`
  - `../wt-ABC-171`
  - `../wt-uat-ABC-171`
  - any process you did not start
- Do not fix anything. Never push or merge.

## Publish
- Hand-written, unsealed notes under `ref:` in main's working tree, including a `decision` note.
- `.grugops/queue/done/secnfr-ABC-173.md` and `.claim.md`, uncommitted. Include:
  - the result, with each ruling;
  - the NFR-010 text and the NFR-008 clause text;
  - A9 and N8-LANE;
  - the accepted risks;
  - a trace row.
