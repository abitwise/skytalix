---
subtask: arch-ABC-242-reading
role: architect-design
ticket: ABC-242
ref: .grugops/context/arch-ABC-242-reading/
branch: new grugops/arch-ABC-242-reading from main e7b22c11 (worktree .claude/worktrees/arch-ABC-242-reading)
width: records only, NO builds/tests/node scripts (a QE may run ALONE timing on this host)
---
# Architect: ABC-242 — how the blunder path sees a third occurrence at its root
## Read
ABC-242 ticket (Scope, § Dependencies, ADRs it names), ADR-0054 (d3 ply ≥ 1 scan, two-match rule), ADR-0032 d2 (strict
second-best), ADR-0020 § AMENDMENT 2026-10-30 (repetition keys, now merged with ABC-241 at 1f6abec4), src/levels.ts
`blunder` on main (read only), qe-ABC-230 finding QE-230-a `…ba5a249a`.
## Do
Rule the design: where the root-move third-occurrence check lives (blunder in levels.ts vs a chooseMove root check vs
a shared helper), using repetition keys; confirm the engine path is untouched. Write it as a dated ADR-0054 (and
ADR-0032 if touched) amendment, PROPOSED if it changes an owner-accepted decision (then name the owner question), or
an in-scope design note if it does not. Give the SE a file list and the A-rows' exact expected values where derivable
by reasoning. Say whether the ticket stays S and the Orchestrator's S2/no-smoke ruling still fits.
## Fences
Records only (ADRs, the ABC-242 ticket, your notes). No src/, tools/, data/. Run no builds, tests, node scripts or
benchmarks. If sealing notes needs node, draft them and a seal script; the Orchestrator seals after the host frees.
No board edits. Never push/force/amend/rebase/merge into main. No host paths.
## Publish
Notes (task `arch-ABC-242-reading`), commit, `## Result` + trace row here, brief + claim to done/.

## Result

*Architect/Design, 2026-10-30, task `arch-ABC-242-reading`. Records only, at `main` `ee7da249` (the Orchestrator's base; the header's `e7b22c11` is one commit older), on branch `grugops/arch-ABC-242-reading`. Nothing was built, run or timed.*

- **Ruling: the check lives in `src/levels.ts` `blunder`.**
  - After a root move is made, the child's repetition key is matched against the children's list (prior keys plus the root key). The walk is `−4, −6, …`, bounded by `min(child clock, list length, 100)`.
  - **On two or more matches, the move scores exactly 0 and its child is not searched.**
  - This is `repeatsBeforeRoot` at ply 0 against the child's list. It equals the engine's ply-1 count, except at the 100-key cap.
  - `src/engine.ts`, `src/search.ts` and `createLevel`'s engine branch are untouched, so the engine path is node-equal by construction.
- **Rejected:**
  - a `chooseMove` root check, blunder-only or for all callers;
  - exporting `repeatsBeforeRoot`, which edits `engine.ts` and re-pins `ABC-078` `A4`;
  - search-then-override;
  - the one-match rule.
- **The parent-root count:** ruled out of `ABC-242`. It stays as `ADR-0054` d2 is written, because changing it is an engine change. Its effect is `UNKNOWN - verify`, and no ticket is cut.
- **Status: PROPOSED.** It adds a bullet to `ADR-0032` d1 (owner-accepted) and a sentence to `ADR-0054` d2, and the 2026-10-22 standing ruling, item 3, keeps that with the owner.
  - **The owner's question:** "On a blunder move at levels 1–4, should a root move that makes the third occurrence of a game position score exactly 0, without its child search? The engine path does not change." Answer: "ADR-0054 ABC-242: accept / decline".
  - Default: nothing changes, and `ABC-242` stays in Backlog.
- **SE files:**
  - `src/levels.ts`: the check, a private helper, a named 100 constant, and docs. No new import or export.
  - `src/levels.test.ts`: `A1`, `A2`, `A3`, `A5`, `A6`.
  - `src/cli.test.ts` and `src/uci-session.test.ts`: `A4`.
- **Expected values:**
  - **A1, probe:** `d8e8` scores 0 (base −1013), and 4 of the 5 children are searched. Entries 1–4 are `UNKNOWN - verify`. If they keep base's values, the move played is `d8e7`, kind `blunder`.
  - **A2:** one match, so the list equals base's keyed list.
  - **A3:** child clock 1, so the list equals base's.
  - **A6:** the result equals base's.
  - Recommended: one A1 fixture whose repeating move is last in `legalMoves` order, for a full-list pin.
- **Size S stands. S2, no smoke, fits.** `A8` needs one correction, for BA/PM: the ladder lane hands in no prior keys, so it is an identity row, not a playing check.
- **Written:**
  - `ADR-0054`: a § Status pointer and § Proposed amendment 2026-10-30 (A1–A6, alternatives, consequences, rollback);
  - `ADR-0032`: a § Status pointer;
  - `ABC-242`: an Architect-reading header block. The DoR is BA/PM's and was not re-scored.
- **Notes:** drafted in `.grugops/context/arch-ABC-242-reading/raw/` (`note-decision.md`, `note-observation.md`), with `seal.mjs` and `seal-spec.json`. **Sealing is pending**, because no node process may run while a QE timing read may hold the host. After the host frees, run this from the worktree: `node .grugops/context/arch-ABC-242-reading/raw/seal.mjs .grugops/context arch-ABC-242-reading .grugops/context/arch-ABC-242-reading/raw/seal-spec.json`, then commit the notes.
- **Checks:** `git diff --check` is clean, and the host-path scan found 0 hits. `reference-check` was not run (it is a node script).
- **Not touched:** `src/`, `tools/`, `data/`, the board. Nothing was pushed or merged. The main checkout's `claimed/` copies are untouched; the tracked done/ copies are on this branch.

### Trace row (10 cells, header order)

| ABC-242 (Architect reading) | Blunder root-move third-occurrence check in src/levels.ts blunder (two matches in prior+root list within min(child clock, len, 100) → 0, child not searched); engine path untouched; parent-root count ruled out; PROPOSED (owner: "ADR-0054 ABC-242: accept/decline"); A8 ladder-lane correction | EPIC-010 | — | NFR-004 (≤ 49 comparisons per root move, sum clamp unchanged), NFR-009 (no allocation); ADR-0054 § Proposed amendment 2026-10-30, ADR-0032 d1 addition (pointer), ADR-0020 § AMENDMENT C1 | grugops/arch-ABC-242-reading (records only): ADR-0054, ADR-0032, ABC-242, .grugops/context/arch-ABC-242-reading/raw/ (drafts; seal pending) | none run (records only) | — (UAT owed at build; QE verdict signs) | — | ABC-242 Backlog, waits on owner (no board move) |
