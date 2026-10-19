---
subtask: qe-ABC-171
role: qe-e2e
ticket: ABC-171
page: plans/tickets/ABC-171-the-uci-session-offers-ownbook-and-skill-level.md
branch: grugops/ABC-171 @ 9ae31679 (code b6afd021, base 7df64755)
ref: .grugops/context/qe-ABC-171/
---

# QE pass on ABC-171 (OwnBook + Skill Level), lean

Break the delivery at `9ae31679` and report the gaps.

**Read first:**
- the ticket page;
- ADR-0044 D10 and D11;
- the SE notes on the branch (`.grugops/context/ticket-to-pr-ABC-171/notes/`);
- the SE's six choices, in note `…a171d001`;
- the blunder-path note `…a171d002`.

**Check:**
- **Grade the six choices.** For each, say whether the page or ADR decides it, or whether it is a gap.
- **Mutants on scratch copies.** At minimum, target:
  - setoption parsing and case rules;
  - the Skill Level bounds (`0`, `6`, `2.5`, `constructor`, `Object.hasOwn`);
  - `min(G, level)`;
  - book warm-once at `isready` / `go`;
  - book-off making zero `read` calls;
  - a book hit while `infinite` is held;
  - a failing book still writing a legal `bestmove` with exactly one warn;
  - the per-`go` seed draws.
- **NFR-004.** Under ABC-167 the session's highest budget was 3 000 ms, because the default level capped it. Level 5 now lets up to 4 500 ms through, and the page says this is under the 5 s ceiling. Confirm that against NFR-004 and the ADR, on the virtual clock only.
- **ABC-167 regressions.** All of ABC-167's rows must still be green and must still kill their mutants. The only ABC-167 row the SE changed is A1.
- **R-167-1.** Re-run the grep on the added production lines.
- **Gates at the tip.** `last-run.json` must show `success: true` with the full count. Run the integrity check at skip 0.
- **N8-LANE.** Take it only in a quiet window you have verified in the foreground (180 s), and record host and load. Otherwise mark it OWED. Never estimate it.

**Fences:**
- Work in a scratch detached worktree, `../wt-qe-ABC-171`, and remove it when done.
- Commit nothing to `grugops/ABC-171`.
- Do not touch `src/`, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-171`, `../wt-arch-levels-recut`, or any process you did not start.
- Do not fix anything. Never push, merge or self-sign.

**Publish:**
- Hand-authored, unsealed notes under `ref:` in main's working tree, including a `kind: decision` note authored by `qe-e2e`.
- `.grugops/queue/done/qe-ABC-171.md` and `.claim.md`, uncommitted, with:
  - the verdict;
  - the criteria;
  - the six choices graded;
  - the mutants;
  - the gates;
  - N8-LANE;
  - the gaps (`QE-171-*`);
  - a trace row.
