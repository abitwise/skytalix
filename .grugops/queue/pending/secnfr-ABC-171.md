---
subtask: secnfr-ABC-171
role: security-nfr
ticket: ABC-171
branch: grugops/ABC-171 @ 5dee231c
ref: .grugops/context/secnfr-ABC-171/
---

# Security/NFR gate on ABC-171 (lean)

Read these first:
- The ticket page, § Security / NFR triggers.
- ADR-0044 D10 and D11.
- `secnfr-ABC-167` (`…99713c0e`, with R-167-1 and R-167-2).
- `qe-ABC-171` and `qe2-ABC-171` (verdict PASS, `…d60ef4d9`).

Then rule on each of these:

1. **Triggers (a)–(d).** Confirm them against the tip. The book seam: `book.ts` is `import type` only, and the probe is injected. Use ADR-0036's instrument as in `secnfr-ABC-167`.
2. **R-167-1 carry.** Grep the added `src/uci-session.ts` lines for `globalThis`, `global`, `Reflect` and `constructor`. QE found one hit, the test-file literal `"constructor"`. `LEVELS[skill]` sits behind `Object.hasOwn`. Confirm.
3. **NFR-004.** Level 5 now lets a 4 500 ms budget leave the session. Under ABC-167 the cap was 3 000 ms; QE's maximum is 4 600 virtual ms. Rule against NFR-004's clauses A and B, and against `AR-NFR004-A`.
   - ADR-0045, accepted, moves `DEFAULT_LEVEL` to 5 at 3 000 ms in ABC-174. Say what changes there.
   - Name the two `nfr-catalog` lines ADR-0045 routed to you (`AR-NFR004-A`, `:1364`). Do not edit the catalog. Just state the edit that ABC-174's gate owes.
4. **Book read surface (D10).** A bad or throwing book writes one warn and still a legal `bestmove`. No path or file name comes from UCI input. Confirm.
5. **NFR-008 N8-LANE.** Take it only in a foreground-verified 180 s quiet window. An ABC-173 SE hop is running lanes, so a quiet window is unlikely. Otherwise mark it **OWED** and say whether merge can carry it under an owner word, as with R-167-2. Never estimate it.

## Fences
- Scratch detached worktree `../wt-secnfr-ABC-171`, removed at the end.
- Do not touch `src/`, `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, `../wt-ABC-171`, `../wt-ABC-173`, or any process you did not start.
- Do not fix anything. Never push or merge.

## Publish
- Hand-authored, unsealed notes under `ref:` in main's working tree, including a `decision` note (PASS / PASS_WITH_RISKS / FAIL).
- `.grugops/queue/done/secnfr-ABC-171.md` and `.claim.md`, uncommitted, with:
  - the result
  - each ruling
  - required fixes
  - accepted risks
  - N8-LANE
  - a trace row
