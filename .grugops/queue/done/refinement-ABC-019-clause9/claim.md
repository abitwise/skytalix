---
task: refinement-ABC-019-clause9
by: ba-pm
at: 2026-08-11T01:40:00Z
---

Claimed per `agent-factory/workflows/17-task-claim.md` step 2 by atomic `mkdir` of
`.grugops/queue/claimed/refinement-ABC-019-clause9/`. `scripts/claim.js` does not exist in this
repo, so the directory create was done by hand; the directory IS the claim, and `mkdir` without
`-p` is the atomic primitive step 2 names (a second claimant would get `EEXIST`). This record is
the now-running registry record and is **NOT** a `kind: claim` note.

Queue width is 1 and no other agent is running, so the claim is degenerate — recorded rather than
glossed, exactly as the 66 prior entries on this board record it.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is
likewise absent, so this role's context notes are hand-written into
`.grugops/context/refinement-ABC-019-clause9/notes/` in the schema's exact shape
(`agent-factory/contracts/context-note.md`). **No `finding` is written** — this hop holds no
`§14-gate#<id>` stamp and no `human:<name>` grant, and nothing is self-stamped. The kinds used are
`decision`, `observation` and `artifact-ref`.

Read BEFORE any edit, per step 1: `ADR-0009` clause 9 in full (`memory-bank/50-decisions/`), the
Architect/Design hop that produced it
(`.grugops/context/design-stub-seam-and-nfr002/notes/` — `…-decision-b40ecd8e`,
`…-observation-83fd686f`, `…-artifact-ref-d31eb755`), this ticket's own prior refinement
(`.grugops/context/refinement-ABC-019/notes/` — all three notes, so no settled ground is
re-opened), the ticket, `AGENTS.md` and `agent-factory/checklists/definition-of-ready.md`.

---
completed_at: 2026-08-11T01:52:00Z
outcome: AMENDED — `ADR-0009` clause 9's two owed criteria are WRITTEN on
  `plans/tickets/ABC-019-turn-loop-skeleton.md` as `A18` (clause 9d — two stub shapes, neither at the
  reference layout's 3 and 8, one at H ≤ 24 and one at H ≥ 25, with the append path exercised at this
  ticket's own gate) and `A19` (clauses 9a + 9e — one session, height == the FIRST frame's `.length`,
  frames written UNMODIFIED, every frame's `.length` == that height). 19 criteria total; **no `A1`–`A17`
  criterion edited, re-worded or renumbered, and the 25 defects from `refinement-ABC-019` stay fixed —
  this was a targeted amendment, not a re-refinement.** MEASURED AGAINST MERGED src/ RATHER THAN
  REASONED FROM TICKET TEXT, four throwaway harnesses outside the repository: with two stub shapes
  EVERY hardcoded height is RED at this ticket's own gate (23, 19 and 25 each fail at least one shape)
  and only the derived form ships; with a 3/8 stub a hardcoded 23 is GREEN on every clause and emits 25
  rows into a 24-row viewport after the rebase — the landmine clause 9d exists to disarm, reproduced
  rather than quoted. TWO FINDINGS BEYOND THE ASSIGNMENT, both from constructing wrong builds: (1)
  clause 9e's LITERAL words are GREEN on a loop that pads or truncates every frame to its height — it
  truncated a 20-row frame to 19 and ate the reserved prompt row — so 9d does NOT save 9e on its own
  and `A19` carries an "unmodified" clause the ADR does not; (2) one stub shape is defeated by a literal
  TUNED to it (H = 19 against a 2/5 stub is green on all four clauses), which is a stronger reason for
  9d's "two shapes" than the append-branch reason the ADR gives. Two ticket defects fixed in place:
  `[D27]` the render seam's RETURN (`readonly string[]`) was stated NOWHERE, and without it the session
  height cannot be derived and `A19` cannot be asserted; `[D26]` `## Out of scope`'s "Frame content and
  writing" admitted a build that writes BEHIND the seam. One correction to this role's own earlier work
  taken rather than left: `[D19]`'s "the CORRECT build is at or over its own bar" is REFUTED —
  `gameStatusOf` already contains the `gameStatus` call (`src/history.ts:152-154`, re-read at source),
  so the arithmetic double-counted it; the half that mattered (a two-derives build MEETS the bar at
  0.94x, so `A3b`'s spied count binds) survives and NO BAR MOVED. SIZE `L` (5) and PRIORITY `P0`
  re-derived a second time and both UNMOVED — not `XL`, no SPLIT_REQUIRED — costed in three directions.
  DoR: all ten items hold, four re-checked (2, 4, 6, 7) and six untouched by the amendment and
  deliberately NOT re-ticked on their behalf. **`ABC-019` IS GATEABLE `Ready` → `Ready for Dev`; the
  gate and the board move are the Orchestrator's.** GATES on the branch tip: `npm run lint` exit 0,
  `npm run typecheck` exit 0, `npm test` exit 0 (676/676, 22 files), `npm run build` exit 0, skip count
  0 — all four `quality.mandatory_gates` green. **ZERO PRODUCTION LINES: src/ byte-identical, 36-file
  aggregate md5 `59d99f2861a7e5b593473c15049746ce` before and after, `git status --short -- src/`
  empty.** `plans/traceability.md`: the `ABC-019` row only, four cells appended, all 34 other table
  lines asserted byte-identical by md5 and the row at exactly 12 pipe-separated fields before and after.
  NOT WRITTEN, deliberately: `plans/board.md`, `plans/nfr-catalog.md`, `memory-bank/50-decisions/`, any
  other ticket, anything under `src/`. Four items flagged with owners, including that `ADR-0009` clause
  9e's own wording needs Architect/Design and that clause 9f's rebase re-gate must run against the REAL
  panels (measured: the loop is swap-invariant, so a re-gate tests the seam WIRING and only a real-panel
  run tests it).
moved: pending/ -> claimed/refinement-ABC-019-clause9/ -> done/refinement-ABC-019-clause9/ — ALL BY HAND
  (no scripts/claim.js in this install).
