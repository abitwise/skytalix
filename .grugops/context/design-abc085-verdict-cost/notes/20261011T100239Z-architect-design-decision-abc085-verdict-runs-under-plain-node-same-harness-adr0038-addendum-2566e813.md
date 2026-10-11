---
id: 20261011T100239Z-architect-design-decision-abc085-verdict-runs-under-plain-node-same-harness-adr0038-addendum-2566e813
kind: decision
by: architect-design
at: 2026-10-11T10:02:39Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ABC-083
  - ABC-144
  - ADR-0038
  - ADR-0037
  - ADR-0011
  - ADR-0036
  - ADR-0040
  - NFR-008
  - N8-LANE
  - memory-bank/50-decisions/ADR-0038-the-ladder-step-is-one-named-constant-per-run-step-4-for-the-verdict-step-120-for-the-short-mode.md
  - .grugops/context/ticket-to-pr-ABC-085/notes/20261011T093952Z-software-engineer-observation-abc085-vitest-runner-4x-slower-verdict-cost-estimate-x4-70684a78.md
  - 20261011T100239Z-architect-design-observation-abc085-abc144-cost-arithmetic-from-recorded-readings-nothing-timed-5d70d79e
supersedes:
---

# `ABC-085` verdict cost: run the SAME harness under plain `node`, outside vitest. About 10 h, not about 44 h. Written as a PROPOSED `ADR-0038` addendum (decision 5)

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). Subtask
`design-abc085-verdict-cost`, on the wave tip `8639effb`. **Nothing was timed at this hop.** The inputs are the
Engineer's `…70684a78` and `probe/RUN.txt`, on branch `grugops/ABC-085-self-play-ladder` at `773b48cc`, which
is not on the wave tip. The arithmetic is in `…5d70d79e`. The full text is `ADR-0038` § Addendum 2026-10-11.

## The ruling, against the four options

| option | ruling | estimated hours, step 4, full verdict |
|---|---|---|
| (a) accept ~44 h inside vitest | **rejected as the plan.** It stays the fallback if the equivalence check fails | ~43.5 h (30–58) of one core |
| (b) the pairs as parallel processes | **rejected**, under either runner | CPU unchanged at ~43.5 core-hours. Wall ≥ ~18.7 h (the 1v5 `it`), on up to 5 cores |
| **(c) the same harness outside vitest** | **RECOMMENDED** | **~10 h (7–13) of one core**, plus an `XS` build |
| other: find and remove the vitest overhead | not a dependency. Routed to BA/PM (`…be323233`) | — |

**Why (c).** The games are a function of node counts only (`ADR-0038` decision 4; `A5`).
- The Engineer read 145 765 nodes under both runners.
- The vitest 3v4 row and this role's plain-`node` probe played the same four games.

So the runner buys nothing but wall, at ~4.35x. Under plain `node`, the verdict costs what the owner accepted
`ADR-0038` at. Step 4 also stands: the Rollback band (2–8 ms per reading) is a plain-`node` reading. The vitest
~24 ms per 1 024 nodes is a reading of the runner, not of real play.

## The design (`ADR-0038` decision 5, amended for the verdict mode only)

1. The harness's non-vitest code moves verbatim into a module under **`tools/ladder/`**. That is `ADR-0037`
   D1(g)'s precedent: outside `src/`, so not a production module (`ADR-0011` cl. 1), and it imports `src/`
   read-only.
   - `src/ladder.test.ts` imports it and keeps every default row and `LADDER_DEEP=1`.
   - A small `node` entry runs `verdict` (and `1`, for item 2).
   - `tsconfig.json` and `biome.json` gain `tools/ladder/**/*.ts`.
2. **The equivalence check is pre-registered, on counts and digests only.** On one commit, vitest
   `LADDER_DEEP=1` and the `node` entry with `1` must print the same five pair digests, the same `A5` digest,
   and the same plies and ending per game.
   - If any differs, the `node` route is refused, and the fallback is (a).
3. **There is one verdict route.** Under vitest, `LADDER_DEEP=verdict` is refused at load, and the message
   points at the `node` command.
4. **The report adds the runner and its version.**
5. **Scheduling.** The verdict runs as one serial background process. It never overlaps a no-other-hop window
   (`ABC-144` Window B, any `ADR-0035` reading). The pairs never run in parallel.

## What is not changed

- Step 4, decisions 1–4 and 6, the short mode, the default lane (0 games, +1 file), `A1`–`A6`'s bars, and the
  claim policy.
- The verdict still waits for `ABC-083`'s merge.

## Where to build it

Build it in the **pre-registered split ticket** (`ABC-085` § Dependencies: the `A1`/`A2` verdict run as its
own `XS`), not as a repair to `ABC-085`'s build, which is in review.
- The verdict cannot run before `ABC-083` merges, and `ABC-083` is `Blocked`. So the split costs no time.
- The Orchestrator and BA/PM choose. The design is the same either way.

**Status:** `ADR-0038` stays accepted. **The addendum is PROPOSED, and the owner's acceptance is owed**
(`…be323233` question 1).
