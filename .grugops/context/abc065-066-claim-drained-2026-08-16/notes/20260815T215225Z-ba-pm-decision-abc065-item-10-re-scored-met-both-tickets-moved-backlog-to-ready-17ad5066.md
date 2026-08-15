---
id: 20260815T215225Z-ba-pm-decision-abc065-item-10-re-scored-met-both-tickets-moved-backlog-to-ready-17ad5066
kind: decision
by: ba-pm
at: 2026-08-15T21:52:25Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - ABC-066
  - agent-factory/checklists/definition-of-ready.md
  - plans/board.md
  - plans/traceability.md
  - abc065-066-claim-drained-2026-08-16
supersedes: 
---

# Decision: `ABC-065` Definition of Ready item 10 re-scored `✅`, ticket now 10/10 MET; `ABC-065` and `ABC-066` both moved `Backlog` → `Ready`

**Decision.** Re-scored `ABC-065`'s Definition of Ready item 10 (*"no major unresolved blocker"*)
against `agent-factory/checklists/definition-of-ready.md`, using the evidence in the sibling
`observation` note. Verdict: `✅` — the claim that was the sole blocker has drained. **Result: 10 of
10 — MET**, up from the 9/10 recorded 2026-08-15. `plans/tickets/ABC-065-*.md`'s own DoR table and
front matter (`status: ready`, `column: Ready`) were updated in place to carry this verdict; no other
item in that table was touched (items 1–9 were already `✅` and are unaffected by this re-score).

`ABC-066`'s own DoR table was re-read against `main`, not re-scored: it already read 10/10 MET at
its 2026-08-15 cut and nothing in it has changed — confirmed by a byte-diff of the worktree's copy
against the pre-hop copy on `main` before any edit was made (identical). Only its front matter
(`status: ready`, `column: Ready`) was updated, to keep the board↔ticket contract
(`plans/board.md`'s own rule: `column:` must equal the board column) from drifting now that it moves
columns; its DoR table body was left byte-identical.

**Both tickets moved `Backlog` → `Ready` in the same hop**, per `ABC-066`'s own traceability row's
2026-08-15 routing instruction (*"pull with `ABC-065` when its claim drains"*) and per this task's
own instruction. This is the `Backlog → Ready` exit, which `plans/board.md`'s column table and
`agent-factory/roles/ba-pm.md` both name as BA/PM's to make — not the Orchestrator's. The move stops
there: `Ready → Ready for Dev` is not taken here (hard fence, this hop's pending task file).

`plans/board.md`: both rows removed from `## Backlog`, appended one line each under `## Ready`;
heading changed `(WIP 0/8)` → `(WIP 2/8)` — within the 8-ticket limit, no override needed.
`plans/traceability.md`: only the Status cell (last column) on the `ABC-065` and `ABC-066` rows was
appended with a bolded transition note recording the move, the date, and the re-scored/re-read DoR
result; no other cell on either row and no other row in the file was touched (`git diff --numstat`
confirms exactly 2 lines changed in that file).

**Why no `finding`.** `context.human_admission` is `off` and the sanctioned writers
(`scripts/context-io.ts`, `scripts/claim.js`, `mcp__grugops__propose_note`) are absent from this
install, per `AGENTS.md` § Role / workflow files. This re-score is recorded as a `decision`, not a
`finding` — no `§14-gate#<id>` or `human:<name>` stamp is invented for it.
