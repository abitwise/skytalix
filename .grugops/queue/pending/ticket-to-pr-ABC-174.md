---
subtask: ticket-to-pr-ABC-174
role: software-engineer
ticket: ABC-174
page: plans/tickets/ABC-174-re-cut-the-level-table-per-adr-0045-the-default-moves-to-level-5-and-plays-as-today.md
from: main bd480c99
branch: grugops/ABC-174
worktree: ../wt-ABC-174
---

# Implement ABC-174 end to end

The ticket page is the contract: scope, acceptance A1–A8, § Pins that move, and the fences. Also read:
- ADR-0045 (ACCEPTED): D1 table, D2 default, D3 mechanism fence, D4 UCI, D6, D11, D12.
- The owner words the page cites (`…b2e6d4a9`, `…1a9c7f42`).
- ABC-171's merged session (`src/uci-session.ts`, `src/uci-session.test.ts` at `94f85341`).

Carry these forward:
- **Pin lines have drifted.** The page read lines at `6fc32150` / `9ae31679`; main is now `bd480c99`
  (ABC-171 and ABC-173 merged, and ABC-173 re-stepped some rows). QE2-171-g already noted that ABC-171 `A8`
  is at `:882-897`, not `:877-893`. Locate every pin by content, and report its line at `bd480c99` in the commit body.
- **UAT-171-c / control C12.** The `Skill Level` line's `default` must be read from `DEFAULT_LEVEL` (scope 3),
  and A5's row that builds the expected line from `DEFAULT_LEVEL` is what pins them together.
- **R-167-1.** On your added lines run, and report:
  `git diff -U0 bd480c99...<tip> -- src | grep '^+' | grep -nE 'globalThis|\bglobal\b|Reflect|constructor'`
  It should print nothing; explain any hit.
- **Do not tune.** No value moves toward a game result (test note 1). D1's values exactly.
- **Armed reds (test note 5):** watch each red once, revert, and record it in the handoff.
- **A6 is QE's** (deep lanes `ENGINE_DEEP` / `LADDER_DEEP`); you need not run them. `ABC-175` (verdict) is not yours.

Write the tests first. If an edge case is undecided on the page, **stop and report**; do not decide it.

## The vitest cap (ADR-0008 addendum 2026-10-19, NFR-010) — every vitest command carries its prefix

The heap guard refuses a run without it. Suite: `NODE_OPTIONS=--max-old-space-size=128` (built into `npm test`).
One-file lanes: `NODE_OPTIONS=--max-old-space-size=400`. At most 2 executors at a time, summed heap ≤ 2048 MiB —
so run at most one vitest command at a time. Heavy rows use coarse virtual-clock steps (10 or 100), never step 1.

## Gates
All green on your tip:
- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`
- `.test-results/last-run.json` shows `success: true` with the full count.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`
- `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts`
- `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts`

## Fences
- Only the seven `src/` files A8 names. No change to the mechanism files (A4), `src/ladder.test.ts`,
  `plans/nfr-catalog.md`, or `AGENTS.md` (those are other roles').
- Take no timing readings; leave any timing criterion OWED and do not estimate it. A7 is data assertions only.
- Do not touch `plans/board.md`, `plans/traceability.md`, or any process you did not start.
- Never push, never merge, never `git push -f`.

## Handoff
Write `.grugops/queue/done/ticket-to-pr-ABC-174.md` and `.claim.md` in main's working tree, uncommitted. Include:
- the tip;
- each criterion A1–A8 with its result (A6 left to QE; A7's data rows);
- every pin old → new with its line at `bd480c99`, and any further pin the build reddened, with its reason;
- the armed reds observed;
- the gates;
- the R-167-1 grep output;
- A4's numstat output, and A8's `--name-only` output;
- the production-lines measurement: `git diff --name-only bd480c99...<tip> | grep -v '\.test\.ts$' | grep '^src/'`;
- any row whose cost moved (NFR-008);
- a trace row.
