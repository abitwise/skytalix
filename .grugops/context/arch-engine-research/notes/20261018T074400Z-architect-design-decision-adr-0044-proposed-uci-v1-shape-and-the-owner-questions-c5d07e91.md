---
id: 20261018T074400Z-architect-design-decision-adr-0044-proposed-uci-v1-shape-and-the-owner-questions-c5d07e91
kind: decision
by: architect-design
at: 2026-10-18T07:44:00Z
verified_by:
confidence: medium
refs:
  - ADR-0044
  - EPIC-004
  - EPIC-006
  - NFR-004
  - NFR-008
  - memory-bank/50-decisions/ADR-0044-the-engine-speaks-uci-through-a-second-entry-point-over-the-unchanged-core.md
  - .grugops/context/wave-2026-09-25/notes/20261018T073030Z-orchestrator-decision-owner-word-chess-engine-conversion-research-only-5b37b0bc.md
supersedes:
---

# `ADR-0044` IS WRITTEN **PROPOSED**: A UCI V1 SHAPE, AND EIGHT QUESTIONS ONLY THE OWNER CAN ANSWER

**This decision is proposed, and owner acceptance is owed.** Confidence is `medium` because the design
rests on the owner's answers to Q1–Q3. The standards and repo facts behind it are the two sibling
`observation` notes (`…3f1a9c20`, `…7b2e4d18`) and are `high`.

## The decision, in five lines

1. The engine speaks **UCI only** (2006 text). There is no CECP.
2. It runs as a **second entry point, `node src/uci.ts`**. A capability-free `src/uci-session.ts` sits
   beside it, and both are flat in `src/`. They compose the **unedited** core: `parseFen`,
   `parseCoordinateMove`, `makeMove` and `chooseMove`. `npm run chess` is byte-identical.
3. **v1 commands:** `uci`/`id`/`uciok` (no options), `isready`/`readyok`, `ucinewgame`,
   `position startpos|fen … moves …`, `go` (movetime, clock+increment via `t/(m??20) + i/2`, `infinite`
   held to `stop`), `stop`, `quit`, and ignore everything else. Output is one final `info` line and
   `bestmove`.
4. **One thread, synchronous.** `stop` and `isready` take effect at most one budget late (≤ 5 s, held by
   `NFR-004`'s clamp). A worker plus a stop flag through the existing `now` clock is pre-designed and is
   built only on a named trigger.
5. **A web UI is a separate project.** It reaches the engine by a WebSocket bridge to the child process, or
   by bundling the session into a Web Worker. This repo's only obligation is that the session holds no
   capability.

## Rejected (full table in `ADR-0044` § Alternatives)

- CECP; both protocols; a `--uci` flag on `cli.ts`; a network server in this repo.
- A worker in v1; a yielding search.
- Reusing `EngineSeam`/`history.ts` (`ADR-0011` cl. 3) or `line-input.ts` (prompt bytes, a 1024-byte cap).
- Honouring `go depth` in v1 (`ABC-078` `A4`, `ADR-0027` d3).
- The book or levels as v1 options (`ADR-0024` d7).
- A WASM or bundled build here.

## Owner questions (copied from `ADR-0044` § Owner questions so a reader of the context sees them)

- **Q1.** Accept UCI, which lifts the UCI half of `EPIC-004`'s "permanent non-goal"?
- **Q2.** What is it for first: humans in your web UI, analysis, engine testing, or a Lichess bot?
- **Q3.** Keep the 5 s ceiling for UCI, or lift it (which brings the worker and an `NFR-004` re-scope)?
- **Q4.** Book under UCI: off (recommended), on, or `OwnBook`?
- **Q5.** Strength control: none, `Skill Level` 1–5, or `UCI_Elo` (no Elo has ever been claimed)?
- **Q6.** Must v1 honour `go depth`/`nodes` (the Lichess provider sends them)?
- **Q7.** How should the web project get the code: submodule, copy, or package (`ADR-0018`/`EPIC-006`)?
- **Q8.** Licence: this repo has none. chessground and Stockfish.js are GPL-3.0.

## What this hop wrote, and what it refused to do

- **Wrote** `ADR-0044` (PROPOSED) and three notes under `.grugops/context/arch-engine-research/notes/`, on
  `grugops/arch-engine-research` (worktree `../wt-arch-engine`, from `main` `fedb80d4`).
- **Did not touch** `src/`, `tools/`, `package.json` or any config. There is no `"uci"` script line yet,
  because that is the build ticket's.
- **Did not touch** `plans/board.md` or `plans/traceability.md` (the brief's fence). The trace row is in
  the handoff.
- **Did not edit `plans/nfr-catalog.md`.** The ADR is proposed and no target moves. Its three candidate
  rows (idle responsiveness, time safety, stdout hygiene) are for Security/NFR to place at acceptance.
- **Did not edit `EPIC-004`.** Lifting its non-goal is BA/PM's, on the owner's word (`bapm-engine-plan`).
- **Ran no test, vitest, build or timing.** Nothing was pushed or merged.
- **Admission.** This note and its siblings are hand-authored and unsealed. `scripts/context-io.ts` is
  absent on this install (`AGENTS.md`), so no `finding` was attempted.
