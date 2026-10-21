---
subtask: security-nfr-ABC-183
role: security-nfr
ticket: plans/tickets/ABC-183-a7-pins-that-the-decoy-is-written-before-the-booked-spawn.md
ref: .grugops/context/qe-ABC-183/
branch: grugops/qe-ABC-183 @ 3ab055f4 (over SE 7bd2b54f/c4c6d36e; base 19abbdb1); QE worktree ../wt-qe-ABC-183 (read only)
width: 2 (beside qe-ABC-182)
---

# Security/NFR: AR-180-VALIDATED close, and QE-183-a / QE-183-b

QE (verdict `…be7c2c82`) read part (ii) of `AR-180-VALIDATED`'s close condition met: TMO + P6f is 11/11 green on the base test and 10/11 on the head test, red `A7` at the new assertion, `AR-162-FALLBACK` in the output. Part (i) was met at `ABC-163`'s merge (`…8d0de2f4`). QE also found two survivors (plant evidence in the `qe-ABC-183` notes on the branch):
- **QE-183-a (LOW, pre-existing since `ABC-162`):** drop the `neutral` cwd argument from the `booked` spawn and the lane stays 11/11 under P6f. `A7` checks the variable, not the child's working directory.
- **QE-183-b (INFO):** move the capture line together with the decoy write and the lane stays green; only `A1`'s static grep catches it.

## Decide
1. **AR-180-VALIDATED.** Close it as written, or close it and carry a narrower named residual (owner, trigger, close condition), or keep it open. The Orchestrator owns the risk and records the close per your ruling.
2. **QE-183-a.** Is this a new risk (and under which id), an extension of an existing one (`AR-162-FALLBACK` is closed; `AR-095-CWD` is closed), or accepted? If a fix is wanted, name its shape so BA/PM can cut it, with a priority and promotion trigger. Say whether it blocks this merge (the page says it is outside scope).
3. **QE-183-b.** Accept or route.
4. **Security surface.** Confirm the change is test-only (`src/cli.real-engine.test.ts`, 0 production lines) and raises no new concern.

## Fences
- Records only, plus the risk record where `AR-180-VALIDATED` lives (the Security/NFR addenda on the ABC-095 page).
- No `src/`, `AGENTS.md`, board or worktree edits. No timing. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-ABC-183`).
- Write `.grugops/queue/done/security-nfr-ABC-183.md` (brief + `## Result`: verdict, rulings, trace row as one `| ABC-183 | … |` line) and `.claim.md`, uncommitted on main.
